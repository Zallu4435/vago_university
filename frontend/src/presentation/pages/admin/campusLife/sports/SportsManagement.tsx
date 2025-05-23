import React, { useState, useCallback } from 'react';
import { 
  IoAdd as Plus,
  IoEyeOutline as Eye,
  IoCreateOutline as Edit,
  IoTrashOutline as Trash2,
  IoCalendarOutline as Calendar,
  IoPeopleOutline as Users,
  IoCheckmarkCircleOutline as CheckCircle,
  IoCloseCircleOutline as XCircle,
  IoTrophyOutline as Trophy,
  IoLocationOutline as MapPin,
  IoPersonOutline as User,
} from 'react-icons/io5';
import { debounce } from 'lodash';
import Header from '../../User/Header';
import ApplicationsTable from '../../User/ApplicationsTable';
import Pagination from '../../User/Pagination';
import WarningModal from '../../../../components/WarningModal';
import AddTeamModal from './AddTeamModa';
import EventModal from './EventModal';
import TeamDetailsModal from './TeamDetailsModal';
import { useSportsManagement } from '../../../../../application/hooks/useSportsManagement';

interface Team {
  id: string;
  name: string;
  sportType: string;
  coach: string;
  playerCount: number;
  status: string;
  formedOn: string;
  logo: string;
}

interface Event {
  id: string;
  title: string;
  sportType: string;
  teams: string[];
  dateTime: string;
  venue: string;
  status: string;
}

interface TeamRequest {
  id: string;
  teamName: string;
  sportType: string;
  requestedBy: string;
  reason: string;
  requestedAt: string;
  status: string;
}

interface PlayerRequest {
  id: string;
  studentName: string;
  studentId: string;
  team: string;
  sport: string;
  reason: string;
  requestedAt: string;
  status: string;
}

const SPORT_TYPES = ['All Sports', 'Football', 'Basketball', 'Badminton', 'Athletics', 'Swimming'];
const STATUSES = ['All Statuses', 'Active', 'Inactive', 'Upcoming', 'Completed', 'Pending', 'Approved', 'Rejected'];
const COACHES = ['All Coaches', 'Dr. John Smith', 'Prof. Sarah Johnson', 'Mr. Mike Wilson'];

const teamColumns = [
  {
    header: 'Team',
    key: 'name',
    render: (team: Team) => (
      <div className="flex items-center gap-3">
        <span className="text-2xl">{team.logo}</span>
        <div>
          <p className="font-medium text-gray-200">{team.name}</p>
          <p className="text-xs text-gray-400">ID: {team.id}</p>
        </div>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Sport',
    key: 'sportType',
    render: (team: Team) => (
      <div className="flex items-center text-gray-300">
        <Trophy size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{team.sportType}</span>
      </div>
    ),
  },
  {
    header: 'Coach',
    key: 'coach',
    render: (team: Team) => (
      <div className="flex items-center text-gray-300">
        <User size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{team.coach}</span>
      </div>
    ),
  },
  {
    header: 'Players',
    key: 'playerCount',
    render: (team: Team) => (
      <div className="flex items-center text-gray-300">
        <Users size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{team.playerCount}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (team: Team) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          team.status === 'Active'
            ? 'bg-green-900/30 text-green-400 border-green-500/30'
            : 'bg-gray-900/30 text-gray-400 border-gray-500/30'
        }`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full mr-1.5"
          style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
        ></span>
        {team.status}
      </span>
    ),
  },
  {
    header: 'Formed On',
    key: 'formedOn',
    render: (team: Team) => (
      <div className="flex items-center text-gray-300">
        <Calendar size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{team.formedOn}</span>
      </div>
    ),
  },
];

const eventColumns = [
  {
    header: 'Event',
    key: 'title',
    render: (event: Event) => (
      <div>
        <p className="font-medium text-gray-200">{event.title}</p>
        <p className="text-xs text-gray-400">ID: {event.id}</p>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Sport',
    key: 'sportType',
    render: (event: Event) => (
      <div className="flex items-center text-gray-300">
        <Trophy size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{event.sportType}</span>
      </div>
    ),
  },
  {
    header: 'Teams',
    key: 'teams',
    render: (event: Event) => (
      <div className="text-sm text-gray-300">{event.teams.join(' vs ')}</div>
    ),
  },
  {
    header: 'Date & Time',
    key: 'dateTime',
    render: (event: Event) => (
      <div className="flex items-center text-gray-300">
        <Calendar size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{event.dateTime}</span>
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
          event.status === 'Upcoming'
            ? 'bg-blue-900/30 text-blue-400 border-blue-500/30'
            : event.status === 'Completed'
            ? 'bg-green-900/30 text-green-400 border-green-500/30'
            : 'bg-red-900/30 text-red-400 border-red-500/30'
        }`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full mr-1.5"
          style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
        ></span>
        {event.status}
      </span>
    ),
  },
];

