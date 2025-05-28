import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FiDollarSign, FiCheckCircle, FiXCircle, FiEye, FiCreditCard, FiFileText, FiAward } from 'react-icons/fi';
import { debounce } from 'lodash';
import { useFinancial } from '../../../../application/hooks/useFinancial';
import Header from '../User/Header';
import ApplicationsTable from '../User/ApplicationsTable';
import Pagination from '../User/Pagination';
import WarningModal from '../../../components/WarningModal';
import ReceiptModal from './ReceiptModal';
import ActionModal from './ActionModal';

interface Payment {
  id: string;
  studentId: string;
  date: string;
  description: string;
  method: 'Credit Card' | 'Bank Transfer' | 'Financial Aid';
  amount: number;
  status: string;
  receiptUrl?: string;
}

interface FinancialAidApplication {
  id: string;
  studentId: string;
  term: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  amount: number;
  type: 'Grant' | 'Loan' | 'Scholarship';
  applicationDate: string;
  documents: { id: string; name: string; url: string; status: string }[];
}

interface ScholarshipApplication {
  id: string;
  scholarshipId: string;
  studentId: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  applicationDate: string;
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
    header: 'Description',
    key: 'description',
    render: (payment: Payment) => (
      <div className="flex items-center text-gray-300">
        <FiFileText size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{payment.description}</span>
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

  const {
    getAllPayments,
    getFinancialAidApplications,
    getScholarshipApplications,
    updateFinancialAidApplication,
    updateScholarshipApplication,
    loading,
    error
  } = useFinancial();

  const fetchData = useCallback(async () => {
    try {
      let response;
      
      if (activeTab === 'payments') {
        response = await getAllPayments();
        setData(response || []);
      } else if (activeTab === 'financialAid') {
        response = await getFinancialAidApplications();
        setData(response || []);
      } else {
        response = await getScholarshipApplications();
        setData(response || []);
      }
      
      setTotalPages(Math.ceil((response?.length || 0) / 10));
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  }, [activeTab, getAllPayments, getFinancialAidApplications, getScholarshipApplications]);

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

  const debouncedFilterChange = useCallback(
    debounce((field: string, value: string) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
      setPage(1);
    }, 300),
    []
  );

  const handleResetFilters = () => {
    setFilters({ status: 'All Statuses', term: 'All Terms', startDate: '' });
    setPage(1);
  };

  const paymentActions = [
    {
      icon: <FiEye size={16} />,
      label: 'View Receipt',
      onClick: handleViewReceipt,
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

        <div className="mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
            <div className="px-6 py-5">
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
                    onPageChange={(newPage) => setPage(newPage)}
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
          message={`Are you sure you want to ${actionType} this ${'term' in selectedApplication ? 'financial aid' : 'scholarship'} application for student ${selectedApplication.studentId}?`}
          type={actionType === 'approve' ? 'success' : 'danger'}
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
  );
};

export default PaymentManagement;