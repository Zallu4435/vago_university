import React from 'react';
import {
    FiSearch,
    FiFilter,
    FiRefreshCw,
    FiX,
    FiCalendar
} from 'react-icons/fi';

const FilterPanel = ({
    searchQuery,
    setSearchQuery,
    filterOpen,
    setFilterOpen,
    filters,
    programs, // Renamed to be generic (can be programs or departments)
    filterField = 'program', // Dynamic field name (e.g., 'program' or 'department')
    debouncedFilterChange,
    customDateRange,
    handleCustomDateChange,
    handleResetFilters
}) => {
    return (
        <div className="mb-6 relative">
            {filterOpen && (
                <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl shadow-2xl p-6 
                         border border-purple-500/20 animate-fadeIn relative overflow-hidden">
                    {/* Ghost effect elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {/* Glowing orbs */}
                        <div className="absolute top-1/4 -right-10 w-40 h-40 bg-purple-600/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-1/3 -left-20 w-60 h-60 bg-blue-600/5 rounded-full blur-3xl"></div>

                        {/* Floating misty particles */}
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full bg-purple-500/10 blur-md"
                                style={{
                                    width: `${Math.random() * 15 + 5}px`,
                                    height: `${Math.random() * 15 + 5}px`,
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    animationName: 'floatingMist',
                                    animationDuration: `${Math.random() * 10 + 20}s`,
                                    animationTimingFunction: 'ease-in-out',
                                    animationIterationCount: 'infinite',
                                    animationDelay: `${Math.random() * 5}s`,
                                }}
                            />
                        ))}
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                                <FiFilter className="text-purple-400" />
                                <span>Filter {filterField === 'program' ? 'Applications' : 'Faculty'}</span>
                            </h3>
                            <button
                                onClick={handleResetFilters}
                                className="px-4 py-2 text-sm font-medium text-purple-300 hover:text-white 
                         bg-purple-900/30 hover:bg-purple-800/40 rounded-lg transition-colors 
                         flex items-center gap-2 border border-purple-500/30 shadow-lg
                         hover:shadow-purple-500/20"
                            >
                                <FiRefreshCw size={16} className="animate-pulse-slow" />
                                Reset Filters
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FilterSelect
                                label="Status"
                                value={filters?.status || "all"}
                                onChange={(e) => debouncedFilterChange && debouncedFilterChange('status', e.target.value)}
                                options={[
                                    { value: 'all', label: 'All Statuses' },
                                    { value: 'pending', label: 'Pending' },
                                    { value: 'approved', label: 'Approved' },
                                    { value: 'rejected', label: 'Rejected' }
                                ]}
                            />

                            <FilterSelect
                                label={filterField === 'program' ? 'Program' : 'Department'}
                                value={filters?.[filterField] || `all_${filterField}s`}
                                onChange={(e) => debouncedFilterChange && debouncedFilterChange(filterField, e.target.value)}
                                options={(programs || []).map((item) => ({
                                    value: item === `All ${filterField === 'program' ? 'Programs' : 'Departments'}` 
                                        ? `all_${filterField}s` 
                                        : item.toLowerCase().replace(/\s+/g, '_'),
                                    label: item
                                }))}
                            />

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-purple-300">Application Date</label>
                                <select
                                    value={filters?.dateRange || "all"}
                                    onChange={(e) => debouncedFilterChange && debouncedFilterChange('dateRange', e.target.value)}
                                    className="w-full border border-purple-500/30 rounded-lg p-2.5 focus:outline-none 
                           focus:ring-2 focus:ring-purple-500/50 text-white bg-gray-800/80 shadow-md
                           backdrop-blur-sm appearance-none"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239f7aea' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 0.75rem center',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '2.5rem'
                                    }}
                                >
                                    <option value="all">All Dates</option>
                                    <option value="last_week">Last Week</option>
                                    <option value="last_month">Last Month</option>
                                    <option value="last_3_months">Last 3 Months</option>
                                    <option value="custom">Custom Range</option>
                                </select>

                                {filters?.dateRange === 'custom' && (
                                    <div className="mt-3 space-y-3">
                                        <div className="relative">
                                            <label className="block text-xs text-purple-300 mb-1">Start Date</label>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    value={customDateRange?.startDate || ""}
                                                    onChange={(e) => handleCustomDateChange && handleCustomDateChange('startDate', e.target.value)}
                                                    className="w-full border border-purple-500/30 rounded-lg p-2 text-white 
                                   focus:outline-none focus:ring-2 focus:ring-purple-500/50 pl-9
                                   bg-gray-800/80 backdrop-blur-sm shadow-md"
                                                />
                                                <FiCalendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <label className="block text-xs text-purple-300 mb-1">End Date</label>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    value={customDateRange?.endDate || ""}
                                                    onChange={(e) => handleCustomDateChange && handleCustomDateChange('endDate', e.target.value)}
                                                    className="w-full border border-purple-500/30 rounded-lg p-2 text-white 
                                   focus:outline-none focus:ring-2 focus:ring-purple-500/50 pl-9
                                   bg-gray-800/80 backdrop-blur-sm shadow-md"
                                                />
                                                <FiCalendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {filters && (filters.status !== 'all' || filters[filterField] !== `all_${filterField}s` || filters.dateRange !== 'all') && (
                            <div className="mt-6 pt-4 border-t border-purple-500/20">
                                <div className="flex flex-wrap gap-2">
                                    {filters.status !== 'all' && (
                                        <ActiveFilter
                                            label={`Status: ${filters.status}`}
                                            onRemove={() => debouncedFilterChange && debouncedFilterChange('status', 'all')}
                                        />
                                    )}
                                    {filters[filterField] !== `all_${filterField}s` && (
                                        <ActiveFilter
                                            label={`${filterField === 'program' ? 'Program' : 'Department'}: ${filters[filterField].replace(/_/g, ' ')}`}
                                            onRemove={() => debouncedFilterChange && debouncedFilterChange(filterField, `all_${filterField}s`)}
                                        />
                                    )}
                                    {filters.dateRange !== 'all' && (
                                        <ActiveFilter
                                            label={`Date: ${filters.dateRange === 'custom'
                                                ? `${customDateRange?.startDate || ""} to ${customDateRange?.endDate || ""}`
                                                : filters.dateRange.replace(/_/g, ' ')}`}
                                            onRemove={() => debouncedFilterChange && debouncedFilterChange('dateRange', 'all')}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes floatingMist {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(15px);
            opacity: 0.6;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
        
        /* Fix the date input styling for Webkit browsers */
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.8) brightness(0.8) sepia(1) hue-rotate(220deg) saturate(5);
          opacity: 0.8;
        }
      `}</style>
        </div>
    );
};

const FilterSelect = ({ label, value, onChange, options }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-purple-400 text-shadow-sm">
            {label}
        </label>
        <select
            value={value}
            onChange={onChange}
            className="w-full border border-purple-600/40 rounded-lg p-2.5 focus:outline-none 
               focus:ring-2 focus:ring-purple-600/60 text-purple-200 bg-gray-900/70 shadow-md
               backdrop-blur-sm appearance-none transition-all duration-300 hover:border-purple-600/60"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a78bfa' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
            }}
        >
            {options.map((option, index) => (
                <option 
                    key={index} 
                    value={option.value}
                    className="bg-gray-900 text-purple-200 hover:bg-purple-900/50 border-purple-600/20"
                >
                    {option.label}
                </option>
            ))}
        </select>
        <style jsx>{`
            select option {
                background-color: #1f2937; /* bg-gray-900 */
                color: #e9d5ff; /* text-purple-200 */
                border-bottom: 1px solid rgba(147, 51, 234, 0.2); /* border-purple-600/20 */
                padding: 8px;
                transition: background-color 0.2s ease;
            }
            select option:hover {
                background-color: rgba(88, 28, 135, 0.5); /* hover:bg-purple-900/50 */
            }
            .text-shadow-sm {
                text-shadow: 0 0 8px rgba(139, 92, 246, 0.3);
            }
        `}</style>
    </div>
);

const ActiveFilter = ({ label, onRemove }) => (
    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm 
                 bg-purple-900/40 text-purple-200 border border-purple-500/40
                 shadow-sm backdrop-blur-sm hover:bg-purple-900/50 transition-colors">
        {label}
        <button
            onClick={onRemove}
            className="ml-2 text-purple-300 hover:text-white focus:outline-none"
        >
            <FiX size={14} />
        </button>
    </span>
);

export default FilterPanel;