const teamRequestColumns = [
  {
    header: 'Request',
    key: 'teamName',
    render: (request: TeamRequest) => (
      <div>
        <p className="font-medium text-gray-200">{request.teamName}</p>
        <p className="text-xs text-gray-400">ID: {request.id}</p>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Sport',
    key: 'sportType',
    render: (request: TeamRequest) => (
      <div className="flex items-center text-gray-300">
        <Trophy size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{request.sportType}</span>
      </div>
    ),
  },
  {
    header: 'Requested By',
    key: 'requestedBy',
    render: (request: TeamRequest) => (
      <div className="flex items-center text-gray-300">
        <User size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{request.requestedBy}</span>
      </div>
    ),
  },
  {
    header: 'Reason',
    key: 'reason',
    render: (request: TeamRequest) => (
      <div className="text-sm text-gray-300 max-w-xs truncate">{request.reason}</div>
    ),
  },
  {
    header: 'Date',
    key: 'requestedAt',
    render: (request: TeamRequest) => (
      <div className="flex items-center text-gray-300">
        <Calendar size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{request.requestedAt}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (request: TeamRequest) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          request.status === 'Pending'
            ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
            : request.status === 'Approved'
            ? 'bg-green-900/30 text-green-400 border-green-500/30'
            : 'bg-red-900/30 text-red-400 border-red-500/30'
        }`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full mr-1.5"
          style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
        ></span>
        {request.status}
      </span>
    ),
  },
];

const playerRequestColumns = [
  {
    header: 'Student',
    key: 'studentName',
    render: (request: PlayerRequest) => (
      <div>
        <p className="font-medium text-gray-200">{request.studentName}</p>
        <p className="text-xs text-gray-400">{request.studentId}</p>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Team',
    key: 'team',
    render: (request: PlayerRequest) => (
      <div className="flex items-center text-gray-300">
        <Users size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{request.team}</span>
      </div>
    ),
  },
  {
    header: 'Sport',
    key: 'sport',
    render: (request: PlayerRequest) => (
      <div className="flex items-center text-gray-300">
        <Trophy size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{request.sport}</span>
      </div>
    ),
  },
  {
    header: 'Reason',
    key: 'reason',
    render: (request: PlayerRequest) => (
      <div className="text-sm text-gray-300 max-w-xs truncate">{request.reason}</div>
    ),
  },
  {
    header: 'Date',
    key: 'requestedAt',
    render: (request: PlayerRequest) => (
      <div className="flex items-center text-gray-300">
        <Calendar size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{request.requestedAt}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (request: PlayerRequest) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          request.status === 'Pending'
            ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
            : request.status === 'Approved'
            ? 'bg-green-900/30 text-green-400 border-green-500/30'
            : 'bg-red-900/30 text-red-400 border-red-500/30'
        }`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full mr-1.5"
          style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
        ></span>
        {request.status}
      </span>
    ),
  },
];

