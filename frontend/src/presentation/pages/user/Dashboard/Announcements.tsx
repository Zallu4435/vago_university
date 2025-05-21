import { FaBell } from 'react-icons/fa';

export default function Announcements({ announcements }) {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-md bg-gradient-to-br from-amber-50 to-white">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-white opacity-95"></div>
      <div className="absolute inset-0 bg-yellow-100 opacity-10 group-hover:opacity-20 transition-opacity"></div>
      <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-yellow-300 opacity-30 blur-2xl"></div>
      <div className="relative z-10 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <FaBell size={20} className="text-orange-500" />
          <h2 className="text-xl font-bold text-gray-800">Important Announcements</h2>
        </div>
        <div className="space-y-4">
          {announcements.map((item, index) => (
            <div key={index} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 hover:from-amber-100 hover:to-orange-100 transition-all border border-amber-200">
              <h3 className="font-medium text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.date}</p>
            </div>
          ))}
          <button className="text-gray-700 hover:text-gray-900">
            View all announcements
          </button>
        </div>
      </div>
    </div>
  );
}