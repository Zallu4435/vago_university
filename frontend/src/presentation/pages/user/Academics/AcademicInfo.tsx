import { FaGraduationCap } from 'react-icons/fa';
import { usePreferences } from '../../../context/PreferencesContext';

export default function AcademicInfo({ major = 'Computer Science', academicStanding = 'Good', advisor = 'Dr. Emma Wilson' }) {
  const { styles, theme } = usePreferences();

  return (
    <div className={`relative overflow-hidden border-b ${styles.borderSecondary}`}>
      {/* Background layers */}
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.accentSecondary} backdrop-blur-md`}></div>
      <div className={`absolute inset-0 bg-gradient-to-r ${styles.orb.secondary}`}></div>
      <div className={`absolute -top-8 -left-8 w-48 h-48 rounded-full bg-gradient-to-br ${styles.orb.primary} blur-3xl animate-pulse`}></div>
      <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${styles.orb.secondary} blur-2xl animate-pulse delay-700`}></div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className={`group relative overflow-hidden rounded-2xl shadow-xl ${styles.card.background} hover:${styles.card.hover} transition-all duration-300 border ${styles.border}`}>
          {/* Background glow */}
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>

          <div className="relative z-10 p-6">
            {/* Enhanced header */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${styles.accent} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                  <FaGraduationCap size={20} className="text-white relative z-10" />
                </div>
                <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} bg-clip-text`}>
                  Academic Information
                </h2>
                <div className={`h-1 w-16 bg-gradient-to-r ${styles.accent} rounded-full mt-1 group-hover:w-24 transition-all duration-300`}></div>
              </div>
            </div>

            {/* Content */}
            <p className={`${styles.textSecondary} text-sm`}>
              <span className="font-medium">Current Major:</span> {major} |{' '}
              <span className="font-medium">Academic Standing:</span> {academicStanding} |{' '}
              <span className="font-medium">Advisor:</span> {advisor}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}