const AdminSportsManagement: React.FC = () => {
  const {
    teams,
    events,
    teamRequests,
    playerRequests,
    totalPages,
    page,
    setPage,
    filters,
    setFilters,
    isLoading,
    error,
    createTeam,
    updateTeam,
    deleteTeam,
    scheduleEvent,
    approveTeamRequest,
    rejectTeamRequest,
    approvePlayerRequest,
    rejectPlayerRequest,
  } = useSportsManagement();

  const [activeTab, setActiveTab] = useState<'teams' | 'events' | 'requests'>('teams');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showTeamDetailsModal, setShowTeamDetailsModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'team' | 'event' } | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [teamForm, setTeamForm] = useState({
    name: '',
    sportType: '',
    coach: '',
    playerCount: 0,
    status: 'Active',
    formedOn: new Date().toISOString().split('T')[0],
    logo: '',
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    sportType: '',
    teams: [] as string[],
    dateTime: '',
    venue: '',
    status: 'Upcoming',
  });

  const filteredTeams = teams.filter((team) => {
    const matchesSearch = searchTerm
      ? team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.id.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesSportType =
      filters.sportType === 'all' || team.sportType.toLowerCase() === filters.sportType.toLowerCase();
    const matchesStatus =
      filters.status === 'all' || team.status.toLowerCase() === filters.status.toLowerCase();
    const matchesCoach =
      filters.coach === 'all' || team.coach.toLowerCase() === filters.coach.toLowerCase();
    return matchesSearch && matchesSportType && matchesStatus && matchesCoach;
  });

  const filteredEvents = events.filter((event) => {
    const matchesSearch = searchTerm
      ? event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.id.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesSportType =
      filters.sportType === 'all' || event.sportType.toLowerCase() === filters.sportType.toLowerCase();
    const matchesStatus =
      filters.status === 'all' || event.status.toLowerCase() === filters.status.toLowerCase();
    return matchesSearch && matchesSportType && matchesStatus;
  });

  const filteredTeamRequests = teamRequests.filter((request) => {
    const matchesSearch = searchTerm
      ? request.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesSportType =
      filters.sportType === 'all' || request.sportType.toLowerCase() === filters.sportType.toLowerCase();
    const matchesStatus =
      filters.status === 'all' || request.status.toLowerCase() === filters.status.toLowerCase();
    return matchesSearch && matchesSportType && matchesStatus;
  });

  const filteredPlayerRequests = playerRequests.filter((request) => {
    const matchesSearch = searchTerm
      ? request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesSportType =
      filters.sportType === 'all' || request.sport.toLowerCase() === filters.sportType.toLowerCase();
    const matchesStatus =
      filters.status === 'all' || request.status.toLowerCase() === filters.status.toLowerCase();
    return matchesSearch && matchesSportType && matchesStatus;
  });

  const handleAddTeam = () => {
    setTeamForm({
      name: '',
      sportType: '',
      coach: '',
      playerCount: 0,
      status: 'Active',
      formedOn: new Date().toISOString().split('T')[0],
      logo: '',
    });
    setIsEditing(false);
    setSelectedTeam(null);
    setShowAddTeamModal(true);
  };

  const handleEditTeam = (team: Team) => {
    setTeamForm({
      name: team.name,
      sportType: team.sportType,
      coach: team.coach,
      playerCount: team.playerCount,
      status: team.status,
      formedOn: team.formedOn,
      logo: team.logo,
    });
    setSelectedTeam(team);
    setIsEditing(true);
    setShowAddTeamModal(true);
  };

  const handleViewTeam = (team: Team) => {
    setSelectedTeam(team);
    setShowTeamDetailsModal(true);
  };

  const handleSaveTeam = async () => {
    try {
      if (isEditing && selectedTeam) {
        await updateTeam({ id: selectedTeam._id, data: teamForm });
      } else {
        await createTeam(teamForm);
      }
      setShowAddTeamModal(false);
      setSelectedTeam(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving team:', error);
    }
  };

  const handleDeleteItem = (id: string, type: 'team' | 'event') => {
    setItemToDelete({ id, type });
    setShowDeleteWarning(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      try {
        if (itemToDelete.type === 'team') {
          await deleteTeam(itemToDelete.id);
        }
        setShowDeleteWarning(false);
        setItemToDelete(null);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleScheduleEvent = async () => {
    try {
      await scheduleEvent(eventForm);
      setShowEventModal(false);
    } catch (error) {
      console.error('Error scheduling event:', error);
    }
  };

  const handleApproveTeamRequest = async (id: string) => {
    try {
      await approveTeamRequest(id);
    } catch (error) {
      console.error('Error approving team request:', error);
    }
  };

  const handleRejectTeamRequest = async (id: string) => {
    try {
      await rejectTeamRequest(id);
    } catch (error) {
      console.error('Error rejecting team request:', error);
    }
  };

  const handleApprovePlayerRequest = async (id: string) => {
    try {
      await approvePlayerRequest(id);
    } catch (error) {
      console.error('Error approving player request:', error);
    }
  };

  const handleRejectPlayerRequest = async (id: string) => {
    try {
      await rejectPlayerRequest(id);
    } catch (error) {
      console.error('Error rejecting player request:', error);
    }
  };

  const debouncedFilterChange = useCallback(
    debounce((field: string, value: string) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
    }, 10000),
    []
  );

  const handleResetFilters = () => {
    setFilters({
      sportType: 'All Sports',
      status: 'All Statuses',
      coach: 'All Coaches',
    });
  };

  const teamActions = [
    {
      icon: <Eye size={16} />,
      label: 'View Team',
      onClick: handleViewTeam,
      color: 'blue' as const,
    },
    {
      icon: <Edit size={16} />,
      label: 'Edit Team',
      onClick: handleEditTeam,
      color: 'green' as const,
    },
    {
      icon: <Trash2 size={16} />,
      label: 'Delete Team',
      onClick: (team: Team) => handleDeleteItem(team.id, 'team'),
      color: 'red' as const,
    },
  ];

  const eventActions = [
    {
      icon: <Eye size={16} />,
      label: 'View Event',
      onClick: () => {}, // Implement view event modal if needed
      color: 'blue' as const,
    },
    {
      icon: <Edit size={16} />,
      label: 'Edit Event',
      onClick: () => {}, // Implement edit event if needed
      color: 'green' as const,
    },
    {
      icon: <XCircle size={16} />,
      label: 'Cancel Event',
      onClick: (event: Event) => handleDeleteItem(event._id, 'event'),
      color: 'red' as const,
    },
  ];

  const teamRequestActions = [
    {
      icon: <CheckCircle size={16} />,
      label: 'Approve Request',
      onClick: (request: TeamRequest) => handleApproveTeamRequest(request.id),
      color: 'green' as const,
    },
    {
      icon: <XCircle size={16} />,
      label: 'Reject Request',
      onClick: (request: TeamRequest) => handleRejectTeamRequest(request.id),
      color: 'red' as const,
    },
    {
      icon: <Eye size={16} />,
      label: 'View Request',
      onClick: () => {}, // Implement view request modal if needed
      color: 'blue' as const,
    },
  ];

  const playerRequestActions = [
    {
      icon: <CheckCircle size={16} />,
      label: 'Approve Request',
      onClick: (request: PlayerRequest) => handleApprovePlayerRequest(request.id),
      color: 'green' as const,
      disabled: (request: PlayerRequest) => request.status !== 'Pending',
    },
    {
      icon: <XCircle size={16} />,
      label: 'Reject Request',
      onClick: (request: PlayerRequest) => handleRejectPlayerRequest(request.id),
      color: 'red' as const,
      disabled: (request: PlayerRequest) => request.status !== 'Pending',
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
          title="Sports Management"
          subtitle="Manage sports teams, events, and enrollments"
          stats={[
            {
              icon: <Users />,
              title: 'Active Teams',
              value: teams.filter((t) => t.status === 'Active').length.toString(),
              change: '+10%',
              isPositive: true,
            },
            {
              icon: <Calendar />,
              title: 'Upcoming Events',
              value: events.filter((e) => e.status === 'Upcoming').length.toString(),
              change: '+5%',
              isPositive: true,
            },
            {
              icon: <Trophy />,
              title: 'Total Players',
              value: teams.reduce((sum, team) => sum + team.playerCount, 0).toString(),
              change: '+15%',
              isPositive: true,
            },
            {
              icon: <CheckCircle />,
              title: 'Pending Requests',
              value: (
                teamRequests.length + playerRequests.filter((r) => r.status === 'Pending').length
              ).toString(),
              change: '+8%',
              isPositive: true,
            },
          ]}
          tabs={[
            { label: 'Teams', icon: <Users size={16} />, active: activeTab === 'teams' },
            { label: 'Events', icon: <Calendar size={16} />, active: activeTab === 'events' },
            {
              label: 'Requests',
              icon: <CheckCircle size={16} />,
              active: activeTab === 'requests',
            },
          ]}
          searchQuery={searchTerm}
          setSearchQuery={setSearchTerm}
          searchPlaceholder="Search teams, events, or requests..."
          filters={filters}
          filterOptions={{
            sportType: SPORT_TYPES,
            status: STATUSES,
            coach: COACHES,
          }}
          debouncedFilterChange={debouncedFilterChange}
          handleResetFilters={handleResetFilters}
          onTabClick={(index) => {
            const tabMap = ['teams', 'events', 'requests'];
            setActiveTab(tabMap[index] as 'teams' | 'events' | 'requests');
          }}
        />

        <div className="mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
            <div className="px-6 py-5">
              {activeTab === 'teams' && (
                <button
                  onClick={handleAddTeam}
                  className="mb-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus size={16} />
                  Add Team
                </button>
              )}
              {activeTab === 'events' && (
                <button
                  onClick={() => setShowEventModal(true)}
                  className="mb-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Calendar size={16} />
                  Schedule Event
                </button>
              )}

              {activeTab === 'teams' && filteredTeams.length > 0 && (
                <>
                  <ApplicationsTable data={filteredTeams} columns={teamColumns} actions={teamActions} />
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    itemsCount={filteredTeams.length}
                    itemName="teams"
                    onPageChange={setPage}
                    onFirstPage={() => setPage(1)}
                    onLastPage={() => setPage(totalPages)}
                  />
                </>
              )}
              {activeTab === 'events' && filteredEvents.length > 0 && (
                <>
                  <ApplicationsTable
                    data={filteredEvents}
                    columns={eventColumns}
                    actions={eventActions}
                  />
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
              {activeTab === 'requests' && (
                <div className="space-y-6">
                  {filteredTeamRequests.length > 0 && (
                    <>
                      <h3 className="text-lg font-medium text-white">Team Creation Requests</h3>
                      <ApplicationsTable
                        data={filteredTeamRequests}
                        columns={teamRequestColumns}
                        actions={teamRequestActions}
                      />
                      <Pagination
                        page={page}
                        totalPages={totalPages}
                        itemsCount={filteredTeamRequests.length}
                        itemName="team requests"
                        onPageChange={setPage}
                        onFirstPage={() => setPage(1)}
                        onLastPage={() => setPage(totalPages)}
                      />
                    </>
                  )}
                  {filteredPlayerRequests.length > 0 && (
                    <>
                      <h3 className="text-lg font-medium text-white">Player Enrollment Requests</h3>
                      <ApplicationsTable
                        data={filteredPlayerRequests}
                        columns={playerRequestColumns}
                        actions={playerRequestActions}
                      />
                      <Pagination
                        page={page}
                        totalPages={totalPages}
                        itemsCount={filteredPlayerRequests.length}
                        itemName="player requests"
                        onPageChange={setPage}
                        onFirstPage={() => setPage(1)}
                        onLastPage={() => setPage(totalPages)}
                      />
                    </>
                  )}
                  {filteredTeamRequests.length === 0 && filteredPlayerRequests.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                        <CheckCircle size={32} className="text-purple-400" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-1">No Requests Found</h3>
                      <p className="text-gray-400 text-center max-w-sm">
                        There are no team or player requests matching your current filters.
                      </p>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'teams' && filteredTeams.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                    <Users size={32} className="text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">No Teams Found</h3>
                  <p className="text-gray-400 text-center max-w-sm">
                    There are no teams matching your current filters. Try adjusting your search criteria.
                  </p>
                </div>
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
            </div>
          </div>
        </div>
      </div>

      <TeamDetailsModal
        isOpen={showTeamDetailsModal}
        onClose={() => setShowTeamDetailsModal(false)}
        team={selectedTeam}
        onEdit={handleEditTeam}
      />

      <AddTeamModal
        isOpen={showAddTeamModal}
        onClose={() => {
          setShowAddTeamModal(false);
          setSelectedTeam(null);
          setIsEditing(false);
        }}
        onSubmit={handleSaveTeam}
        form={teamForm}
        setForm={setTeamForm}
        sportTypes={SPORT_TYPES}
        coaches={COACHES}
        isEditing={isEditing}
      />

      <EventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSubmit={handleScheduleEvent}
        form={eventForm}
        setForm={setEventForm}
        sportTypes={SPORT_TYPES}
      />

      <WarningModal
        isOpen={showDeleteWarning}
        onClose={() => {
          setShowDeleteWarning(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        message={
          itemToDelete
            ? `Are you sure you want to delete this ${itemToDelete.type}? This action cannot be undone.`
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

export default AdminSportsManagement;