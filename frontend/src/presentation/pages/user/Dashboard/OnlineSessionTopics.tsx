import { FaComments, FaArrowRight } from 'react-icons/fa';

export default function OnlineSessionTopics({ onlineTopics, handleVote }) {
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
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
              <FaComments size={20} className="text-white relative z-10" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-orange-400/30 to-amber-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
              Online Session Topics
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mt-1 group-hover:w-24 transition-all duration-300"></div>
          </div>
        </div>

        {/* Enhanced topic items */}
        <div className="space-y-4">
          {onlineTopics.map((topic, index) => (
            <div
              key={index}
              className="group/item relative overflow-hidden bg-white/70 backdrop-blur-md rounded-2xl p-5 hover:bg-white/90 transition-all duration-300 border border-amber-100/50 hover:border-orange-200/50 shadow-sm hover:shadow-lg transform hover:scale-[1.02]"
            >
              {/* Item background glow */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${
                  topic.voted
                    ? 'from-green-200/0 to-amber-200/0 group-hover/item:from-green-200/20 group-hover/item:to-amber-200/20'
                    : 'from-orange-200/0 to-amber-200/0 group-hover/item:from-orange-200/20 group-hover/item:to-amber-200/20'
                } rounded-2xl blur transition-all duration-300`}
              ></div>

              <div className="relative z-10 flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        topic.voted ? 'bg-green-400 animate-pulse' : 'bg-gradient-to-br from-orange-400 to-amber-500'
                      }`}
                    ></div>
                    <h3 className="font-semibold text-gray-800 group-hover/item:text-gray-900 transition-colors duration-200">
                      {topic.title}
                    </h3>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="bg-gray-200 h-1.5 rounded-full w-24 mr-2">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-1.5 rounded-full transition-all duration-1000"
                        style={{ width: `${(topic.votes / 30) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">🗳️ {topic.votes} votes</p>
                  </div>
                </div>
                <button
                  onClick={() => handleVote(index)}
                  className={`group/btn px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 ${
                    topic.voted
                      ? 'bg-green-100 text-green-600 border border-green-200'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border border-amber-200'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>{topic.voted ? 'Voted' : 'Vote'}</span>
                    {!topic.voted && (
                      <FaArrowRight
                        className="group-hover/btn:translate-x-1 transition-transform duration-300"
                        size={12}
                      />
                    )}
                  </span>
                </button>
              </div>

              {/* Hover effect line */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-orange-400 to-amber-500 group-hover/item:w-full transition-all duration-300 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}