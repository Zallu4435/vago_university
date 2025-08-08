import React from 'react';

interface GlassPanelProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ title, icon: Icon, children }) => (
  <div className="group relative">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-500/20">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-4 w-8 h-8 border-purple-500/20 rotate-45 rounded-lg"></div>
        <div className="absolute bottom-4 right-4 w-6 h-6 border-purple-500/20 rotate-12 rounded-full"></div>
        <div className="absolute top-1/2 right-4 w-4 h-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rotate-45 rounded-sm"></div>
      </div>
      <div className="relative z-10">
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-2 rounded-lg shadow-lg backdrop-blur-sm">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white ml-3">{title}</h3>
        </div>
        {children}
      </div>
    </div>
  </div>
);

export default GlassPanel; 