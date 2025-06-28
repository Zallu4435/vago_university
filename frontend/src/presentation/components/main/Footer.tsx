import React from "react";
import { Link } from "react-router-dom";
import { HiLocationMarker, HiPhone } from "react-icons/hi";
import { FaFacebookF, FaInstagram, FaTelegram, FaYoutube } from "react-icons/fa";

export const Footer: React.FC = () => (
  <footer className="bg-gradient-to-r from-cyan-700 via-blue-600 to-cyan-400 text-white mt-auto border-t-4 border-cyan-300 shadow-lg">
    {/* Upper footer section */}
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 border-b border-white/20">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 sm:mb-4 text-white drop-shadow-lg tracking-wider">
          ACADEMIA UNIVERSITY
        </h2>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 mb-2">
          <div className="flex justify-center items-center">
            <HiLocationMarker className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-cyan-200" />
            <span className="text-sm sm:text-base text-cyan-50">123 Example Street</span>
          </div>
          <div className="flex justify-center items-center">
            <HiPhone className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-cyan-200" />
            <span className="text-sm sm:text-base text-cyan-50">+00 1234 5678</span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Social media icons */}
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-white/20">
      <div className="flex justify-center space-x-6 sm:space-x-8">
        {/* Facebook */}
        <a href="#" className="text-cyan-200 hover:text-white transition-colors duration-300 transform hover:scale-110">
          <FaFacebookF className="w-5 h-5 sm:w-6 sm:h-6" />
        </a>
        {/* Instagram */}
        <a href="#" className="text-cyan-200 hover:text-white transition-colors duration-300 transform hover:scale-110">
          <FaInstagram className="w-5 h-5 sm:w-6 sm:h-6" />
        </a>
        {/* Telegram */}
        <a href="#" className="text-cyan-200 hover:text-white transition-colors duration-300 transform hover:scale-110">
          <FaTelegram className="w-5 h-5 sm:w-6 sm:h-6" />
        </a>
        {/* YouTube */}
        <a href="#" className="text-cyan-200 hover:text-white transition-colors duration-300 transform hover:scale-110">
          <FaYoutube className="w-5 h-5 sm:w-6 sm:h-6" />
        </a>
      </div>
    </div>
    
    {/* Copyright and links */}
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="text-center">
        <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-cyan-50 font-semibold">
          © National University of Academia. All Rights Reserved
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 lg:gap-8">
          <Link to="#" className="text-xs sm:text-sm text-cyan-200 hover:text-white transition-colors duration-300">
            Legal
          </Link>
          <Link to="#" className="text-xs sm:text-sm text-cyan-200 hover:text-white transition-colors duration-300">
            Branding guidelines
          </Link>
          <Link to="#" className="text-xs sm:text-sm text-cyan-200 hover:text-white transition-colors duration-300">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  </footer>
);