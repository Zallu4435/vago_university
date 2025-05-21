import React, { useState } from 'react';
import { FiUsers, FiClipboard, FiBarChart2, FiSearch, FiFilter, FiChevronUp, FiChevronDown, FiX } from 'react-icons/fi';
import FilterPanel from './FilterPanel';

const Header = ({ 
  // Dynamic page title props
  title = "Admission Management",
  subtitle = "Review and process student applications efficiently",
  
  // Stats data props
  stats = [
    { icon: <FiUsers />, title: "Total", value: "1,248", change: "+12.5%", isPositive: true },
    { icon: <FiClipboard />, title: "Pending", value: "42", change: "-8.3%", isPositive: true },
    { icon: <FiBarChart2 />, title: "Approval Rate", value: "78%", change: "+5.2%", isPositive: true }
  ],
  
  // Tabs data props
  tabs = [
    { label: "All Applications", icon: <FiUsers size={16} />, active: true },
    { label: "Pending", icon: <FiClipboard size={16} />, active: false },
    { label: "Analytics", icon: <FiBarChart2 size={16} />, active: false }
  ],
  
  // Search and filter props
  searchQuery,
  setSearchQuery,
  searchPlaceholder = "Search applicants...",
  filters,
  programs,
  debouncedFilterChange,
  customDateRange,
  handleCustomDateChange,
  handleResetFilters,
  filterField = 'program', // New prop for dynamic filter field
  
  // Optional callback for tab click
  onTabClick = null
}) => {
  const [filterOpen, setFilterOpen] = useState(false);

  const handleTabClick = (index) => {
    if (onTabClick) {
      onTabClick(index);
    }
  };

  return (
    <div className="mb-6 relative">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-xl shadow-2xl mb-6 border border-purple-800/30 overflow-hidden relative">
        {/* Animated ghost particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-10 z-0 particles-container" 
            style={{
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
            }}>
          </div>
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-purple-500/20 blur-sm"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationName: 'floatParticle',
                animationDuration: `${Math.random() * 10 + 15}s`,
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="container px-6 py-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white text-shadow-lg">
                {title}
              </h1>
              <p className="text-purple-300 mt-1 text-shadow-sm">
                {subtitle}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {stats.map((stat, index) => (
                <StatCard 
                  key={index}
                  icon={stat.icon}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  isPositive={stat.isPositive}
                />
              ))}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {tabs.map((tab, index) => (
                <TabButton 
                  key={index}
                  label={tab.label} 
                  active={tab.active} 
                  icon={tab.icon}
                  onClick={() => handleTabClick(index)}
                />
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-auto">
                <FiSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300"
                  size={18}
                />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery || ""}
                  onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-gray-800/60 backdrop-blur-sm
                            border border-purple-500/30 rounded-lg focus:outline-none 
                            focus:ring-2 focus:ring-purple-500/50 text-white placeholder-purple-300
                            shadow-lg transition-all duration-300"
                  aria-label="Search applicants"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery && setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                    aria-label="Clear search"
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/60 backdrop-blur-sm
                          text-white hover:bg-gray-700/70 rounded-lg transition-all duration-300
                          w-full sm:w-auto justify-center border border-purple-500/30 shadow-lg
                          hover:shadow-purple-500/20 hover:border-purple-500/50"
                aria-label={filterOpen ? "Close filters" : "Open filters"}
              >
                <FiFilter size={18} className="text-purple-400" />
                <span className="font-medium">Filters</span>
                {filterOpen ? 
                  <FiChevronUp size={16} className="text-purple-400" /> : 
                  <FiChevronDown size={16} className="text-purple-400" />
                }
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <FilterPanel
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        filters={filters}
        programs={programs}
        filterField={filterField} // Pass filterField to FilterPanel
        debouncedFilterChange={debouncedFilterChange}
        customDateRange={customDateRange}
        handleCustomDateChange={handleCustomDateChange}
        handleResetFilters={handleResetFilters}
      />
      
      <style jsx>{`
        .text-shadow-lg {
          text-shadow: 0 0 15px rgba(139, 92, 246, 0.5), 0 0 10px rgba(139, 92, 246, 0.3);
        }
        
        .text-shadow-sm {
          text-shadow: 0 0 8px rgba(139, 92, 246, 0.3);
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
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
        
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(139, 92, 246, 0);
          }
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ icon, title, value, change, isPositive }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-purple-500/30 
                  flex items-center space-x-4 min-w-[150px] shadow-lg hover:shadow-purple-500/10
                  transition-all duration-300 hover:bg-gray-800/70 group">
    <div className="w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center 
                    text-purple-300 group-hover:bg-purple-600/40 transition-all duration-300
                    border border-purple-500/30 shadow-inner">
      {icon}
    </div>
    <div>
      <p className="text-xs text-purple-300">{title}</p>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className={`text-xs ${isPositive ? 'text-green-400' : 'text-rose-400'}`}>
        {change}
      </p>
    </div>
  </div>
);

const TabButton = ({ label, active, icon, onClick }) => (
  <button 
    className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-300 ${
      active 
        ? 'bg-purple-600/30 text-white font-medium shadow-lg border border-purple-500/50 backdrop-blur-sm' 
        : 'text-purple-300 hover:bg-gray-800/60 hover:border-purple-500/30 hover:border backdrop-blur-sm'
    }`}
    onClick={onClick}
    aria-pressed={active}
  >
    <span className={`${active ? 'text-purple-200' : 'text-purple-400'}`}>{icon}</span>
    <span>{label}</span>
  </button>
);

export default Header;