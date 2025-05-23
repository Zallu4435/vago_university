import React, { useState, useCallback } from 'react';
import { 
  IoAdd as Plus,
  IoEyeOutline as Eye,
  IoCreateOutline as Edit,
  IoTrashOutline as Trash2,
  IoCalendarOutline as Calendar,
  IoTimeOutline as Clock,
  IoLocationOutline as MapPin,
  IoPeopleOutline as Users,
  IoCheckmarkCircleOutline as CheckCircle,
  IoCloseCircleOutline as XCircle,
  IoBusinessOutline as Building,
  IoSchoolOutline as GraduationCap,
  IoPersonOutline as User,
} from 'react-icons/io5';
import { debounce } from 'lodash';
import Header from '../../User/Header';
import ApplicationsTable from '../../User/ApplicationsTable';
import Pagination from '../../User/Pagination';
import WarningModal from '../../../../components/WarningModal';
import AddEventModal from './AddEventModal';
import EventDetailsModal from './EventDetailsModal';
import { useEventManagement } from '../../../../../application/hooks/useEventManagement';

interface Event {
  id: string;
  name: string;
  organizer: string;
  organizerType: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  status: string;
  description: string;
  maxParticipants: number;
  registrationRequired: boolean;
  participants: number;
  createdAt: string;
}

interface EventRequest {
  id: string;
  eventName: string;
  requestedBy: string;
  requesterType: string;
  type: string;
  proposedDate: string;
  proposedVenue: string;
  status: string;
  requestedAt: string;
  description: string;
  expectedParticipants: number;
}

interface Participant {
  id: string;
  name: string;
  studentId: string;
  registeredAt: string;
  status: string;
}

const EVENT_TYPES = ['All Types', 'workshop', 'seminar', 'fest', 'competition', 'exhibition'];
const STATUSES = ['All Statuses', 'upcoming', 'completed', 'cancelled', 'pending', 'approved', 'rejected'];
const ORGANIZERS = ['All Organizers', 'department', 'club', 'student'];

const eventColumns = [
  {
    header: 'Event',
    key: 'name',
    render: (event: Event) => (
      <div>
        <p className="font-medium text-gray-200">{event.name}</p>
        <p className="text-xs text-gray-400">ID: {event._id.slice(0, 7)}</p>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Organizer',
    key: 'organizer',
    render: (event: Event) => (
      <div className="flex items-center text-gray-300">
        {event.organizerType === 'department' ? (
          <Building size={14} className="text-purple-400 mr-2" />
        ) : event.organizerType === 'club' ? (
          <Users size={14} className="text-purple-400 mr-2" />
        ) : (
          <User size={14} className="text-purple-400 mr-2" />
        )}
        <div>
          <p className="text-sm">{event.organizer}</p>
          <p className="text-xs text-gray-400 capitalize">{event.organizerType}</p>
        </div>
      </div>
    ),
  },
  {
    header: 'Type',
    key: 'type',
    render: (event: Event) => (
      <div className="text-sm text-gray-300 capitalize">{event.type}</div>
    ),
  },
  {
    header: 'Date & Time',
    key: 'date',
    render: (event: Event) => (
      <div>
        <div className="flex items-center text-gray-300">
          <Calendar size={14} className="text-purple-400 mr-2" />
          <span className="text-sm">{event.date}</span>
        </div>
        <div className="flex items-center text-gray-300">
          <Clock size={14} className="text-purple-400 mr-2" />
          <span className="text-sm">{event.time}</span>
        </div>
      </div>
    ),
  },
  {
    header: 'Venue',
    key: 'venue',
    render: (event: Event) => (
      <div className="flex items-center text-gray-300">
        <MapPin size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{event.venue}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (event: Event) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          event.status === 'upcoming'
            ? 'bg-blue-900/30 text-blue-400 border-blue-500/30'
            : event.status === 'completed'
            ? 'bg-green-900/30 text-green-400 border-green-500/30'
            : 'bg-red-900/30 text-red-400 border-red-500/30'
        }`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full mr-1.5"
          style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
        ></span>
        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
      </span>
    ),
  },
  {
    header: 'Participants',
    key: 'participants',
    render: (event: Event) => (
      <div className="flex items-center text-gray-300">
        <Users size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">
          {event.participants}/{event.maxParticipants}
        </span>
      </div>
    ),
  },
];

const eventRequestColumns = [
  {
    header: 'Request',
    key: 'eventName',
    render: (request: EventRequest) => (
      <div>
        <p className="font-medium text-gray-200">{request.eventName}</p>
        <p className="text-xs text-gray-400">ID: {request.id}</p>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Requested By',
    key: 'requestedBy',
    render: (request: EventRequest) => (
      <div className="flex items-center text-gray-300">
        {request.requesterType === 'department' ? (
          <Building size={14} className="text-purple-400 mr-2" />
        ) : request.requesterType === 'club' ? (
          <Users size={14} className="text-purple-400 mr-2" />
        ) : (
          <User size={14} className="text-purple-400 mr-2" />
        )}
        <div>
          <p className="text-sm">{request.requestedBy}</p>
          <p className="text-xs text-gray-400 capitalize">{request.requesterType}</p>
        </div>
      </div>
    ),
  },
  {
    header: 'Type',
    key: 'type',
    render: (request: EventRequest) => (
      <div className="text-sm text-gray-300 capitalize">{request.type}</div>
    ),
  },
  {
    header: 'Proposed Date',
    key: 'proposedDate',
    render: (request: EventRequest) => (
      <div className="flex items-center text-gray-300">
        <Calendar size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{request.proposedDate}</span>
      </div>
    ),
  },
  {
    header: 'Venue',
    key: 'proposedVenue',
    render: (request: EventRequest) => (
      <div className="flex items-center text-gray-300">
        <MapPin size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{request.proposedVenue}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (request: EventRequest) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          request.status === 'pending'
            ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
            : request.status === 'approved'
            ? 'bg-green-900/30 text-green-400 border-green-500/30'
            : 'bg-red-900/30 text-red-400 border-red-500/30'
        }`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full mr-1.5"
          style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
        ></span>
        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
      </span>
    ),
  },
];

