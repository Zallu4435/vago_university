import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { usePreferences } from '../../../context/PreferencesContext';

export default function WelcomeBanner() {
  const { styles, theme } = usePreferences();
  const user = useSelector((state: RootState) => state.auth.user);
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Student';

  return (
    <div className={`relative z-0 ${styles.backgroundSecondary} ${styles.borderSecondary} overflow-hidden`}>
      <div className="absolute inset-0">
        <div className={`absolute top-8 left-8 w-32 h-32 bg-gradient-to-br ${styles.orb.secondary} rounded-full blur-2xl animate-pulse`}></div>
        <div className={`absolute top-16 right-16 w-24 h-24 bg-gradient-to-br ${styles.orb.secondary} rounded-full blur-xl animate-pulse delay-700`}></div>
        <div className={`absolute bottom-8 left-1/3 w-28 h-28 bg-gradient-to-br ${styles.orb.secondary} rounded-full blur-2xl animate-pulse delay-1000`}></div>
        <div className={`absolute bottom-12 right-1/4 w-20 h-20 bg-gradient-to-br ${styles.orb.secondary} rounded-full blur-xl animate-pulse delay-500`}></div>
      </div>
      <div className="absolute inset-0 opacity-5">
        <div className={`absolute top-4 left-1/4 w-16 h-16 ${styles.pattern.primary} rotate-45 rounded-lg`}></div>
        <div className={`absolute bottom-8 right-1/3 w-12 h-12 ${styles.pattern.primary} rotate-12 rounded-full`}></div>
        <div className={`absolute top-1/2 right-8 w-8 h-8 bg-gradient-to-br ${styles.orb.primary} rotate-45 rounded-sm`}></div>
      </div>
      <div className={`absolute inset-0 bg-gradient-to-r via-transparent backdrop-blur-[2px]`}></div>
      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-8 bg-gradient-to-b ${styles.accent} rounded-full`}></div>
              <div>
                <h2 className={`text-3xl lg:text-4xl font-bold ${theme == 'dark' ? 'text-white' : 'text-gray-800'} bg-clip-text`}>
                  Welcome back, {fullName}!
                </h2>
                <div className={`h-1 w-24 bg-gradient-to-r ${styles.accent} rounded-full mt-1`}></div>
              </div>
            </div>
            <p className={`text-lg font-medium ml-5 flex items-center space-x-2 ${styles.textSecondary}`}>
              <span>Let's continue your academic journey</span>
              <div className={`w-2 h-2 bg-gradient-to-br ${styles.accent} rounded-full animate-pulse`}></div>
            </p>
          </div>
          <div className="flex flex-wrap gap-4 lg:gap-6">
            {[
              { label: 'Semester', value: 'Spring 2025', icon: '📚' },
              { label: 'GPA', value: '3.7', icon: '⭐' },
              { label: 'Credits', value: '85/120', icon: '🎯' },
              { label: 'Status', value: 'Confirmed', icon: '✅' }
            ].map((stat, index) => (
              <div key={stat.label} className="group relative">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.primary} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className={`relative ${styles.card.background} ${styles.card.border} ${styles.card.hover} rounded-2xl px-5 py-4 shadow-lg transition-all duration-300 backdrop-blur-xl`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className={`text-xs font-medium ${styles.textTertiary} uppercase tracking-wider`}>{stat.label}</p>
                    <span className={`text-lg ${styles.icon.primary} group-hover:scale-110 transition-transform duration-200`}>{stat.icon}</span>
                  </div>
                  <div className="relative">
                    <p className={`text-lg font-bold ${styles.textPrimary} group-hover:text-gray-900 transition-colors duration-200`}>
                      {stat.value}
                    </p>
                    {stat.label === 'GPA' && (
                      <div className={`mt-2 h-1.5 ${styles.progress.background} rounded-full overflow-hidden`}>
                        <div className={`h-full ${styles.progress.fill} rounded-full`} style={{ width: '92.5%' }}></div>
                      </div>
                    )}
                    {stat.label === 'Credits' && (
                      <div className={`mt-2 h-1.5 ${styles.progress.background} rounded-full overflow-hidden`}>
                        <div className={`h-full ${styles.progress.fill} rounded-full`} style={{ width: '70.8%' }}></div>
                      </div>
                    )}
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${styles.orb.primary} opacity-0 group-hover:opacity-10 rounded-2xl transition-all duration-300 pointer-events-none`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={`mt-8 pt-6 ${styles.borderSecondary}`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 ${styles.status.success} rounded-full animate-pulse`}></div>
                <span className={`${styles.textSecondary} font-medium`}>Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 ${styles.status.info} rounded-full`}></div>
                <span className={`${styles.textSecondary} font-medium`}>Last login: Today, 9:30 AM</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className={`px-4 py-2 ${styles.button.secondary} rounded-xl text-sm font-medium shadow-md hover:shadow-lg border ${styles.borderSecondary}`}>
                Quick Enrollment
              </button>
              <button className={`px-4 py-2 ${styles.button.primary} rounded-xl text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105`}>
                View Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}