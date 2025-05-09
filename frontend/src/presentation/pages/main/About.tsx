import React from 'react';

import MissionVision from '../../components/main/MissionVision';
import UniversityLeadership from '../../components/main/UniversityLeadership';
import InNumbers from '../../components/main/InNumbers';

export const About: React.FC = () => {
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
          <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100">
              <MissionVision />
            </div>
          </section>

          {/* Leadership Section */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100">
              <UniversityLeadership />
            </div>
          </section>

          {/* Statistics Section */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100">
              <InNumbers />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};