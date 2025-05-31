import { FaCalendarAlt, FaClock, FaExclamationTriangle } from 'react-icons/fa';

export default function Deadlines({ deadlines }) {
  return (
    <div className="relative overflow-hidden rounded-3xl shadow-xl bg-gradient-to-br from-amber-50 via-orange-50 to-white group hover:shadow-2xl transition-all duration-500">
      {/* Enhanced background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/80 to-white/90"></div>
      <div className="absolute inset-0 bg-gradient-to-l from-red-50/20 to-amber-50/20 group-hover:from-red-50/40 group-hover:to-amber-50/40 transition-all duration-500"></div>
      
      {/* Floating animated orbs */}
      <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-gradient-to-br from-yellow-300/30 to-red-300/20 blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-amber-200/20 to-orange-200/20 blur-2xl animate-pulse delay-500"></div>
      
      {/* Geometric patterns */}
      <div className="absolute top-6 right-6 w-12 h-12 border-2 border-red-200/30 rounded-lg rotate-12 group-hover:rotate-45 transition-transform duration-700"></div>
      <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-br from-amber-300/30 to-red-300/30 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
      
      <div className="relative z-10 p-7">
        {/* Enhanced header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
              <FaCalendarAlt size={20} className="text-white relative z-10" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-red-400/30 to-orange-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
              Upcoming Deadlines
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-red-400 to-orange-500 rounded-full mt-1 group-hover:w-24 transition-all duration-300"></div>
          </div>
        </div>

        {/* Enhanced deadline items */}
        <div className="space-y-4">
          {deadlines.map((item, index) => (
            <div 
              key={index} 
              className={`group/item relative overflow-hidden backdrop-blur-md rounded-2xl p-5 transition-all duration-300 border shadow-sm hover:shadow-lg transform hover:scale-[1.02] ${
                item.urgent 
                  ? 'bg-red-50/80 hover:bg-red-50 border-red-200/50 hover:border-red-300/50' 
                  : 'bg-white/70 hover:bg-white/90 border-amber-100/50 hover:border-orange-200/50'
              }`}
            >
              {/* Item background glow */}
              <div className={`absolute -inset-0.5 rounded-2xl blur transition-all duration-300 ${
                item.urgent 
                  ? 'bg-gradient-to-r from-red-200/0 to-orange-200/0 group-hover/item:from-red-200/30 group-hover/item:to-orange-200/30'
                  : 'bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover/item:from-orange-200/20 group-hover/item:to-amber-200/20'
              }`}></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {item.urgent && (
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 border-2 border-red-200 animate-pulse">
                        <FaExclamationTriangle className="text-red-500" size={14} />
                      </div>
                    )}
                    <div className={`w-3 h-3 rounded-full ${item.urgent ? 'bg-red-400 animate-pulse' : 'bg-gradient-to-br from-orange-400 to-amber-500'}`}></div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.urgent 
                      ? 'bg-red-100 text-red-700 border border-red-200' 
                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}>
                    {item.urgent ? 'Urgent' : 'Scheduled'}
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-800 group-hover/item:text-gray-900 transition-colors duration-200 mb-2">
                  {item.title}
                </h3>
                
                <div className="flex items-center space-x-2">
                  <FaClock className={`${item.urgent ? 'text-red-500' : 'text-orange-500'}`} size={12} />
                  <p className={`text-sm font-medium ${
                    item.urgent ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {item.urgent && '⚠️ '}{item.date}
                  </p>
                </div>
                
                {/* Progress bar for urgency */}
                <div className="mt-3">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        item.urgent 
                          ? 'bg-gradient-to-r from-red-400 to-orange-500 w-5/6' 
                          : 'bg-gradient-to-r from-orange-400 to-amber-500 w-1/2'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}