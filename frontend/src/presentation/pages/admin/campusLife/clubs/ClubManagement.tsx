import React, { useState, useCallback } from 'react';
import {
  IoAdd as Plus,
  IoEyeOutline as Eye,
  IoCreateOutline as Edit,
  IoTrashOutline as Trash2,
  IoBusinessOutline as Building,
  IoPersonOutline as User,
} from 'react-icons/io5';
import { debounce } from 'lodash';
import toast from 'react-hot-toast';
import Header from '../../User/Header';
import ApplicationsTable from '../../User/ApplicationsTable';
import Pagination from '../../User/Pagination';
import WarningModal from '../../../../components/WarningModal';
import AddClubModal from './AddClubModal';
import ClubDetailsModal from './ClubDetailsModal';
import ClubRequestDetailsModal from './ClubRequestDetailsModal';
import { useClubManagement } from '../../../../../application/hooks/useClubManagement';

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

interface Club {
  id: string;
  name: string;
  type: string;
  members: string;
  icon: string;
  color: string;
  status: string;
  role: string;
  nextMeeting: string;
  about: string;
  createdBy: string;
  createdAt: string;
  upcomingEvents: { date: string; description: string }[];
}

interface ClubRequest {
  _id: string;
  name: string;
  type: string;
  members: string;
  icon: string;
  color: string;
  role: string;
  nextMeeting: string;
  about: string;
  requestedBy: string;
  createdAt: string;
  status: string;
  rejectionReason: string;
  upcomingEvents: { date: string; description: string }[];
}

const CATEGORIES = ['All', 'Tech', 'Cultural', 'Sports', 'Arts', 'Academic'];
const CLUB_STATUSES = ['All', 'Active', 'Inactive'];
const REQUEST_STATUSES = ['All', 'Pending', 'Approved', 'Rejected'];
const DATE_RANGES = ['All', 'Last Week', 'Last Month', 'Last 3 Months', 'Last 6 Months', 'Last Year'];
const ICONS = ['🎓', '🎨', '⚽', '💻', '🎭', '📚', '🎤', '🎮', '🏆', '🔬'];
const COLORS = ['#8B5CF6', '#06B6D4', '#EF4444', '#10B981', '#F59E0B', '#EC4899', '#6366F1', '#84CC16', '#F97316', '#DC2626'];

