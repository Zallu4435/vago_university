import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export const PresidentsWelcome: React.FC = () => {
  return (
    <section className="bg-transparent_65 rounded-xl border border-cyan-100 shadow-sm p-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-3 text-cyan-800">
          President's Welcome
        </h2>
        <p className="text-cyan-600 text-lg mb-6 max-w-2xl mx-auto">
          We are Singapore's flagship university. We hope you will be inspired by the many fascinating facets that make NUS a leading global university centred in Asia.
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mb-10" />
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-8">
        {/* Left side - Enhanced quote box */}
        <div className="bg-gradient-to-r from-cyan-700 via-blue-600 to-cyan-600 text-white p-8 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300">
          <h3 className="text-2xl font-semibold mb-4">Shaping the Future</h3>
          <blockquote className="text-lg mb-6 italic">
            "At NUS, we are moving boldly — and concertedly — to expand tomorrow's frontiers. We believe that we have the power to shape the future, for the better."
          </blockquote>
          <Link 
            to="/president-message" 
            className="inline-flex items-center px-6 py-3 bg-white/20 rounded-lg text-white font-semibold hover:bg-white/30 transition group"
          >
            Learn More
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Right side - Enhanced president image */}
        <div className="flex justify-center">
          <div className="relative group">
            <img
              src="https://via.placeholder.com/400x300?text=President+Photo"
              alt="University President"
              className="rounded-xl w-full max-w-sm object-cover shadow-lg transform group-hover:-translate-y-1 transition-all duration-300"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-cyan-700 to-blue-600 text-white p-4 rounded-lg opacity-90">
              <h4 className="font-semibold">Prof. John Doe</h4>
              <p className="text-sm">President, Academia University</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
