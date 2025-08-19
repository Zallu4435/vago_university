import { FaBookOpen, FaArrowRight } from 'react-icons/fa';
import { usePreferences } from '../../../../application/context/PreferencesContext';
import { AcademicRecordsProps } from '../../../../domain/types/user/academics';

export default function AcademicRecords({ studentInfo, gradeInfo, academicHistory }: AcademicRecordsProps) {
  const { styles, theme } = usePreferences();

  return (
    <div className="container mx-auto px Solemnity, June 01, 2025 4 mt-6">
      <div className={`relative overflow-hidden rounded-t-2xl shadow-xl bg-gradient-to-r ${styles.accent} group`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${styles.orb.primary}`}></div>
        <div className={`absolute -top-8 -left-8 w-48 h-48 rounded-full bg-gradient-to-br ${styles.orb.primary} blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${styles.orb.secondary} blur-2xl animate-pulse delay-700`}></div>
        <div className="relative z-10 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${styles.accent} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                  <FaBookOpen size={20} className="text-white relative z-10" />
                </div>
                <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} bg-clip-text text-transparent`}>
                  Academic Records
                </h2>
                <div className={`h-1 w-16 bg-gradient-to-r ${styles.accent} rounded-full mt-1 group-hover:w-24 transition-all duration-300`}></div>
              </div>
            </div>
            <span className={`text-white font-medium ${styles.button.secondary} px-3 py-1 rounded-full border ${styles.border}`}>Fall 2025</span>
          </div>
        </div>
      </div>

      <div className={`relative overflow-hidden rounded-b-2xl shadow-xl ${styles.card.background} border ${styles.border} group hover:${styles.card.hover} transition-all duration-500`}>
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
        <div className="relative z-10 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-amber-200/50 pb-2">Student Information</h3>
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${styles.accentSecondary} p-4 border ${styles.border} hover:${styles.card.hover} transition-all duration-300 group/item`}>
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
              <div className={`relative z-10 ${styles.textSecondary} text-sm`}>
                <p>
                  <span className="font-medium">Name:</span> {studentInfo.name} |{' '}
                  <span className="font-medium">Email:</span> {studentInfo.email} |{' '}
                  <span className="font-medium">Major:</span> {studentInfo.major} |{' '}
                  <span className="font-medium">Academic Standing:</span> {studentInfo.academicStanding}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-amber-200/50 pb-2">Grade Summary</h3>
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${styles.accentSecondary} p-4 border ${styles.border} hover:${styles.card.hover} transition-all duration-300 group/item`}>
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
                <div className="relative z-10 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-800 font-medium">Cumulative GPA:</span>
                    <span className={`${styles.textSecondary}`}>{gradeInfo.cumulativeGPA}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-800 font-medium">Term GPA ({gradeInfo.termName}):</span>
                    <span className={`${styles.textSecondary}`}>{gradeInfo.termGPA}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-800 font-medium">Credits Earned:</span>
                    <span className={`${styles.textSecondary}`}>{gradeInfo.creditsEarned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-800 font-medium">Credits In Progress:</span>
                    <span className={`${styles.textSecondary}`}>{gradeInfo.creditsInProgress}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-amber-200/50 pb-2">Academic History</h3>
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${styles.accentSecondary} p-4 border ${styles.border} hover:${styles.card.hover} transition-all duration-300 group/item`}>
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
                <div className="relative z-10 space-y-2">
                  {academicHistory.map((term) => (
                    <div
                      key={term.id}
                      className={`bg-white/70 backdrop-blur-md p-3 rounded-lg border ${styles.border} hover:${styles.card.hover} transition-all duration-300 group/subitem`}
                    >
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-lg blur transition-all duration-300`}></div>
                      <div className="relative z-10 flex justify-between items-center text-sm">
                        <span className="font-medium text-gray-800">{term.term}</span>
                        <div className="flex space-x-2">
                          <span className={`${styles.textSecondary}`}>{term.credits} Credits</span>
                          <span className={`${styles.textSecondary}`}>|</span>
                          <span className={`${styles.textSecondary}`}>GPA: {term.gpa}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
            <button className={`group/btn ${styles.card.background} border ${styles.button.outline} py-2 px-4 rounded-full transition-all duration-300 shadow-sm hover:${styles.card.hover} transform hover:scale-105`}>
              <span className="flex items-center space-x-2">
                <span>View Unofficial Transcript</span>
                <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform duration-300" size={12} />
              </span>
            </button>
            <button className={`group/btn bg-gradient-to-r ${styles.accent} hover:${styles.button.primary} text-white py-2 px-4 rounded-full transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105`}>
              <span className="flex items-center space-x-2">
                <span>Request Official Transcript</span>
                <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform duration-300" size={12} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}