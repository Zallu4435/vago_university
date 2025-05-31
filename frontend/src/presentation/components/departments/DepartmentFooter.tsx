import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const DepartmentFooter: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-white text-gray-900 px-3 py-2 rounded font-bold">
                CS
              </div>
              <span className="font-bold">Computer Science</span>
            </div>
            <p className="text-gray-400">Leading innovation in computing and technology</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Admissions</a></li>
              <li><a href="#" className="hover:text-white">Academic Calendar</a></li>
              <li><a href="#" className="hover:text-white">Library</a></li>
              <li><a href="#" className="hover:text-white">Campus Life</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Student Services</a></li>
              <li><a href="#" className="hover:text-white">Career Center</a></li>
              <li><a href="#" className="hover:text-white">Research</a></li>
              <li><a href="#" className="hover:text-white">International</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center">
                <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                <span>123 University Ave</span>
              </div>
              <div className="flex items-center">
                <FaPhone className="w-4 h-4 mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="w-4 h-4 mr-2" />
                <span>info@university.edu</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© 2025 University. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <FaFacebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            <FaTwitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            <FaLinkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            <FaInstagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DepartmentFooter; 