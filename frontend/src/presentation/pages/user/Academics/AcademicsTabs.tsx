import { usePreferences } from "../../../context/PreferencesContext";

export default function AcademicsTabs({ activeSubTab, setActiveSubTab }) {
  const tabs = ['Course Registration', 'Academic Records', 'Degree Audit'];
  const { styles, theme } = usePreferences();

  return (
    <div className="container mx-auto px-4 mt-6">
      <div className={`relative overflow-hidden rounded-2xl shadow-xl ${styles.card.background} border ${styles.border} group hover:${styles.card.hover} transition-all duration-500`}>
        {/* Background glow */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>

        <div className="relative z-10 flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`relative flex-1 py-3 px-4 font-medium text-center transition-all duration-300 group/tab ${
                activeSubTab === tab
                  ? `bg-gradient-to-r ${styles.accent} text-white rounded-2xl`
                  : `${styles.textSecondary} hover:${styles.textPrimary} hover:bg-amber-100/50`
              }`}
            >
              <span className="relative z-10">{tab}</span>
              {activeSubTab === tab && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"></div>
              )}
              <div
                className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${styles.accent} rounded-full transition-all duration-300 ${
                  activeSubTab === tab ? 'w-full' : 'group-hover/tab:w-full'
                }`}
              ></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}