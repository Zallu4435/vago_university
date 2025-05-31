export default function WelcomeBanner() {
  return (
    <div className="relative z-0 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border-b border-amber-200/50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-8 left-8 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-16 right-16 w-24 h-24 bg-gradient-to-br from-amber-300/15 to-orange-300/15 rounded-full blur-xl animate-pulse delay-700"></div>
        <div className="absolute bottom-8 left-1/3 w-28 h-28 bg-gradient-to-br from-orange-200/25 to-amber-200/25 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-12 right-1/4 w-20 h-20 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
      
      {/* Geometric patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-1/4 w-16 h-16 border-2 border-orange-400 rotate-45 rounded-lg"></div>
        <div className="absolute bottom-8 right-1/3 w-12 h-12 border-2 border-amber-500 rotate-12 rounded-full"></div>
        <div className="absolute top-1/2 right-8 w-8 h-8 bg-orange-300 rotate-45 rounded-sm"></div>
      </div>
      
      {/* Main gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-white/40 backdrop-blur-[2px]"></div>
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
          {/* Enhanced Welcome Text */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full"></div>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent">
                  Welcome back, John!
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mt-1"></div>
              </div>
            </div>
            <p className="text-gray-600 text-lg font-medium ml-5 flex items-center space-x-2">
              <span>Let's continue your academic journey</span>
              <div className="w-2 h-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full animate-pulse"></div>
            </p>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="flex flex-wrap gap-4 lg:gap-6">
            {[
              { label: 'Semester', value: 'Spring 2025', icon: '📚' },
              { label: 'GPA', value: '3.7', icon: '⭐' },
              { label: 'Credits', value: '85/120', icon: '🎯' },
              { label: 'Status', value: 'Confirmed', icon: '✅' }
            ].map((stat, index) => (
              <div key={stat.label} className="group relative">
                {/* Card glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-300/30 to-amber-300/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Main card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl px-5 py-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 group-hover:border-orange-200/50 transform group-hover:scale-105">
                  {/* Card header with icon */}
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                    <span className="text-lg group-hover:scale-110 transition-transform duration-200">{stat.icon}</span>
                  </div>
                  
                  {/* Value with gradient background */}
                  <div className="relative">
                    <p className="text-lg font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-200">
                      {stat.value}
                    </p>
                    
                    {/* Progress bar for GPA and Credits */}
                    {stat.label === 'GPA' && (
                      <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full" style={{ width: '92.5%' }}></div>
                      </div>
                    )}
                    
                    {stat.label === 'Credits' && (
                      <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full" style={{ width: '70.8%' }}></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400/0 to-amber-500/0 group-hover:from-orange-400/5 group-hover:to-amber-500/5 rounded-2xl transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Enhanced bottom section with quick actions */}
        <div className="mt-8 pt-6 border-t border-orange-100/50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium">Last login: Today, 9:30 AM</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-white/70 backdrop-blur-md rounded-xl text-sm font-medium text-gray-700 hover:bg-white/90 hover:text-gray-900 transition-all duration-200 shadow-md hover:shadow-lg border border-white/50">
                Quick Enrollment
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
                View Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}