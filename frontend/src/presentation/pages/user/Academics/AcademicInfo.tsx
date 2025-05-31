import { FaGraduationCap } from 'react-icons/fa';

export default function AcademicInfo({ major = 'Computer Science', academicStanding = 'Good', advisor = 'Dr. Emma Wilson' }) {
  return (
    <div className="relative overflow-hidden border-b border-amber-200/50">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/80 to-white/90 backdrop-blur-md"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100/20 to-amber-100/20"></div>
      <div className="absolute -top-8 -left-8 w-48 h-48 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-300/30 blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-amber-200/20 to-orange-200/20 blur-2xl animate-pulse delay-700"></div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="group relative overflow-hidden rounded-2xl shadow-xl bg-white/70 backdrop-blur-md hover:bg-white/90 transition-all duration-300 border border-amber-100/50 hover:border-orange-200/50 hover:shadow-2xl">
          {/* Background glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 group-hover:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>

          <div className="relative z-10 p-6">
            {/* Enhanced header */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                  <FaGraduationCap size={20} className="text-white relative z-10" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-orange-400/30 to-amber-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
                  Academic Information
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mt-1 group-hover:w-24 transition-all duration-300"></div>
              </div>
            </div>

            {/* Content */}
            <p className="text-gray-600 text-sm">
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
