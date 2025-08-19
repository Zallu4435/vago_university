import { usePreferences } from '../../../../application/context/PreferencesContext';
import { CampusLifeTabsProps } from '../../../../domain/types/user/campus-life';

export default function CampusLifeTabs({ activeTab, setActiveTab }: CampusLifeTabsProps) {
  const tabs = ['Events', 'Clubs', 'Athletics'];
  const { styles } = usePreferences();

  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-xl ${styles.card.background} border ${styles.border} group hover:${styles.card.hover} transition-all duration-500 w-full`}>
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
      <div className="relative z-10 flex flex-col xs:flex-row xs:space-x-0 sm:flex-row w-full">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex-1 w-full py-2 sm:py-3 px-3 sm:px-6 font-medium text-center transition-all duration-300 group/tab text-sm sm:text-base md:text-lg ${
              activeTab === tab
                ? `bg-gradient-to-r ${styles.accent} text-white rounded-t-2xl sm:rounded-2xl`
                : `${styles.textSecondary} hover:${styles.textPrimary} hover:bg-amber-100/50`
            }`}
          >
            <span className="relative z-10">{tab}</span>
            {activeTab === tab && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-t-2xl sm:rounded-2xl"></div>
            )}
            <div
              className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${styles.accent} rounded-full transition-all duration-300 ${
                activeTab === tab ? 'w-full' : 'group-hover/tab:w-full'
              }`}
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
}
