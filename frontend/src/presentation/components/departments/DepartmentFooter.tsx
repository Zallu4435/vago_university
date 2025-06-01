import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const DepartmentFooter: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-cyan-700 via-blue-600 to-cyan-400 text-white py-12 border-t-4 border-cyan-300 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-white text-cyan-900 px-3 py-2 rounded font-bold">
                CS
              </div>
              <span className="font-bold text-cyan-50">Computer Science</span>
            </div>
            <p className="text-cyan-200">Leading innovation in computing and technology</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-cyan-50">Quick Links</h4>
            <ul className="space-y-2 text-cyan-200">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Admissions</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Academic Calendar</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Library</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Campus Life</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-cyan-50">Resources</h4>
            <ul className="space-y-2 text-cyan-200">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Student Services</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Career Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Research</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">International</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-cyan-50">Contact</h4>
            <div className="space-y-2 text-cyan-200">
              <div className="flex items-center">
                <FaMapMarkerAlt className="w-4 h-4 mr-2 text-cyan-200" />
                <span>123 University Ave</span>
              </div>
              <div className="flex items-center">
                <FaPhone className="w-4 h-4 mr-2 text-cyan-200" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="w-4 h-4 mr-2 text-cyan-200" />
                <span>info@university.edu</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-cyan-200">© 2025 University. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <FaFacebook className="w-5 h-5 text-cyan-200 hover:text-white cursor-pointer transition-colors duration-300" />
            <FaTwitter className="w-5 h-5 text-cyan-200 hover:text-white cursor-pointer transition-colors duration-300" />
            <FaLinkedin className="w-5 h-5 text-cyan-200 hover:text-white cursor-pointer transition-colors duration-300" />
            <FaInstagram className="w-5 h-5 text-cyan-200 hover:text-white cursor-pointer transition-colors duration-300" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DepartmentFooter;