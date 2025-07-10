import React from 'react';

const EmptyState: React.FC<{ icon: React.ReactNode; title: string; message: string }> = ({ icon, title, message }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
      {icon}
    </div>
    <h3 className="text-lg font-medium text-white mb-1">{title}</h3>
    <p className="text-gray-400 text-center max-w-sm">{message}</p>
  </div>
);

export default EmptyState; 