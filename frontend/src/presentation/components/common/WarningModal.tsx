import React, { useState, useEffect } from 'react';
import { FiAlertTriangle, FiAlertCircle, FiInfo } from 'react-icons/fi';

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  // Optional input support (e.g., rejection reason)
  showInput?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputValue?: string;
  onInputChange?: (value: string) => void;
}

const WarningModal: React.FC<WarningModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  showInput = false,
  inputLabel,
  inputPlaceholder,
  inputValue,
  onInputChange,
}) => {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimateIn(true), 50);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <FiAlertTriangle size={26} />,
          iconColor: 'text-red-400',
          iconBg: 'bg-red-500/20',
          iconBorder: 'border-red-500/30',
          button: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600',
          buttonBorder: 'border-red-500/50',
          buttonRing: 'focus:ring-red-500/50',
          contentBg: 'bg-red-500/10',
          contentBorder: 'border-red-500/30'
        };
      case 'warning':
        return {
          icon: <FiAlertCircle size={26} />,
          iconColor: 'text-yellow-400',
          iconBg: 'bg-yellow-500/20',
          iconBorder: 'border-yellow-500/30',
          button: 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600',
          buttonBorder: 'border-yellow-500/50',
          buttonRing: 'focus:ring-yellow-500/50',
          contentBg: 'bg-yellow-500/10',
          contentBorder: 'border-yellow-500/30'
        };
      case 'info':
        return {
          icon: <FiInfo size={26} />,
          iconColor: 'text-blue-400',
          iconBg: 'bg-blue-500/20',
          iconBorder: 'border-blue-500/30',
          button: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600',
          buttonBorder: 'border-blue-500/50',
          buttonRing: 'focus:ring-blue-500/50',
          contentBg: 'bg-blue-500/10',
          contentBorder: 'border-blue-500/30'
        };
      default:
        return {
          icon: <FiAlertTriangle size={26} />,
          iconColor: 'text-red-400',
          iconBg: 'bg-red-500/20',
          iconBorder: 'border-red-500/30',
          button: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600',
          buttonBorder: 'border-red-500/50',
          buttonRing: 'focus:ring-red-500/50',
          contentBg: 'bg-red-500/10',
          contentBorder: 'border-red-500/30'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm transition-all duration-300">
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm">
        {[...Array(25)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-purple-500/20 blur-sm"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `floatParticle ${Math.random() * 10 + 15}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div 
        className={`bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 
                   rounded-xl border border-purple-500/30 shadow-2xl w-full max-w-md 
                   relative overflow-hidden transition-all duration-500 transform mx-4
                   ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-purple-600/5 pointer-events-none" />
        
        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-tr-full" />

        <div className="p-6 relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center 
                          ${styles.iconBg} ${styles.iconColor} border ${styles.iconBorder}
                          shadow-lg shadow-purple-500/10`}>
              {styles.icon}
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${styles.contentBg} border ${styles.contentBorder} mb-6`}>
            <h3 className="text-xl font-bold text-white text-center mb-3 text-shadow-sm">
              {title}
            </h3>
            
            <p className="text-purple-100 text-center">
              {message}
            </p>
          </div>

          {showInput && (
            <div className="mb-6">
              {inputLabel && (
                <label className="block text-purple-200 text-sm mb-2">{inputLabel}</label>
              )}
              <textarea
                value={inputValue || ''}
                onChange={(e) => onInputChange?.(e.target.value)}
                placeholder={inputPlaceholder || ''}
                className="w-full bg-gray-800/70 border border-purple-500/30 rounded-lg p-3 text-purple-100 placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                rows={4}
              />
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-purple-500/30 rounded-lg text-purple-200 
                        hover:bg-purple-500/10 transition-all duration-300 focus:outline-none 
                        focus:ring-2 focus:ring-purple-500/50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-2.5 px-4 rounded-lg text-white shadow-lg
                         ${styles.button} border ${styles.buttonBorder}
                         transition-all duration-300 focus:outline-none focus:ring-2 ${styles.buttonRing}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .text-shadow-sm {
          text-shadow: 0 0 8px rgba(139, 92, 246, 0.3);
        }
        
        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          25% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.3;
          }
          75% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default WarningModal;