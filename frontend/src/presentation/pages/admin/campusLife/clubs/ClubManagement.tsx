import React, { useState, useCallback } from 'react';
import {
  IoAdd as Plus,
  IoEyeOutline as Eye,
  IoCreateOutline as Edit,
  IoTrashOutline as Trash2,
  IoPeopleOutline as Users,
  IoCheckmarkCircleOutline as CheckCircle,
  IoCloseCircleOutline as XCircle,
  IoBusinessOutline as Building,
  IoPersonOutline as User,
} from 'react-icons/io5';
import { debounce } from 'lodash';
import Header from '../../User/Header';
import ApplicationsTable from '../../User/ApplicationsTable';
import Pagination from '../../User/Pagination';
import WarningModal from '../../../../components/WarningModal';
import AddClubModal from './AddClubModal';
import ClubDetailsModal from './ClubDetailsModal';
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
  category: string;
  createdBy: string;
  createdDate: string;
  members: number;
  status: string;
}

interface ClubRequest {
  id: string;
  clubName: string;
  requestedBy: string;
  category: string;
  reason: string;
  requestedAt: string;
  status: string;
}

interface MemberRequest {
  id: string;
  studentName: string;
  studentId: string;
  clubName: string;
  requestedAt: string;
  status: string;
}

const CATEGORIES = ['All', 'Tech', 'Cultural', 'Sports', 'Arts', 'Academic'];
const STATUSES = ['All', 'Active', 'Inactive', 'Pending', 'Approved', 'Rejected'];

