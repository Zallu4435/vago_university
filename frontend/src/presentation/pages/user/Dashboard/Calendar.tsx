import { FaCalendarAlt } from 'react-icons/fa';

export default function Calendar({ calendarDays, specialDates }) {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-md bg-gradient-to-br from-amber-50 to-white">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-white opacity-95"></div>
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-yellow-200 opacity-30 blur-2xl"></div>

      {/* Main content */}
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FaCalendarAlt size={20} className="text-orange-500" />
            <h2 className="text-xl font-bold text-gray-800">Calendar</h2>
          </div>
          <div>
            <span className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">May 2025</span>
          </div>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="py-1 font-medium text-gray-600">{day}</div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarDays.map(day => {
            const special = specialDates[day];
            let bgClass = 'hover:bg-gray-100';
            let textClass = 'text-gray-700';

            if (special) {
              if (special.type === 'exam') {
                bgClass = 'bg-red-50 hover:bg-red-100';
                textClass = 'text-red-600';
              } else if (special.type === 'deadline') {
                bgClass = 'bg-yellow-50 hover:bg-yellow-100';
                textClass = 'text-yellow-600';
              } else if (special.type === 'event') {
                bgClass = 'bg-blue-50 hover:bg-blue-100';
                textClass = 'text-blue-600';
              }
            }

            const isToday = day === 12; // Replace with actual logic if needed

            return (
              <div
                key={day}
                className={`py-2 rounded-lg ${bgClass} cursor-pointer transition-all ${isToday ? 'ring-2 ring-orange-400' : ''}`}
              >
                <span className={`${textClass} ${isToday ? 'font-bold' : ''}`}>{day}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <Legend color="red" label="Exam" />
          <Legend color="yellow" label="Deadline" />
          <Legend color="blue" label="Event" />
        </div>
      </div>
    </div>
  );
}

// Small helper for legend items
function Legend({ color, label }) {
  return (
    <div className="flex items-center bg-white px-2 py-1 rounded-md border border-gray-200">
      <span className={`w-3 h-3 inline-block bg-${color}-100 rounded-full mr-1 border border-${color}-200`}></span>
      <span className="text-gray-600">{label}</span>
    </div>
  );
}
