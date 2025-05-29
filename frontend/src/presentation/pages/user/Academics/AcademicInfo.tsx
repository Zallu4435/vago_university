export default function AcademicInfo({ major = "Computer Science", academicStanding = "Good", advisor = "Dr. Emma Wilson" }) {
  return (
      <div className="relative z-0 bg-gradient-to-r from-amber-100 to-orange-100 border-b border-amber-200">
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">Academic Information</h2>
            <p className="text-gray-600 mt-1">
              Current Major: {major} | Academic Standing: {academicStanding} | Advisor: {advisor}
            </p>
          </div>
        </div>
      </div>
    );
  }