import { useState, useEffect } from 'react';
import { FaMoneyBillWave } from 'react-icons/fa';
import FinancialTabs from './FinancialTabs';
import FeesPaymentsSection from './FeesPaymentsSection';
import FinancialAidSection from './FinancialAidSection';
import ScholarshipsSection from './ScholarshipsSection';
import { useFinancial } from '../../../../application/hooks/useFinancial';
import { usePreferences } from '../../../context/PreferencesContext';
import { MdCurrencyRupee } from 'react-icons/md';

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

export default function Financial() {
  const {
    getStudentFinancialInfo,
    loading,
    error,
  } = useFinancial();
  const { styles, theme } = usePreferences();

  const [activeTab, setActiveTab] = useState('Fees and Payments');
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const info = await getStudentFinancialInfo();
        console.log('API Response:', info);
        setStudentInfo(info || {});
      } catch (err) {
        console.error('Error fetching financial data:', err);
      }
    };
    fetchData();
  }, [getStudentFinancialInfo]);


  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${styles.background}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${styles.button.primary.split(' ')[0]}`}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${styles.background}`}>
        <div className={`relative overflow-hidden rounded-2xl shadow-xl ${styles.card.background} border ${styles.border} p-4 sm:p-6 max-w-md w-full`}>
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
          <div className={`relative z-10 ${styles.status.error} text-sm sm:text-base text-center`}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden ${styles.background}`}>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`group relative overflow-hidden rounded-2xl shadow-xl ${styles.card.background} border ${styles.border} hover:${styles.card.hover} transition-all duration-300`}>
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
          <div className="relative z-10 p-4 sm:p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${styles.accent} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                  <FaMoneyBillWave size={20} className="text-white relative z-10" />
                </div>
                <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
              <div>
                <h2 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} bg-clip-text`}>
                  Financial Services
                </h2>
                <div className={`h-1 w-16 bg-gradient-to-r ${styles.accent} rounded-full mt-1 group-hover:w-24 transition-all duration-300`}></div>
              </div>
            </div>
            <div className={`mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm ${styles.textSecondary}`}>
              <div className="flex items-center gap-1">
                <span className="font-medium">Account Balance:</span>
                <MdCurrencyRupee />
                <span>
                  {studentInfo?.info && studentInfo.info.length > 0 && studentInfo.info[0]?.amount
                    ? studentInfo.info[0].amount.toLocaleString()
                    : '0.00'}
                </span>
              </div>
              <div>
                <span className="font-medium">Payment Due:</span>{' '}
                {studentInfo?.info?.[0]?.paymentDueDate
                  ? formatDate(studentInfo.info[0].paymentDueDate)
                  : 'N/A'}
              </div>
              <div>
                <span className="font-medium">Financial Aid Status:</span>{' '}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${studentInfo?.financialAidStatus === 'Approved'
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

        <div className='mt-6'>
          <FinancialTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="mt-6">
          {activeTab === 'Fees and Payments' && (
            <FeesPaymentsSection
              studentInfo={studentInfo?.info || []}
              paymentHistory={studentInfo?.history || []}
            />
          )}
          {activeTab === 'Financial Aid' && <FinancialAidSection />}
          {activeTab === 'Scholarships' && <ScholarshipsSection />}
        </div>
      </div>
    </div>
  );
}