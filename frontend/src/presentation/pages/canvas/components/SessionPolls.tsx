import React from 'react';
import { FaPoll, FaClock, FaCheck } from 'react-icons/fa';
import { SessionPoll } from '../types/UniversityDashboardTypes';

interface SessionPollsProps {
  polls: SessionPoll[];
  onVote: (pollId: number, optionIndex: number) => void;
}

const SessionPolls: React.FC<SessionPollsProps> = ({ polls, onVote }) => {
  if (polls.length === 0) return null;

  return (
    <div className="space-y-4 border-t pt-4">
      <h4 className="font-semibold text-gray-800 text-xs sm:text-sm flex items-center">
        <FaPoll className="mr-2 text-purple-500" />
        Session Polls ({polls.length})
      </h4>
      {polls.slice(0, 1).map((poll) => (
        <div key={poll.id} className="bg-purple-50 rounded-lg p-3 sm:p-4 border border-purple-100">
          <div className="flex justify-between items-start mb-3">
            <h5 className="font-medium text-gray-900 text-xs sm:text-sm truncate">{poll.question}</h5>
            <span className="text-xs text-gray-500">{poll.totalVotes} votes</span>
          </div>
          
          <div className="space-y-2">
            {poll.options.map((option, index) => {
              const percentage = poll.totalVotes > 0 ? (poll.votes[index] / poll.totalVotes) * 100 : 0;
              const isUserChoice = poll.userVote === index;
              
              return (
                <div key={index} className="relative">
                  <button
                    onClick={() => !poll.userVoted && poll.isActive && onVote(poll.id, index)}
                    disabled={poll.userVoted || !poll.isActive}
                    className={`w-full text-left p-2 sm:p-3 rounded-lg border text-xs sm:text-sm transition-all ${
                      poll.userVoted || !poll.isActive
                        ? 'cursor-default'
                        : 'hover:bg-purple-100 cursor-pointer'
                    } ${
                      isUserChoice
                        ? 'bg-purple-200 border-purple-400 font-medium'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate">{option}</span>
                      <div className="flex items-center space-x-2">
                        {isUserChoice && <FaCheck className="text-purple-600 text-xs" />}
                        <span className="text-xs font-medium">{poll.votes[index]}</span>
                      </div>
                    </div>
                    
                    {poll.userVoted && (
                      <div 
                        className="absolute bottom-0 left-0 h-1 bg-purple-500 rounded-b-lg transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
            <span>by {poll.createdBy}</span>
            <div className="flex items-center space-x-3">
              {poll.timeRemaining && (
                <span className="flex items-center">
                  <FaClock className="mr-1" />
                  {Math.floor(poll.timeRemaining / 60)}:{(poll.timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              )}
              <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${
                poll.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {poll.isActive ? 'Active' : 'Closed'}
              </span>
            </div>
          </div>
        </div>
      ))}
      {polls.length > 1 && (
        <button className="text-xs text-purple-600 hover:underline">
          View {polls.length - 1} more poll{polls.length - 1 > 1 ? 's' : ''}
        </button>
      )}
    </div>
  );
};

export default SessionPolls; 