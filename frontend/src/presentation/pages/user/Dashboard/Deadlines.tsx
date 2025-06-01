import { useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { usePreferences } from '../../../context/PreferencesContext';

export default function Deadlines({ deadlines }) {
  const { styles, theme } = usePreferences();

  useEffect(() => {
    console.log('Deadlines theme styles:', styles);
  }, [styles]);

  return (
    <div className={`relative overflow-hidden rounded-3xl shadow-xl ${styles.backgroundSecondary} group hover:shadow-2xl transition-all duration-500`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.backgroundSecondary}`}></div>
      <div className={`absolute inset-0 bg-gradient-to-l ${styles.orb.secondary} group-hover:opacity-40 transition-all duration-500`}></div>
      <div className={`absolute -top-16 -left-16 w-56 h-56 rounded-full bg-gradient-to-br ${styles.orb.primary} blur-3xl animate-pulse`}></div>
      <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${styles.orb.secondary} blur-2xl animate-pulse delay-500`}></div>
      <div className={`absolute top-6 right-6 w-12 h-12 ${styles.pattern.primary} rounded-lg rotate-12 group-hover:rotate-45 transition-transform duration-700`}></div>
      <div className={`absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-br ${styles.pattern.secondary} rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
      <div className="relative z-10 p-7">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${styles.accent} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
              <FaCalendarAlt size={20} className="text-white relative z-10" />
            </div>
            <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${theme == 'dark' ? 'text-white' : 'text-gray-800'} bg-clip-text`}>
              Upcoming Deadlines
            </h2>
            <div className={`h-1 w-16 bg-gradient-to-r ${styles.accent} rounded-full mt-1 group-hover:w-24 transition-all duration-300`}></div>
          </div>
        </div>
        <div className="space-y-4">
          {deadlines.map((item, index) => (
            <div 
              key={index} 
              className={`group/item relative overflow-hidden backdrop-blur-md rounded-2xl p-5 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-[1.02] ${
                item.urgent 
                  ? `${styles.status.error}/10 hover:${styles.status.error}/20 border-${styles.status.error.replace('text-', '')}/20`
                  : `${styles.card.background} ${styles.card.border} ${styles.card.hover}`
              }`}
            >
              <div className={`absolute -inset-0.5 rounded-2xl blur transition-all duration-300 ${
                item.urgent 
                  ? `bg-gradient-to-r ${styles.status.error}/10 group-hover/item:${styles.status.error}/20`
                  : `bg-gradient-to-r ${styles.orb.secondary} group-hover/item:opacity-20`
              }`}></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {item.urgent && (
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-opacity-10 border-2" style={{ backgroundColor: styles.status.error.replace('text-', 'bg-') + '/10', borderColor: styles.status.error.replace('text-', 'bg-') + '/20' }}>
                        <FaExclamationTriangle className={`${styles.status.error}`} size={14} />
                      </div>
                    )}
                    <div className={`w-3 h-3 rounded-full ${item.urgent ? `${styles.status.error} animate-pulse` : `bg-gradient-to-br ${styles.accent}`}`}></div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.urgent 
                      ? `bg-opacity-10 text-${styles.status.error.replace('text-', '')} border border-opacity-20`
                      : `${styles.button.secondary} border ${styles.borderSecondary}`
                  }`} style={item.urgent ? { backgroundColor: styles.status.error.replace('text-', 'bg-') + '/10', borderColor: styles.status.error.replace('text-', 'bg-') + '/20' } : {}}>
                    {item.urgent ? 'Urgent' : 'Scheduled'}
                  </div>
                </div>
                <h3 className={`font-semibold ${styles.textPrimary} group-hover/item:text-gray-900 transition-colors duration-200 mb-2`}>
                  {item.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <FaClock className={`${item.urgent ? styles.status.error : styles.icon.secondary}`} size={12} />
                  <p className={`text-sm font-medium ${item.urgent ? styles.status.error : styles.textSecondary}`}>
                    {item.urgent && '⚠️ '}{item.date}
                  </p>
                </div>
                <div className="mt-3">
                  <div className={`h-1.5 ${styles.progress.background} rounded-full overflow-hidden`}>
                    <div 
                      className={`h-full ${styles.progress.fill} rounded-full transition-all duration-1000 ${
                        item.urgent ? 'w-5/6' : 'w-1/2'
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