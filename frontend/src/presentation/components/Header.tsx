import React from "react";
import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { IoSchool } from "react-icons/io5";
import { FaUserGraduate } from "react-icons/fa";
import { SiGooglescholar } from "react-icons/si";

export const Header: React.FC = () => (
  <header className="flex justify-between items-center px-10 py-4 bg-gradient-to-r from-cyan-700 via-blue-600 to-cyan-400 shadow-lg border-b-4 border-cyan-300 z-10 relative">
    <div className="flex items-center">
      <div className="w-14 h-14 mr-4 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-cyan-300">
        <SiGooglescholar className="w-8 h-8 text-cyan-600" />
      </div>
      <span className="text-white text-3xl font-extrabold tracking-widest drop-shadow-lg">ACADEMIA</span>
    </div>
    <div className="flex gap-4">
      <Link 
        to="/dashboard" 
        className="flex items-center bg-white/20 px-4 py-2 rounded-lg text-white font-semibold hover:bg-white/30 transition shadow"
      >
        <MdDashboard className="w-5 h-5 mr-2" />
        Dashboard
      </Link>
      <Link 
        to="/canvas" 
        className="flex items-center bg-white/20 px-4 py-2 rounded-lg text-white font-semibold hover:bg-white/30 transition shadow"
      >
        <IoSchool className="w-5 h-5 mr-2" />
        Canvas
      </Link>
      <Link 
        to="/faculty" 
        className="flex items-center bg-white/20 px-4 py-2 rounded-lg text-white font-semibold hover:bg-white/30 transition shadow"
      >
        <FaUserGraduate className="w-5 h-5 mr-2" />
        Faculty
      </Link>
    </div>
  </header>
);