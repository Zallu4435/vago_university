import React from 'react';
import { FaFilter } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { SessionFiltersProps } from '../../../../../domain/types/canvas/session';

export const SessionFilters: React.FC<Omit<SessionFiltersProps, 'filters' | 'onFilterChange'> & {
  filters: { status: string; instructor: string };
  onFilterChange: (filters: { status: string; instructor: string }) => void;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
}> = ({
  filters,
  onFilterChange,
  onClearFilters,
  uniqueInstructors,
  userAccess,
  onToggleEnrollment,
  styles,
  searchTerm,
  setSearchTerm
}) => {
  return (
    <div className={`${styles.card.background} rounded-xl sm:rounded-2xl ${styles.cardShadow} ${styles.cardBorder} p-3 sm:p-6 mb-6 sm:mb-8`}>
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 ${styles.accent} rounded-lg sm:rounded-xl flex items-center justify-center`}>
          <FaFilter className={`w-4 h-4 sm:w-5 sm:h-5 ${styles.textPrimary}`} />
        </div>
        <h2 className={`text-base sm:text-xl font-semibold ${styles.textPrimary}`}>Filter Sessions</h2>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        {/* Search bar left-aligned */}
        <div className="w-full sm:max-w-md">
          <div className="relative">
            <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 ${styles.icon.secondary}`} />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 rounded-lg sm:rounded-xl ${styles.input.background} ${styles.input.border} ${styles.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base`}
            />
          </div>
        </div>
        {/* Filters and clear button right-aligned */}
        <div className="w-full sm:w-auto flex flex-row gap-2 sm:gap-3 justify-end">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value as 'all' | 'live' | 'upcoming' | 'completed' })}
            className={`min-w-[120px] px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl ${styles.input.background} ${styles.input.border} ${styles.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-base`}
            aria-label="Filter by status"
          >
            <option value="all">All Sessions</option>
            <option value="live">🔴 Live</option>
            <option value="upcoming">⏰ Upcoming</option>
            <option value="ended">✅ Completed</option>
          </select>
          <select
            value={filters.instructor}
            onChange={(e) => onFilterChange({ ...filters, instructor: e.target.value })}
            className={`min-w-[120px] px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl ${styles.input.background} ${styles.input.border} ${styles.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-base`}
            aria-label="Filter by instructor"
          >
            <option value="all">All Instructors</option>
            {uniqueInstructors.map(instructor => (
              <option key={instructor} value={instructor}>{instructor}</option>
            ))}
          </select>
          <button
            onClick={onClearFilters}
            className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium ${styles.button.secondary} ${styles.border} rounded-lg sm:rounded-xl ${styles.cardHover}`}
            aria-label="Clear all filters"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
}; 