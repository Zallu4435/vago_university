import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const DepartmentFooter: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-cyan-700 via-blue-600 to-cyan-400 text-white py-8 sm:py-10 lg:py-12 border-t-4 border-cyan-300 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <div className="bg-white text-cyan-900 px-2 sm:px-3 py-1 sm:py-2 rounded font-bold text-sm sm:text-base">
                CS
              </div>
              <span className="font-bold text-cyan-50 text-sm sm:text-base lg:text-lg">Computer Science</span>
            </div>
            <p className="text-cyan-200 text-xs sm:text-sm lg:text-base">Leading innovation in computing and technology</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-cyan-50 text-sm sm:text-base lg:text-lg">Quick Links</h4>
            <ul className="space-y-1 sm:space-y-2 text-cyan-200">
              <li><a href="#" className="hover:text-white transition-colors duration-300 text-xs sm:text-sm lg:text-base">Admissions</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300 text-xs sm:text-sm lg:text-base">Academic Calendar</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300 text-xs sm:text-sm lg:text-base">Library</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300 text-xs sm:text-sm lg:text-base">Campus Life</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-cyan-50 text-sm sm:text-base lg:text-lg">Resources</h4>
            <ul className="space-y-1 sm:space-y-2 text-cyan-200">
              <li><a href="#" className="hover:text-white transition-colors duration-300 text-xs sm:text-sm lg:text-base">Student Services</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300 text-xs sm:text-sm lg:text-base">Career Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300 text-xs sm:text-sm lg:text-base">Research</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300 text-xs sm:text-sm lg:text-base">International</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-cyan-50 text-sm sm:text-base lg:text-lg">Contact</h4>
            <div className="space-y-1 sm:space-y-2 text-cyan-200">
              <div className="flex items-center">
                <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-cyan-200 flex-shrink-0" />
                <span className="text-xs sm:text-sm lg:text-base">123 University Ave</span>
              </div>
              <div className="flex items-center">
                <FaPhone className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-cyan-200 flex-shrink-0" />
                <span className="text-xs sm:text-sm lg:text-base">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-cyan-200 flex-shrink-0" />
                <span className="text-xs sm:text-sm lg:text-base">info@university.edu</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-cyan-200 text-xs sm:text-sm lg:text-base text-center sm:text-left">© 2025 University. All rights reserved.</p>
          <div className="flex space-x-3 sm:space-x-4">
            <FaFacebook className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-200 hover:text-white cursor-pointer transition-colors duration-300" />
            <FaTwitter className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-200 hover:text-white cursor-pointer transition-colors duration-300" />
            <FaLinkedin className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-200 hover:text-white cursor-pointer transition-colors duration-300" />
            <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-200 hover:text-white cursor-pointer transition-colors duration-300" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DepartmentFooter;