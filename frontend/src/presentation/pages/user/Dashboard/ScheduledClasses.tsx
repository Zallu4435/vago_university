import { useEffect } from 'react';
import { FaThLarge, FaMapMarkerAlt } from 'react-icons/fa';
import { usePreferences } from '../../../context/PreferencesContext';

export default function ScheduledClasses({ classes }) {
  const { styles, theme } = usePreferences();

  useEffect(() => {
    console.log('ScheduledClasses theme styles:', styles);
  }, [styles]);

  return (
    <div className={`relative overflow-hidden rounded-3xl shadow-xl ${styles.backgroundSecondary} group hover:shadow-2xl transition-all duration-500`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.backgroundSecondary}`}></div>
      <div className={`absolute inset-0 bg-gradient-to-r ${styles.orb.secondary} group-hover:opacity-40 transition-all duration-500`}></div>
      <div className={`absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-br ${styles.orb.primary} blur-3xl animate-pulse`}></div>
      <div className={`absolute -top-8 -left-8 w-32 h-32 rounded-full bg-gradient-to-br ${styles.orb.secondary} blur-2xl animate-pulse delay-700`}></div>
      <div className={`absolute top-4 right-4 w-16 h-16 ${styles.pattern.primary} rounded-full rotate-45 group-hover:rotate-90 transition-transform duration-700`}></div>
      <div className={`absolute bottom-8 left-8 w-8 h-8 bg-gradient-to-br ${styles.pattern.secondary} rounded-lg rotate-12 group-hover:rotate-45 transition-transform duration-500`}></div>
      <div className="relative z-10 p-7">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${styles.accent} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
              <FaThLarge size={20} className="text-white relative z-10" />
            </div>
            <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${theme == 'dark' ? 'text-white' : 'text-gray-800'} bg-clip-text`}>
              Scheduled Classes
            </h2>
            <div className={`h-1 w-16 bg-gradient-to-r ${styles.accent} rounded-full mt-1 group-hover:w-24 transition-all duration-300`}></div>
          </div>
        </div>
        <div className="space-y-4">
          {classes.map((cls, index) => (
            <div
              key={index}
              className={`group/item relative overflow-hidden ${styles.card.background} ${styles.card.border} ${styles.card.hover} rounded-2xl p-5 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-[1.02] backdrop-blur-md`}
            >
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${
                  cls.status === 'Live'
                    ? `${styles.status.error}/10 group-hover/item:${styles.status.error}/20`
                    : styles.orb.secondary
                } rounded-2xl blur transition-all duration-300 group-hover/item:opacity-20`}
              ></div>
              <div className="relative z-10 flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        cls.status === 'Live' ? `${styles.status.error} animate-pulse` : `bg-gradient-to-br ${styles.accent}`
                      }`}
                    ></div>
                    <h3 className={`font-semibold ${styles.textPrimary} group-hover/item:text-gray-900 transition-colors duration-200`}>
                      {cls.code}: {cls.name}
                    </h3>
                  </div>
                  <p className={`text-sm ${styles.textSecondary} ml-5 flex items-center space-x-2`}>
                    <span className="mr-2">🕒 {cls.time}</span>
                    <FaMapMarkerAlt size={14} className={`${styles.icon.secondary}`} />
                    <span>{cls.room}</span>
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    cls.status === 'Live'
                      ? `bg-opacity-10 text-${styles.status.error.replace('text-', '')} border border-opacity-20`
                      : `${styles.button.secondary} border ${styles.borderSecondary}`
                  }`} style={cls.status === 'Live' ? { backgroundColor: styles.status.error.replace('text-', 'bg-') + '/10', borderColor: styles.status.error.replace('text-', 'bg-') + '/20' } : {}}>
                  {cls.status}
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${styles.accent} group-hover/item:w-full transition-all duration-300 rounded-full`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}