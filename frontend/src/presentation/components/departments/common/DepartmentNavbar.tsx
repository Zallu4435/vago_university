import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa';

const DepartmentNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Get the current department from the URL
  const currentDepartment = location.pathname.split('/')[2]; // e.g., 'computer-science' or 'business'

  const navItems = [
    { label: 'Home', path: `/departments/${currentDepartment}` },
    { label: 'About', path: `/departments/${currentDepartment}/about` },
    { label: 'Program', path: `/departments/${currentDepartment}/program` },
    { label: 'Community', path: `/departments/${currentDepartment}/community` },
    { label: 'Entrepreneur', path: `/departments/${currentDepartment}/entrepreneur` }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-blue-700 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-white text-gray-900 px-3 py-2 rounded font-bold">
              CS
            </div>
            <div>
              <div className="font-bold text-lg">School of Computer Science</div>
              <div className="text-sm opacity-90">Leading innovation in computing and technology</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors relative group ${
                  isActive(item.path) ? 'text-yellow-300' : 'hover:text-gray-200'
                }`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-yellow-300 transition-all duration-300 ${
                  isActive(item.path) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}
            <FaSearch className="w-5 h-5 cursor-pointer hover:text-gray-200" />
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-opacity-20 py-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block w-full text-left py-2 px-4 hover:bg-black hover:bg-opacity-20 ${
                  isActive(item.path) ? 'text-yellow-300' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default DepartmentNavbar; 