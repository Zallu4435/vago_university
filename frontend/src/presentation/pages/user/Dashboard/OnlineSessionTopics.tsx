import { useEffect } from 'react';
import { FaComments, FaArrowRight } from 'react-icons/fa';
import { usePreferences } from '../../../../application/context/PreferencesContext';

interface OnlineTopic {
  title: string;
  votes: number;
  voted: boolean;
}

interface OnlineSessionTopicsProps {
  onlineTopics: OnlineTopic[];
  handleVote: (index: number) => void;
}

export default function OnlineSessionTopics({ onlineTopics, handleVote }: OnlineSessionTopicsProps) {
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
        <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
          <div className="relative">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${styles.accent} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
              <FaComments size={16} className="sm:w-5 sm:h-5 text-white relative z-10" />
            </div>
            <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-xl sm:rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
          </div>
          <div>
            <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${theme == 'dark' ? 'text-white' : 'text-gray-800'} bg-clip-text`}>
              Online Session Topics
            </h2>
            <div className={`h-0.5 sm:h-1 w-12 sm:w-16 bg-gradient-to-r ${styles.accent} rounded-full mt-1 group-hover:w-16 sm:group-hover:w-24 transition-all duration-300`}></div>
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {onlineTopics.map((topic: OnlineTopic, index: number) => (
            <div
              key={index}
              className={`group/item relative overflow-hidden ${styles.card.background} ${styles.card.border} ${styles.card.hover} rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-[1.02] backdrop-blur-md`}
            >
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${
                  topic.voted
                    ? `${styles.status.success}/10 group-hover/item:${styles.status.success}/20`
                    : styles.orb.secondary
                } rounded-xl sm:rounded-2xl blur transition-all duration-300 group-hover/item:opacity-20`}
              ></div>
              <div className="relative z-10 flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-1 sm:mb-2">
                    <div
                      className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${
                        topic.voted ? `${styles.status.success} animate-pulse` : `bg-gradient-to-br ${styles.accent}`
                      }`}
                    ></div>
                    <h3 className={`text-sm sm:text-base font-semibold ${styles.textPrimary} group-hover/item:text-gray-900 transition-colors duration-200`}>
                      {topic.title}
                    </h3>
                  </div>
                  <div className="flex items-center mt-1 sm:mt-2">
                    <div className={`h-1 sm:h-1.5 ${styles.progress.background} rounded-full w-16 sm:w-24 mr-2`}>
                      <div
                        className={`h-1 sm:h-1.5 ${styles.progress.fill} rounded-full transition-all duration-1000`}
                        style={{ width: `${(topic.votes / 30) * 100}%` }}
                      ></div>
                    </div>
                    <p className={`text-xs sm:text-sm ${styles.textSecondary}`}>
                      <span className={`${styles.icon.secondary}`}>🗳️</span> {topic.votes} votes
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleVote(index)}
                  className={`group/btn px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 ${
                    topic.voted
                      ? `bg-opacity-10 text-${styles.status.success.replace('text-', '')} border border-opacity-20`
                      : styles.button.primary
                  }`} style={topic.voted ? { backgroundColor: styles.status.success.replace('text-', 'bg-') + '/10', borderColor: styles.status.success.replace('text-', 'bg-') + '/20' } : {}}>
                  <span className="flex items-center space-x-1 sm:space-x-2">
                    <span>{topic.voted ? 'Voted' : 'Vote'}</span>
                    {!topic.voted && (
                      <FaArrowRight
                        className="group-hover/btn:translate-x-1 transition-transform duration-300"
                        size={10}
                      />
                    )}
                  </span>
                </button>
              </div>
              <div className={`absolute bottom-0 left-0 h-0.5 sm:h-1 w-0 bg-gradient-to-r ${styles.accent} group-hover/item:w-full transition-all duration-300 rounded-full`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}