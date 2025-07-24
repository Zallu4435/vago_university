import { usePreferences } from "../../../../application/context/PreferencesContext";
import { AcademicsTabsProps } from "../../../../domain/types/user/academics";

interface AcademicsTabsWithDisabledProps extends AcademicsTabsProps {
  disabledTabs?: string[];
}

export default function AcademicsTabs({ activeSubTab, setActiveSubTab, disabledTabs = [] }: AcademicsTabsWithDisabledProps) {
  const tabs = ['Course Registration', 'Academic Records', 'Degree Audit'];
  const { styles, theme } = usePreferences();

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-4 mt-4 sm:mt-6">
      <div className={`relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl ${styles.card.background} border ${styles.border} group hover:${styles.card.hover} transition-all duration-500`}>
        {/* Background glow */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-xl sm:rounded-2xl blur transition-all duration-300`}></div>

        <div className="relative z-10 flex flex-col sm:flex-row">
          {tabs.map((tab) => {
            const isDisabled = disabledTabs.includes(tab);
            return (
              <button
                key={tab}
                onClick={() => !isDisabled && setActiveSubTab(tab)}
                disabled={isDisabled}
                className={`relative flex-1 py-2 sm:py-3 px-3 sm:px-4 font-medium text-center transition-all duration-300 group/tab text-xs sm:text-sm ${
                  activeSubTab === tab
                    ? `bg-gradient-to-r ${styles.accent} text-white rounded-lg sm:rounded-2xl`
                    : `${styles.textSecondary} hover:${styles.textPrimary} hover:bg-amber-100/50`
                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="relative z-10">{tab}</span>
                {activeSubTab === tab && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-lg sm:rounded-2xl"></div>
                )}
                <div
                  className={`absolute bottom-0 left-0 h-0.5 sm:h-1 w-0 bg-gradient-to-r ${styles.accent} rounded-full transition-all duration-300 ${
                    activeSubTab === tab ? 'w-full' : 'group-hover/tab:w-full'
                  }`}
                ></div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}