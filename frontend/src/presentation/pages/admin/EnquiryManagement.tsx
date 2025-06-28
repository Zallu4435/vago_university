import React, { useState, useMemo, useCallback } from 'react';
import { FiMail, FiUser, FiFlag, FiEye, FiTrash2, FiHelpCircle, FiClock, FiCheckSquare } from 'react-icons/fi';
import { debounce } from 'lodash';
import Header from './User/Header';
import ApplicationsTable from './User/ApplicationsTable';
import Pagination from './User/Pagination';
import WarningModal from '../../components/WarningModal';
import EnquiryDetailsModal from './EnquiryDetailsModal';
import { useEnquiryManagement } from '../../../application/hooks/useEnquiryManagement';
import { Enquiry, EnquiryStatus } from '../../../domain/types/enquiry';
import { FiMessageSquare } from 'react-icons/fi';
import ReplyModal from './ReplyModal';
import { toast } from 'react-hot-toast';

const ENQUIRY_STATUSES = ['All Statuses', ...Object.values(EnquiryStatus)];

const EnquiryManagement: React.FC = () => {
  const {
    enquiries,
    totalPages,
    page,
    setPage,
    filters,
    searchQuery,
    deleteEnquiry,
    updateEnquiryStatus,
    handleFilterChange,
    resetFilters,
    sendReply,
  } = useEnquiryManagement();

  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState<Enquiry | null>(null);
  const [showEnquiryDetails, setShowEnquiryDetails] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [enquiryToReply, setEnquiryToReply] = useState<Enquiry | null>(null);

  // Debounced filter change
  const debouncedFilterChange = useCallback(
    debounce((field: string, value: string) => {
      handleFilterChange({ [field]: value } as any);
    }, 300),
    [handleFilterChange]
  );

  // Handle custom date range change
  const handleCustomDateChange = useCallback((field: 'startDate' | 'endDate', value: string) => {
    setCustomDateRange(prev => ({ ...prev, [field]: value }));
    setPage(1);
  }, [setPage]);

  // Handle delete enquiry
  const handleDeleteEnquiry = (enquiry: Enquiry) => {
    setEnquiryToDelete(enquiry);
    setShowDeleteWarning(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (enquiryToDelete) {
      try {
        await deleteEnquiry(enquiryToDelete.id);
        setShowDeleteWarning(false);
        setEnquiryToDelete(null);
      } catch (error) {
        console.error('Failed to delete enquiry:', error);
      }
    }
  };

  // Handle view enquiry
  const handleViewEnquiry = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowEnquiryDetails(true);
  };

  // Handle update enquiry status
  const handleUpdateStatus = async (enquiryId: string, status: string) => {
    try {
      await updateEnquiryStatus({ id: enquiryId, status });
      // Update the selectedEnquiry state to reflect the change immediately
      if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
        setSelectedEnquiry({ ...selectedEnquiry, status: status as any });
      }
      toast.success('Enquiry status updated successfully');
    } catch (error) {
      toast.error('Failed to update enquiry status');
    }
  };

  const handleSendReply = async (enquiryId: string, replyMessage: string) => {
    try {
      await sendReply({ id: enquiryId, replyMessage });
      setShowReplyModal(false);
      setEnquiryToReply(null);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  // Filter data based on search and filters
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((enquiry) => {
      const matchesSearch = searchQuery === '' || 
        enquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enquiry.subject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filters.status === 'All Statuses' || enquiry.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [enquiries, searchQuery, filters]);

  const columns = useMemo(() => [
    {
      header: 'Name',
      key: 'name',
      render: (item: any) => (
        <div className="flex items-center text-gray-300">
          <FiUser size={14} className="text-purple-400 mr-2" />
          <span className="text-sm">{item.name}</span>
        </div>
      ),
    },
    {
      header: 'Email',
      key: 'email',
      render: (item: any) => (
        <div className="flex items-center text-gray-300">
          <FiMail size={14} className="text-purple-400 mr-2" />
          <span className="text-sm">{item.email}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (item: any) => (
        <div className="flex items-center text-gray-300">
          <FiFlag size={14} className="text-purple-400 mr-2" />
          <span className={`capitalize px-2 py-1 rounded-full text-xs font-semibold border ${
            item.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30' :
            item.status === 'in_progress' ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' :
            item.status === 'resolved' ? 'bg-green-900/30 text-green-400 border-green-500/30' :
            'bg-gray-800/30 text-gray-400 border-gray-500/30'
          }`}>
            {item.status.replace('_', ' ')}
          </span>
        </div>
      ),
    },
    {
      header: 'Created At',
      key: 'createdAt',
      render: (item: any) => (
        <div className="flex items-center text-gray-300">
          <FiClock size={14} className="text-purple-400 mr-2" />
          <span className="text-sm">{new Date(item.createdAt).toLocaleDateString()}</span>
        </div>
      ),
    },
  ], []);

  const actions = useMemo(() => [
    {
      icon: <FiEye className="h-4 w-4" />,
      label: 'View',
      color: 'blue' as const,
      onClick: (item: any) => {
        setSelectedEnquiry(item);
        setShowEnquiryDetails(true);
      },
    },
    {
      icon: <FiMessageSquare className="h-4 w-4" />,
      label: 'Reply',
      color: 'green' as const,
      onClick: (item: any) => {
        setEnquiryToReply(item);
        setShowReplyModal(true);
      },
    },
    {
      icon: <FiTrash2 className="h-4 w-4" />,
      label: 'Delete',
      color: 'red' as const,
      onClick: (item: any) => {
        setEnquiryToDelete(item);
        setShowDeleteWarning(true);
      },
    },
  ], []);

  // Calculate stats
  const stats = useMemo(() => ({
    total: enquiries.length,
    pending: enquiries.filter(e => e.status === 'pending').length,
    resolved: enquiries.filter(e => e.status === 'resolved').length,
  }), [enquiries]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Header
          title="Enquiry Management"
          subtitle="Manage and respond to user enquiries"
          stats={[
            {
              icon: <FiHelpCircle />,
              title: 'Total Enquiries',
              value: stats?.total?.toString() || '0',
              change: '+5.2%',
              isPositive: true,
            },
            {
              icon: <FiClock />,
              title: 'Pending',
              value: stats?.pending?.toString() || '0',
              change: '-2.1%',
              isPositive: true,
            },
            {
              icon: <FiCheckSquare />,
              title: 'Resolved',
              value: stats?.resolved?.toString() || '0',
              change: '+3.8%',
              isPositive: true,
            },
          ]}
          tabs={[
            { label: 'All Enquiries', icon: <FiHelpCircle size={16} />, active: true },
          ]}
          searchQuery={searchQuery}
          setSearchQuery={() => {}} // This will be handled by the hook
          searchPlaceholder="Search by name, email, or subject..."
          filters={filters as any}
          filterOptions={{
            status: ENQUIRY_STATUSES,
          }}
          debouncedFilterChange={debouncedFilterChange}
          customDateRange={customDateRange}
          handleCustomDateChange={handleCustomDateChange}
          handleResetFilters={() => {
            resetFilters();
            setCustomDateRange({ startDate: '', endDate: '' });
          }}
        />
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-purple-500/20 mt-8">
          <div className="px-6 py-5">
            {filteredEnquiries.length > 0 ? (
              <>
                <ApplicationsTable
                  data={filteredEnquiries}
                  columns={columns}
                  actions={actions}
                />
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  itemsCount={filteredEnquiries.length}
                  itemName="enquiries"
                  onPageChange={(newPage) => setPage(newPage)}
                  onFirstPage={() => setPage(1)}
                  onLastPage={() => setPage(totalPages)}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                  <FiHelpCircle size={32} className="text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No Enquiries Found</h3>
                <p className="text-gray-400 text-center max-w-sm">
                  There are no enquiries matching your current filters. Try adjusting your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>

        <WarningModal
          isOpen={showDeleteWarning}
          onClose={() => {
            setShowDeleteWarning(false);
            setEnquiryToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Enquiry"
          message={enquiryToDelete ? `Are you sure you want to delete the enquiry from "${enquiryToDelete.name}"? This action cannot be undone.` : ''}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </div>

      {/* Enquiry Details Modal - Rendered outside main div */}
      <EnquiryDetailsModal
        isOpen={showEnquiryDetails}
        onClose={() => {
          setShowEnquiryDetails(false);
          setSelectedEnquiry(null);
        }}
        enquiry={selectedEnquiry}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Reply Modal - Rendered outside main div */}
      {showReplyModal && enquiryToReply && (
        <ReplyModal
          enquiry={enquiryToReply}
          onClose={() => {
            setShowReplyModal(false);
            setEnquiryToReply(null);
          }}
          onSend={handleSendReply}
        />
      )}
    </>
  );
};

export default EnquiryManagement; 