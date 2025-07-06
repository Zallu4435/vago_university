import React, { useState, useEffect, useCallback } from 'react';
import { FiDollarSign, FiCheckCircle, FiXCircle, FiEye, FiCreditCard, FiFileText, FiAward, FiPlus, FiList } from 'react-icons/fi';
import { debounce } from 'lodash';
import { useFinancial } from '../../../../application/hooks/useFinancial';
import Header from '../User/Header';
import ApplicationsTable from '../User/ApplicationsTable';
import Pagination from '../User/Pagination';
import ReceiptModal from './ReceiptModal';
import ActionModal from './ActionModal';
import AddChargeModal from './AddChargeModal';
import ViewChargesModal from './ViewChargesModal';
import PaymentDetailsModal from './PaymentDetailsModal';
import { Charge, Payment } from '../../../../domain/types/financial';
import { toast } from 'react-hot-toast';

interface FinancialAidApplication {
  id: string;
  studentId: string;
  term: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  amount: number;
  type: 'Grant' | 'Loan' | 'Scholarship';
  documents: { id: string; name: string; url: string; status: string }[];
}

interface ScholarshipApplication {
  id: string;
  scholarshipId: string;
  studentId: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  documents: { id: string; name: string; url: string; status: string }[];
}

interface Filters {
  status: string;
  term: string;
  startDate: string;
}

const STATUSES = ['All Statuses', 'Pending', 'Approved', 'Rejected'];
const TERMS = ['All Terms', 'Fall 2024', 'Spring 2025', 'Summer 2025'];

const paymentColumns = [
  {
    header: 'Student ID',
    key: 'studentId',
    render: (payment: Payment) => (
      <div className="flex items-center text-gray-300">
        <FiCreditCard size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{payment.studentId}</span>
      </div>
    ),
    width: '15%',
  },
  {
    header: 'Date',
    key: 'date',
    render: (payment: Payment) => (
      <div className="flex items-center text-gray-300">
        <FiFileText size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{new Date(payment.date).toLocaleDateString()}</span>
      </div>
    ),
  },
  {
    header: 'Method',
    key: 'method',
    render: (payment: Payment) => (
      <div className="flex items-center text-gray-300">
        <FiCreditCard size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{payment.method}</span>
      </div>
    ),
  },
  {
    header: 'Amount',
    key: 'amount',
    render: (payment: Payment) => (
      <div className="flex items-center text-gray-300">
        <FiDollarSign size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">${payment.amount.toFixed(2)}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (payment: Payment) => (
      <div className="flex items-center text-gray-300">
        <FiFileText size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{payment.status}</span>
      </div>
    ),
  },
];

const financialAidColumns = [
  {
    header: 'Student ID',
    key: 'studentId',
    render: (app: FinancialAidApplication) => (
      <div className="flex items-center text-gray-300">
        <FiCreditCard size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{app.studentId}</span>
      </div>
    ),
    width: '15%',
  },
  {
    header: 'Term',
    key: 'term',
    render: (app: FinancialAidApplication) => (
      <div className="flex items-center text-gray-300">
        <FiFileText size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{app.term}</span>
      </div>
    ),
  },
  {
    header: 'Type',
    key: 'type',
    render: (app: FinancialAidApplication) => (
      <div className="flex items-center text-gray-300">
        <FiFileText size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{app.type}</span>
      </div>
    ),
  },
  {
    header: 'Amount',
    key: 'amount',
    render: (app: FinancialAidApplication) => (
      <div className="flex items-center text-gray-300">
        <FiDollarSign size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">${app.amount.toFixed(2)}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (app: FinancialAidApplication) => (
      <div className="flex items-center text-gray-300">
        <FiFileText size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{app.status}</span>
      </div>
    ),
  },
  {
    header: 'Date',
    key: 'applicationDate',
    render: (app: FinancialAidApplication) => (
      <div className="flex items-center text-gray-300">
        <FiFileText size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{new Date(app.applicationDate).toLocaleDateString()}</span>
      </div>
    ),
  },
];

