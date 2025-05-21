import { FaCalendarAlt } from 'react-icons/fa';

export default function Deadlines({ deadlines }) {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-md bg-gradient-to-br from-amber-50 to-white">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-white opacity-95"></div>
      <div className="absolute inset-0 bg-yellow-100 opacity-10 group-hover:opacity-20 transition-opacity"></div>
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-yellow-300 opacity-30 blur-2xl"></div>
      <div className="relative z-10 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <FaCalendarAlt size={20} className="text-orange-500" />
          <h2 className="text-xl font-bold text-gray-800">Upcoming Deadlines</h2>
        </div>
        <div className="space-y-4">
          {deadlines.map((item, index) => (
            <div key={index} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 hover:from-amber-100 hover:to-orange-100 transition-all border border-amber-200">
              <h3 className="font-medium text-gray-800">{item.title}</h3>
              <p className={`text-sm ${item.urgent ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                {item.urgent && '⚠️ '}{item.date}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}