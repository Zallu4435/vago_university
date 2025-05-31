import { FaChartLine, FaArrowRight } from 'react-icons/fa';

export default function DegreeAudit({ studentInfo, programInfo, progressInfo, requirementsInfo }) {
  return (
    <div className="container mx-auto px-4 mt-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-t-2xl shadow-xl bg-gradient-to-r from-orange-600 to-amber-500 group">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-600/30"></div>
        <div className="absolute -top-8 -left-8 w-48 h-48 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-300/30 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-amber-200/20 to-orange-200/20 blur-2xl animate-pulse delay-700"></div>
        <div className="relative z-10 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                  <FaChartLine size={20} className="text-white relative z-10" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-orange-400/30 to-amber-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  Degree Audit
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mt-1 group-hover:w-24 transition-all duration-300"></div>
              </div>
            </div>
            <span className="text-white font-medium bg-amber-500/80 px-3 py-1 rounded-full border border-amber-200/50">Fall 2025</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative overflow-hidden rounded-b-2xl shadow-xl bg-white/70 backdrop-blur-md border border-amber-100/50 group hover:shadow-2xl transition-all duration-500">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 group-hover:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
        <div className="relative z-10 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-amber-200/50 pb-2">Program Information</h3>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-4 border border-amber-200/50 hover:border-orange-200/50 hover:shadow-lg transition-all duration-300 group/item">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover/item:from-orange-200/20 group-hover/item:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:justify-between text-sm">
                <div className="text-gray-600">
                  <span className="font-medium text-gray-800">Degree:</span> {programInfo.degree}
                </div>
                <div className="text-gray-600 mt-2 md:mt-0">
                  <span className="font-medium text-gray-800">Catalog Year:</span> {programInfo.catalogYear}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-amber-200/50 pb-2">Progress Summary</h3>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-4 border border-amber-200/50 hover:border-orange-200/50 hover:shadow-lg transition-all duration-300 group/item">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover/item:from-orange-200/20 group-hover/item:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="mb-4">
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-gray-800 font-medium">Overall Degree Progress:</span>
                    <span className="text-gray-600">{progressInfo.completedCredits}/{progressInfo.totalCredits} credits</span>
                  </div>
                  <div className="w-full bg-amber-200/50 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-4 rounded-full transition-all duration-1000"
                      style={{ width: `${progressInfo.overallProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span className="text-gray-600">{progressInfo.overallProgress}% Complete</span>
                    <span className="text-gray-600">{progressInfo.remainingCredits} Credits Remaining</span>
                  </div>
                </div>
                <div className="flex justify-between px-2 py-1 bg-white/70 backdrop-blur-md rounded-lg border border-amber-100/50 text-sm">
                  <span className="text-gray-800 font-medium">Estimated Graduation:</span>
                  <span className="text-gray-600">{progressInfo.estimatedGraduation}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-amber-200/50 pb-2">Degree Requirements</h3>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-4 border border-amber-200/50 hover:border-orange-200/50 hover:shadow-lg transition-all duration-300 group/item">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover/item:from-orange-200/20 group-hover/item:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
              <div className="relative z-10 space-y-4">
                {[
                  { label: 'Core Requirements', data: requirementsInfo.core },
                  { label: 'Elective Requirements', data: requirementsInfo.elective },
                  { label: 'General Education Requirements', data: requirementsInfo.general },
                ].map((req, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="text-gray-800 font-medium">{req.label}:</span>
                      <span className="text-gray-600">{req.data.completed}/{req.data.total} credits</span>
                    </div>
                    <div className="w-full bg-amber-200/50 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-4 rounded-full transition-all duration-1000"
                        style={{ width: `${req.data.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right mt-1 text-sm">
                      <span className="text-gray-600">{req.data.percentage}% Complete</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
            <button className="group/btn bg-white/70 backdrop-blur-md border border-orange-500 text-orange-500 hover:bg-orange-50 py-2 px-4 rounded-full transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105">
              <span className="flex items-center space-x-2">
                <span>View Detailed Requirements</span>
                <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform duration-300" size={12} />
              </span>
            </button>
            <button className="group/btn bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded-full transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105">
              <span className="flex items-center space-x-2">
                <span>Download Degree Audit</span>
                <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform duration-300" size={12} />
              </span>
            </button>
            <button className="group/btn bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded-full transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105">
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
