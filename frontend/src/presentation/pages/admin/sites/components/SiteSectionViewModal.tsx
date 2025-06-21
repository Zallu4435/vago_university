import React, { useEffect } from 'react';
import { FiXCircle, FiStar } from 'react-icons/fi';

interface SectionField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}

interface SiteSectionViewModalProps {
  fields: SectionField[];
  data: Record<string, any>;
  onClose: () => void;
}

const SiteSectionViewModal: React.FC<SiteSectionViewModalProps> = ({ fields, data, onClose }) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  // Particle effect
  const ghostParticles = Array(30)
    .fill(0)
    .map((_, i) => ({
      size: Math.random() * 10 + 5,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animDuration: Math.random() * 10 + 15,
      animDelay: Math.random() * 5,
    }));

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Background particles */}
      {ghostParticles.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-purple-500/20 blur-sm"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            animation: `floatParticle ${particle.animDuration}s infinite ease-in-out`,
            animationDelay: `${particle.animDelay}s`,
          }}
        />
      ))}
      {/* Main Modal Container */}
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 w-full max-w-4xl max-h-[90vh] rounded-2xl border border-purple-600/30 shadow-2xl overflow-hidden relative">
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-purple-600/5 pointer-events-none" />
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500/10 rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-tl-full" />
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-900 to-gray-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg border border-purple-600/30"
                style={{ backgroundColor: '#8B5CF620', borderColor: '#8B5CF6' }}
              >
                <FiStar size={24} className="text-purple-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-100">Details</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-500/20 rounded-full transition-colors"
            >
              <FiXCircle size={24} className="text-purple-300" />
            </button>
          </div>
        </div>
        {/* Content Section */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field: SectionField) => (
              <div 
                key={field.name} 
                className={`bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm ${
                  field.type === 'textarea' ? 'md:col-span-2' : ''
                }`}
              >
                <div className="flex items-center mb-2">
                  <span className="text-purple-300 mr-2">
                    <FiStar size={18} />
                  </span>
                  <span className="text-sm font-medium text-purple-300">{field.label}</span>
                </div>
                {field.type === 'text' || field.type === 'textarea' ? (
                  <p className="text-white font-semibold break-words">{data[field.name]}</p>
                ) : null}
                {field.type === 'image' && data[field.name] ? (
                  <img src={data[field.name]} alt={field.label} className="mt-2 max-h-40 rounded-lg border border-purple-600/30" />
                ) : null}
              </div>
            ))}
          </div>
          <div className="border-t border-purple-600/30 bg-gray-900/80 p-6 mt-6">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors border border-gray-500/50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .no-scroll { overflow: hidden; }
        @keyframes floatParticle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          25% { opacity: 0.8; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.3; }
          75% { opacity: 0.7; }
          100% { transform: translateY(0) translateX(0); opacity: 0; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(128, 90, 213, 0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.3); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(139, 92, 246, 0.5); }
      `}</style>
    </div>
  );
};

export default SiteSectionViewModal; 