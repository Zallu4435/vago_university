import React from 'react';

interface TopBarProps {
  sessionName: string;
  timer?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ sessionName, timer }) => (
  <div className="fixed top-0 left-0 w-full bg-black bg-opacity-80 text-white flex items-center justify-between px-6 py-3 z-20 shadow">
    <span className="font-semibold text-lg truncate max-w-[70vw]">{sessionName}</span>
    {timer && <span className="font-mono text-sm bg-gray-800 px-3 py-1 rounded">{timer}</span>}
  </div>
); 