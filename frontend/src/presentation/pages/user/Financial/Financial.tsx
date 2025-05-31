import { useState, useEffect } from 'react';
import { FaMoneyBillWave } from 'react-icons/fa';
import FinancialTabs from './FinancialTabs';
import FeesPaymentsSection from './FeesPaymentsSection';
import FinancialAidSection from './FinancialAidSection';
import ScholarshipsSection from './ScholarshipsSection';
import { useFinancial } from '../../../../application/hooks/useFinancial';

const mockStudentFinancialInfo = {
  accountBalance: 2500.00,
  paymentDueDate: '2024-04-15',
  financialAidStatus: 'Approved',
  studentId: 'STU123456',
  name: 'John Doe',
  semester: 'Spring 2024',
  totalCharges: 5000.00,
  totalPayments: 2500.00,
  paymentPlan: {
    status: 'Active',
    monthlyAmount: 833.33,
    remainingPayments: 3,
    nextPaymentDate: '2024-04-15'
  },
  financialAid: {
    totalAwarded: 2000.00,
    disbursedAmount: 1000.00,
    pendingAmount: 1000.00,
    grants: [
      {
        name: 'Pell Grant',
        amount: 1500.00,
        status: 'Disbursed'
      },
      {
        name: 'State Grant',
        amount: 500.00,
        status: 'Pending'
      }
    ],
    loans: [
      {
        name: 'Federal Direct Loan',
        amount: 2000.00,
        status: 'Approved'
      }
    ]
  },
  scholarships: [
    {
      name: 'Academic Excellence',
      amount: 1000.00,
      status: 'Awarded',
      disbursementDate: '2024-03-15'
    }
  ],
  recentTransactions: [
    {
      date: '2024-03-01',
      description: 'Tuition Payment',
      amount: -1000.00,
      type: 'Payment'
    },
    {
      date: '2024-02-15',
      description: 'Financial Aid Disbursement',
      amount: 1500.00,
      type: 'Credit'
    }
  ]
};

export default function Financial() {
  const {
    getStudentFinancialInfo,
    getCurrentCharges,
    getPaymentHistory,
    loading,
    error,
  } = useFinancial();

  const [activeTab, setActiveTab] = useState('Fees and Payments');
  const [studentInfo, setStudentInfo] = useState(null);
  const [currentCharges, setCurrentCharges] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [info, charges, history] = await Promise.all([
  //         getStudentFinancialInfo(),
  //         getCurrentCharges(),
  //         getPaymentHistory(),
  //       ]);
  //       setStudentInfo(info || {});
  //       setCurrentCharges(charges || []);
  //       setPaymentHistory(history || []);
  //     } catch (err) {
  //       console.error('Error fetching financial data:', err);
  //     }
  //   };
  //   fetchData();
  // }, [getStudentFinancialInfo, getCurrentCharges, getPaymentHistory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-white/90">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-white/90">
        <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-amber-100/50 p-4 sm:p-6 max-w-md w-full">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 group-hover:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
          <div className="relative z-10 text-red-600 text-sm sm:text-base text-center">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-white/90">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/80 to-white/90"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100/20 to-amber-100/20"></div>
      <div className="absolute -bottom-16 -right-16 w-96 h-96 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-300/30 blur-3xl animate-pulse"></div>
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-gradient-to-br from-amber-200/20 to-orange-200/20 blur-2xl animate-pulse delay-700"></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="group relative overflow-hidden rounded-2xl shadow-xl bg-white/70 backdrop-blur-md mb-6 border border-amber-100/50 hover:border-orange-200/50 hover:shadow-2xl transition-all duration-300">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 group-hover:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
          <div className="relative z-10 p-4 sm:p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                  <FaMoneyBillWave size={20} className="text-white relative z-10" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-orange-400/30 to-amber-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
                  Financial Services
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mt-1 group-hover:w-24 transition-all duration-300"></div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Account Balance:</span>{' '}
                ${studentInfo?.accountBalance?.toLocaleString() || '0.00'}
              </div>
              <div>
                <span className="font-medium">Payment Due:</span>{' '}
                {studentInfo?.paymentDueDate || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Financial Aid Status:</span>{' '}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    studentInfo?.financialAidStatus === 'Approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {studentInfo?.financialAidStatus || 'Not Applied'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <FinancialTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-6">
          {activeTab === 'Fees and Payments' && (
            <FeesPaymentsSection
              studentInfo={studentInfo || mockStudentFinancialInfo || {}}
              currentCharges={currentCharges}
              paymentHistory={paymentHistory}
            />
          )}
          {activeTab === 'Financial Aid' && <FinancialAidSection />}
          {activeTab === 'Scholarships' && <ScholarshipsSection />}
        </div>
      </div>
    </div>
  );
}
