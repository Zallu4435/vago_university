import React, { useState, useCallback } from 'react';
import { 
  IoAdd as Plus,
  IoEyeOutline as Eye,
  IoCreateOutline as Edit,
  IoTrashOutline as Trash2,
  IoPeopleOutline as Users,
  IoCheckmarkCircleOutline as CheckCircle,
  IoCloseCircleOutline as XCircle,
  IoTrophyOutline as Trophy,
  IoPersonOutline as User,
} from 'react-icons/io5';
import { debounce } from 'lodash';
import Header from '../../User/Header';
import ApplicationsTable from '../../User/ApplicationsTable';
import Pagination from '../../User/Pagination';
import WarningModal from '../../../../components/WarningModal';
import AddTeamModal from './AddTeamModal';
import TeamDetailsModal from './TeamDetailsModal';
import { useSportsManagement } from '../../../../../application/hooks/useSportsManagement';

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

interface Team {
  id: string;
  title: string;
  type: string;
  headCoach: string;
  playerCount: number;
  status: string;
  createdAt: string;
  logo: string;
  category: string;
  organizer: string;
  organizerType: string;
  icon: string;
  color: string;
  division: string;
  homeGames: number;
  record: string;
  upcomingGames: { date: string; description: string }[];
}

interface PlayerRequest {
  teamName: string;
  requestId: string;
  requestedBy: string;
  type: string;
  requestedDate: string;
  status: string;
}

const SPORT_TYPES = ['All Sports', 'Football', 'Basketball', 'Badminton', 'Athletics', 'Swimming'];
const STATUSES = ['All Statuses', 'Active', 'Inactive', 'Pending', 'Approved', 'Rejected'];
const COACHES = ['All Coaches', 'Dr. John Smith', 'Prof. Sarah Johnson', 'Mr. Mike Wilson'];
const TEAM_CATEGORIES = ['Varsity', 'Club', 'Intramural'];
const DIVISIONS = ['Division I', 'Division II', 'Division III'];

const teamColumns = [
  {
    header: 'Team',
    key: 'name',
    render: (team: Team) => (
      <div className="flex items-center gap-3">
        <span 
          className="text-2xl w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${team.color}20`, color: team.color }}
        >
          {team.icon}
        </span>
        <div>
          <p className="font-medium text-gray-200">{team.title}</p>
        </div>
      </div>
    ),
    width: '15%',
  },
  {
    header: 'Sport',
    key: 'sportType',
    render: (team: Team) => (
      <div className="flex items-center text-gray-300">
        <Trophy size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{team.type}</span>
      </div>
    ),
  },
  {
    header: 'Coach',
    key: 'coach',
    render: (team: Team) => (
      <div className="flex items-center text-gray-300">
        <User size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{team.headCoach}</span>
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
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
          team.status === 'Active'
            ? 'bg-green-900/30 text-green-400 border-green-500/30'
            : 'bg-gray-900/30 text-gray-400 border-gray-500/30'
        }`}
      >
        <span
          className="h-2 w-2 rounded-full mr-2"
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
        <Users size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{formatDate(team.createdAt)}</span>
      </div>
    ),
  },
];

const playerRequestColumns = [
  {
    header: 'Student',
    key: 'studentName',
    render: (request: PlayerRequest) => (
      <div>
        <p className="font-medium text-gray-200">{request.requestedBy}</p>
        <p className="text-xs text-gray-400">{request.requestId}</p>
      </div>
    ),
    width: '25%',
  },
  {
    header: 'Team',
    key: 'team',
    render: (request: PlayerRequest) => (
      <div className="flex items-center text-gray-300">
        <Users size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{request.teamName}</span>
      </div>
    ),
  },
  {
    header: 'Sport',
    key: 'sport',
    render: (request: PlayerRequest) => (
      <div className="flex items-center text-gray-300">
        <Trophy size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{request.type}</span>
      </div>
    ),
  },
  {
    header: 'Date',
    key: 'requestedAt',
    render: (request: PlayerRequest) => (
      <div className="flex items-center text-gray-300">
        <Users size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{formatDate(request.requestedDate)}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (request: PlayerRequest) => (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
          request.status === 'pending'
            ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
            : request.status === 'approved'
            ? 'bg-green-900/30 text-green-400 border-green-500/30'
            : 'bg-red-900/30 text-red-400 border-red-500/30'
        }`}
      >
        <span
          className="h-2 w-2 rounded-full mr-2"
          style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
        ></span>
        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
      </span>
    ),
  },
];

