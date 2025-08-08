import { FaChartLine, FaArrowRight } from 'react-icons/fa';
import { usePreferences } from '../../../../application/context/PreferencesContext';

export default function DegreeAudit({ programInfo, progressInfo, requirementsInfo }: { programInfo: any, progressInfo: any, requirementsInfo: any }) {
  const { styles, theme } = usePreferences();

  return (
    <div className="container mx-auto px-4 mt-6">
      {/* Header Section */}
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
                  <FaChartLine size={20} className="text-white relative z-10" />
                </div>
                <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} bg-clip-text text-transparent`}>
                  Degree Audit
                </h2>
                <div className={`h-1 w-16 bg-gradient-to-r ${styles.accent} rounded-full mt-1 group-hover:w-24 transition-all duration-300`}></div>
              </div>
            </div>
            <span className={`text-white font-medium ${styles.button.secondary} px-3 py-1 rounded-full border ${styles.border}`}>Fall 2025</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className={`relative overflow-hidden rounded-b-2xl shadow-xl ${styles.card.background} border ${styles.border} group hover:${styles.card.hover} transition-all duration-500`}>
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
        <div className="relative z-10 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-amber-200/50 pb-2">Program Information</h3>
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${styles.accentSecondary} p-4 border ${styles.border} hover:${styles.card.hover} transition-all duration-300 group/item`}>
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
              <div className="relative z-10 flex flex-col md:flex-row md:justify-between text-sm">
                <div className={`${styles.textSecondary}`}>
                  <span className="font-medium text-gray-800">Degree:</span> {programInfo.degree}
                </div>
                <div className={`${styles.textSecondary} mt-2 md:mt-0`}>
                  <span className="font-medium text-gray-800">Catalog Year:</span> {programInfo.catalogYear}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-amber-200/50 pb-2">Progress Summary</h3>
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${styles.accentSecondary} p-4 border ${styles.border} hover:${styles.card.hover} transition-all duration-300 group/item`}>
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
              <div className="relative z-10">
                <div className="mb-4">
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-gray-800 font-medium">Overall Degree Progress:</span>
                    <span className={`${styles.textSecondary}`}>{progressInfo.completedCredits}/{progressInfo.totalCredits} credits</span>
                  </div>
                  <div className={`w-full bg-amber-200/50 rounded-full h-4`}>
                    <div
                      className={`bg-gradient-to-r ${styles.accent} h-4 rounded-full transition-all duration-1000`}
                      style={{ width: `${progressInfo.overallProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span className={`${styles.textSecondary}`}>{progressInfo.overallProgress}% Complete</span>
                    <span className={`${styles.textSecondary}`}>{progressInfo.remainingCredits} Credits Remaining</span>
                  </div>
                </div>
                <div className={`flex justify-between px-2 py-1 ${styles.card.background} rounded-lg border ${styles.border} text-sm`}>
                  <span className="text-gray-800 font-medium">Estimated Graduation:</span>
                  <span className={`${styles.textSecondary}`}>{progressInfo.estimatedGraduation}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-amber-200/50 pb-2">Degree Requirements</h3>
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${styles.accentSecondary} p-4 border ${styles.border} hover:${styles.card.hover} transition-all duration-300 group/item`}>
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
              <div className="relative z-10 space-y-4">
                {[
                  { label: 'Core Requirements', data: requirementsInfo.core },
                  { label: 'Elective Requirements', data: requirementsInfo.elective },
                  { label: 'General Education Requirements', data: requirementsInfo.general },
                ].map((req, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="text-gray-800 font-medium">{req.label}:</span>
                      <span className={`${styles.textSecondary}`}>{req.data.completed}/{req.data.total} credits</span>
                    </div>
                    <div className={`w-full bg-amber-200/50 rounded-full h-4`}>
                      <div
                        className={`bg-gradient-to-r ${styles.accent} h-4 rounded-full transition-all duration-1000`}
                        style={{ width: `${req.data.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right mt-1 text-sm">
                      <span className={`${styles.textSecondary}`}>{req.data.percentage}% Complete</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
            <button className={`group/btn ${styles.card.background} border ${styles.button.outline} py-2 px-4 rounded-full transition-all duration-300 shadow-sm hover:${styles.card.hover} transform hover:scale-105`}>
              <span className="flex items-center space-x-2">
                <span>View Detailed Requirements</span>
                <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform duration-300" size={12} />
              </span>
            </button>
            <button className={`group/btn bg-gradient-to-r ${styles.accent} hover:${styles.button.primary} text-white py-2 px-4 rounded-full transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105`}>
              <span className="flex items-center space-x-2">
                <span>Download Degree Audit</span>
                <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform duration-300" size={12} />
              </span>
            </button>
            <button className={`group/btn bg-gradient-to-r ${styles.accent} hover:${styles.button.primary} text-white py-2 px-4 rounded-full transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105`}>
              <span className="flex items-center space-x-2">
                <span>Meet with Advisor</span>
                <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform duration-300" size={12} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}