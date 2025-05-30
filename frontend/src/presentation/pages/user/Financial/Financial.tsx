import { useState, useEffect } from 'react';
import { useFinancial } from '../../../../application/hooks/useFinancial';
import FinancialTabs from './FinancialTabs';
import FeesPaymentsSection from './FeesPaymentsSection';
import FinancialAidSection from './FinancialAidSection';
import ScholarshipsSection from './ScholarshipsSection';

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
    error
  } = useFinancial();

  const [activeTab, setActiveTab] = useState('Fees and Payments');
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [currentCharges, setCurrentCharges] = useState<any[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [info, charges, history] = await Promise.all([
        // getStudentFinancialInfo(),
        getCurrentCharges(),
        getPaymentHistory()
      ]);
      if (info) setStudentInfo(info);
      if (charges) setCurrentCharges(charges);
      if (history) setPaymentHistory(history);
    };
    fetchData();
  }, [ getCurrentCharges, getPaymentHistory]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-lg shadow-sm mb-4">
        <h2 className="text-xl font-bold text-gray-800">Financial Services</h2>
        <div className="flex flex-col md:flex-row md:justify-between mt-2 text-gray-600">
          <div>
            <span className="font-medium">Account Balance:</span> ${mockStudentFinancialInfo?.accountBalance?.toLocaleString() || '0.00'}
          </div>
          <div className="mt-1 md:mt-0">
            <span className="font-medium">Payment Due:</span> {mockStudentFinancialInfo?.paymentDueDate || 'N/A'}
          </div>
          <div className="mt-1 md:mt-0">
            <span className="font-medium">Financial Aid Status:</span>
            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-sm ml-1">
              {mockStudentFinancialInfo?.financialAidStatus || 'Not Applied'}
            </span>
          </div>
        </div>
      </div>
      <FinancialTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'Fees and Payments' && (
        <FeesPaymentsSection
          studentInfo={mockStudentFinancialInfo}
          currentCharges={currentCharges}
          paymentHistory={paymentHistory}
        />
      )}
      {activeTab === 'Financial Aid' && <FinancialAidSection />}
      {activeTab === 'Scholarships' && <ScholarshipsSection />}
    </div>
  );
}