const scholarshipColumns = [
  {
    header: 'Student ID',
    key: 'studentId',
    render: (app: ScholarshipApplication) => (
      <div className="flex items-center text-gray-300">
        <FiCreditCard size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{app.studentId}</span>
      </div>
    ),
    width: '15%',
  },
  {
    header: 'Scholarship ID',
    key: 'scholarshipId',
    render: (app: ScholarshipApplication) => (
      <div className="flex items-center text-gray-300">
        <FiAward size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{app.scholarshipId}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (app: ScholarshipApplication) => (
      <div className="flex items-center text-gray-300">
        <FiFileText size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{app.status}</span>
      </div>
    ),
  },
  {
    header: 'Date',
    key: 'applicationDate',
    render: (app: ScholarshipApplication) => (
      <div className="flex items-center text-gray-300">
        <FiFileText size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{new Date(app.applicationDate).toLocaleDateString()}</span>
      </div>
    ),
  },
];

// Helper function to convert id to _id for table compatibility
const convertToTableData = <T extends { id: string }>(data: T[]) => {
  return data.map(item => ({
    ...item,
    _id: item.id
  }));
};

const PaymentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'payments' | 'financialAid' | 'scholarships'>('payments');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({ status: 'All Statuses', term: 'All Terms', startDate: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState<Payment[] | FinancialAidApplication[] | ScholarshipApplication[]>([]);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<FinancialAidApplication | ScholarshipApplication | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [showAddChargeModal, setShowAddChargeModal] = useState(false);
  const [showViewChargesModal, setShowViewChargesModal] = useState(false);
  const [charges, setCharges] = useState<Charge[]>([]);
  const [showPaymentDetailsModal, setShowPaymentDetailsModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const {
    getAllPayments,
    getFinancialAidApplications,
    getScholarshipApplications,
    updateFinancialAidApplication,
    updateScholarshipApplication,
    createCharge,
    getCharges,
    loading,
    error,
    getPaymentDetails
  } = useFinancial();

  const fetchData = useCallback(async () => {
    try {
      let response;
      
      if (activeTab === 'payments') {
        response = await getAllPayments({
          page,
          limit: 10,
          status: filters.status !== 'All Statuses' ? filters.status : undefined,
          startDate: filters.startDate || undefined,
          endDate: undefined, // Add endDate if needed
        });
        setData(response.data || []);
        setTotalPages(response.totalPages || 1);
      } else if (activeTab === 'financialAid') {
        response = await getFinancialAidApplications();
        setData(response || []);
        setTotalPages(Math.ceil((response?.length || 0) / 10));
      } else {
        response = await getScholarshipApplications();
        setData(response || []);
        setTotalPages(Math.ceil((response?.length || 0) / 10));
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  }, [activeTab, getAllPayments, getFinancialAidApplications, getScholarshipApplications, page, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = data.filter((item: any) => {
    const matchesSearch = searchQuery
      ? item.studentId.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesSearch;
  });

  const handleViewReceipt = (payment: Payment) => {
    if (payment.receiptUrl) {
      setSelectedReceiptUrl(payment.receiptUrl);
      setShowReceiptModal(true);
    }
  };

  const handleAction = (app: FinancialAidApplication | ScholarshipApplication, type: 'approve' | 'reject') => {
    setSelectedApplication(app);
    setActionType(type);
    setShowActionModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedApplication) return;
    try {
      const status = actionType === 'approve' ? 'Approved' : 'Rejected';
      if ('term' in selectedApplication) {
        await updateFinancialAidApplication(selectedApplication.id, { status });
      } else {
        await updateScholarshipApplication(selectedApplication.id, { status });
      }
      setShowActionModal(false);
      fetchData();
    } catch (err: any) {
      console.error('Failed to update application:', err);
    }
  };

  const handleAddCharge = async (charge: {
    title: string;
    description: string;
    amount: number;
    term: string;
    dueDate: string;
    applicableFor: string;
  }) => {
    try {
      await createCharge(charge);
      setShowAddChargeModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to create charge:', err);
    }
  };

  const handleViewCharges = async () => {
    try {
      const chargesData = await getCharges();
      setCharges(chargesData);
      setShowViewChargesModal(true);
    } catch (err) {
      console.error('Failed to fetch charges:', err);
    }
  };

  const handleViewPayment = async (payment: Payment) => {
    try {
      const details = await getPaymentDetails(payment.id);
      setSelectedPayment(details);
      setShowPaymentDetailsModal(true);
    } catch (error) {
      console.error('Error fetching payment details:', error);
      toast.error('Failed to fetch payment details');
    }
  };

  const debouncedFilterChange = useCallback(
    debounce((field: string, value: string) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
      setPage(1);
    }, 300),
    []
  );

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleResetFilters = () => {
    setFilters({ status: 'All Statuses', term: 'All Terms', startDate: '' });
    setPage(1);
  };

  const paymentActions = [
    {
      icon: <FiEye size={16} />,
      label: 'View Details',
      onClick: handleViewPayment,
      color: 'blue' as const,
    },
  ];

  const applicationActions = [
    {
      icon: <FiCheckCircle size={16} />,
      label: 'Approve',
      onClick: (app: FinancialAidApplication | ScholarshipApplication) => handleAction(app, 'approve'),
      color: 'green' as const,
    },
    {
      icon: <FiXCircle size={16} />,
      label: 'Reject',
      onClick: (app: FinancialAidApplication | ScholarshipApplication) => handleAction(app, 'reject'),
      color: 'red' as const,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
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
        <div className="mb-6">
          <Header
            title="Payment Management"
            subtitle="Manage student payments and applications"
            stats={[
              {
                icon: <FiDollarSign />,
                title: 'Total Payments',
                value: data.length.toString(),
                change: '+4.5%',
                isPositive: true,
              },
              {
                icon: <FiFileText />,
                title: 'Pending Applications',
                value: data.filter((item: any) => item.status === 'Pending').length.toString(),
                change: '+1.2%',
                isPositive: true,
              },
              {
                icon: <FiAward />,
                title: 'Approved Awards',
                value: data.filter((item: any) => item.status === 'Approved').length.toString(),
                change: '+2.8%',
                isPositive: true,
              },
            ]}
            tabs={[
              { label: 'Payments', icon: <FiDollarSign size={16} />, active: activeTab === 'payments' },
              { label: 'Financial Aid', icon: <FiFileText size={16} />, active: activeTab === 'financialAid' },
              { label: 'Scholarships', icon: <FiAward size={16} />, active: activeTab === 'scholarships' },
            ]}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchPlaceholder="Search by student ID..."
            filters={filters}
            filterOptions={{
              status: STATUSES,
              term: TERMS,
              startDate: [],
            }}
            debouncedFilterChange={debouncedFilterChange}
            handleResetFilters={handleResetFilters}
            onTabClick={(index) => {
              const tabMap = ['payments', 'financialAid', 'scholarships'];
              setActiveTab(tabMap[index] as 'payments' | 'financialAid' | 'scholarships');
              setPage(1);
            }}
          />
        </div>

        <div className="mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
            <div className="px-6 py-5">
              {activeTab === 'payments' && (
                <div className="mb-4 flex justify-start space-x-4">
                  <button
                    onClick={() => setShowAddChargeModal(true)}
                    className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    <FiPlus className="mr-2" />
                    Add New Charge
                  </button>
                  <button
                    onClick={handleViewCharges}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <FiList className="mr-2" />
                    View Charges
                  </button>
                </div>
              )}
              {filteredData.length > 0 ? (
                <>
                  <ApplicationsTable
                    data={filteredData}
                    columns={
                      activeTab === 'payments'
                        ? paymentColumns
                        : activeTab === 'financialAid'
                        ? financialAidColumns
                        : scholarshipColumns
                    }
                    actions={activeTab === 'payments' ? paymentActions : applicationActions}
                  />
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    itemsCount={filteredData.length}
                    itemName={activeTab === 'payments' ? 'payments' : activeTab === 'financialAid' ? 'applications' : 'scholarship applications'}
                    onPageChange={handlePageChange}
                    onFirstPage={() => setPage(1)}
                    onLastPage={() => setPage(totalPages)}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                    {activeTab === 'payments' ? (
                      <FiDollarSign size={32} className="text-purple-400" />
                    ) : activeTab === 'financialAid' ? (
                      <FiFileText size={32} className="text-purple-400" />
                    ) : (
                      <FiAward size={32} className="text-purple-400" />
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">
                    No {activeTab === 'payments' ? 'Payments' : activeTab === 'financialAid' ? 'Financial Aid Applications' : 'Scholarship Applications'} Found
                  </h3>
                  <p className="text-gray-400 text-center max-w-sm">
                    There are no {activeTab === 'payments' ? 'payments' : activeTab === 'financialAid' ? 'financial aid applications' : 'scholarship applications'} matching your current filters. Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {showReceiptModal && (
          <ReceiptModal
            isOpen={showReceiptModal}
            onClose={() => setShowReceiptModal(false)}
            receiptUrl={selectedReceiptUrl}
          />
        )}

        {showActionModal && selectedApplication && (
          <ActionModal
            isOpen={showActionModal}
            onClose={() => setShowActionModal(false)}
            onConfirm={handleConfirmAction}
            title={actionType === 'approve' ? 'Approve Application' : 'Reject Application'}
            message={`Are you sure you want to ${actionType} this ${'term' in selectedApplication ? 'financial aid' : 'scholarship'} application for student ${selectedApplication.studentId}? `}
            type={actionType === 'approve' ? 'success' : 'danger'}
          />
        )}

        {showAddChargeModal && (
          <AddChargeModal
            isOpen={showAddChargeModal}
            onClose={() => setShowAddChargeModal(false)}
            onSubmit={handleAddCharge}
          />
        )}

        {showViewChargesModal && (
          <ViewChargesModal
            isOpen={showViewChargesModal}
            onClose={() => setShowViewChargesModal(false)}
            charges={charges}
            loading={loading}
          />
        )}

        {showPaymentDetailsModal && (
          <PaymentDetailsModal
            isOpen={showPaymentDetailsModal}
            onClose={() => {
              setShowPaymentDetailsModal(false);
              setSelectedPayment(null);
            }}
            payment={selectedPayment}
          />
        )}

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
    </div>
  );
};

export default PaymentManagement;