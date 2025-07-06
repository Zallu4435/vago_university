import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export const PresidentsWelcome: React.FC = () => {
  return (
    <section className="bg-transparent_65 rounded-xl border border-cyan-100 shadow-sm p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-cyan-800">
          President's Welcome
        </h2>
        <p className="text-cyan-600 text-base sm:text-lg mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
          We are Singapore's flagship university. We hope you will be inspired by the many fascinating facets that make NUS a leading global university centred in Asia.
        </p>
        <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mb-6 sm:mb-8 md:mb-10" />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-6 sm:gap-8">
        {/* Left side - Enhanced quote box */}
        <div className="bg-gradient-to-r from-cyan-700 via-blue-600 to-cyan-600 text-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300">
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Shaping the Future</h3>
          <blockquote className="text-base sm:text-lg mb-4 sm:mb-6 italic">
            "At NUS, we are moving boldly — and concertedly — to expand tomorrow's frontiers. We believe that we have the power to shape the future, for the better."
          </blockquote>
          <Link 
            to="/president-message" 
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white/20 rounded-lg text-white font-semibold hover:bg-white/30 transition group text-sm sm:text-base"
          >
            Learn More
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Right side - Enhanced president image */}
        <div className="flex justify-center">
          <div className="relative group">
            <img
              src="/images/president-welcome.webp"
              alt="University President"
              className="rounded-xl w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl object-cover shadow-lg transform group-hover:-translate-y-1 transition-all duration-300"
            />
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 bg-gradient-to-r from-cyan-700 to-blue-600 text-white p-3 sm:p-4 rounded-lg opacity-90">
              <h4 className="font-semibold text-sm sm:text-base">Prof. John Doe</h4>
              <p className="text-xs sm:text-sm">President, Academia University</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
