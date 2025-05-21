export default function WelcomeBanner() {
    return (
      <div className="relative z-0 bg-gradient-to-r from-amber-100 to-orange-100 border-b border-amber-200">
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome back, John!</h2>
              <p className="text-gray-600 mt-1">Let's continue your academic journey</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <div className="bg-white/70 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm">
                <p className="text-xs text-gray-500">Semester</p>
                <p className="font-semibold text-gray-800">Spring 2025</p>
              </div>
              <div className="bg-white/70 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm">
                <p className="text-xs text-gray-500">GPA</p>
                <p className="font-semibold text-gray-800">3.7</p>
              </div>
              <div className="bg-white/70 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm">
                <p className="text-sm text-gray-500">Credits</p>
                <p className="font-semibold text-gray-800">85/120</p>
              </div>
              <div className="bg-white/70 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm">
                <p className="text-xs text-gray-700">Status</p>
                <p className="font-semibold text-sm text-gray-600">Confirmed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }