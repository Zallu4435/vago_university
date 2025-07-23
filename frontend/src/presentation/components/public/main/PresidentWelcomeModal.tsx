import React from 'react';
import ReactDOM from 'react-dom';
import { usePreventBodyScroll } from '../../../../shared/hooks/usePreventBodyScroll';

interface PresidentWelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

const PresidentWelcomeModal: React.FC<PresidentWelcomeModalProps> = ({ open, onClose }) => {
  usePreventBodyScroll(open);
  if (!open) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      {/* Decorative SVG background pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" viewBox="0 0 400 400" fill="none">
        <circle cx="200" cy="200" r="180" fill="url(#uni-gradient)" />
        <defs>
          <radialGradient id="uni-gradient" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#2563eb" />
          </radialGradient>
        </defs>
      </svg>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative animate-fade-in-modal pointer-events-auto flex flex-col items-center border-t-8 border-cyan-500">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cyan-700 hover:text-cyan-900 text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>
        {/* University Logo */}
        <img
          src="/images/university-logo.png"
          alt="University Logo"
          className="w-16 h-16 mb-2 rounded-full object-contain border-2 border-cyan-200 bg-white shadow"
        />
        <h2 className="text-2xl font-extrabold text-cyan-800 mb-1 tracking-tight">President's Welcome</h2>
        {/* Accent bar */}
        <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-2" />
        <h3 className="text-lg font-semibold text-cyan-600 mb-1">Prof. John Doe</h3>
        <p className="text-cyan-500 text-sm mb-3">President, Academia University</p>
        {/* Mission Statement */}
        <p className="text-cyan-700 text-base mb-4 font-medium italic">
          "Empowering minds, shaping the future. At Academia University, we are committed to fostering innovation, leadership, and global citizenship."
        </p>
        {/* Quote */}
        <blockquote className="italic text-cyan-800 text-lg mb-4 font-semibold border-l-4 border-cyan-400 pl-4">
          "Together, we strive for excellence in education, research, and service to society. Let us inspire and be inspired, as we build a brighter tomorrow."
        </blockquote>
        {/* Signature */}
        <div className="w-full flex flex-col items-end mt-2">
          <span className="text-cyan-700 font-bold text-base">Prof. John Doe</span>
          <span className="text-cyan-500 text-xs">President, Academia University</span>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-modal {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-modal {
          animation: fade-in-modal 0.3s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
    </div>,
    document.body
  );
};

export default PresidentWelcomeModal; 