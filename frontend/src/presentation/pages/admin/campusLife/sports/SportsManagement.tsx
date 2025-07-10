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
import Header from '../../../../components/admin/management/Header';
import ApplicationsTable from '../../../../components/admin/management/ApplicationsTable';
import Pagination from '../../../../components/admin/management/Pagination';
import WarningModal from '../../../../components/WarningModal';
import AddTeamModal from './AddTeamModal';
import TeamDetailsModal from './TeamDetailsModal';
import { useSportsManagement } from '../../../../../application/hooks/useSportsManagement';
import TeamRequestDetailsModal from './TeamRequestDetailsModal';
import {
  Team,
  PlayerRequest,
  Filters,
  ItemToAction,
} from '../../../../../domain/types/sportmanagement';
import { formatDate } from '../../../../../shared/utils/dateUtils';
import {
  SPORT_TYPES,
  TEAM_STATUSES,
  REQUEST_STATUSES,
  COACHES,
  DATE_RANGES,
  TEAM_CATEGORIES,
  DIVISIONS,
  getTeamColumns,
  getPlayerRequestColumns,
} from '../../../../../shared/constants/sportManagementConstants';
import {
  filterTeams,
  filterPlayerRequests,
  resetFilters,
  formatDateRangeValue,
  getFilterOptions,
} from '../../../../../shared/filters/sportManagementFilter';

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
    teamDetails,
    handleViewTeam,
    handleEditTeam,
    setSelectedTeamId,
    requestDetails,
    handleViewRequest,

  } = useSportsManagement();



  const [activeTab, setActiveTab] = useState<'teams' | 'requests'>('teams');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showTeamDetailsModal, setShowTeamDetailsModal] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'team' } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showApproveWarning, setShowApproveWarning] = useState(false);
  const [showRejectWarning, setShowRejectWarning] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PlayerRequest | null>(null);
  const [showRequestDetailsModal, setShowRequestDetailsModal] = useState(false);

  const debouncedFilterChange = useCallback(
    debounce((field: string, value: string) => {      
      // Format date range value
      let formattedValue = value;
      if (field === 'dateRange') {
        formattedValue = formatDateRangeValue(value);
      }

      setFilters((prev) => {
        const newFilters = { ...prev, [field]: formattedValue || 'all' };
        return newFilters;
      });
    }, 300),
    [setFilters]
  );

  const handleResetFilters = () => {
    setFilters(resetFilters());
    setSearchTerm('');
  };

  // Update the tab change handler
  const handleTabChangeWithFilters = (tab: 'teams' | 'requests') => {
    setActiveTab(tab);
    handleTabChange(tab);
    setFilters(resetFilters());
    setPage(1);
  };

  const filteredTeams = filterTeams(teams || [], searchTerm, filters);
  const filteredPlayerRequests = filterPlayerRequests(playerRequests || [], searchTerm, filters);

  const handleAddTeam = () => {
    setSelectedTeamId(null);
    setIsEditing(false);
    setShowAddTeamModal(true);
  };

  const handleViewTeamClick = (team: Team) => {
    handleViewTeam(team.id);
    setShowTeamDetailsModal(true);
  };

  const handleEditTeamClick = (team: Team) => {
    handleEditTeam(team.id);
    setIsEditing(true);
    setShowAddTeamModal(true);
  };

  const handleSaveTeam = async (data: Team) => {
    try {
      if (isEditing && teamDetails) {
        await updateTeam({ id: teamDetails._id, data });
      } else {
        await createTeam(data);
      }
      setShowAddTeamModal(false);
      setSelectedTeamId(null);
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
        setPlayerRequests(prevRequests => 
          prevRequests?.map(request => 
            request.requestId === selectedRequest.requestId 
              ? { ...request, status: 'approved' }
              : request
          )
        );
        if (requestDetails?.sportRequest?.id === selectedRequest.requestId) {
          setRequestDetails(prev => ({
            ...prev,
            sportRequest: {
              ...prev.sportRequest,
              status: 'approved'
            }
          }));
        }
        setShowApproveWarning(false);
        setShowRequestDetailsModal(false);
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
        setPlayerRequests(prevRequests => 
          prevRequests?.map(request => 
            request.requestId === selectedRequest.requestId 
              ? { ...request, status: 'rejected' }
              : request
          )
        );
        if (requestDetails?.sportRequest?.id === selectedRequest.requestId) {
          setRequestDetails(prev => ({
            ...prev,
            sportRequest: {
              ...prev.sportRequest,
              status: 'rejected'
            }
          }));
        }
        setShowRejectWarning(false);
        setShowRequestDetailsModal(false);
        setSelectedRequest(null);
      } catch (error) {
        console.error('Error rejecting player request:', error);
      }
    }
  };

  const teamActions = [
    {
      icon: <Eye size={16} />,
      label: 'View Team',
      onClick: handleViewTeamClick,
      color: 'blue' as const,
    },
    {
      icon: <Edit size={16} />,
      label: 'Edit Team',
      onClick: handleEditTeamClick,
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
        handleViewRequest(request.requestId);
        setShowRequestDetailsModal(true);
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
          subtitle="Manage sports teams and player enrollments"
          stats={[
            {
              icon: <Users />,
              title: 'Total Teams',
              value: filteredTeams.length.toString(),
              change: '+10%',
              isPositive: true,
            },
            {
              icon: <CheckCircle />,
              title: 'Pending Requests',
              value: filteredPlayerRequests.filter((r) => r.status === 'pending').length.toString(),
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
          filterOptions={getFilterOptions(activeTab)}
          debouncedFilterChange={debouncedFilterChange}
          handleResetFilters={handleResetFilters}
          onTabClick={(index) => {
            const tabMap = ['teams', 'requests'];
            const newTab = tabMap[index] as 'teams' | 'requests';
            handleTabChangeWithFilters(newTab);
          }}
        />

        <div className="mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
            <div className="px-6 py-5">
              {activeTab === 'teams' && (
                <button
                  onClick={handleAddTeam}
                  className="mb-6 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  aria-label="Add new team"
                >
                  <Plus size={16} />
                  Add Team
                </button>
              )}

              {activeTab === 'teams' && filteredTeams.length > 0 && (
                <>
                  <ApplicationsTable data={filteredTeams} columns={getTeamColumns(Users, Trophy, formatDate)} actions={teamActions} />
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

              {activeTab === 'requests' && filteredPlayerRequests.length > 0 && (
                <>
                  <ApplicationsTable
                    data={filteredPlayerRequests}
                    columns={getPlayerRequestColumns(Users, Trophy, formatDate)}
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
                    aria-label="Create new team"
                  >
                    <Plus size={16} />
                    Create New Team
                  </button>
                </div>
              )}

              {activeTab === 'requests' && filteredPlayerRequests.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                    <CheckCircle size={32} className="text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">No Player Requests Found</h3>
                  <p className="text-gray-400 text-center max-w-md">
                    There are no player requests matching your current filters. Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <TeamDetailsModal
        isOpen={showTeamDetailsModal}
        onClose={() => {
          setShowTeamDetailsModal(false);
          setSelectedTeamId(null);
        }}
        team={teamDetails}
        onEdit={handleEditTeamClick}
      />

      <AddTeamModal
        isOpen={showAddTeamModal}
        onClose={() => {
          setShowAddTeamModal(false);
          setSelectedTeamId(null);
          setIsEditing(false);
        }}
        onSubmit={handleSaveTeam}
        initialData={isEditing && teamDetails ? {
          title: teamDetails.title,
          type: teamDetails.type,
          category: teamDetails.category,
          organizer: teamDetails.organizer,
          organizerType: teamDetails.organizerType,
          icon: teamDetails.icon,
          color: teamDetails.color,
          division: teamDetails.division,
          headCoach: teamDetails.headCoach,
          homeGames: teamDetails.homeGames,
          record: teamDetails.record,
          upcomingGames: teamDetails.upcomingGames || [{ date: '', description: '' }],
          participants: teamDetails.playerCount,
          status: teamDetails.status as 'Active' | 'Inactive',
        } : undefined}
        isEditing={isEditing}
        sportTypes={SPORT_TYPES.filter(type => type !== 'All')}
        coaches={COACHES.filter(coach => coach !== 'All')}
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
        title="Approve Player Request"
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
        title="Reject Player Request"
        message="Are you sure you want to reject this player request?"
        confirmText="Reject"
        cancelText="Cancel"
        type="danger"
      />

      <TeamRequestDetailsModal
        isOpen={showRequestDetailsModal}
        onClose={() => {
          setShowRequestDetailsModal(false);
          setSelectedRequest(null);
        }}
        request={requestDetails?.data}
        onApprove={handleConfirmApprove}
        onReject={handleConfirmReject}
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

export { AdminSportsManagement as default };