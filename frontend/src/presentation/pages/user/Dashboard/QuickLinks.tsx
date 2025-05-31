import { FaBookmark, FaBookOpen, FaCalendarAlt, FaDollarSign, FaThLarge, FaArrowRight } from 'react-icons/fa';

export default function QuickLinks() {
  const links = [
    { 
      icon: <FaBookOpen size={20} />, 
      text: 'Course Registration',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      emoji: '📚'
    },
    { 
      icon: <FaCalendarAlt size={20} />, 
      text: 'Timetable',
      color: 'from-green-400 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      emoji: '📅'
    },
    { 
      icon: <FaDollarSign size={20} />, 
      text: 'Fee Payment',
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100',
      emoji: '💳'
    },
    { 
      icon: <FaThLarge size={20} />, 
      text: 'Learning Portal',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      emoji: '🎓'
    }
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-xl bg-gradient-to-br from-amber-50 via-orange-50 to-white group hover:shadow-2xl transition-all duration-500">
      {/* Enhanced background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/80 to-white/90"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-orange-100/20 to-amber-100/20 group-hover:from-orange-100/40 group-hover:to-amber-100/40 transition-all duration-500"></div>
      
      {/* Floating animated orbs */}
      <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-300/30 blur-3xl animate-pulse"></div>
      <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-gradient-to-br from-amber-200/20 to-orange-200/20 blur-2xl animate-pulse delay-1000"></div>
      
      {/* Geometric patterns */}
      <div className="absolute top-4 right-4 w-20 h-20 border-2 border-orange-200/20 rounded-2xl rotate-12 group-hover:rotate-45 transition-transform duration-700"></div>
      <div className="absolute bottom-6 left-6 w-8 h-8 bg-gradient-to-br from-amber-300/20 to-orange-300/20 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
      
      <div className="relative z-10 p-7">
        {/* Enhanced header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
              <FaBookmark size={20} className="text-white relative z-10" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-orange-400/30 to-amber-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
              Quick Links
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mt-1 group-hover:w-24 transition-all duration-300"></div>
          </div>
        </div>

        {/* Enhanced quick links */}
        <div className="grid grid-cols-1 gap-4">
          {links.map((link, index) => (
            <button 
              key={index} 
              className="group/link relative overflow-hidden p-5 bg-white/80 backdrop-blur-md hover:bg-white/95 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-[1.02] border border-white/50 hover:border-orange-200/50"
            >
              {/* Background glow effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${link.bgColor} opacity-0 group-hover/link:opacity-20 rounded-2xl blur transition-all duration-300`}></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Enhanced icon container */}
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center shadow-md group-hover/link:shadow-lg transition-all duration-300 group-hover/link:scale-110`}>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent"></div>
                      <span className="text-white relative z-10">{link.icon}</span>
                    </div>
                    <div className={`absolute -inset-1 bg-gradient-to-br ${link.color} opacity-30 rounded-xl blur group-hover/link:opacity-50 transition-opacity duration-300`}></div>
                  </div>
                  
                  {/* Text and emoji */}
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{link.emoji}</span>
                    <span className="text-gray-800 font-semibold group-hover/link:text-gray-900 transition-colors duration-200">
                      {link.text}
                    </span>
                  </div>
                </div>
                
                {/* Arrow icon */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 group-hover/link:bg-orange-200 flex items-center justify-center transition-all duration-300">
                    <FaArrowRight 
                      className="text-orange-500 group-hover/link:text-orange-600 group-hover/link:translate-x-0.5 transition-all duration-300" 
                      size={12} 
                    />
                  </div>
                </div>
              </div>
              
              {/* Hover effect line */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-orange-400 to-amber-500 group-hover/link:w-full transition-all duration-300 rounded-full"></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}