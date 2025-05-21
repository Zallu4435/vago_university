import React from 'react';
import { FiFileText } from 'react-icons/fi';

const EmptyState = () => {
  return (
    <div className="relative py-12 flex flex-col items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="dust-effect"
          style={{
            background:
              'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMDAgMTAwYzEuNSAwIDIuNS0xLjEyIDIuNS0yLjUgMC0xLjM4LTEuMTItMi41LTIuNS0yLjUtMS4zOCAwLTIuNSAxLjEyLTIuNSAyLjUgMCAxLjM4IDEuMTIgMi41IDIuNSAyLjV6bTMwIDBjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41IDAtMS4zOCAxLjEyLTIuNSAyLjUtMi41IDEuMzggMCAyLjUgMS4xMiAyLjUgMi41IDAgMS4zOC0xLjEyIDIuNS0yLjUgMi41em0tMzAgMzBjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41IDAtMS4zOCAxLjEyLTIuNSAyLjUtMi41IDEuMzggMCAyLjUgMS4xMiAyLjUgMi41IDAgMS4zOC0xLjEyIDIuNS0yLjUgMi41eiIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC4yIi8+PC9nPjwvc3ZnPg==")',
            backgroundSize: '100px 100px',
            animation: 'dustAnimation 20s linear infinite',
          }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
          <FiFileText size={32} className="text-sky-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Applications Found</h3>
        <p className="text-gray-500 text-center max-w-sm">
          There are no admission applications matching your current filters. Try adjusting your search criteria.
        </p>
      </div>

      <style jsx>{`
        @keyframes dustAnimation {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(20px, 20px);
          }
        }
      `}</style>
    </div>
  );
};

export default EmptyState;