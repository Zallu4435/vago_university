import { useEffect } from 'react';
import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import { usePreferences } from '../../../context/PreferencesContext';

export default function Calendar({ calendarDays, specialDates }) {
  const { styles, theme } = usePreferences();

  useEffect(() => {
    console.log('Calendar theme styles:', styles);
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${styles.accent} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                <FaCalendarAlt size={20} className="text-white relative z-10" />
              </div>
              <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${theme == 'dark' ? 'text-white' : 'text-gray-800'} bg-clip-text`}>
                Calendar
              </h2>
              <div className={`h-1 w-16 bg-gradient-to-r ${styles.accent} rounded-full mt-1 group-hover:w-24 transition-all duration-300`}></div>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${styles.button.secondary} border ${styles.borderSecondary}`}
          >
            May 2025
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-4">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div
              key={day}
              className={`py-1 font-medium ${styles.textSecondary} ${styles.card.background} ${styles.card.border} rounded-md backdrop-blur-md`}
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarDays.map((day) => {
            const special = specialDates[day];
            let bgClass = `${styles.card.background} ${styles.card.hover}`;
            let textClass = styles.textPrimary;
            let borderClass = styles.card.border;

            if (special) {
              if (special.type === 'exam') {
                bgClass = `${styles.status.error}/10 hover:${styles.status.error}/20`;
                textClass = styles.status.error;
                borderClass = `border-${styles.status.error.replace('text-', '')}/20`;
              } else if (special.type === 'deadline') {
                bgClass = `${styles.status.warning}/10 hover:${styles.status.warning}/20`;
                textClass = styles.status.warning;
                borderClass = `border-${styles.status.warning.replace('text-', '')}/20`;
              } else if (special.type === 'event') {
                bgClass = `${styles.status.info}/10 hover:${styles.status.info}/20`;
                textClass = styles.status.info;
                borderClass = `border-${styles.status.info.replace('text-', '')}/20`;
              }
            }

            const isToday = day === 31;

            return (
              <div
                key={day}
                className={`group/day relative py-2 rounded-lg ${bgClass} cursor-pointer transition-all duration-300 border ${borderClass} shadow-sm hover:shadow-md transform hover:scale-105 ${
                  isToday ? `ring-2 ring-${styles.icon.primary.replace('text-', '')}` : ''
                }`}
              >
                <div
                  className={`absolute -inset-0.5 rounded-lg blur transition-all duration-300 ${
                    special
                      ? `bg-gradient-to-r ${
                          special.type === 'exam'
                            ? `${styles.status.error}/10 group-hover/day:${styles.status.error}/20`
                            : special.type === 'deadline'
                            ? `${styles.status.warning}/10 group-hover/day:${styles.status.warning}/20`
                            : `${styles.status.info}/10 group-hover/day:${styles.status.info}/20`
                        }`
                      : `bg-gradient-to-r ${styles.orb.secondary} group-hover/day:opacity-20`
                  }`}
                ></div>
                <span className={`${textClass} ${isToday ? 'font-bold' : ''} relative z-10`}>{day}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-xs">
          <Legend color={styles.status.error} label="Exam" styles={styles} />
          <Legend color={styles.status.warning} label="Deadline" styles={styles} />
          <Legend color={styles.status.info} label="Event" styles={styles} />
        </div>
        <button className={`group/btn w-full mt-6 px-6 py-4 ${styles.button.primary} rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-md ${styles.border}`}>
          <span className="flex items-center justify-center space-x-2">
            <span>View Full Calendar</span>
            <FaArrowRight
              className="group-hover/btn:translate-x-1 transition-transform duration-300"
              size={14}
            />
          </span>
        </button>
      </div>
    </div>
  );
}

function Legend({ color, label, styles }) {
  return (
    <div className={`flex items-center ${styles.card.background} px-2 py-1 rounded-md ${styles.card.border} hover:bg-white/90 transition-all duration-300 backdrop-blur-md`}>
      <span
        className={`w-3 h-3 inline-block bg-opacity-10 rounded-full mr-1 border border-opacity-20`}
        style={{ backgroundColor: color.replace('text-', 'bg-') + '/10', borderColor: color.replace('text-', 'bg-') + '/20' }}
      ></span>
      <span className={`font-medium ${styles.textSecondary}`}>{label}</span>
    </div>
  );
}