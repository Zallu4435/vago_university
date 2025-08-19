import React from "react";
import { Link } from "react-router-dom";
import { HiLocationMarker, HiPhone } from "react-icons/hi";
import { FaFacebookF, FaInstagram, FaTelegram, FaYoutube } from "react-icons/fa";

export const Footer: React.FC = () => (
  <footer className="bg-gradient-to-r from-cyan-700 via-blue-600 to-cyan-400 text-white mt-auto border-t-4 border-cyan-300 shadow-lg">
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 border-b border-white/20">
      <div className="text-center">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold mb-2 sm:mb-3 md:mb-4 text-white drop-shadow-lg tracking-wider">
          ACADEMIA UNIVERSITY
        </h2>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-2 md:gap-6 mb-2">
          <div className="flex justify-center items-center">
            <HiLocationMarker className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2 text-cyan-200" />
            <span className="text-xs sm:text-sm md:text-base text-cyan-50">123 Example Street</span>
          </div>
          <div className="flex justify-center items-center">
            <HiPhone className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2 text-cyan-200" />
            <span className="text-xs sm:text-sm md:text-base text-cyan-50">+00 1234 5678</span>
          </div>
        </div>
      </div>
    </div>
    
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 border-b border-white/20">
      <div className="flex justify-center space-x-4 sm:space-x-6 md:space-x-8">
        <a href="#" className="text-cyan-200 hover:text-white transition-colors duration-300 transform hover:scale-110 p-1">
          <FaFacebookF className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </a>
        <a href="#" className="text-cyan-200 hover:text-white transition-colors duration-300 transform hover:scale-110 p-1">
          <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </a>
        <a href="#" className="text-cyan-200 hover:text-white transition-colors duration-300 transform hover:scale-110 p-1">
          <FaTelegram className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </a>
        <a href="#" className="text-cyan-200 hover:text-white transition-colors duration-300 transform hover:scale-110 p-1">
          <FaYoutube className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </a>
      </div>
    </div>
    
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
      <div className="text-center">
        <p className="mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm text-cyan-50 font-semibold">
          © National University of Academia. All Rights Reserved
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 md:gap-6 lg:gap-8">
          <Link to="#" className="text-xs sm:text-sm text-cyan-200 hover:text-white transition-colors duration-300 px-2 py-1 rounded hover:bg-white/10">
            Legal
          </Link>
          <Link to="#" className="text-xs sm:text-sm text-cyan-200 hover:text-white transition-colors duration-300 px-2 py-1 rounded hover:bg-white/10">
            Branding guidelines
          </Link>
          <Link to="#" className="text-xs sm:text-sm text-cyan-200 hover:text-white transition-colors duration-300 px-2 py-1 rounded hover:bg-white/10">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  </footer>
);