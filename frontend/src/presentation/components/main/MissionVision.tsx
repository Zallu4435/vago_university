import React from 'react';
import { FaLightbulb, FaGraduationCap, FaHeart } from 'react-icons/fa';

const MissionVision: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-b from-cyan-50 via-white to-cyan-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-cyan-800 mb-4">
            Our Purpose & Values
          </h2>
          <p className="text-lg text-cyan-600 max-w-3xl mx-auto mb-6">
            Academia University aspires to be a vital community of academics, researchers, 
            staff, students and alumni working together in a spirit of innovation and 
            enterprise for a better world.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
        </div>

        {/* Vision, Mission, Values Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Vision Card */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl p-6 transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-center mb-4">
              <FaLightbulb className="text-3xl text-cyan-200" />
            </div>
            <h3 className="text-xl font-bold text-center mb-3">Vision</h3>
            <p className="text-center text-cyan-100">
              A leading global university shaping the future through innovation and excellence
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-gradient-to-r from-cyan-700 to-blue-700 text-white rounded-xl p-6 transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-center mb-4">
              <FaGraduationCap className="text-3xl text-cyan-200" />
            </div>
            <h3 className="text-xl font-bold text-center mb-3">Mission</h3>
            <p className="text-center text-cyan-100">
              To educate, inspire and transform minds while fostering innovation and 
              academic excellence
            </p>
          </div>

          {/* Values Card */}
          <div className="bg-gradient-to-r from-cyan-800 to-blue-800 text-white rounded-xl p-6 transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-center mb-4">
              <FaHeart className="text-3xl text-cyan-200" />
            </div>
            <h3 className="text-xl font-bold text-center mb-3">Values</h3>
            <ul className="text-center text-cyan-100 space-y-2">
              <li>Innovation</li>
              <li>Resilience</li>
              <li>Excellence</li>
              <li>Respect</li>
              <li>Integrity</li>
            </ul>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="text-center mt-12 max-w-3xl mx-auto">
          <p className="text-lg text-cyan-700 italic">
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