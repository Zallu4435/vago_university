import { useState } from 'react';
import { FaSearch, FaChevronRight, FaReply, FaShareSquare } from 'react-icons/fa';
import PropTypes from 'prop-types';

export default function SentSection({ messages }) {
  const [selectedMessage, setSelectedMessage] = useState(messages[0]);

  return (
    <>
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg p-4 mb-4 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Sent Messages</h3>
          <span className="bg-amber-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">Spring 2025</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        {/* Message List */}
        <div className="w-full md:w-1/3 border-r border-amber-200">
          <div className="p-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                className="w-full pl-10 pr-4 py-2 rounded-md border border-amber-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                placeholder="Search sent messages..."
              />
            </div>
          </div>
          <div className="divide-y divide-amber-100">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 cursor-pointer hover:bg-amber-100 flex ${
                  selectedMessage.id === message.id ? 'bg-amber-100' : ''
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className={`w-8 h-8 rounded-full ${message.color} text-white flex items-center justify-center mr-3 flex-shrink-0`}>
                  {message.icon}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-800">{message.recipient}</span>
                    <span className="text-xs text-gray-500">{message.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Message Detail */}
        <div className="w-full md:w-2/3 p-4">
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <div className={`w-10 h-10 rounded-full ${selectedMessage.color} text-white flex items-center justify-center mr-3`}>
                {selectedMessage.icon}
              </div>
              <div>
                <h4 className="font-medium text-lg text-gray-800">{selectedMessage.recipient}</h4>
                <div className="text-sm text-gray-500 flex items-center">
                  <span>{selectedMessage.email}</span>
                  <span className="mx-2">•</span>
                  <span>{selectedMessage.date} {selectedMessage.time}</span>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-orange-700 mb-3">{selectedMessage.subject}</h3>
            <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-orange-500 mb-4">
              {selectedMessage.content.map((paragraph, index) => (
                <p key={index} className="mb-3">{paragraph}</p>
              ))}
            </div>
            {selectedMessage.reply && (
              <div className="bg-amber-100 p-3 rounded-lg flex items-start border border-amber-200 mb-4">
                <FaReply className="h-5 w-5 text-orange-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-orange-800 font-medium">{selectedMessage.reply.title}</p>
                  <p className="text-sm text-gray-600">{selectedMessage.reply.content}</p>
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-amber-200 pt-4">
            <div className="flex justify-between mb-3">
              <h4 className="text-gray-700 font-medium">Reply</h4>
              <div className="flex space-x-2">
                <button className="bg-amber-200 hover:bg-amber-300 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center">
                  <FaShareSquare className="h-4 w-4 mr-1" /> Forward
                </button>
                <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-3 py-1 rounded-md text-sm flex items-center">
                  <FaReply className="h-4 w-4 mr-1" /> Reply
                </button>
              </div>
            </div>
            <textarea
              className="w-full border border-amber-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 text-sm"
              placeholder="Type your reply here..."
              defaultValue={selectedMessage.replyDraft || ''}
            ></textarea>
            <div className="flex justify-end mt-2">
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-md flex items-center">
                Send Response <FaChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

SentSection.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      recipient: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      subject: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      content: PropTypes.arrayOf(PropTypes.string).isRequired,
      icon: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      reply: PropTypes.shape({
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
      }),
      replyDraft: PropTypes.string,
    })
  ).isRequired,
};