import { useEffect } from 'react';
import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import { usePreferences } from '../../../../application/context/PreferencesContext';

interface SpecialDate {
  type: 'exam' | 'deadline' | 'event';
}

interface CalendarProps {
  calendarDays: number[];
  specialDates: Record<number, SpecialDate>;
}

interface LegendProps {
  color: string;
  label: string;
  styles: any;
}

export default function Calendar({ calendarDays, specialDates }: CalendarProps) {
  const { styles, theme } = usePreferences();

  return (
    <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl ${styles.backgroundSecondary} group hover:shadow-2xl transition-all duration-500`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.backgroundSecondary}`}></div>
      <div className={`absolute inset-0 bg-gradient-to-r ${styles.orb.secondary} group-hover:opacity-40 transition-all duration-500`}></div>
      <div className={`absolute -bottom-8 sm:-bottom-16 -right-8 sm:-right-16 w-32 h-32 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br ${styles.orb.primary} blur-2xl sm:blur-3xl animate-pulse`}></div>
      <div className={`absolute -top-4 sm:-top-8 -left-4 sm:-left-8 w-16 h-16 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br ${styles.orb.secondary} blur-xl sm:blur-2xl animate-pulse delay-700`}></div>
      <div className={`absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-16 sm:h-16 ${styles.pattern.primary} rounded-full rotate-45 group-hover:rotate-90 transition-transform duration-700`}></div>
      <div className={`absolute bottom-4 sm:bottom-8 left-4 sm:left-8 w-4 h-4 sm:w-8 sm:h-8 bg-gradient-to-br ${styles.pattern.secondary} rounded-lg rotate-12 group-hover:rotate-45 transition-transform duration-500`}></div>
      <div className="relative z-10 p-4 sm:p-5 md:p-7">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${styles.accent} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                <FaCalendarAlt size={16} className="sm:w-5 sm:h-5 text-white relative z-10" />
              </div>
              <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-xl sm:rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
            <div>
              <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${theme == 'dark' ? 'text-white' : 'text-gray-800'} bg-clip-text`}>
                Calendar
              </h2>
              <div className={`h-0.5 sm:h-1 w-12 sm:w-16 bg-gradient-to-r ${styles.accent} rounded-full mt-1 group-hover:w-16 sm:group-hover:w-24 transition-all duration-300`}></div>
            </div>
          </div>
          <div
            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${styles.button.secondary} border ${styles.borderSecondary}`}
          >
            May 2025
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-3 sm:mb-4">
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
                className={`group/day relative py-1.5 sm:py-2 rounded-lg ${bgClass} cursor-pointer transition-all duration-300 border ${borderClass} shadow-sm hover:shadow-md transform hover:scale-105 ${
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
                <span className={`text-xs sm:text-sm ${textClass} ${isToday ? 'font-bold' : ''} relative z-10`}>{day}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3 text-xs">
          <Legend color={styles.status.error} label="Exam" styles={styles} />
          <Legend color={styles.status.warning} label="Deadline" styles={styles} />
          <Legend color={styles.status.info} label="Event" styles={styles} />
        </div>
        <button className={`group/btn w-full mt-4 sm:mt-6 px-4 sm:px-6 py-3 sm:py-4 ${styles.button.primary} rounded-xl sm:rounded-2xl text-sm sm:text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-md ${styles.border}`}>
          <span className="flex items-center justify-center space-x-2">
            <span>View Full Calendar</span>
            <FaArrowRight
              className="group-hover/btn:translate-x-1 transition-transform duration-300"
              size={12}
            />
          </span>
        </button>
      </div>
    </div>
  );
}

function Legend({ color, label, styles }: LegendProps) {
  return (
    <div className={`flex items-center ${styles.card.background} px-2 py-1 rounded-md ${styles.card.border} hover:bg-white/90 transition-all duration-300 backdrop-blur-md`}>
      <span
        className={`w-2 h-2 sm:w-3 sm:h-3 inline-block bg-opacity-10 rounded-full mr-1 border border-opacity-20`}
        style={{ backgroundColor: color.replace('text-', 'bg-') + '/10', borderColor: color.replace('text-', 'bg-') + '/20' }}
      ></span>
      <span className={`text-xs font-medium ${styles.textSecondary}`}>{label}</span>
    </div>
  );
}