const clubColumns = [
  {
    header: 'Club',
    key: 'name',
    render: (club: Club) => (
      <div>
        <p className="font-medium text-gray-200">{club.name}</p>
        <p className="text-xs text-gray-400">ID: {club.id}</p>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Category',
    key: 'category',
    render: (club: Club) => (
      <div className="text-sm text-gray-300 capitalize">{club.category}</div>
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
    key: 'createdDate',
    render: (club: Club) => (
      <div className="text-sm text-gray-300">{formatDate(club.createdAt)}</div>
    ),
  },
  {
    header: 'Members',
    key: 'members',
    render: (club: Club) => (
      <div className="flex items-center text-gray-300">
        <Users size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{club.members?.length || 0}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (club: Club) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${club.status === 'Active'
            ? 'bg-green-900/30 text-green-400 border-green-500/30'
            : 'bg-red-900/30 text-red-400 border-red-500/30'
          }`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full mr-1.5"
          style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
        ></span>
        {club.status}
      </span>
    ),
  },
];

const clubRequestColumns = [
  {
    header: 'Request',
    key: 'clubName',
    render: (request: ClubRequest) => (
      <div>
        <p className="font-medium text-gray-200">{request.clubName}</p>
        <p className="text-xs text-gray-400">ID: {request.id}</p>
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
    header: 'Category',
    key: 'category',
    render: (request: ClubRequest) => (
      <div className="text-sm text-gray-300 capitalize">{request.category}</div>
    ),
  },
  {
    header: 'Requested At',
    key: 'requestedAt',
    render: (request: ClubRequest) => (
      <div className="text-sm text-gray-300">{request.requestedAt}</div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (request: ClubRequest) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${request.status === 'Pending'
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

const memberRequestColumns = [
  {
    header: 'Student',
    key: 'studentName',
    render: (request: MemberRequest) => (
      <div className="flex items-center">
        <User size={14} className="text-purple-400 mr-2" />
        <div>
          <p className="font-medium text-gray-200">{request.studentName}</p>
          <p className="text-xs text-gray-400">{request.studentId}</p>
        </div>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Club',
    key: 'clubName',
    render: (request: MemberRequest) => (
      <div className="text-sm text-gray-300">{request.clubName}</div>
    ),
  },
  {
    header: 'Requested At',
    key: 'requestedAt',
    render: (request: MemberRequest) => (
      <div className="text-sm text-gray-300">{request.requestedAt}</div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (request: MemberRequest) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${request.status === 'Pending'
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

const AdminClubManagement: React.FC = () => {
  const {
    clubs,
    clubRequests,
    memberRequests,
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
    approveMemberRequest,
    rejectMemberRequest,
  } = useClubManagement();

  const [activeTab, setActiveTab] = useState<'clubs' | 'requests' | 'members'>('clubs');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddClubModal, setShowAddClubModal] = useState(false);
  const [showClubDetailsModal, setShowClubDetailsModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | ClubRequest | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [itemToAction, setItemToAction] = useState<{
    id: string;
    type: 'club' | 'clubRequest' | 'memberRequest';
    action: 'delete' | 'reject';
  } | null>(null);

  const [clubForm, setClubForm] = useState({
    name: '',
    category: 'Tech',
    description: '',
    createdBy: 'Admin',
    status: 'Active',
  });

  const filteredClubs = clubs.filter((club) => {
    const matchesSearch = searchTerm
      ? club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesCategory =
      filters.category === 'all' || club.category.toLowerCase() === filters.category.toLowerCase();
    const matchesStatus =
      filters.status === 'all' || club.status.toLowerCase() === filters.status.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredClubRequests = clubRequests.filter((request) => {
    const matchesSearch = searchTerm
      ? request.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesCategory =
      filters.category === 'all' || request.category.toLowerCase() === filters.category.toLowerCase();
    const matchesStatus =
      filters.status === 'all' || request.status.toLowerCase() === filters.status.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredMemberRequests = memberRequests.filter((request) => {
    const matchesSearch = searchTerm
      ? request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.clubName.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesStatus =
      filters.status === 'all' || request.status.toLowerCase() === filters.status.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleAddClub = () => {
    setClubForm({
      name: '',
      category: 'Tech',
      description: '',
      createdBy: 'Admin',
      status: 'Active',
    });
    setShowAddClubModal(true);
  };

  const handleEditClub = (club: Club) => {
    setClubForm({
      name: club.name,
      category: club.category,
      description: club.description, 
      createdBy: club.createdBy,
      status: club.status,
    });
    setSelectedClub(club);
    setShowAddClubModal(true);
  };

  const handleViewClub = (club: Club | ClubRequest) => {
    setSelectedClub(club);
    setShowClubDetailsModal(true);
  };

  const handleSaveClub = async () => {
    try {
      if (selectedClub) {
        await updateClub({ id: selectedClub._id, data: clubForm });
      } else {
        await createClub(clubForm);
      }
      setShowAddClubModal(false);
      setSelectedClub(null);
    } catch (error) {
      console.error('Error saving club:', error);
    }
  };

  const handleDeleteClub = (id: string) => {
    setItemToAction({ id, type: 'club', action: 'delete' });
    setShowWarningModal(true);
  };

  const handleApproveClubRequest = async (id: string) => {
    try {
      await approveClubRequest(id);
    } catch (error) {
      console.error('Error approving club request:', error);
    }
  };

  const handleRejectClubRequest = (id: string) => {
    setItemToAction({ id, type: 'clubRequest', action: 'reject' });
    setShowWarningModal(true);
  };

  const handleApproveMemberRequest = async (id: string) => {
    try {
      await approveMemberRequest(id);
    } catch (error) {
      console.error('Error approving member request:', error);
    }
  };

  const handleRejectMemberRequest = (id: string) => {
    setItemToAction({ id, type: 'memberRequest', action: 'reject' });
    setShowWarningModal(true);
  };

  const handleConfirmAction = async () => {
    if (itemToAction) {
      try {
        if (itemToAction.type === 'club' && itemToAction.action === 'delete') {
          await deleteClub(itemToAction.id);
        } else if (itemToAction.type === 'clubRequest' && itemToAction.action === 'reject') {
          await rejectClubRequest(itemToAction.id);
        } else if (itemToAction.type === 'memberRequest' && itemToAction.action === 'reject') {
          await rejectMemberRequest(itemToAction.id);
        }
        setShowWarningModal(false);
        setItemToAction(null);
      } catch (error) {
        console.error('Error performing action:', error);
      }
    }
  };

  const debouncedFilterChange = useCallback(
    debounce((field: string, value: string) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
    }, 100000),
    []
  );

  const handleResetFilters = () => {
    setFilters({
      category: 'All',
      status: 'All',
    });
  };

  const clubActions = [
    {
      icon: <Eye size={16} />,
      label: 'View Club',
      onClick: handleViewClub,
      color: 'blue' as const,
    },
    {
      icon: <Edit size={16} />,
      label: 'Edit Club',
      onClick: handleEditClub,
      color: 'green' as const,
    },
    {
      icon: <Trash2 size={16} />,
      label: 'Delete Club',
      onClick: (club: Club) => handleDeleteClub(club._id),
      color: 'red' as const,
    },
  ];

  const clubRequestActions = [
    {
      icon: <CheckCircle size={16} />,
      label: 'Approve Request',
      onClick: (request: ClubRequest) => handleApproveClubRequest(request.id),
      color: 'green' as const,
      disabled: (request: ClubRequest) => request.status !== 'Pending',
    },
    {
      icon: <XCircle size={16} />,
      label: 'Reject Request',
      onClick: (request: ClubRequest) => handleRejectClubRequest(request.id),
      color: 'red' as const,
      disabled: (request: ClubRequest) => request.status !== 'Pending',
    },
    {
      icon: <Eye size={16} />,
      label: 'View Request',
      onClick: handleViewClub,
      color: 'blue' as const,
    },
  ];

  const memberRequestActions = [
    {
      icon: <CheckCircle size={16} />,
      label: 'Approve Member',
      onClick: (request: MemberRequest) => handleApproveMemberRequest(request.id),
      color: 'green' as const,
      disabled: (request: MemberRequest) => request.status !== 'Pending',
    },
    {
      icon: <XCircle size={16} />,
      label: 'Reject Member',
      onClick: (request: MemberRequest) => handleRejectMemberRequest(request.id),
      color: 'red' as const,
      disabled: (request: MemberRequest) => request.status !== 'Pending',
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
          subtitle="Manage campus clubs and student memberships"
          stats={[
            {
              icon: <Users />,
              title: 'Total Clubs',
              value: clubs.length.toString(),
              change: '+10%',
              isPositive: true,
            },
            {
              icon: <CheckCircle />,
              title: 'Pending Requests',
              value: clubRequests.filter((r) => r.status === 'Pending').length.toString(),
              change: '+5%',
              isPositive: true,
            },
            {
              icon: <Users />,
              title: 'Membership Requests',
              value: memberRequests.filter((r) => r.status === 'Pending').length.toString(),
              change: '+15%',
              isPositive: true,
            },
            {
              icon: <Users />,
              title: 'Active Clubs',
              value: clubs.filter((c) => c.status === 'Active').length.toString(),
              change: '+8%',
              isPositive: true,
            },
          ]}
          tabs={[
            { label: 'Clubs', icon: <Users size={16} />, active: activeTab === 'clubs' },
            { label: 'Club Requests', icon: <CheckCircle size={16} />, active: activeTab === 'requests' },
            { label: 'Membership Requests', icon: <Users size={16} />, active: activeTab === 'members' },
          ]}
          searchQuery={searchTerm}
          setSearchQuery={setSearchTerm}
          searchPlaceholder="Search clubs, requests, or members..."
          filters={filters}
          filterOptions={{
            category: CATEGORIES,
            status: STATUSES,
          }}
          debouncedFilterChange={debouncedFilterChange}
          handleResetFilters={handleResetFilters}
          onTabClick={(index) => {
            const tabMap = ['clubs', 'requests', 'members'];
            setActiveTab(tabMap[index] as 'clubs' | 'requests' | 'members');
          }}
        />

        <div className="mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
            <div className="px-6 py-5">
              {activeTab === 'clubs' && (
                <button
                  onClick={handleAddClub}
                  className="mb-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
              {activeTab === 'members' && filteredMemberRequests.length > 0 && (
                <>
                  <ApplicationsTable
                    data={filteredMemberRequests}
                    columns={memberRequestColumns}
                    actions={memberRequestActions}
                  />
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    itemsCount={filteredMemberRequests.length}
                    itemName="membership requests"
                    onPageChange={setPage}
                    onFirstPage={() => setPage(1)}
                    onLastPage={() => setPage(totalPages)}
                  />
                </>
              )}
              {activeTab === 'clubs' && filteredClubs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                    <Users size={32} className="text-purple-400" />
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
                    <CheckCircle size={32} className="text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">No Club Requests Found</h3>
                  <p className="text-gray-400 text-center max-w-sm">
                    There are no club requests matching your current filters.
                  </p>
                </div>
              )}
              {activeTab === 'members' && filteredMemberRequests.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                    <Users size={32} className="text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">No Membership Requests Found</h3>
                  <p className="text-gray-400 text-center max-w-sm">
                    There are no membership requests matching your current filters.
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
          setSelectedClub(null);
        }}
        onSubmit={handleSaveClub}
        form={clubForm}
        setForm={setClubForm}
        categories={CATEGORIES}
        isEditing={!!selectedClub}
      />

      <ClubDetailsModal
        isOpen={showClubDetailsModal}
        onClose={() => setShowClubDetailsModal(false)}
        club={selectedClub}
        onEdit={handleEditClub}
      />

      <WarningModal
        isOpen={showWarningModal}
        onClose={() => {
          setShowWarningModal(false);
          setItemToAction(null);
        }}
        onConfirm={handleConfirmAction}
        title={
          itemToAction?.type === 'club'
            ? 'Delete Club'
            : itemToAction?.type === 'clubRequest'
              ? 'Reject Club Request'
              : 'Reject Membership Request'
        }
        message={
          itemToAction?.type === 'club'
            ? 'Are you sure you want to delete this club? This action cannot be undone.'
            : itemToAction?.type === 'clubRequest'
              ? 'Are you sure you want to reject this club request?'
              : 'Are you sure you want to reject this membership request?'
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