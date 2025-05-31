import { FaBell, FaArrowRight } from 'react-icons/fa';

export default function Announcements({ announcements }) {
  return (
    <div className="relative overflow-hidden rounded-3xl shadow-xl bg-gradient-to-br from-amber-50 via-orange-50 to-white group hover:shadow-2xl transition-all duration-500">
      {/* Enhanced background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/80 to-white/90"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100/20 to-amber-100/20 group-hover:from-orange-100/40 group-hover:to-amber-100/40 transition-all duration-500"></div>
      
      {/* Floating animated orbs */}
      <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-300/30 blur-3xl animate-pulse"></div>
      <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-gradient-to-br from-amber-200/20 to-orange-200/20 blur-2xl animate-pulse delay-700"></div>
      
      {/* Geometric patterns */}
      <div className="absolute top-4 right-4 w-16 h-16 border-2 border-orange-200/30 rounded-full rotate-45 group-hover:rotate-90 transition-transform duration-700"></div>
      <div className="absolute bottom-8 left-8 w-8 h-8 bg-gradient-to-br from-amber-300/20 to-orange-300/20 rounded-lg rotate-12 group-hover:rotate-45 transition-transform duration-500"></div>
      
      <div className="relative z-10 p-7">
        {/* Enhanced header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
              <FaBell size={20} className="text-white relative z-10" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-orange-400/30 to-amber-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
              Important Announcements
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mt-1 group-hover:w-24 transition-all duration-300"></div>
          </div>
        </div>

        {/* Enhanced announcement items */}
        <div className="space-y-4">
          {announcements.map((item, index) => (
            <div 
              key={index} 
              className="group/item relative overflow-hidden bg-white/70 backdrop-blur-md rounded-2xl p-5 hover:bg-white/90 transition-all duration-300 border border-amber-100/50 hover:border-orange-200/50 shadow-sm hover:shadow-lg transform hover:scale-[1.02]"
            >
              {/* Item background glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover/item:from-orange-200/20 group-hover/item:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
              
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-2 h-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full animate-pulse"></div>
                    <h3 className="font-semibold text-gray-800 group-hover/item:text-gray-900 transition-colors duration-200">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 ml-5 flex items-center space-x-2">
                    <span>📅</span>
                    <span className="font-medium">{item.date}</span>
                  </p>
                </div>
                <FaArrowRight className="text-orange-400 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all duration-300" size={14} />
              </div>
            </div>
          ))}
          
          {/* Enhanced view all button */}
          <button className="group/btn w-full mt-6 px-6 py-4 bg-gradient-to-r from-orange-500/80 to-amber-500/80 hover:from-orange-500 hover:to-amber-500 text-white rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-md border border-white/20">
            <span className="flex items-center justify-center space-x-2">
              <span>View all announcements</span>
              <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform duration-300" size={14} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}