const participantColumns = [
  {
    header: 'Student',
    key: 'name',
    render: (participant: Participant) => (
      <div className="flex items-center">
        <User size={14} className="text-purple-400 mr-2" />
        <div>
          <p className="font-medium text-gray-200">{participant.name}</p>
          <p className="text-xs text-gray-400">{participant.studentId}</p>
        </div>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Registered At',
    key: 'registeredAt',
    render: (participant: Participant) => (
      <div className="flex items-center text-gray-300">
        <Calendar size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{participant.registeredAt}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (participant: Participant) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          participant.status === 'confirmed'
            ? 'bg-green-900/30 text-green-400 border-green-500/30'
            : 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
        }`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full mr-1.5"
          style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
        ></span>
        {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
      </span>
    ),
  },
];

const AdminEventsManagement: React.FC = () => {
  const {
    events,
    eventRequests,
    participants,
    totalPages,
    page,
    setPage,
    filters,
    setFilters,
    isLoading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    approveEventRequest,
    rejectEventRequest,
    approveParticipant,
    rejectParticipant,
    removeParticipant,
  } = useEventManagement();

  const [activeTab, setActiveTab] = useState<'events' | 'requests' | 'participants'>('events');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | EventRequest | null>(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'event' } | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [eventForm, setEventForm] = useState({
    name: '',
    organizer: '',
    organizerType: '',
    type: '',
    date: '',
    time: '',
    venue: '',
    status: 'upcoming',
    description: '',
    maxParticipants: 0,
    registrationRequired: false,
    participants: 0,
  });

  const filteredEvents = events.filter((event) => {
    const matchesSearch = searchTerm
      ? event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesType =
      filters.type === 'All Types' || event.type.toLowerCase() === filters.type.toLowerCase();
    const matchesStatus =
      filters.status === 'All Statuses' || event.status.toLowerCase() === filters.status.toLowerCase();
      const matchesOrganizer =
      filters.organizer === 'All Organizers' ||
      event.organizerType.toLowerCase() === filters.organizer.toLowerCase();
    return matchesSearch && matchesType && matchesStatus && matchesOrganizer;
  });

  const filteredEventRequests = eventRequests.filter((request) => {
    const matchesSearch = searchTerm
      ? request.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesType =
      filters.type === 'All Types' || request.type.toLowerCase() === filters.type.toLowerCase();
    const matchesStatus =
      filters.status === 'All Statuses' || request.status.toLowerCase() === filters.status.toLowerCase();
    const matchesOrganizer =
      filters.organizer === 'All Organizers' ||
      request.requesterType.toLowerCase() === filters.organizer.toLowerCase();
    return matchesSearch && matchesType && matchesStatus && matchesOrganizer;
  });

  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch = searchTerm
      ? participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesStatus =
      filters.status === 'All Statuses' ||
      participant.status.toLowerCase() === filters.status.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleAddEvent = () => {
    setEventForm({
      name: '',
      organizer: '',
      organizerType: '',
      type: '',
      date: '',
      time: '',
      venue: '',
      status: 'upcoming',
      description: '',
      maxParticipants: 0,
      registrationRequired: false,
      participants: 0,
    });
    setIsEditing(false);
    setSelectedEvent(null);
    setShowAddEventModal(true);
  };

  const handleEditEvent = (event: Event) => {
    setEventForm({
      name: event.name,
      organizer: event.organizer,
      organizerType: event.organizerType,
      type: event.type,
      date: event.date,
      time: event.time,
      venue: event.venue,
      status: event.status,
      description: event.description,
      maxParticipants: event.maxParticipants,
      registrationRequired: event.registrationRequired,
      participants: event.participants,
    });
    setSelectedEvent(event);
    setIsEditing(true);
    setShowAddEventModal(true);
  };

  const handleViewEvent = (event: Event | EventRequest) => {
    setSelectedEvent(event);
    setShowEventDetailsModal(true);
  };

  const handleSaveEvent = async () => {
    try {
      if (isEditing && selectedEvent) {
        await updateEvent({ id: selectedEvent._id, data: eventForm });
      } else {
        await createEvent(eventForm);
      }
      setShowAddEventModal(false);
      setSelectedEvent(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDeleteEvent = (id: string) => {
    setItemToDelete({ id, type: 'event' });
    setShowDeleteWarning(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteEvent(itemToDelete.id);
      setShowDeleteWarning(false);
      setItemToDelete(null);
    }
  };

  const handleApproveEventRequest = (id: string) => {
    approveEventRequest(id);
  };

  const handleRejectEventRequest = (id: string) => {
    rejectEventRequest(id);
  };

  const handleApproveParticipant = (id: string) => {
    approveParticipant(id);
  };

  const handleRejectParticipant = (id: string) => {
    rejectParticipant(id);
  };

  const handleRemoveParticipant = (id: string) => {
    removeParticipant(id);
  };

  const debouncedFilterChange = useCallback(
    debounce((field: string, value: string) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
    }, 1000),
    []
  );

  const handleResetFilters = () => {
    setFilters({
      type: 'All Types',
      status: 'All Statuses',
      organizer: 'All Organizers',
    });
  };

  const eventActions = [
    {
      icon: <Eye size={16} />,
      label: 'View Event',
      onClick: handleViewEvent,
      color: 'blue' as const,
    },
    {
      icon: <Edit size={16} />,
      label: 'Edit Event',
      onClick: handleEditEvent,
      color: 'green' as const,
    },
    {
      icon: <Trash2 size={16} />,
      label: 'Delete Event',
      onClick: (event: Event) => handleDeleteEvent(event.id),
      color: 'red' as const,
    },
  ];

  const eventRequestActions = [
    {
      icon: <CheckCircle size={16} />,
      label: 'Approve Request',
      onClick: (request: EventRequest) => handleApproveEventRequest(request.id),
      color: 'green' as const,
      disabled: (request: EventRequest) => request.status !== 'pending',
    },
    {
      icon: <XCircle size={16} />,
      label: 'Reject Request',
      onClick: (request: EventRequest) => handleRejectEventRequest(request.id),
      color: 'red' as const,
      disabled: (request: EventRequest) => request.status !== 'pending',
    },
    {
      icon: <Eye size={16} />,
      label: 'View Request',
      onClick: handleViewEvent,
      color: 'blue' as const,
    },
  ];

  const participantActions = [
    {
      icon: <CheckCircle size={16} />,
      label: 'Approve Participant',
      onClick: (participant: Participant) => handleApproveParticipant(participant.id),
      color: 'green' as const,
      disabled: (participant: Participant) => participant.status !== 'pending',
    },
    {
      icon: <XCircle size={16} />,
      label: 'Reject Participant',
      onClick: (participant: Participant) => handleRejectParticipant(participant.id),
      color: 'red' as const,
      disabled: (participant: Participant) => participant.status !== 'pending',
    },
    {
      icon: <Trash2 size={16} />,
      label: 'Remove Participant',
      onClick: (participant: Participant) => handleRemoveParticipant(participant.id),
      color: 'red' as const,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl"></div>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-500/10 blur-md"
            style={{
              width: `${Math.random() * 12 + 4}px`,
              height: `${Math.random() * 12 + 4}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `floatingMist ${Math.random() * 15 + 20}s ease-in-out infinite ${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Header
          title="Events Management"
          subtitle="Manage campus events, requests, and participants"
          stats={[
            {
              icon: <Calendar />,
              title: 'Total Events',
              value: events.length.toString(),
              change: '+10%',
              isPositive: true,
            },
            {
              icon: <CheckCircle />,
              title: 'Pending Requests',
              value: eventRequests.filter((r) => r.status === 'pending').length.toString(),
              change: '+5%',
              isPositive: true,
            },
            {
              icon: <Users />,
              title: 'Total Participants',
              value: participants.length.toString(),
              change: '+15%',
              isPositive: true,
            },
            {
              icon: <GraduationCap />,
              title: 'Upcoming Events',
              value: events.filter((e) => e.status === 'upcoming').length.toString(),
              change: '+8%',
              isPositive: true,
            },
          ]}
          tabs={[
            { label: 'Events', icon: <Calendar size={16} />, active: activeTab === 'events' },
            { label: 'Requests', icon: <CheckCircle size={16} />, active: activeTab === 'requests' },
            { label: 'Participants', icon: <Users size={16} />, active: activeTab === 'participants' },
          ]}
          searchQuery={searchTerm}
          setSearchQuery={setSearchTerm}
          searchPlaceholder="Search events, requests, or participants..."
          filters={filters}
          filterOptions={{
            type: EVENT_TYPES,
            status: STATUSES,
            organizer: ORGANIZERS,
          }}
          debouncedFilterChange={debouncedFilterChange}
          handleResetFilters={handleResetFilters}
          onTabClick={(index) => {
            const tabMap = ['events', 'requests', 'participants'];
            setActiveTab(tabMap[index] as 'events' | 'requests' | 'participants');
          }}
        />

        <div className="mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
            <div className="px-6 py-5">
              {activeTab === 'events' && (
                <button
                  onClick={handleAddEvent}
                  className="mb-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus size={16} />
                  Add Event
                </button>
              )}

              {activeTab === 'events' && filteredEvents.length > 0 && (
                <>
                  <ApplicationsTable data={filteredEvents} columns={eventColumns} actions={eventActions} />
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    itemsCount={filteredEvents.length}
                    itemName="events"
                    onPageChange={setPage}
                    onFirstPage={() => setPage(1)}
                    onLastPage={() => setPage(totalPages)}
                  />
                </>
              )}
              {activeTab === 'requests' && filteredEventRequests.length > 0 && (
                <>
                  <ApplicationsTable
                    data={filteredEventRequests}
                    columns={eventRequestColumns}
                    actions={eventRequestActions}
                  />
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    itemsCount={filteredEventRequests.length}
                    itemName="event requests"
                    onPageChange={setPage}
                    onFirstPage={() => setPage(1)}
                    onLastPage={() => setPage(totalPages)}
                  />
                </>
              )}
              {activeTab === 'participants' && filteredParticipants.length > 0 && (
                <>
                  <ApplicationsTable
                    data={filteredParticipants}
                    columns={participantColumns}
                    actions={participantActions}
                  />
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    itemsCount={filteredParticipants.length}
                    itemName="participants"
                    onPageChange={setPage}
                    onFirstPage={() => setPage(1)}
                    onLastPage={() => setPage(totalPages)}
                  />
                </>
              )}
              {activeTab === 'events' && filteredEvents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                    <Calendar size={32} className="text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">No Events Found</h3>
                  <p className="text-gray-400 text-center max-w-sm">
                    There are no events matching your current filters. Try adjusting your search criteria.
                  </p>
                </div>
              )}
              {activeTab === 'requests' && filteredEventRequests.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                    <CheckCircle size={32} className="text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">No Event Requests Found</h3>
                  <p className="text-gray-400 text-center max-w-sm">
                    There are no event requests matching your current filters.
                  </p>
                </div>
              )}
              {activeTab === 'participants' && filteredParticipants.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                    <Users size={32} className="text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">No Participants Found</h3>
                  <p className="text-gray-400 text-center max-w-sm">
                    There are no participants matching your current filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddEventModal
        isOpen={showAddEventModal}
        onClose={() => {
          setShowAddEventModal(false);
          setSelectedEvent(null);
          setIsEditing(false);
        }}
        onSubmit={handleSaveEvent}
        form={eventForm}
        setForm={setEventForm}
        eventTypes={EVENT_TYPES}
        organizers={ORGANIZERS}
        isEditing={isEditing}
      />

      <EventDetailsModal
        isOpen={showEventDetailsModal}
        onClose={() => setShowEventDetailsModal(false)}
        event={selectedEvent}
        onEdit={handleEditEvent}
      />

      <WarningModal
        isOpen={showDeleteWarning}
        onClose={() => {
          setShowDeleteWarning(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Event"
        message={
          itemToDelete
            ? `Are you sure you want to delete this event? This action cannot be undone.`
            : ''
        }
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <style jsx>{`
        @keyframes floatingMist {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(15px);
            opacity: 0.7;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminEventsManagement;