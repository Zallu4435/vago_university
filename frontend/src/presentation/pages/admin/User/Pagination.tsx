import React from 'react';
import { FiArrowLeft, FiArrowRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

const Pagination = ({
  page = 1, // Current page number
  totalPages = 1, // Total number of pages
  itemsCount = 0, // Number of items displayed (e.g., filtered count)
  itemName = 'items', // Name of items (e.g., 'applications', 'faculty')
  onPageChange = () => {}, // Callback for page changes (receives new page number)
  onFirstPage = () => {}, // Callback for jumping to first page
  onLastPage = () => {}, // Callback for jumping to last page
  maxDots = 5, // Maximum number of page dots to display
  showMobileDots = false, // Show page dots on mobile
  containerClass = '', // Additional Tailwind classes for container
  buttonClass = '', // Additional Tailwind classes for buttons
  activeButtonClass = 'bg-gradient-to-br from-purple-600 to-purple-900 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-purple-400/20', // Styling for active page button
  disabledButtonClass = 'bg-gray-800/30 text-gray-500 cursor-not-allowed', // Styling for disabled buttons
  defaultButtonClass = 'bg-gray-800/50 hover:bg-purple-900/30 text-gray-300 hover:text-purple-300 hover:border-purple-500/50 border border-gray-700/50 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)]', // Styling for default buttons
}) => {
  // Generate page dots for navigation
  const getPageDots = () => {
    const dots = [];
    
    if (totalPages <= maxDots) {
      // Show all pages if totalPages is small
      for (let i = 1; i <= totalPages; i++) {
        dots.push(i);
      }
    } else {
      // Always include first page
      dots.push(1);
      
      // Calculate middle dots
      if (page <= 3) {
        dots.push(2, 3, 4);
      } else if (page >= totalPages - 2) {
        dots.push(totalPages - 3, totalPages - 2, totalPages - 1);
      } else {
        dots.push(page - 1, page, page + 1);
      }
      
      // Always include last page
      dots.push(totalPages);
      
      // De-duplicate and sort
      return [...new Set(dots)].sort((a, b) => a - b);
    }
    
    return dots;
  };

  const pageDots = getPageDots();

  // Navigation handlers
  const handleFirstPage = () => {
    if (page > 1) {
      onFirstPage();
      onPageChange(1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  const handleLastPage = () => {
    if (page < totalPages) {
      onLastPage();
      onPageChange(totalPages);
    }
  };

  // Generate floating particles for ghost effect
  const ghostParticles = Array(6).fill(0).map((_, i) => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: 3 + Math.random() * 4,
    delay: i * 0.3,
  }));

  return (
    <div className={`mt-8 px-2 relative ${containerClass}`}>
      {/* Background effect */}
      <div className="absolute inset-0 backdrop-blur-sm rounded-xl bg-purple-900/5 -z-10"></div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between py-4 px-6 relative overflow-hidden">
        {/* Animated particle effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {ghostParticles.map((particle, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-purple-400/40 rounded-full blur-sm"
              style={{
                top: `${particle.top}%`,
                left: `${particle.left}%`,
                animationName: 'floatParticle',
                animationDuration: `${particle.duration}s`,
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </div>
        
        {/* Count indicator */}
        <div className="py-2 px-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-purple-500/20 mb-4 sm:mb-0">
          <p className="text-gray-300">
            Showing <span className="font-medium text-purple-300">{itemsCount}</span> {itemName}
          </p>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center space-x-2">
          {/* First page button */}
          <button
            onClick={handleFirstPage}
            disabled={page === 1}
            className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${page === 1 ? disabledButtonClass : `${defaultButtonClass} ${buttonClass}`}`}
            aria-label="First page"
          >
            <FiChevronsLeft size={18} />
          </button>
          
          {/* Previous button */}
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className={`flex items-center justify-center px-4 h-10 rounded-lg font-medium transition-all duration-300 ${page === 1 ? disabledButtonClass : `${defaultButtonClass} ${buttonClass}`}`}
            aria-label="Previous page"
          >
            <FiArrowLeft size={16} className="mr-1" />
            <span>Prev</span>
          </button>
          
          {/* Page dots */}
          <div className={`${showMobileDots ? 'flex' : 'hidden sm:flex'} items-center space-x-2`}>
            {pageDots.map((pageNumber, index) => {
              // Add ellipsis if there's a gap
              if (index > 0 && pageNumber - pageDots[index - 1] > 1) {
                return (
                  <React.Fragment key={`ellipsis-${index}`}>
                    <span className="w-8 text-center text-gray-500">...</span>
                    <button
                      key={pageNumber}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 font-medium ${page === pageNumber ? activeButtonClass : `${defaultButtonClass} ${buttonClass}`}`}
                      onClick={() => onPageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  </React.Fragment>
                );
              }
              
              return (
                <button
                  key={pageNumber}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 font-medium ${page === pageNumber ? activeButtonClass : `${defaultButtonClass} ${buttonClass}`}`}
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>
          
          {/* Current page indicator (mobile) */}
          <div className={`${showMobileDots ? 'hidden' : 'sm:hidden'} px-4 py-2 bg-gray-800/50 rounded-lg border border-purple-500/20 text-purple-300 font-medium`}>
            {page} / {totalPages}
          </div>
          
          {/* Next button */}
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className={`flex items-center justify-center px-4 h-10 rounded-lg font-medium transition-all duration-300 ${page === totalPages ? disabledButtonClass : `${defaultButtonClass} ${buttonClass}`}`}
            aria-label="Next page"
          >
            <span>Next</span>
            <FiArrowRight size={16} className="ml-1" />
          </button>
          
          {/* Last page button */}
          <button
            onClick={handleLastPage}
            disabled={page === totalPages}
            className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${page === totalPages ? disabledButtonClass : `${defaultButtonClass} ${buttonClass}`}`}
            aria-label="Last page"
          >
            <FiChevronsRight size={18} />
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes floatParticle {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-10px) translateX(5px);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
};

export default Pagination;