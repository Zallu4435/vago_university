import { Programmes } from "../../components/main/Programmes";
import Scholarships from "../../components/main/Scholarships";
import Apply from "../../components/main/Apply";
import { useSectionAnimation } from "../../../application/hooks/useSectionAnimation";
import React from "react";

export const Admissions: React.FC = () => {
  const isVisible = useSectionAnimation();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-50 mt-16 via-white to-cyan-50">
      {/* Main content container */}
      <main className="flex-1 relative pb-8 sm:pb-12 md:pb-16">
        {/* Subtle background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/30 via-white to-cyan-50/30" />
        </div>

        {/* Content sections */}
        <div className="relative space-y-6 sm:space-y-8">
          {/* Programmes Section */}
          <section
            id="programmes"
            data-animate
            className={`py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto transition-all duration-800 ${
              isVisible["programmes"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100">
              <Programmes />
            </div>
          </section>

          {/* Scholarships Section */}
          <section
            id="scholarships"
            data-animate
            className={`py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto transition-all duration-800 ${
              isVisible["scholarships"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100">
              <Scholarships />
            </div>
          </section>

          {/* Apply Section */}
          <section
            id="apply"
            data-animate
            className={`py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto transition-all duration-800 ${
              isVisible["apply"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100">
              <Apply />
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