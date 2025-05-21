import { FaComments } from 'react-icons/fa';

export default function OnlineSessionTopics({ onlineTopics, handleVote }) {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-md bg-gradient-to-br from-amber-50 to-white">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-white opacity-95"></div>
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-yellow-200 opacity-30 blur-2xl"></div>
      <div className="relative z-10 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <FaComments size={20} className="text-orange-500" />
          <h2 className="text-xl font-bold text-gray-800">Online Session Topics</h2>
        </div>
        <div className="space-y-4">
          {onlineTopics.map((topic, index) => (
            <div key={index} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 hover:from-amber-100 hover:to-orange-100 transition-all border border-amber-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800">{topic.title}</h3>
                  <div className="flex items-center mt-1">
                    <div className="bg-gray-200 h-1.5 rounded-full w-24 mr-2">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-1.5 rounded-full" style={{ width: `${(topic.votes / 30) * 100}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500">{topic.votes} votes</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleVote(index)}
                  className={`px-3 py-1 rounded-md text-sm ${topic.voted 
                    ? 'bg-green-100 text-green-600 border border-green-200' 
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm'}`}
                >
                  {topic.voted ? 'Voted' : 'Vote'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}