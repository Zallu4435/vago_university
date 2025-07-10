import React from 'react';
import { FaLightbulb, FaGraduationCap, FaHeart } from 'react-icons/fa';

const MissionVision: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-b from-cyan-50 via-white to-cyan-50 py-6 sm:py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-cyan-800 mb-2 sm:mb-4">
            Our Purpose & Values
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-cyan-600 max-w-3xl mx-auto mb-4 sm:mb-6 px-2">
            Academia University aspires to be a vital community of academics, researchers, 
            staff, students and alumni working together in a spirit of innovation and 
            enterprise for a better world.
          </p>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
        </div>

        {/* Vision, Mission, Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {/* Vision Card */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg sm:rounded-xl p-4 sm:p-6 transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <FaLightbulb className="text-2xl sm:text-3xl text-cyan-200" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-center mb-2 sm:mb-3">Vision</h3>
            <p className="text-center text-cyan-100 text-sm sm:text-base">
              A leading global university shaping the future through innovation and excellence
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-gradient-to-r from-cyan-700 to-blue-700 text-white rounded-lg sm:rounded-xl p-4 sm:p-6 transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <FaGraduationCap className="text-2xl sm:text-3xl text-cyan-200" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-center mb-2 sm:mb-3">Mission</h3>
            <p className="text-center text-cyan-100 text-sm sm:text-base">
              To educate, inspire and transform minds while fostering innovation and 
              academic excellence
            </p>
          </div>

          {/* Values Card */}
          <div className="bg-gradient-to-r from-cyan-800 to-blue-800 text-white rounded-lg sm:rounded-xl p-4 sm:p-6 transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <FaHeart className="text-2xl sm:text-3xl text-cyan-200" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-center mb-2 sm:mb-3">Values</h3>
            <ul className="text-center text-cyan-100 space-y-1 sm:space-y-2 text-sm sm:text-base">
              <li>Innovation</li>
              <li>Resilience</li>
              <li>Excellence</li>
              <li>Respect</li>
              <li>Integrity</li>
            </ul>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="text-center mt-8 sm:mt-10 lg:mt-12 max-w-3xl mx-auto">
          <p className="text-sm sm:text-base lg:text-lg text-cyan-700 italic px-2">
            "Our singular focus on talent will be the cornerstone of a truly great 
            university that is dedicated to quality education, influential research 
            and visionary enterprise, in service of country and society."
          </p>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;