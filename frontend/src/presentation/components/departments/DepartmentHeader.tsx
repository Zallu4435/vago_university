import React from 'react';
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const DepartmentHeader: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white text-sm py-2">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Contact Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <FaEnvelope className="w-4 h-4 text-gray-300" />
            <span>info@university.edu</span>
          </div>
          <div className="flex items-center gap-1">
            <FaPhoneAlt className="w-4 h-4 text-gray-300" />
            <span>+1 (555) 123-4567</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-gray-300 transition">Student Portal</a>
          <a href="#" className="hover:text-gray-300 transition">Staff Portal</a>
          <a href="#" className="hover:text-gray-300 transition">Alumni</a>
        </div>
      </div>
    </div>
  );
};

export default DepartmentHeader;
