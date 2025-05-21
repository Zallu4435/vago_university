import { FaBookmark, FaBookOpen, FaCalendarAlt, FaDollarSign, FaThLarge } from 'react-icons/fa';

export default function QuickLinks() {
  const links = [
    { icon: <FaBookOpen size={18} />, text: 'Course Registration' },
    { icon: <FaCalendarAlt size={18} />, text: 'Timetable' },
    { icon: <FaDollarSign size={18} />, text: 'Fee Payment' },
    { icon: <FaThLarge size={18} />, text: 'Learning Portal' }
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-md bg-gradient-to-br from-amber-50 to-white">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-white opacity-95"></div>
      <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-yellow-300 opacity-30 blur-2xl"></div>
      <div className="relative z-10 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <FaBookmark size={20} className="text-orange-500" />
          <h2 className="text-xl font-bold text-gray-800">Quick Links</h2>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {links.map((link, index) => (
            <button 
              key={index} 
              className="flex items-center p-3 bg-gradient-to-r from-amber-200 to-orange-200 hover:from-amber-300 hover:to-orange-300 rounded-xl transition-all"
            >
              <span className="bg-white rounded-full p-2 mr-3 shadow-sm">
                <span className="text-orange-500">{link.icon}</span>
              </span>
              <span className="text-gray-800 font-medium">{link.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}