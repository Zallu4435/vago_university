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
import toast from 'react-hot-toast';
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
  _id: string;
  id: number;
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
  updatedAt: string;
  upcomingEvents: { date: string; description: string }[];
}

interface ClubRequest {
  id: string;
  clubName: string;
  requestedBy: string;
  type: string;
  about: string;
  members: string;
  icon: string;
  color: string;
  role: string;
  nextMeeting: string;
  status: string;
  rejectionReason: string;
  requestedAt: string;
  upcomingEvents: { date: string; description: string }[];
}

interface MemberRequest {
  id: string;
  studentName: string;
  studentId: string;
  clubName: string;
  requestedAt: string;
  status: string;
  rejectionReason: string;
}

const CATEGORIES = ['All', 'Tech', 'Cultural', 'Sports', 'Arts', 'Academic'];
const CLUB_TYPES = ['Tech', 'Cultural', 'Sports', 'Arts', 'Academic'];
const STATUSES = ['All', 'Active', 'Inactive', 'Pending', 'Approved', 'Rejected'];
const ROLES = ['President', 'Member', 'Advisor'];
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
          style={{ backgroundColor: `${club.color || '#8B5CF6'}20`, color: club.color || '#8B5CF6' }}
        >
          {club.icon || '🎓'}
        </span>
        <div>
          <p className="font-medium text-gray-200">{club.name}</p>
          <p className="text-xs text-gray-400">ID: {club._id}</p>
        </div>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Type',
    key: 'type',
    render: (club: Club) => (
      <div className="text-sm text-gray-300 capitalize">{club.type || 'Unknown'}</div>
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
        <Users size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{club.members || '0'}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (club: Club) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          club.status === 'active'
            ? 'bg-green-900/30 text-green-400 border-green-500/30'
            : 'bg-red-900/30 text-red-400 border-red-500/30'
        }`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full mr-1.5"
          style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
        ></span>
        {club.status.charAt(0).toUpperCase() + club.status.slice(1) || 'Inactive'}
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
    header: 'Type',
    key: 'type',
    render: (request: ClubRequest) => (
      <div className="text-sm text-gray-300 capitalize">{request.type}</div>
    ),
  },
  {
    header: 'Requested At',
    key: 'requestedAt',
    render: (request: ClubRequest) => (
      <div className="text-sm text-gray-300">{formatDate(request.requestedAt)}</div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (request: ClubRequest) => (
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
      <div className="text-sm text-gray-300">{formatDate(request.requestedAt)}</div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (request: MemberRequest) => (
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

  console.log(clubs, 'clubs');


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
  const [formError, setFormError] = useState<string | null>(null);

  // Normalize clubs data to handle missing fields and id type
  const normalizedClubs = clubs.map((club) => ({
    _id: club._id?.toString() || '',
    id: Number(club._id?.toString().slice(-6)) || 0, // Example conversion
    name: club.name || 'Unknown',
    type: club.type || 'Unknown',
    members: club.members || '',
    icon: club.icon || '🎓',
    color: club.color || '#8B5CF6',
    status: club.status || 'active',
    role: club.role || 'Member',
    nextMeeting: club.nextMeeting || '',
    about: club.about || '',
    createdBy: club.createdBy || 'Unknown',
    createdAt: club.createdAt || new Date().toISOString(),
    updatedAt: club.updatedAt || new Date().toISOString(),
    upcomingEvents: club.upcomingEvents || [],
  }));

  const filteredClubs = normalizedClubs.filter((club) => {
    const matchesSearch = searchTerm
      ? club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.id.toString().includes(searchTerm.toLowerCase()) ||
        club.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesCategory =
      filters.category === 'all' || club.type.toLowerCase() === filters.category.toLowerCase();
    console.log(matchesCategory, 'matchesCategory', filters.category, club.type);
    const matchesStatus =
      filters.status === 'all' || club.status.toLowerCase() === filters.status.toLowerCase();
    console.log(matchesStatus, 'matchesStatus');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const normalizedClubRequests = clubRequests.map((request) => ({
    id: request._id?.toString() || request.id || '',
    clubName: request.name || request.clubName || 'Unknown',
    requestedBy: request.createdBy || request.requestedBy || 'Unknown',
    type: request.type || request.category || 'Unknown',
    about: request.about || request.reason || '',
    members: request.members || '',
    icon: request.icon || '🎓',
    color: request.color || '#8B5CF6',
    role: request.role || 'Member',
    nextMeeting: request.nextMeeting || '',
    status: request.status || 'pending',
    rejectionReason: request.rejectionReason || '',
    requestedAt: request.createdAt || request.requestedAt || new Date().toISOString(),
    upcomingEvents: request.upcomingEvents || [],
  }));

  const filteredClubRequests = normalizedClubRequests.filter((request) => {
    const matchesSearch = searchTerm
      ? request.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesCategory =
      filters.category === 'All' || request.type.toLowerCase() === filters.category.toLowerCase();
    const matchesStatus =
      filters.status === 'All' || request.status.toLowerCase() === filters.status.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredMemberRequests = memberRequests.map((request) => ({
    id: request._id?.toString() || request.id || '',
    studentName: request.studentName || 'Unknown',
    studentId: request.studentId || 'Unknown',
    clubName: request.clubName || 'Unknown',
    requestedAt: request.requestedAt || request.createdAt || new Date().toISOString(),
    status: request.status || 'pending',
    rejectionReason: request.rejectionReason || '',
  })).filter((request) => {
    const matchesSearch = searchTerm
      ? request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.clubName.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesStatus =
      filters.status === 'All' || request.status.toLowerCase() === filters.status.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleAddClub = () => {
    setSelectedClub(null);
    setShowAddClubModal(true);
    setFormError(null);
  };

  const handleEditClub = (club: Club) => {
    setSelectedClub(club);
    setShowAddClubModal(true);
    setFormError(null);
  };

  const handleViewClub = (club: Club | ClubRequest) => {
    setSelectedClub(club);
    setShowClubDetailsModal(true);
  };

  const handleSaveClub = async (data: Omit<Club, '_id' | 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setFormError(null);
      if (selectedClub && 'id' in selectedClub && selectedClub._id) {
        // Update existing club
        await updateClub({ id: selectedClub._id, data });
        toast.success('Club updated successfully');
      } else {
        // Create new club
        await createClub(data);
        toast.success('Club created successfully');
      }
      setShowAddClubModal(false);
      setSelectedClub(null);
    } catch (error: any) {
      console.error('Error saving club:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save club';
      setFormError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleDeleteClub = (id: number) => {
    const club = normalizedClubs.find((c) => c.id === id);
    if (club) {
      setItemToAction({ id: club._id, type: 'club', action: 'delete' });
      setShowWarningModal(true);
    }
  };

  const handleApproveClubRequest = async (id: string) => {
    try {
      await approveClubRequest(id);
      toast.success('Club request approved');
    } catch (error: any) {
      console.error('Error approving club request:', error);
      toast.error(error.message || 'Failed to approve club request');
    }
  };

  const handleRejectClubRequest = (id: string) => {
    setItemToAction({ id, type: 'clubRequest', action: 'reject' });
    setShowWarningModal(true);
  };

  const handleApproveMemberRequest = async (id: string) => {
    try {
      await approveMemberRequest(id);
      toast.success('Member request approved');
    } catch (error: any) {
      console.error('Error approving member request:', error);
      toast.error(error.message || 'Failed to approve member request');
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
          toast.success('Club deleted successfully');
        } else if (itemToAction.type === 'clubRequest' && itemToAction.action === 'reject') {
          await rejectClubRequest(itemToAction.id);
          toast.success('Club request rejected');
        } else if (itemToAction.type === 'memberRequest' && itemToAction.action === 'reject') {
          await rejectMemberRequest(itemToAction.id);
          toast.success('Member request rejected');
        }
        setShowWarningModal(false);
        setItemToAction(null);
      } catch (error: any) {
        console.error('Error performing action:', error);
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
      onClick: (club: Club) => handleDeleteClub(club.id),
      color: 'red' as const,
    },
  ];

  const clubRequestActions = [
    {
      icon: <CheckCircle size={16} />,
      label: 'Approve Request',
      onClick: (request: ClubRequest) => handleApproveClubRequest(request.id),
      color: 'green' as const,
      disabled: (request: ClubRequest) => request.status !== 'pending',
    },
    {
      icon: <XCircle size={16} />,
      label: 'Reject Request',
      onClick: (request: ClubRequest) => handleRejectClubRequest(request.id),
      color: 'red' as const,
      disabled: (request: ClubRequest) => request.status !== 'pending',
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
      disabled: (request: MemberRequest) => request.status !== 'pending',
    },
    {
      icon: <XCircle size={16} />,
      label: 'Reject Member',
      onClick: (request: MemberRequest) => handleRejectMemberRequest(request.id),
      color: 'red' as const,
      disabled: (request: MemberRequest) => request.status !== 'pending',
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
              value: normalizedClubs.length.toString(),
              change: '+10%',
              isPositive: true,
            },
            {
              icon: <CheckCircle />,
              title: 'Pending Requests',
              value: normalizedClubRequests.filter((r) => r.status === 'pending').length.toString(),
              change: '+5%',
              isPositive: true,
            },
            {
              icon: <Users />,
              title: 'Membership Requests',
              value: filteredMemberRequests.filter((r) => r.status === 'pending').length.toString(),
              change: '+15%',
              isPositive: true,
            },
            {
              icon: <Users />,
              title: 'Active Clubs',
              value: normalizedClubs.filter((c) => c.status === 'active').length.toString(),
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
          {formError && (
            <div className="mb-4 p-4 bg-red-900/30 text-red-400 rounded-xl border border-red-500/30">
              {formError}
            </div>
          )}
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
          setFormError(null);
        }}
        onSubmit={handleSaveClub}
        initialData={selectedClub ? {
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
        } : undefined}
        isEditing={!!selectedClub}
        clubTypes={CLUB_TYPES}
        roles={ROLES}
        icons={ICONS}
        colors={COLORS}
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