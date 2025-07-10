import React from 'react';
import UndergraduateProgrammes from "../../components/public/ug_admissions/UndergraduateProgrammes";
import UndergraduatePublications from "../../components/public/ug_admissions/UndergraduatePublications";
import WhatMakesNUSDifferent from "../../components/public/ug_admissions/WhatMakesNUSDifferent";
import { useSectionAnimation } from "../../../shared/hooks/useSectionAnimation";

export const UGHome: React.FC = () => {
  const isVisible = useSectionAnimation();
  return (
    <div className="min-h-screen flex flex-col pt-16">
      {/* Main content container */}
      <main className="flex-1 relative pb-8 sm:pb-12 lg:pb-20 bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
        <div className="relative space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Section 1 */}
          <section
            id="what-makes-nus-different"
            data-animate
            className={`py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 xl:px-8 max-w-6xl mx-auto transition-all duration-800 ${
              isVisible["what-makes-nus-different"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-cyan-100 shadow-sm">
              <WhatMakesNUSDifferent />
            </div>
          </section>

          {/* Section 2 */}
          <section
            id="undergraduate-programmes"
            data-animate
            className={`py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 xl:px-8 max-w-6xl mx-auto transition-all duration-800 ${
              isVisible["undergraduate-programmes"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-cyan-100 shadow-sm">
              <UndergraduateProgrammes />
            </div>
          </section>

          {/* Section 3 */}
          <section
            id="undergraduate-publications"
            data-animate
            className={`py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 xl:px-8 max-w-6xl mx-auto transition-all duration-800 ${
              isVisible["undergraduate-publications"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-cyan-100 shadow-sm">
              <UndergraduatePublications />
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