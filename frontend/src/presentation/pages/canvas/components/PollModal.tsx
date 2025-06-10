import React from 'react';
import { Session } from '../types/UniversityDashboardTypes';

interface PollModalProps {
  show: boolean;
  onClose: () => void;
  selectedSession: number | null;
  sessions: Session[];
  newPoll: {
    question: string;
    options: string[];
    allowMultiple: boolean;
  };
  onQuestionChange: (value: string) => void;
  onOptionChange: (index: number, value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onAllowMultipleChange: (value: boolean) => void;
  onCreatePoll: (sessionId: number) => void;
}

const PollModal: React.FC<PollModalProps> = ({
  show,
  onClose,
  selectedSession,
  sessions,
  newPoll,
  onQuestionChange,
  onOptionChange,
  onAddOption,
  onRemoveOption,
  onAllowMultipleChange,
  onCreatePoll
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Create New Poll</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg sm:text-xl"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Select Session
            </label>
            <select
              value={selectedSession || ''}
              onChange={(e) => onCreatePoll(Number(e.target.value))}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs sm:text-sm"
            >
              <option value="">Select a session</option>
              {sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.title} ({session.date} at {session.time})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Poll Question
            </label>
            <input
              type="text"
              value={newPoll.question}
              onChange={(e) => onQuestionChange(e.target.value)}
              placeholder="Enter your question..."
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Answer Options
            </label>
            <div className="space-y-2">
              {newPoll.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => onOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs sm:text-sm"
                  />
                  {newPoll.options.length > 2 && (
                    <button
                      onClick={() => onRemoveOption(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={onAddOption}
              className="mt-2 px-2 sm:px-3 py-1 sm:py-2 text-purple-600 hover:bg-purple-50 rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              + Add Option
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="allowMultiple"
              checked={newPoll.allowMultiple}
              onChange={(e) => onAllowMultipleChange(e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="allowMultiple" className="text-xs sm:text-sm text-gray-700">
              Allow multiple selections
            </label>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-4 sm:mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => selectedSession && onCreatePoll(selectedSession)}
            disabled={!newPoll.question.trim() || newPoll.options.some(opt => !opt.trim()) || !selectedSession}
            className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
          >
            Create Poll
          </button>
        </div>
      </div>
    </div>
  );
};

export default PollModal;