import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaTimes, FaStar, FaBolt, FaUserTie, FaCalendar, FaTag, FaArrowLeft } from 'react-icons/fa';
import { SiteSection } from '../../../application/services/siteSections.service';

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
  variant = 'light',
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
      hoverGradient: 'hover:from-cyan-700 hover:to-blue-700',
    },
    vagoNow: {
      icon: FaBolt,
      title: 'VAGO Now',
      buttonText: 'Learn More',
      descriptionLabel: 'Description',
      gradient: 'from-cyan-600 to-blue-600',
      hoverGradient: 'hover:from-cyan-700 hover:to-blue-700',
    },
    leadership: {
      icon: FaUserTie,
      title: 'Leadership',
      buttonText: 'View Profile',
      descriptionLabel: 'About',
      gradient: 'from-cyan-600 to-blue-600',
      hoverGradient: 'hover:from-cyan-700 hover:to-blue-700',
    },
  };

  const currentConfig = config[type];
  const IconComponent = currentConfig.icon;

  // Dark variant styling
  const isDark = variant === 'dark';
  const bgClass = isDark ? 'bg-gray-900' : 'bg-white';
  const textClass = isDark ? 'text-white' : 'text-gray-800';
  const textSecondaryClass = isDark ? 'text-gray-300' : 'text-gray-600';
  const textMutedClass = isDark ? 'text-gray-400' : 'text-gray-500';

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`
          relative w-full max-w-4xl max-h-[85vh] ${bgClass} rounded-2xl shadow-2xl
          overflow-hidden flex flex-col
        `}
      >
        {/* Fixed Header */}
        <div
          className={`
            bg-gradient-to-r ${currentConfig.gradient} p-6 text-white
            sticky top-0 z-10 shadow-md
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <IconComponent className="text-3xl" />
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
                  {item.title}
                </h2>
                {item.category && (
                  <p className="text-cyan-100 text-sm sm:text-base mt-1">
                    {item.category}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/30 rounded-full transition-colors duration-200"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Image Section */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <img
                  src={item.image}
                  alt={item.title}
                  className={`
                    w-full ${type === 'leadership' ? 'h-80 sm:h-96' : 'h-64 sm:h-80'}
                    object-cover rounded-lg shadow-lg
                    transition-transform duration-300 hover:scale-[1.02]
                  `}
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className={`text-xl sm:text-2xl font-semibold ${textClass} mb-3`}>
                  {currentConfig.descriptionLabel}
                </h3>
                <p className={`${textSecondaryClass} text-base sm:text-lg leading-relaxed`}>
                  {item.description}
                </p>
              </div>

              {/* Metadata */}
              <div
                className={`
                  flex flex-wrap gap-4 text-sm ${textMutedClass}
                  border-t border-gray-200 dark:border-gray-700 pt-4
                `}
              >
                <div className="flex items-center space-x-2">
                  <FaCalendar size={16} />
                  <span>
                    {type === 'leadership'
                      ? `Joined: ${new Date(item.createdAt).toLocaleDateString()}`
                      : new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {item.category && (
                  <div className="flex items-center space-x-2">
                    <FaTag size={16} />
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
                    className={`
                      inline-flex items-center px-6 py-3 bg-gradient-to-r ${currentConfig.gradient}
                      ${currentConfig.hoverGradient} text-white font-semibold rounded-lg
                      transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
                      focus:outline-none focus:ring-2 focus:ring-cyan-500/50
                    `}
                  >
                    {currentConfig.buttonText}
                    <FaArrowLeft className="ml-3 text-sm rotate-180 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              )}
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

  return ReactDOM.createPortal(modalContent, document.body);
};

export default SiteSectionModal;