const clubColumns = [
  {
    header: 'Club',
    key: 'name',
    render: (club: Club) => (
      <div className="flex items-center gap-3">
        <span
          className="text-2xl w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${club.color}20`, color: club.color }}
        >
          {club.icon}
        </span>
        <div>
          <p className="font-medium text-gray-200">{club.name}</p>
          <p className="text-xs text-gray-400">ID: {club.id?.slice(0, 7)}</p>
        </div>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Type',
    key: 'type',
    render: (club: Club) => (
      <div className="text-sm text-gray-300 capitalize">{club.type}</div>
    ),
  },
  {
    header: 'Created By',
    key: 'createdBy',
    render: (club: Club) => (
      <div className="flex items-center text-gray-300">
        {club.createdBy.includes('Admin') ? (
          <Building size={14} className="text-purple-400 mr-2" />
        ) : (
          <User size={14} className="text-purple-400 mr-2" />
        )}
        <span className="text-sm">{club.createdBy}</span>
      </div>
    ),
  },
  {
    header: 'Created Date',
    key: 'createdAt',
    render: (club: Club) => (
      <div className="text-sm text-gray-300">{formatDate(club.createdAt)}</div>
    ),
  },
  {
    header: 'Members',
    key: 'members',
    render: (club: Club) => (
      <div className="flex items-center text-gray-300">
        <span className="text-sm">{club.members || '0'}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (club: Club) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${club.status.toLowerCase() === 'active'
            ? 'bg-green-900/30 text-green-400 border-green-500/30'
            : 'bg-red-900/30 text-red-400 border-red-500/30'
          }`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full mr-1.5"
          style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
        ></span>
        {club.status.charAt(0).toUpperCase() + club.status.slice(1)}
      </span>
    ),
  },
];

const clubRequestColumns = [
  {
    header: 'Request',
    key: 'name',
    render: (request: ClubRequest) => (
      <div>
        <p className="font-medium text-gray-200">{request.clubName}</p>
        <p className="text-xs text-gray-400">ID: {request.id?.slice(0, 7)}</p>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Requested By',
    key: 'requestedBy',
    render: (request: ClubRequest) => (
      <div className="flex items-center text-gray-300">
        <User size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{request.requestedBy}</span>
      </div>
    ),
  },
  {
    header: 'Type',
    key: 'type',
    render: (request: ClubRequest) => (
      <div className="text-sm text-gray-300 capitalize">{request.type}</div>
    ),
  },
  {
    header: 'Requested At',
    key: 'createdAt',
    render: (request: ClubRequest) => (
      <div className="text-sm text-gray-300">{formatDate(request.requestedAt)}</div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (request: ClubRequest) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${request.status.toLowerCase() === 'pending'
            ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
            : request.status.toLowerCase() === 'approved'
              ? 'bg-green-900/30 text-green-400 border-green-500/30'
              : 'bg-red-900/30 text-red-400 border-red-500/30'
          }`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full mr-1.5"
          style={{ boxShadow: '0 0 8px currentColor', backgroundColor: 'currentColor' }}
        ></span>
        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
      </span>
    ),
  },
];

const AdminClubManagement: React.FC = () => {
  const {
    clubs,
    clubRequests,
    totalPages,
    page,
    setPage,
    filters,
    setFilters,
    isLoading,
    error,
    createClub,
    updateClub,
    deleteClub,
    approveClubRequest,
    rejectClubRequest,
    handleTabChange,
    getClubDetails,
    getClubRequestDetails,
    isLoadingClubDetails,
  } = useClubManagement();

  const [activeTab, setActiveTab] = useState<'clubs' | 'requests'>('clubs');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddClubModal, setShowAddClubModal] = useState(false);
  const [showClubDetailsModal, setShowClubDetailsModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | ClubRequest | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [itemToAction, setItemToAction] = useState<{
    id: string;
    type: 'club' | 'request';
    action: 'delete' | 'reject';
  } | null>(null);
  const [showRequestDetailsModal, setShowRequestDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ClubRequest | null>(null);

  const filteredClubs = clubs.filter((club) => {
    const matchesSearch = searchQuery
      ? club.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.createdBy?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory =
      filters.category === 'All' || club.type?.toLowerCase() === filters.category.toLowerCase();
    const matchesStatus =
      filters.status === 'All' || club.status?.toLowerCase() === filters.status.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredClubRequests = clubRequests.filter((request) => {
    const matchesSearch = searchQuery
      ? request.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requestedBy?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory =
      filters.category === 'All' || request.type?.toLowerCase() === filters.category.toLowerCase();
    const matchesStatus =
      filters.status === 'All' || request.status?.toLowerCase() === filters.status.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddClub = () => {
    setSelectedClub(null);
    setShowAddClubModal(true);
  };

  const handleEditClub = async (club: Club) => {
    try {
      const id = club.id || club._id;
      const details = await getClubDetails(id);
      setSelectedClub(details);
      setShowAddClubModal(true);
    } catch (error) {
      console.error('Error fetching club details:', error);
      toast.error('Failed to fetch club details');
    }
  };

  const handleViewClub = async (club: Club | ClubRequest) => {
    try {
      if ('id' in club) {
        const details = await getClubDetails(club.id);
        setSelectedClub(details);
      } else {
        setSelectedClub(club);
      }
      setShowClubDetailsModal(true);
    } catch (error) {
      console.error('Error fetching club details:', error);
      toast.error('Failed to fetch club details');
    }
  };

  const handleViewRequest = async (request: ClubRequest) => {
    try {
      const details = await getClubRequestDetails(request.id);
      setSelectedRequest(details);
      setShowRequestDetailsModal(true);
    } catch (error) {
      console.error('Error fetching request details:', error);
      toast.error('Failed to fetch request details');
    }
  };

  const handleSaveClub = async (data: Omit<Club, '_id' | 'createdAt'>) => {
    try {
      if (selectedClub && '_id' in selectedClub) {
        await updateClub({ id: selectedClub._id, data });
        toast.success('Club updated successfully');
      } else {
        await createClub(data);
        toast.success('Club created successfully');
      }
      setShowAddClubModal(false);
      setSelectedClub(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to save club');
    }
  };

  const handleDeleteClub = (id: string) => {
    setItemToAction({ id, type: 'club', action: 'delete' });
    setShowWarningModal(true);
  };

  const handleApproveRequest = async (id: string) => {
    try {
      await approveClubRequest(id);
      toast.success('Club request approved');
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve club request');
    }
  };

  const handleRejectRequest = (id: string) => {
    setItemToAction({ id, type: 'request', action: 'reject' });
    setShowWarningModal(true);
  };

  const handleConfirmAction = async () => {
    if (itemToAction) {
      try {
        if (itemToAction.type === 'club' && itemToAction.action === 'delete') {
          await deleteClub(itemToAction.id);
          toast.success('Club deleted successfully');
        } else if (itemToAction.type === 'request' && itemToAction.action === 'reject') {
          await rejectClubRequest(itemToAction.id);
          toast.success('Club request rejected');
        }
        setShowWarningModal(false);
        setItemToAction(null);
      } catch (error: any) {
        toast.error(error.message || 'Failed to perform action');
      }
    }
  };

  const debouncedFilterChange = useCallback(
    debounce((field: string, value: string) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
    }, 300),
    []
  );

  const handleResetFilters = () => {
    setFilters({
      category: 'All',
      status: 'All',
      dateRange: 'All',
    });
    setSearchQuery('');
  };

  const clubActions = [
    {
      icon: <Eye size={16} />,
      label: 'View Club',
      onClick: handleViewClub,
      color: 'blue' as const,
      disabled: isLoadingClubDetails,
    },
    {
      icon: <Edit />,
      label: 'Edit Club',
      onClick: handleEditClub,
      color: 'green' as const,
      disabled: isLoadingClubDetails,
    },
    {
      icon: <Trash2 />,
      label: 'Delete Club',
      onClick: (club: Club) => handleDeleteClub(club.id),
      color: 'red' as const,
    },
  ];

  const clubRequestActions = [
    {
      icon: <Eye size={16} />,
      label: 'View Request',
      onClick: handleViewRequest,
      color: 'blue' as const,
      disabled: isLoadingClubDetails,
    },
    {
      icon: <Edit size={16} />,
      label: 'Approve Request',
      onClick: (request: ClubRequest) => handleApproveRequest(request._id),
      color: 'green' as const,
      disabled: (request: ClubRequest) => request.status !== 'pending' || isLoadingClubDetails,
    },
    {
      icon: <Trash2 size={16} />,
      label: 'Reject Request',
      onClick: (request: ClubRequest) => handleRejectRequest(request._id),
      color: 'red' as const,
      disabled: (request: ClubRequest) => request.status !== 'pending' || isLoadingClubDetails,
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
          title="Club Management"
          subtitle="Manage campus clubs and club requests"
          stats={[
            {
              icon: <Building />,
              title: 'Total Clubs',
              value: filteredClubs.length.toString(),
              change: '+10%',
              isPositive: true,
            },
            {
              icon: <Edit />,
              title: 'Pending Requests',
              value: filteredClubRequests.filter((r) => r.status.toLowerCase() === 'pending').length.toString(),
              change: '+5%',
              isPositive: true,
            },
            {
              icon: <Building />,
              title: 'Active Clubs',
              value: filteredClubs.filter((c) => c.status.toLowerCase() === 'active').length.toString(),
              change: '+8%',
              isPositive: true,
            },
          ]}
          tabs={[
            { label: 'Clubs', icon: <Building size={16} />, active: activeTab === 'clubs' },
            { label: 'Club Requests', icon: <Edit size={16} />, active: activeTab === 'requests' },
          ]}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchPlaceholder="Search clubs or requests..."
          filters={filters}
          filterOptions={{
            category: CATEGORIES,
            status: activeTab === 'clubs' ? CLUB_STATUSES : REQUEST_STATUSES,
            dateRange: DATE_RANGES,
          }}
          debouncedFilterChange={debouncedFilterChange}
          handleResetFilters={handleResetFilters}
          onTabClick={(index) => {
            const tabMap = ['clubs', 'requests'];
            const newTab = tabMap[index] as 'clubs' | 'requests';
            setActiveTab(newTab);
            handleTabChange(newTab);
            setFilters({
              category: 'All',
              status: 'All',
              dateRange: 'All',
            });
            setSearchQuery('');
          }}
        />

        <div className="mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
            <div className="px-6 py-5">
              {activeTab === 'clubs' && (
                <button
                  onClick={handleAddClub}
                  className="mb-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  aria-label="Add new club"
                >
                  <Plus size={16} />
                  Add Club
                </button>
              )}

              {activeTab === 'clubs' && filteredClubs.length > 0 && (
                <>
                  <ApplicationsTable data={filteredClubs} columns={clubColumns} actions={clubActions} />
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    itemsCount={filteredClubs.length}
                    itemName="clubs"
                    onPageChange={setPage}
                    onFirstPage={() => setPage(1)}
                    onLastPage={() => setPage(totalPages)}
                  />
                </>
              )}
              {activeTab === 'requests' && filteredClubRequests.length > 0 && (
                <>
                  <ApplicationsTable
                    data={filteredClubRequests}
                    columns={clubRequestColumns}
                    actions={clubRequestActions}
                  />
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    itemsCount={filteredClubRequests.length}
                    itemName="club requests"
                    onPageChange={setPage}
                    onFirstPage={() => setPage(1)}
                    onLastPage={() => setPage(totalPages)}
                  />
                </>
              )}
              {activeTab === 'clubs' && filteredClubs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                    <Building size={32} className="text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">No Clubs Found</h3>
                  <p className="text-gray-400 text-center max-w-sm">
                    There are no clubs matching your current filters. Try adjusting your search criteria.
                  </p>
                </div>
              )}
              {activeTab === 'requests' && filteredClubRequests.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                    <Edit size={32} className="text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">No Club Requests Found</h3>
                  <p className="text-gray-400 text-center max-w-sm">
                    There are no club requests matching your current filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddClubModal
        isOpen={showAddClubModal}
        onClose={() => {
          setShowAddClubModal(false);
        }}
        onSubmit={handleSaveClub}
        initialData={
          selectedClub
            ? {
              name: selectedClub.name,
              type: selectedClub.type,
              members: selectedClub.members,
              icon: selectedClub.icon,
              color: selectedClub.color,
              status: selectedClub.status,
              role: selectedClub.role,
              nextMeeting: selectedClub.nextMeeting,
              about: selectedClub.about,
              createdBy: selectedClub.createdBy,
              upcomingEvents: selectedClub.upcomingEvents,
            }
            : undefined
        }
        isEditing={!!selectedClub}
        clubTypes={CATEGORIES.filter((type) => type !== 'All')}
        roles={['Admin', 'President', 'Advisor']}
        icons={ICONS}
        colors={COLORS}
      />

      <ClubDetailsModal
        isOpen={showClubDetailsModal}
        onClose={() => {
          setShowClubDetailsModal(false);
          setSelectedClub(null);
        }}
        club={selectedClub}
        onEdit={handleEditClub}
      />

      <ClubRequestDetailsModal
        isOpen={showRequestDetailsModal}
        onClose={() => {
          setShowRequestDetailsModal(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        onApprove={(id) => handleApproveRequest(id)}
        onReject={(id) => handleRejectRequest(id)}
      />

      <WarningModal
        isOpen={showWarningModal}
        onClose={() => {
          setShowWarningModal(false);
          setItemToAction(null);
        }}
        onConfirm={handleConfirmAction}
        title={itemToAction?.type === 'club' ? 'Delete Club' : 'Reject Club Request'}
        message={
          itemToAction?.type === 'club'
            ? 'Are you sure you want to delete this club? This action cannot be undone.'
            : 'Are you sure you want to reject this club request?'
        }
        confirmText={itemToAction?.type === 'club' ? 'Delete' : 'Reject'}
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

export default AdminClubManagement;