import React from 'react';
import { FaFilter } from 'react-icons/fa';
import { SessionFiltersProps } from '../types/SessionTypes';

export const SessionFilters: React.FC<SessionFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  uniqueInstructors,
  userAccess,
  onToggleEnrollment,
  styles
}) => {
  return (
    <div className={`${styles.card.background} rounded-2xl ${styles.cardShadow} ${styles.cardBorder} p-6 mb-8`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 ${styles.accent} rounded-xl flex items-center justify-center`}>
          <FaFilter className={`w-5 h-5 ${styles.textPrimary}`} />
        </div>
        <h2 className={`text-xl font-semibold ${styles.textPrimary}`}>Filter Sessions</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className={`block text-sm font-medium ${styles.textPrimary} mb-2`}>Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value as 'all' | 'live' | 'upcoming' | 'completed' })}
            className={`w-full px-4 py-3 ${styles.input.border} rounded-xl ${styles.input.background} ${styles.input.focus}`}
            aria-label="Filter by status"
          >
            <option value="all">All Sessions</option>
            <option value="live">🔴 Live</option>
            <option value="upcoming">⏰ Upcoming</option>
            <option value="completed">✅ Completed</option>
          </select>
        </div>
        
        <div>
          <label className={`block text-sm font-medium ${styles.textPrimary} mb-2`}>Instructor</label>
          <select
            value={filters.instructor}
            onChange={(e) => onFilterChange({ ...filters, instructor: e.target.value })}
            className={`w-full px-4 py-3 ${styles.input.border} rounded-xl ${styles.input.background} ${styles.input.focus}`}
            aria-label="Filter by instructor"
          >
            <option value="all">All Instructors</option>
            {uniqueInstructors.map(instructor => (
              <option key={instructor} value={instructor}>{instructor}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={onClearFilters}
            className={`w-full px-4 py-3 text-sm font-medium ${styles.button.secondary} ${styles.border} rounded-xl ${styles.cardHover}`}
            aria-label="Clear all filters"
          >
            Clear All Filters
          </button>
        </div>
        
        <div className="flex items-end">
          <label className={`flex items-center gap-2 text-sm font-medium ${styles.textPrimary}`}>
            <input
              type="checkbox"
              checked={userAccess.isEnrolled}
              onChange={(e) => onToggleEnrollment(e.target.checked)}
              className={`rounded ${styles.accent} ${styles.input.focus}`}
              aria-label="Toggle enrollment"
            />
            Demo: Toggle Enrollment
          </label>
        </div>
      </div>
    </div>
  );
}; 