import React from 'react';
import MissionVision from '../../components/main/MissionVision';
import UniversityLeadership from '../../components/main/UniversityLeadership';
import InNumbers from '../../components/main/InNumbers';
import { useSectionAnimation } from '../../../application/hooks/useSectionAnimation';

export const About: React.FC = () => {
  const isVisible = useSectionAnimation();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-50">

      {/* Main content container */}
      <main className="flex-1 relative pb-20 pt-16">
        {/* Subtle background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/30 via-white to-cyan-50/30" />
        </div>

        {/* Content sections */}
        <div className="relative space-y-8">
          {/* Mission & Vision Section */}
          <section
            id="mission-vision"
            data-animate
            className={`py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto transition-all duration-800 ${
              isVisible["mission-vision"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100">
              <MissionVision />
            </div>
          </section>

          {/* Leadership Section */}
          <section
            id="leadership"
            data-animate
            className={`py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto transition-all duration-800 ${
              isVisible["leadership"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100">
              <UniversityLeadership />
            </div>
          </section>

          {/* Statistics Section */}
          <section
            id="in-numbers"
            data-animate
            className={`py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto transition-all duration-800 ${
              isVisible["in-numbers"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100">
              <InNumbers />
            </div>
          </section>
        </div>
      </main>
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};