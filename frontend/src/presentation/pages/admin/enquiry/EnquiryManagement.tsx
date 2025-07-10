import React, { useState, useMemo, useCallback } from 'react';
import { FiHelpCircle, FiClock, FiCheckSquare } from 'react-icons/fi';
import { debounce } from 'lodash';
import Header from '../../../components/admin/management/Header';
import ApplicationsTable from '../../../components/admin/management/ApplicationsTable';
import Pagination from '../../../components/admin/management/Pagination';
import WarningModal from '../../../components/WarningModal';
import EnquiryDetailsModal from './EnquiryDetailsModal';
import { useEnquiryManagement } from '../../../../application/hooks/useEnquiryManagement';
import { Enquiry } from '../../../../domain/types/enquirymanagement';
import ReplyModal from './ReplyModal';
import { toast } from 'react-hot-toast';
import {
  ENQUIRY_STATUSES,
  ENQUIRY_COLUMNS,
  ENQUIRY_ACTIONS,
  ENQUIRY_STATS,
  ENQUIRY_TABS,
} from '../../../../shared/constants/enquiryManagementConstants';
import { filterEnquiries } from '../../../../shared/filters/enquiryFilter';
import LoadingSpinner from '../../../../shared/components/LoadingSpinner';
import ErrorMessage from '../../../../shared/components/ErrorMessage';
import EmptyState from '../../../../shared/components/EmptyState';

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
    isLoading,
    error,
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
    return filterEnquiries(enquiries, searchQuery, filters.status);
  }, [enquiries, searchQuery, filters]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Header
          title="Enquiry Management"
          subtitle="Manage and respond to user enquiries"
          stats={[
            {
              icon: ENQUIRY_TABS[0].icon,
              title: 'Total Enquiries',
              value: ENQUIRY_STATS(enquiries).total?.toString() || '0',
              change: '+5.2%',
              isPositive: true,
            },
            {
              icon: <FiClock />,
              title: 'Pending',
              value: ENQUIRY_STATS(enquiries).pending?.toString() || '0',
              change: '-2.1%',
              isPositive: true,
            },
            {
              icon: <FiCheckSquare />,
              title: 'Resolved',
              value: ENQUIRY_STATS(enquiries).resolved?.toString() || '0',
              change: '+3.8%',
              isPositive: true,
            },
          ]}
          tabs={ENQUIRY_TABS}
          searchQuery={searchQuery}
          setSearchQuery={(q: string) => {}} // This will be handled by the hook
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
            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorMessage message={error.message || 'Failed to load enquiries.'} />
            ) : filteredEnquiries.length > 0 ? (
              <>
                <ApplicationsTable
                  data={filteredEnquiries}
                  columns={ENQUIRY_COLUMNS}
                  actions={ENQUIRY_ACTIONS.map((action, idx) => ({
                    ...action,
                    onClick: idx === 0
                      ? (item: any) => {
                          setSelectedEnquiry(item);
                          setShowEnquiryDetails(true);
                        }
                      : idx === 1
                      ? (item: any) => {
                          setEnquiryToReply(item);
                          setShowReplyModal(true);
                        }
                      : (item: any) => {
                          setEnquiryToDelete(item);
                          setShowDeleteWarning(true);
                        },
                  }))}
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
              <EmptyState
                icon={<FiHelpCircle size={32} className="text-purple-400" />}
                title="No Enquiries Found"
                message="There are no enquiries matching your current filters. Try adjusting your search criteria."
              />
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