const AdminSportsManagement: React.FC = () => {
  const {
    teams,
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
    approvePlayerRequest,
    rejectPlayerRequest,
    handleTabChange,
  } = useSportsManagement();

  const [activeTab, setActiveTab] = useState<'teams' | 'requests'>('teams');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showTeamDetailsModal, setShowTeamDetailsModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'team' } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showApproveWarning, setShowApproveWarning] = useState(false);
  const [showRejectWarning, setShowRejectWarning] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PlayerRequest | null>(null);

  const debouncedFilterChange = useCallback(
    debounce((field: string, value: string) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
    }, 300),
    [setFilters]
  );

  console.log(teams, 'teams');
  console.log(playerRequests, 'playerRequests');

  const filteredTeams = teams?.filter((team) => {
    const matchesSearch = team.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSportType = filters.sportType === 'all' || 
      team.type?.toLowerCase() === filters.sportType?.toLowerCase();
    const matchesStatus = filters.status === 'all' || 
      team.status?.toLowerCase() === filters.status?.toLowerCase();
    const matchesCoach = filters.coach === 'all' || 
      team.headCoach?.toLowerCase() === filters.coach?.toLowerCase();
    return matchesSearch && matchesSportType && matchesStatus && matchesCoach;
  }) || [];

  const filteredPlayerRequests = playerRequests?.filter((request) => {
    const matchesSearch = searchTerm
      ? request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesSportType = filters.sportType === 'all' || 
      request.sport?.toLowerCase() === filters.sportType?.toLowerCase();
    const matchesStatus = filters.status === 'all' || 
      request.status?.toLowerCase() === filters.status?.toLowerCase();
    return matchesSearch && matchesSportType && matchesStatus;
  }) || [];

  const handleAddTeam = () => {
    setSelectedTeam(null);
    setIsEditing(false);
    setShowAddTeamModal(true);
  };

  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    setIsEditing(true);
    setShowAddTeamModal(true);
  };

  const handleViewTeam = (team: Team) => {
    setSelectedTeam(team);
    setShowTeamDetailsModal(true);
  };

  const handleSaveTeam = async (data: Team) => {
    try {
      if (isEditing && selectedTeam) {
        await updateTeam({ id: selectedTeam.id, data });
      } else {
        await createTeam(data);
      }
      setShowAddTeamModal(false);
      setSelectedTeam(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving team:', error);
    }
  };

  const handleDeleteItem = (id: string) => {
    setItemToDelete({ id, type: 'team' });
    setShowDeleteWarning(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteTeam(itemToDelete.id);
        setShowDeleteWarning(false);
        setItemToDelete(null);
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  const handleApproveClick = (request: PlayerRequest) => {
    setSelectedRequest(request);
    setShowApproveWarning(true);
  };

  const handleRejectClick = (request: PlayerRequest) => {
    setSelectedRequest(request);
    setShowRejectWarning(true);
  };

  const handleConfirmApprove = async () => {
    if (selectedRequest) {
      try {
        await approvePlayerRequest(selectedRequest.requestId);
        setShowApproveWarning(false);
        setSelectedRequest(null);
      } catch (error) {
        console.error('Error approving player request:', error);
      }
    }
  };

  const handleConfirmReject = async () => {
    if (selectedRequest) {
      try {
        await rejectPlayerRequest(selectedRequest.requestId);
        setShowRejectWarning(false);
        setSelectedRequest(null);
      } catch (error) {
        console.error('Error rejecting player request:', error);
      }
    }
  };

  const handleResetFilters = () => {
    setFilters({
      sportType: 'All Sports',
      status: 'All Statuses',
      coach: 'All Coaches',
    });
    setSearchTerm('');
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
      onClick: (team: Team) => handleDeleteItem(team.id),
      color: 'red' as const,
    },
  ];

  const playerRequestActions = [
    {
      icon: <Eye size={16} />,
      label: 'View Details',
      onClick: (request: PlayerRequest) => {
        setSelectedRequest(request);
        setShowTeamDetailsModal(true);
      },
      color: 'blue' as const,
    },
    {
      icon: <CheckCircle size={16} />,
      label: 'Approve Request',
      onClick: handleApproveClick,
      color: 'green' as const,
      disabled: (request: PlayerRequest) => request.status !== 'pending',
    },
    {
      icon: <XCircle size={16} />,
      label: 'Reject Request',
      onClick: handleRejectClick,
      color: 'red' as const,
      disabled: (request: PlayerRequest) => request.status !== 'pending',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-red-900/30 text-red-400 p-6 rounded-lg border border-red-500/30">
          Error: {error.message}
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            Reset and Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Header
          title="Sports Management"
          subtitle="Manage sports teams and player enrollments"
          stats={[
            {
              icon: <Users />,
              title: 'Active Teams',
              value: filteredTeams.filter((t) => t.status === 'Active').length.toString(),
              change: '+10%',
              isPositive: true,
            },
            {
              icon: <CheckCircle />,
              title: 'Pending Requests',
              value: filteredPlayerRequests.filter((r) => r.status === 'Pending').length.toString(),
              change: '+8%',
              isPositive: true,
            },
            {
              icon: <Trophy />,
              title: 'Total Players',
              value: filteredTeams.reduce((sum, team) => sum + team.playerCount, 0).toString(),
              change: '+15%',
              isPositive: true,
            },
          ]}
          tabs={[
            { label: 'Teams', icon: <Users size={16} />, active: activeTab === 'teams' },
            { label: 'Player Requests', icon: <CheckCircle size={16} />, active: activeTab === 'requests' },
          ]}
          searchQuery={searchTerm}
          setSearchQuery={setSearchTerm}
          searchPlaceholder="Search teams or player requests..."
          filters={filters}
          filterOptions={{
            sportType: SPORT_TYPES,
            status: STATUSES,
            coach: COACHES,
          }}
          debouncedFilterChange={debouncedFilterChange}
          handleResetFilters={handleResetFilters}
          onTabClick={(index) => {
            const tabMap = ['teams', 'requests'];
            const newTab = tabMap[index] as 'teams' | 'requests';
            setActiveTab(newTab);
            handleTabChange(newTab);
            setPage(1);
          }}
        />

        <div className="mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
            <div className="px-6 py-5">
              {activeTab === 'teams' && (
                <button
                  onClick={handleAddTeam}
                  className="mb-6 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  <Plus size={16} />
                  Add Team
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

              {activeTab === 'requests' && (
                <div className="space-y-8">
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
                  {filteredPlayerRequests.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                        <CheckCircle size={32} className="text-purple-400" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">No Player Requests Found</h3>
                      <p className="text-gray-400 text-center max-w-md">
                        There are no player requests matching your current filters. Try adjusting your search criteria or create a new team.
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
                  <h3 className="text-lg font-medium text-white mb-2">No Teams Found</h3>
                  <p className="text-gray-400 text-center max-w-md">
                    There are no teams matching your current filters. Try adjusting your search criteria or create a new team.
                  </p>
                  <button
                    onClick={handleAddTeam}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    <Plus size={16} />
                    Create New Team
                  </button>
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
        initialData={isEditing && selectedTeam ? {
          title: selectedTeam.title,
          type: selectedTeam.type,
          category: selectedTeam.category,
          organizer: selectedTeam.organizer,
          organizerType: selectedTeam.organizerType,
          icon: selectedTeam.icon,
          color: selectedTeam.color,
          division: selectedTeam.division,
          headCoach: selectedTeam.headCoach,
          homeGames: selectedTeam.homeGames,
          record: selectedTeam.record,
          upcomingGames: selectedTeam.upcomingGames || [{ date: '', description: '' }],
          participants: selectedTeam.playerCount,
          status: selectedTeam.status as 'Active' | 'Inactive',
        } : undefined}
        isEditing={isEditing}
        sportTypes={SPORT_TYPES}
        coaches={COACHES}
        divisions={DIVISIONS}
        teamCategories={TEAM_CATEGORIES}
      />

      <WarningModal
        isOpen={showDeleteWarning}
        onClose={() => {
          setShowDeleteWarning(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Team"
        message="Are you sure you want to delete this team? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <WarningModal
        isOpen={showApproveWarning}
        onClose={() => {
          setShowApproveWarning(false);
          setSelectedRequest(null);
        }}
        onConfirm={handleConfirmApprove}
        title="Approve Request"
        message="Are you sure you want to approve this player request?"
        confirmText="Approve"
        cancelText="Cancel"
        type="success"
      />

      <WarningModal
        isOpen={showRejectWarning}
        onClose={() => {
          setShowRejectWarning(false);
          setSelectedRequest(null);
        }}
        onConfirm={handleConfirmReject}
        title="Reject Request"
        message="Are you sure you want to reject this player request?"
        confirmText="Reject"
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