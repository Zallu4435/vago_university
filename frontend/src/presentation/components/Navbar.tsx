import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import { performSearch, getSearchSuggestions, SearchResult } from '../../shared/utils/searchData';

interface NavbarProps {
  layoutType?: 'public' | 'ug' | 'department';
}

export const Navbar: React.FC<NavbarProps> = ({ layoutType = 'public' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Get the current department from the URL for department layout
  const currentDepartment = location.pathname.split('/')[2] || 'computer-science';

  // Search function with debouncing
  const performSearchWithDelay = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchSuggestions([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay for better UX
    setTimeout(() => {
      const results = performSearch(query);
      const suggestions = getSearchSuggestions(query);
      
      setSearchResults(results);
      setSearchSuggestions(suggestions);
      setShowSearchResults(true);
      setIsSearching(false);
    }, 300);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearchWithDelay(query);
  };

  // Handle search result click
  const handleResultClick = (result: SearchResult) => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchSuggestions([]);
    setShowSearchResults(false);
    navigate(result.url);
  };

  // Handle search form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleResultClick(searchResults[0]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    performSearchWithDelay(suggestion);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when clicking on a link
  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  // Get type color for search results
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'scholarship': return 'text-green-600 bg-green-50';
      case 'department': return 'text-blue-600 bg-blue-50';
      case 'program': return 'text-purple-600 bg-purple-50';
      case 'faculty': return 'text-orange-600 bg-orange-50';
      case 'event': return 'text-red-600 bg-red-50';
      case 'admission': return 'text-indigo-600 bg-indigo-50';
      case 'research': return 'text-teal-600 bg-teal-50';
      case 'career': return 'text-pink-600 bg-pink-50';
      case 'academic': return 'text-amber-600 bg-amber-50';
      case 'technology': return 'text-cyan-600 bg-cyan-50';
      case 'international': return 'text-emerald-600 bg-emerald-50';
      case 'achievement': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Define the links based on layout type
  let links;
  if (layoutType === 'ug') {
    links = [
      { label: 'Home', href: '/ug' },
      { label: 'Admissions', href: '/ug/admissions' },
      { label: 'Programmes', href: '/ug/programmes' },
      { label: 'Scholarships', href: '/ug/scholarships' },
      { label: 'Why VAGO', href: '/ug/why-vago' },
      { label: 'Contact', href: '/ug/contact' },
    ];
  } else if (layoutType === 'department') {
    links = [
      { label: 'Home', href: `/departments/${currentDepartment}` },
      { label: 'About', href: `/departments/${currentDepartment}/about` },
      { label: 'Program', href: `/departments/${currentDepartment}/program` },
      { label: 'Community', href: `/departments/${currentDepartment}/community` },
      { label: 'Entrepreneur', href: `/departments/${currentDepartment}/entrepreneur` },
      { label: 'Contact', href: `/departments/${currentDepartment}/contact` },
    ];
  } else {
    links = [
      { label: 'Home', href: '/' },
      { label: 'Admissions', href: '/admissions' },
      { label: 'Education', href: '/education' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ];
  }

  return (
    <nav className="fixed top-[70px] sm:top-[80px] md:top-[90px] left-0 right-0 z-40 bg-white shadow border-t-4 border-cyan-300">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* Mobile Search - Left Side */}
        <div className="md:hidden flex items-center flex-1 mr-4" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full border border-cyan-200 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-cyan-600 transition-colors"
            >
              {isSearching ? (
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaSearch className="w-4 h-4" />
              )}
            </button>
            
            {/* Mobile Search Results */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-cyan-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
                {/* Search Suggestions */}
                {searchSuggestions.length > 0 && (
                  <div className="p-2 border-b border-gray-100">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Suggestions
                    </div>
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left p-2 hover:bg-cyan-50 transition-colors text-sm text-cyan-600"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div>
                    <div className="p-2 border-b border-gray-100">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Results ({searchResults.length})
                      </div>
                    </div>
                    {searchResults.slice(0, 5).map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="w-full text-left p-3 hover:bg-cyan-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                            {result.icon()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm text-gray-900 truncate">
                              {result.title}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {result.description}
                            </div>
                            <div className="text-xs text-cyan-600 mt-1 font-medium">
                              {result.category}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {/* No Results */}
                {searchResults.length === 0 && searchSuggestions.length === 0 && searchQuery.trim() && (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
          <ul className="flex gap-6 lg:gap-10 list-none">
            {links.map((link) => {
              const isActive =
                location.pathname === link.href ||
                (link.href === '/ug' && location.pathname === '/ug/') ||
                (link.href === '/' && location.pathname === '/');

              return (
                <li key={link.label} className="relative flex items-center">
                  <Link
                    to={link.href}
                    className={`text-cyan-800 font-semibold text-sm lg:text-base px-2 py-1 transition-colors duration-200 
                      ${isActive ? 'text-cyan-500' : 'hover:text-cyan-600'} 
                      after:content-[''] after:block after:h-0.5 after:bg-gradient-to-r after:from-cyan-400 after:to-blue-400 
                      ${isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'} 
                      after:transition-transform after:duration-300 after:origin-left`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center ml-4 lg:ml-8" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="border border-cyan-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-200 w-32 lg:w-40"
            />
            <button
              type="submit"
              className="ml-2 px-3 py-1 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition text-sm"
            >
              {isSearching ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Search'
              )}
            </button>
            
            {/* Desktop Search Results */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-cyan-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50 min-w-96">
                {/* Search Suggestions */}
                {searchSuggestions.length > 0 && (
                  <div className="p-3 border-b border-gray-100">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Quick Suggestions
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-2 py-1 bg-cyan-50 text-cyan-600 rounded text-xs hover:bg-cyan-100 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div>
                    <div className="p-3 border-b border-gray-100">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Search Results ({searchResults.length})
                      </div>
                    </div>
                    {searchResults.slice(0, 8).map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="w-full text-left p-3 hover:bg-cyan-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                            {result.icon()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm text-gray-900">
                              {result.title}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {result.description}
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <div className="text-xs text-cyan-600 font-medium">
                                {result.category}
                              </div>
                              <div className="text-xs text-gray-500">
                                {result.url}
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {/* No Results */}
                {searchResults.length === 0 && searchSuggestions.length === 0 && searchQuery.trim() && (
                  <div className="p-6 text-center text-gray-500">
                    <div className="text-lg mb-2">🔍</div>
                    <div className="text-sm">No results found for "{searchQuery}"</div>
                    <div className="text-xs mt-1">Try different keywords or check spelling</div>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2.5 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-cyan-400/30"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <FaTimes className="w-5 h-5 animate-pulse" />
            ) : (
              <FaBars className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden bg-white border-t border-cyan-200 shadow-lg"
        >
          <div className="px-4 py-3">
            {/* Mobile Navigation Links */}
            <ul className="space-y-2">
              {links.map((link) => {
                const isActive =
                  location.pathname === link.href ||
                  (link.href === '/ug' && location.pathname === '/ug/') ||
                  (link.href === '/' && location.pathname === '/');

                return (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      onClick={handleMobileLinkClick}
                      className={`block font-semibold text-base px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden
                        ${isActive 
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg transform scale-105 border-l-4 border-white/30' 
                          : 'text-cyan-800 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 hover:text-cyan-600 hover:shadow-md hover:transform hover:scale-102'
                        }
                        ${isActive ? 'before:absolute before:inset-0 before:bg-white/10 before:animate-pulse' : ''}
                      `}
                    >
                      <span className="relative z-10 flex items-center">
                        {link.label}
                        {isActive && (
                          <div className="ml-2 w-2 h-2 bg-white rounded-full animate-bounce"></div>
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};