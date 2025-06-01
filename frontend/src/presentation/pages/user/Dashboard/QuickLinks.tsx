import { useEffect } from 'react';
import { FaBookmark, FaBookOpen, FaCalendarAlt, FaDollarSign, FaThLarge, FaArrowRight } from 'react-icons/fa';
import { usePreferences } from '../../../context/PreferencesContext';

export default function QuickLinks() {
  const { styles, theme } = usePreferences();

  useEffect(() => {
    console.log('QuickLinks theme styles:', styles);
  }, [styles]);

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
    <div className={`relative overflow-hidden rounded-3xl shadow-xl ${styles.backgroundSecondary} group hover:shadow-2xl transition-all duration-500`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.backgroundSecondary}`}></div>
      <div className={`absolute inset-0 bg-gradient-to-t ${styles.orb.secondary} group-hover:opacity-40 transition-all duration-500`}></div>
      <div className={`absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-br ${styles.orb.primary} blur-3xl animate-pulse`}></div>
      <div className={`absolute -top-8 -left-8 w-32 h-32 rounded-full bg-gradient-to-br ${styles.orb.secondary} blur-2xl animate-pulse delay-1000`}></div>
      <div className={`absolute top-4 right-4 w-20 h-20 ${styles.pattern.primary} rounded-2xl rotate-12 group-hover:rotate-45 transition-transform duration-700`}></div>
      <div className={`absolute bottom-6 left-6 w-8 h-8 bg-gradient-to-br ${styles.pattern.secondary} rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
      <div className="relative z-10 p-7">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${styles.accent} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
              <FaBookmark size={20} className="text-white relative z-10" />
            </div>
            <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${theme == 'dark' ? 'text-white' : 'text-gray-800'} bg-clip-text`}>
              Quick Links
            </h2>
            <div className={`h-1 w-16 bg-gradient-to-r ${styles.accent} rounded-full mt-1 group-hover:w-24 transition-all duration-300`}></div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {links.map((link, index) => (
            <button 
              key={index} 
              className={`group/link relative overflow-hidden ${styles.card.background} ${styles.card.border} ${styles.card.hover} rounded-2xl p-5 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-[1.02] backdrop-blur-md`}
            >
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${link.bgColor} opacity-0 group-hover/link:opacity-20 rounded-2xl blur transition-all duration-300`}></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center shadow-md group-hover/link:shadow-lg transition-all duration-300 group-hover/link:scale-110`}>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent"></div>
                      <span className="text-white relative z-10">{link.icon}</span>
                    </div>
                    <div className={`absolute -inset-1 bg-gradient-to-br ${link.color} opacity-30 rounded-xl blur group-hover/link:opacity-50 transition-opacity duration-300`}></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`${styles.icon.secondary} text-2xl`}>{link.emoji}</span>
                    <span className={`font-semibold ${styles.textPrimary} group-hover/link:text-gray-900 transition-colors duration-200`}>
                      {link.text}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full ${styles.button.secondary} flex items-center justify-center transition-all duration-300`}>
                    <FaArrowRight 
                      className={`${styles.icon.primary} group-hover/link:translate-x-0.5 transition-all duration-300`} 
                      size={12} 
                    />
                  </div>
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${styles.accent} group-hover/link:w-full transition-all duration-300 rounded-full`}></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}