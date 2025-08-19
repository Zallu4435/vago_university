import React from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaHandPaper } from 'react-icons/fa';
import { ParticipantListProps } from '../../../domain/types/videoConference';

export const ParticipantList: React.FC<ParticipantListProps> = ({ isOpen, onClose, participants }) => {
  return (
    <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-30 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <span className="font-semibold">Participants ({participants.length})</span>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500">✕</button>
      </div>
      <ul className="p-4 space-y-3">
        {participants.map((p) => (
          <li key={p.id} className="flex items-center gap-2 border-b pb-2">
            <img
              src={p.profileUrl || 'https://ui-avatars.com/api/?name=User&background=random&size=64'}
              alt={p.name}
              className="w-8 h-8 rounded-full bg-gray-200"
            />
            <span className="font-medium flex-1 truncate">{p.name}</span>
            <span className="flex items-center gap-1">
              {p.audioOn ? <FaMicrophone className="text-green-600" /> : <FaMicrophoneSlash className="text-red-500" />}
              {p.videoOn ? <FaVideo className="text-green-600" /> : <FaVideoSlash className="text-red-500" />}
              {p.handRaised && <FaHandPaper className="text-yellow-400 animate-bounce" />}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}; 