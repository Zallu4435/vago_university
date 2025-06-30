import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa';

interface NavbarProps {
  layoutType?: 'public' | 'ug' | 'department';
}

export const Navbar: React.FC<NavbarProps> = ({ layoutType = 'public' }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Get the current department from the URL for department layout
  const currentDepartment = location.pathname.split('/')[2] || 'computer-science';

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  return (
    <nav className="fixed top-[70px] sm:top-[80px] md:top-[90px] left-0 right-0 z-40 bg-white shadow border-t-4 border-cyan-300">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* Mobile Search - Left Side */}
        <div className="md:hidden flex items-center flex-1 mr-4">
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search..."
              className="w-full border border-cyan-200 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4" />
          </div>
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
        <div className="hidden md:flex items-center ml-4 lg:ml-8">
          <input
            type="text"
            placeholder="Search..."
            className="border border-cyan-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-200 w-32 lg:w-40"
          />
          <button
            type="button"
            className="ml-2 px-3 py-1 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition text-sm"
          >
            Search
          </button>
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