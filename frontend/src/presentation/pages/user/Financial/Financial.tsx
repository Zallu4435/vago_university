import { useState } from 'react';
import FinancialTabs from './FinancialTabs';
import FeesPaymentsSection from './FeesPaymentsSection';
import FinancialAidSection from './FinancialAidSection';
import ScholarshipsSection from './ScholarshipsSection';

export default function Financial() {
  const [activeTab, setActiveTab] = useState('Fees and Payments');

  // Sample data
  const studentInfo = {
    name: 'John Smith',
    accountBalance: '$3,450.00',
    paymentDueDate: 'May 15, 2025',
    financialAidStatus: 'Approved',
  };

  const currentCharges = [
    { description: 'Tuition', amount: '$2,800.00' },
    { description: 'Technology Fee', amount: '$250.00' },
    { description: 'Health Insurance', amount: '$400.00' },
  ];

  const paymentHistory = [
    {
      date: '12/15/2024',
      description: 'Fall 2024 Tuition Payment',
      method: 'Credit Card',
      amount: '$3,200.00',
      id: 1,
    },
    {
      date: '08/01/2024',
      description: 'Housing Fee Payment',
      method: 'Bank Transfer',
      amount: '$1,800.00',
      id: 2,
    },
    {
      date: '05/15/2024',
      description: 'Enrollment Deposit',
      method: 'Credit Card',
      amount: '$500.00',
      id: 3,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-lg shadow-sm mb-4">
        <h2 className="text-xl font-bold text-gray-800">Financial Services</h2>
        <div className="flex flex-col md:flex-row md:justify-between mt-2 text-gray-600">
          <div>
            <span className="font-medium">Account Balance:</span> {studentInfo.accountBalance}
          </div>
          <div className="mt-1 md:mt-0">
            <span className="font-medium">Payment Due:</span> {studentInfo.paymentDueDate}
          </div>
          <div className="mt-1 md:mt-0">
            <span className="font-medium">Financial Aid Status:</span>
            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-sm ml-1">
              {studentInfo.financialAidStatus}
            </span>
          </div>
        </div>
      </div>
      <FinancialTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'Fees and Payments' && (
        <FeesPaymentsSection
          studentInfo={studentInfo}
          currentCharges={currentCharges}
          paymentHistory={paymentHistory}
        />
      )}
      {activeTab === 'Financial Aid' && <FinancialAidSection />}
      {activeTab === 'Scholarships' && <ScholarshipsSection />}
    </div>
  );
}