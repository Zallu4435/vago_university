import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

export default function Calendar({ calendarDays, specialDates }) {
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                <FaCalendarAlt size={20} className="text-white relative z-10" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-orange-400/30 to-amber-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
                Calendar
              </h2>
              <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mt-1 group-hover:w-24 transition-all duration-300"></div>
            </div>
          </div>
          <div
            className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200"
          >
            May 2025
          </div>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-4">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div
              key={day}
              className="py-1 font-medium text-gray-600 bg-white/70 backdrop-blur-md rounded-md border border-amber-100/50"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarDays.map((day) => {
            const special = specialDates[day];
            let bgClass = 'bg-white/70 hover:bg-white/90';
            let textClass = 'text-gray-700';
            let borderClass = 'border-amber-100/50 hover:border-orange-200/50';

            if (special) {
              if (special.type === 'exam') {
                bgClass = 'bg-red-50/70 hover:bg-red-50/90';
                textClass = 'text-red-600';
                borderClass = 'border-red-200/50 hover:border-red-300/50';
              } else if (special.type === 'deadline') {
                bgClass = 'bg-yellow-50/70 hover:bg-yellow-50/90';
                textClass = 'text-yellow-600';
                borderClass = 'border-yellow-200/50 hover:border-yellow-300/50';
              } else if (special.type === 'event') {
                bgClass = 'bg-blue-50/70 hover:bg-blue-50/90';
                textClass = 'text-blue-600';
                borderClass = 'border-blue-200/50 hover:border-blue-300/50';
              }
            }

            const isToday = day === 31; // Assuming May 31, 2025, is today based on provided date

            return (
              <div
                key={day}
                className={`group/day relative py-2 rounded-lg ${bgClass} cursor-pointer transition-all duration-300 border ${borderClass} shadow-sm hover:shadow-md transform hover:scale-105 ${
                  isToday ? 'ring-2 ring-orange-400' : ''
                }`}
              >
                <div
                  className={`absolute -inset-0.5 rounded-lg blur transition-all duration-300 ${
                    special
                      ? `bg-gradient-to-r ${
                          special.type === 'exam'
                            ? 'from-red-200/0 to-orange-200/0 group-hover/day:from-red-200/20 group-hover/day:to-orange-200/20'
                            : special.type === 'deadline'
                            ? 'from-yellow-200/0 to-amber-200/0 group-hover/day:from-yellow-200/20 group-hover/day:to-amber-200/20'
                            : 'from-blue-200/0 to-amber-200/0 group-hover/day:from-blue-200/20 group-hover/day:to-amber-200/20'
                        }`
                      : 'bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover/day:from-orange-200/20 group-hover/day:to-amber-200/20'
                  }`}
                ></div>
                <span className={`${textClass} ${isToday ? 'font-bold' : ''} relative z-10`}>{day}</span>
              </div>
            );
          })}
        </div>

        {/* Enhanced legend */}
        <div className="mt-6 flex flex-wrap gap-3 text-xs">
          <Legend color="red" label="Exam" />
          <Legend color="yellow" label="Deadline" />
          <Legend color="blue" label="Event" />
        </div>

        {/* View Full Calendar button */}
        <button className="group/btn w-full mt-6 px-6 py-4 bg-gradient-to-r from-orange-500/80 to-amber-500/80 hover:from-orange-500 hover:to-amber-500 text-white rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-md border border-white/20">
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

// Small helper for legend items
function Legend({ color, label }) {
  return (
    <div className="flex items-center bg-white/70 backdrop-blur-md px-2 py-1 rounded-md border border-amber-100/50 hover:bg-white/90 transition-all duration-300">
      <span
        className={`w-3 h-3 inline-block bg-${color}-100 rounded-full mr-1 border border-${color}-200`}
      ></span>
      <span className="text-gray-600 font-medium">{label}</span>
    </div>
  );
}