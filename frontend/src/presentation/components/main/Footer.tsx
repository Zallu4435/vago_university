import React from "react";
import { Link } from "react-router-dom";
import { HiLocationMarker, HiPhone } from "react-icons/hi";
import { FaFacebookF, FaInstagram, FaTelegram, FaYoutube } from "react-icons/fa";

export const Footer: React.FC = () => (
  <footer className="bg-gradient-to-r from-cyan-700 via-blue-600 to-cyan-400 text-white mt-auto border-t-4 border-cyan-300 shadow-lg">
    {/* Upper footer section */}
    <div className="container mx-auto px-4 py-8 border-b border-white/20">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold mb-2 text-white drop-shadow-lg tracking-wider">
          ACADEMIA UNIVERSITY
        </h2>
        <div className="flex justify-center items-center mb-2">
          <HiLocationMarker className="h-5 w-5 mr-2 text-cyan-200" />
          <span className="text-cyan-50">123 Example Street</span>
        </div>
        <div className="flex justify-center items-center">
          <HiPhone className="h-5 w-5 mr-2 text-cyan-200" />
          <span className="text-cyan-50">+00 1234 5678</span>
        </div>
      </div>
    </div>
    
    {/* Social media icons */}
    <div className="container mx-auto px-4 py-6 border-b border-white/20">
      <div className="flex justify-center space-x-8">
        {/* Facebook */}
        <a href="#" className="text-cyan-200 hover:text-white transition-colors duration-300">
          <FaFacebookF className="w-6 h-6" />
        </a>
        {/* Instagram */}
        <a href="#" className="text-cyan-200 hover:text-white transition-colors duration-300">
          <FaInstagram className="w-6 h-6" />
        </a>
        {/* Telegram */}
        <a href="#" className="text-cyan-200 hover:text-white transition-colors duration-300">
          <FaTelegram className="w-6 h-6" />
        </a>
        {/* YouTube */}
        <a href="#" className="text-cyan-200 hover:text-white transition-colors duration-300">
          <FaYoutube className="w-6 h-6" />
        </a>
      </div>
    </div>
    
    {/* Copyright and links */}
    <div className="container mx-auto px-4 py-4">
      <div className="text-center text-sm">
        <p className="mb-4 text-cyan-50 font-semibold">© National University of Academia. All Rights Reserved</p>
        <div className="flex justify-center space-x-8">
          <Link to="#" className="text-cyan-200 hover:text-white transition-colors duration-300">
            Legal
          </Link>
          <Link to="#" className="text-cyan-200 hover:text-white transition-colors duration-300">
            Branding guidelines
          </Link>
          <Link to="#" className="text-cyan-200 hover:text-white transition-colors duration-300">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  </footer>
);