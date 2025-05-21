import { FaThLarge, FaMapMarkerAlt } from 'react-icons/fa';

export default function ScheduledClasses({ classes }) {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-md bg-gradient-to-br from-amber-50 to-white">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-white opacity-95"></div>
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-yellow-200 opacity-30 blur-2xl"></div>
      <div className="relative z-10 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <FaThLarge size={20} className="text-orange-500" />
          <h2 className="text-xl font-bold text-gray-800">Scheduled Classes</h2>
        </div>
        <div className="space-y-4">
          {classes.map((cls, index) => (
            <div key={index} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 hover:from-amber-100 hover:to-orange-100 transition-all border border-amber-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800">{cls.code}: {cls.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <span className="mr-2">{cls.time}</span>
                    <FaMapMarkerAlt size={14} className="inline mr-1 text-orange-500" />
                    <span>{cls.room}</span>
                  </p>
                </div>
                <div>
                  <span className={`text-xs px-3 py-1 rounded-full ${cls.status === 'Live' 
                    ? 'bg-red-6696 text-red-600 border border-red-200' 
                    : 'bg-green-100 text-green-600 border border-green-200'}`}>
                    {cls.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}