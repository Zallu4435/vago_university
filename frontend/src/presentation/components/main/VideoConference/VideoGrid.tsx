import React from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaHandPaper } from 'react-icons/fa';

export type Participant = {
  id: string;
  name: string;
  videoOn: boolean;
  audioOn: boolean;
  handRaised: boolean;
  reaction?: string;
  profileUrl?: string;
};

interface VideoGridProps {
  participants: Participant[];
}

const dummyProfile =
  'https://ui-avatars.com/api/?name=User&background=random&size=128';

export const VideoGrid: React.FC<VideoGridProps> = ({ participants }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 w-full h-full">
      {participants.map((p) => (
        <div
          key={p.id}
          className="relative bg-gray-900 rounded-lg shadow-lg flex flex-col items-center justify-end aspect-video overflow-hidden"
        >
          {p.videoOn ? (
            <div className="w-full h-full bg-black flex items-center justify-center">
              {/* Simulated video stream */}
              <div className="w-24 h-24 bg-gray-700 rounded-full animate-pulse" />
            </div>
          ) : (
            <img
              src={p.profileUrl || dummyProfile}
              alt={p.name}
              className="w-24 h-24 rounded-full mx-auto my-8 bg-gray-700"
            />
          )}
          {/* Overlay: Name and status */}
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 px-2 py-1 flex items-center justify-between text-white text-xs">
            <span className="font-semibold truncate max-w-[60%]">{p.name}</span>
            <span className="flex items-center gap-1">
              {p.audioOn ? <FaMicrophone /> : <FaMicrophoneSlash className="text-red-500" />}
              {p.videoOn ? <FaVideo /> : <FaVideoSlash className="text-red-500" />}
              {p.handRaised && <FaHandPaper className="text-yellow-400 animate-bounce" />}
            </span>
          </div>
          {/* Overlay: Reaction */}
          {p.reaction && (
            <div className="absolute top-2 right-2 text-3xl animate-bounce">
              {p.reaction}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}; 