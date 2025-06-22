import React, { useEffect } from 'react';
import { FaTimes, FaStar, FaBolt, FaUserTie, FaCalendar, FaTag, FaArrowLeft } from 'react-icons/fa';
import { SiteSection } from '../../application/services/siteSections.service';

export type SiteSectionType = 'highlights' | 'vagoNow' | 'leadership';

interface SiteSectionModalProps {
  item: SiteSection | null;
  isOpen: boolean;
  onClose: () => void;
  type?: SiteSectionType;
  variant?: 'light' | 'dark';
}

const SiteSectionModal: React.FC<SiteSectionModalProps> = ({ 
  item, 
  isOpen, 
  onClose, 
  type = 'highlights',
  variant = 'light'
}) => {
  if (!isOpen || !item) return null;

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  // Configuration for different section types
  const config = {
    highlights: {
      icon: FaStar,
      title: 'Highlight',
      buttonText: 'Read More',
      descriptionLabel: 'Description',
      gradient: 'from-cyan-600 to-blue-600',
      hoverGradient: 'hover:from-cyan-700 hover:to-blue-700'
    },
    vagoNow: {
      icon: FaBolt,
      title: 'VAGO Now',
      buttonText: 'Learn More',
      descriptionLabel: 'Description',
      gradient: 'from-cyan-600 to-blue-600',
      hoverGradient: 'hover:from-cyan-700 hover:to-blue-700'
    },
    leadership: {
      icon: FaUserTie,
      title: 'Leadership',
      buttonText: 'View Profile',
      descriptionLabel: 'About',
      gradient: 'from-cyan-600 to-blue-600',
      hoverGradient: 'hover:from-cyan-700 hover:to-blue-700'
    }
  };

  const currentConfig = config[type];
  const IconComponent = currentConfig.icon;

  // Dark variant styling
  const isDark = variant === 'dark';
  const bgClass = isDark ? 'bg-gray-900' : 'bg-white';
  const textClass = isDark ? 'text-white' : 'text-gray-800';
  const textSecondaryClass = isDark ? 'text-gray-300' : 'text-gray-600';
  const textMutedClass = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={onClose} 
        />
        
        {/* Modal Container */}
        <div className={`relative w-full max-w-4xl ${bgClass} rounded-2xl shadow-2xl overflow-hidden`}>
          {/* Header */}
          <div className={`bg-gradient-to-r ${currentConfig.gradient} p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <IconComponent className="text-2xl" />
                <div>
                  <h2 className="text-2xl font-bold">{item.title}</h2>
                  {item.category && (
                    <p className="text-cyan-100">{item.category}</p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Section */}
              <div>
                <img
                  src={item.image}
                  alt={item.title}
                  className={`w-full ${type === 'leadership' ? 'h-80' : 'h-64'} object-cover rounded-lg shadow-lg`}
                />
              </div>
              
              {/* Details Section */}
              <div className="space-y-4">
                <div>
                  <h3 className={`text-xl font-semibold ${textClass} mb-2`}>
                    {currentConfig.descriptionLabel}
                  </h3>
                  <p className={`${textSecondaryClass} leading-relaxed`}>
                    {item.description}
                  </p>
                </div>
                
                {/* Metadata */}
                <div className={`flex items-center space-x-4 text-sm ${textMutedClass}`}>
                  <div className="flex items-center space-x-1">
                    <FaCalendar />
                    <span>
                      {type === 'leadership' 
                        ? `Joined: ${new Date(item.createdAt).toLocaleDateString()}`
                        : new Date(item.createdAt).toLocaleDateString()
                      }
                    </span>
                  </div>
                  {item.category && (
                    <div className="flex items-center space-x-1">
                      <FaTag />
                      <span>{item.category}</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                {item.link && (
                  <div className="pt-4">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${currentConfig.gradient} ${currentConfig.hoverGradient} text-white rounded-lg transition-all duration-300`}
                    >
                      {currentConfig.buttonText}
                      <FaArrowLeft className="ml-2 rotate-180" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Global Styles */}
      <style>{`
        .no-scroll {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default SiteSectionModal; 