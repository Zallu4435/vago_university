import PropTypes from 'prop-types';
import { usePreferences } from '../../../../application/context/PreferencesContext';
import type { FinancialTabsProps } from '../../../../domain/types/user/financial';

export default function FinancialTabs({ activeTab, setActiveTab }: FinancialTabsProps) {
  const tabs = ['Fees and Payments', 'Financial Aid', 'Scholarships'];
  const { styles } = usePreferences();

  return (
    <div className={`w-full sm:px-4 md:px-6 relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl ${styles.card.background} border ${styles.border} group hover:${styles.card.hover} transition-all duration-500`}>
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-xl sm:rounded-2xl blur transition-all duration-300`}></div>
      <div className="relative z-10 flex flex-col sm:flex-row">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex-1 py-2 sm:py-3 px-3 sm:px-4 md:px-6 font-medium text-center transition-all duration-300 group/tab text-xs sm:text-sm ${
              activeTab === tab
                ? `bg-gradient-to-r ${styles.accent} text-white rounded-t-xl sm:rounded-2xl`
                : `${styles.textSecondary} hover:${styles.textPrimary} hover:bg-amber-100/50`
            }`}
          >
            <span className="relative z-10">{tab}</span>
            {activeTab === tab && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-t-xl sm:rounded-2xl"></div>
            )}
            <div
              className={`absolute bottom-0 left-0 h-0.5 sm:h-1 w-0 bg-gradient-to-r ${styles.accent} rounded-full transition-all duration-300 ${
                activeTab === tab ? 'w-full' : 'group-hover/tab:w-full'
              }`}
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
}

FinancialTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};