import React, { useState, useCallback } from 'react';
import {
  IoAdd as Plus,
  IoEyeOutline as Eye,
  IoCreateOutline as Edit,
  IoTrashOutline as Trash2,
  IoCalendarOutline as Calendar,
  IoLocationOutline as MapPin,
  IoBusinessOutline as Building,
  IoSchoolOutline as GraduationCap,
  IoPersonOutline as User,
} from 'react-icons/io5';
import { debounce } from 'lodash';
import toast from 'react-hot-toast';
import Header from '../../User/Header';
import ApplicationsTable from '../../User/ApplicationsTable';
import Pagination from '../../User/Pagination';
import WarningModal from '../../../../components/WarningModal';
import AddEventModal from './AddEventModal';
import EventDetailsModal from './EventDetailsModal';
import EventRequestDetailsModal from './EventRequestDetailsModal';
import { useEventManagement } from '../../../../../application/hooks/useEventManagement';

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  organizerType: string;
  eventType: string;
  icon: string;
  color: string;
  description?: string;
  fullTime: boolean;
  additionalInfo?: string;
  requirements?: string;
  status: string;
  maxParticipants: number;
  registrationRequired: boolean;
  createdAt: string;
  organizer: string;
}

interface EventRequest {
  _id: string;
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

interface Filters {
  [key: string]: string;
  eventType: string;
  dateRange: string;
  status: string;
}

const EVENT_TYPES = ['All', 'Workshop', 'Seminar', 'Fest', 'Competition', 'Exhibition'];
const EVENT_STATUSES = ['All', 'Upcoming', 'Completed', 'Cancelled'];
const REQUEST_STATUSES = ['All', 'Pending', 'Approved', 'Rejected'];
const DATE_RANGES = ['All', 'Last Week', 'Last Month', 'Last 3 Months', 'Last 6 Months', 'Last Year'];
const ORGANIZERS = ['All', 'Department', 'Club', 'Student'];

const eventColumns = [
  {
    header: 'Event',
    key: 'title',
    render: (event: Event) => (
      <div>
        <p className="font-medium text-gray-200">{event.title}</p>
        <p className="text-xs text-gray-400">ID: {event._id.slice(0, 7)}</p>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Organizer Type',
    key: 'organizerType',
    render: (event: Event) => (
      <div className="flex items-center text-gray-300">
        {event.organizerType.toLowerCase() === 'department' ? (
          <Building size={14} className="text-purple-400 mr-2" />
        ) : event.organizerType.toLowerCase() === 'club' ? (
          <GraduationCap size={14} className="text-purple-400 mr-2" />
        ) : (
          <User size={14} className="text-purple-400 mr-2" />
        )}
        <div>
          <p className="text-sm capitalize">{event.organizerType}</p>
        </div>
      </div>
    ),
  },
  {
    header: 'Type',
    key: 'eventType',
    render: (event: Event) => (
      <div className="text-sm text-gray-300 capitalize">{event.eventType}</div>
    ),
  },
  {
    header: 'Date & Time',
    key: 'date',
    render: (event: Event) => (
      <div className="flex items-center text-gray-300">
        <Calendar size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{formatDate(event.date)}</span>
      </div>
    ),
  },
  {
    header: 'Venue',
    key: 'location',
    render: (event: Event) => (
      <div className="flex items-center text-gray-300">
        <MapPin size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{event.location}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (event: Event) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${event.status === 'upcoming'
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
];

const eventRequestColumns = [
  {
    header: 'Request',
    key: 'eventName',
    render: (request: EventRequest) => (
      <div>
        <p className="font-medium text-gray-200">{request.eventName}</p>
        <p className="text-xs text-gray-400">ID: {request.requestedId?.slice(0, 7)}</p>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Requested By',
    key: 'requestedBy',
    render: (request: EventRequest) => (
      <div className="flex items-center text-gray-300">
        {request.requesterType?.toLowerCase() === 'department' ? (
          <Building size={14} className="text-purple-400 mr-2" />
        ) : request.requesterType?.toLowerCase() === 'club' ? (
          <GraduationCap size={14} className="text-purple-400 mr-2" />
        ) : (
          <User size={14} className="text-purple-400 mr-2" />
        )}
        <div>
          <p className="text-sm">{request.requestedBy}</p>
          <p className="text-xs text-gray-400 capitalize">{request?.requesterType}</p>
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
        <span className="text-sm">{formatDate(request.proposedDate)}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (request: EventRequest) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${request.status === 'pending'
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

const AdminEventsManagement: React.FC = () => {
  const {
    events,
    eventRequests,
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
    handleTabChange,
    getEventDetails,
    getEventRequestDetails,
  } = useEventManagement();

  const [activeTab, setActiveTab] = useState<'events' | 'requests'>('events');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [showRequestDetailsModal, setShowRequestDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | EventRequest | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<EventRequest | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [itemToAction, setItemToAction] = useState<{
    id: string;
    type: 'event' | 'eventRequest';
    action: 'delete' | 'reject';
  } | null>(null);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = searchTerm
      ? event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizerType?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesEventType =
      filters.eventType === 'All' || event.eventType?.toLowerCase() === filters.eventType.toLowerCase();

    const matchesStatus =
      filters.status === 'All' || event.status?.toLowerCase() === filters.status.toLowerCase();

    let matchesDateRange = true;
    if (filters.dateRange && filters.dateRange !== 'All' && event.date) {
      const eventDate = new Date(event.date);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - eventDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (filters.dateRange) {
        case 'Last Week':
          matchesDateRange = diffDays <= 7;
          break;
        case 'Last Month':
          matchesDateRange = diffDays <= 30;
          break;
        case 'Last 3 Months':
          matchesDateRange = diffDays <= 90;
          break;
        case 'Last 6 Months':
          matchesDateRange = diffDays <= 180;
          break;
        case 'Last Year':
          matchesDateRange = diffDays <= 365;
          break;
        default:
          matchesDateRange = true;
      }
    }

    return matchesSearch && matchesEventType && matchesStatus && matchesDateRange;
  });

  const filteredEventRequests = eventRequests.filter((request) => {
    const matchesSearch = searchTerm
      ? request.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestedBy?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesEventType =
      filters.eventType === 'All' || request.type?.toLowerCase() === filters.eventType.toLowerCase();

    const matchesStatus =
      filters.status === 'All' || request.status?.toLowerCase() === filters.status.toLowerCase();

    let matchesDateRange = true;
    if (filters.dateRange && filters.dateRange !== 'All' && request.proposedDate) {
      const requestDate = new Date(request.proposedDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - requestDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (filters.dateRange) {
        case 'Last Week':
          matchesDateRange = diffDays <= 7;
          break;
        case 'Last Month':
          matchesDateRange = diffDays <= 30;
          break;
        case 'Last 3 Months':
          matchesDateRange = diffDays <= 90;
          break;
        case 'Last 6 Months':
          matchesDateRange = diffDays <= 180;
          break;
        case 'Last Year':
          matchesDateRange = diffDays <= 365;
          break;
        default:
          matchesDateRange = true;
      }
    }

    return matchesSearch && matchesEventType && matchesStatus && matchesDateRange;
  });

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setShowAddEventModal(true);
  };

  const handleEditEvent = async (event: Event) => {
    try {
      const details = await getEventDetails(event._id);
      setSelectedEvent(details);
      setShowAddEventModal(true);
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast.error('Failed to fetch event details');
    }
  };

  const handleViewEvent = async (event: Event | EventRequest) => {
    try {
      if ('_id' in event) {
        const details = await getEventDetails(event._id);
        setSelectedEvent(details);
      } else {
        setSelectedEvent(event);
      }
      setShowEventDetailsModal(true);
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast.error('Failed to fetch event details');
    }
  };

  const handleSaveEvent = async (data: Omit<Event, '_id' | 'createdAt'>) => {
    try {
      if (selectedEvent && '_id' in selectedEvent) {
        await updateEvent({ id: selectedEvent._id, data });
        toast.success('Event updated successfully');
      } else {
        await createEvent(data);
        toast.success('Event created successfully');
      }
      setShowAddEventModal(false);
      setSelectedEvent(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to save event');
    }
  };

  const handleDeleteEvent = (id: string) => {
    setItemToAction({ id, type: 'event', action: 'delete' });
    setShowWarningModal(true);
  };

  const handleViewRequest = async (request: EventRequest) => {
    try {
      const details = await getEventRequestDetails(request.requestedId);
      setSelectedRequest(details);
      setShowRequestDetailsModal(true);
    } catch (error) {
      console.error('Error fetching request details:', error);
      toast.error('Failed to fetch request details');
    }
  };

  const handleApproveRequest = async (id: string) => {
    try {
      await approveEventRequest(id);
      toast.success('Event request approved');
      setShowRequestDetailsModal(false);
      setSelectedRequest(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve event request');
    }
  };

  const handleRejectRequest = async (id: string) => {
    try {
      await rejectEventRequest(id);
      toast.success('Event request rejected');
      setShowRequestDetailsModal(false);
      setSelectedRequest(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject event request');
    }
  };

  const handleConfirmAction = async () => {
    if (itemToAction) {
      try {
        if (itemToAction.type === 'event' && itemToAction.action === 'delete') {
          await deleteEvent(itemToAction.id);
          toast.success('Event deleted successfully');
        } else if (itemToAction.type === 'eventRequest' && itemToAction.action === 'reject') {
          await rejectEventRequest(itemToAction.id);
          toast.success('Event request rejected');
        }
        setShowWarningModal(false);
        setItemToAction(null);
      } catch (error: any) {
        toast.error(error.message || 'Failed to perform action');
      }
    }
  };

  const handleResetFilters = () => {
    setFilters({
      eventType: 'All',
      dateRange: 'All',
      status: 'All',
    });
  };

  const debouncedFilterChange = useCallback(
    debounce((field: string, value: string) => {
      setFilters((prev) => ({
        ...prev,
        [field]: value || 'All',
      }));
    }, 300),
    []
  );

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
      onClick: (event: Event) => handleDeleteEvent(event._id),
      color: 'red' as const,
    },
  ];

  const eventRequestActions = [
    {
      icon: <Eye size={16} />,
      label: 'View Request',
      onClick: handleViewRequest,
      color: 'blue' as const,
    },
    {
      icon: <Edit size={16} />,
      label: 'Approve Request',
      onClick: (request: EventRequest) => handleApproveRequest(request._id),
      color: 'green' as const,
      disabled: (request: EventRequest) => request.status !== 'pending',
    },
    {
      icon: <Trash2 size={16} />,
      label: 'Reject Request',
      onClick: (request: EventRequest) => {
        setItemToAction({ id: request._id, type: 'eventRequest', action: 'reject' });
        setShowWarningModal(true);
      },
      color: 'red' as const,
      disabled: (request: EventRequest) => request.status !== 'pending',
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
          title="Event Management"
          subtitle="Manage campus events and activities"
          stats={[
            {
              icon: <Calendar />,
              title: 'Total Events',
              value: filteredEvents.length.toString(),
              change: '+10%',
              isPositive: true,
            },
            {
              icon: <Calendar />,
              title: 'Upcoming Events',
              value: filteredEvents.filter((e) => e.status?.toLowerCase() === 'upcoming').length.toString(),
              change: '+8%',
              isPositive: true,
            },
            {
              icon: <Building />,
              title: 'Department Events',
              value: filteredEvents.filter((e) => e.organizerType?.toLowerCase() === 'department').length.toString(),
              change: '+5%',
              isPositive: true,
            },
          ]}
          tabs={[
            { label: 'Events', icon: <Calendar size={16} />, active: activeTab === 'events' },
            { label: 'Event Requests', icon: <Edit size={16} />, active: activeTab === 'requests' },
          ]}
          searchQuery={searchTerm}
          setSearchQuery={setSearchTerm}
          searchPlaceholder="Search events or requests..."
          filters={filters}
          filterOptions={{
            eventType: EVENT_TYPES,
            dateRange: DATE_RANGES,
            status: activeTab === 'events' ? EVENT_STATUSES : REQUEST_STATUSES,
          }}
          debouncedFilterChange={debouncedFilterChange}
          handleResetFilters={handleResetFilters}
          onTabClick={(index) => {
            const tabMap = ['events', 'requests'];
            const newTab = tabMap[index] as 'events' | 'requests';
            setActiveTab(newTab);
            handleTabChange(newTab);
            setFilters({
              eventType: 'All',
              dateRange: 'All',
              status: 'All',
            });
          }}
        />

        <div className="mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
            <div className="px-6 py-5">
              {activeTab === 'events' && (
                <button
                  onClick={handleAddEvent}
                  className="mb-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  aria-label="Add new event"
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
                    <Edit size={32} className="text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">No Event Requests Found</h3>
                  <p className="text-gray-400 text-center max-w-sm">
                    There are no event requests matching your current filters.
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
        }}
        onSubmit={handleSaveEvent}
        initialData={selectedEvent ? {
          title: selectedEvent.title,
          date: selectedEvent.date,
          time: selectedEvent.time,
          location: selectedEvent.location,
          organizerType: selectedEvent.organizerType,
          eventType: selectedEvent.eventType,
          icon: selectedEvent.icon,
          color: selectedEvent.color,
          description: selectedEvent.description,
          fullTime: selectedEvent.fullTime,
          additionalInfo: selectedEvent.additionalInfo,
          requirements: selectedEvent.requirements,
          status: selectedEvent.status,
          maxParticipants: selectedEvent.maxParticipants,
          registrationRequired: selectedEvent.registrationRequired,
          organizer: selectedEvent.organizer,
        } : undefined}
        isEditing={!!selectedEvent}
        eventTypes={EVENT_TYPES.filter(type => type !== 'All')}
        organizers={ORGANIZERS.filter(org => org !== 'All')}
      />

      <EventDetailsModal
        isOpen={showEventDetailsModal}
        onClose={() => {
          setShowEventDetailsModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onEdit={handleEditEvent}
      />

      <EventRequestDetailsModal
        isOpen={showRequestDetailsModal}
        onClose={() => {
          setShowRequestDetailsModal(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
      />

      <WarningModal
        isOpen={showWarningModal}
        onClose={() => {
          setShowWarningModal(false);
          setItemToAction(null);
        }}
        onConfirm={handleConfirmAction}
        title={
          itemToAction?.type === 'event'
            ? 'Delete Event'
            : 'Reject Event Request'
        }
        message={
          itemToAction?.type === 'event'
            ? 'Are you sure you want to delete this event? This action cannot be undone.'
            : 'Are you sure you want to reject this event request?'
        }
        confirmText={itemToAction?.type === 'event' ? 'Delete' : 'Reject'}
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