import React from 'react';
import  CollegesFacultiesSchools  from "../../components/public/main/CollegesFacultiesSchools";
import  AcademicCalendar  from "../../components/public/main/AcademicCalendar";
import  NeedHelp  from "../../components/public/main/NeedHelp";
import { useSectionAnimation } from "../../../shared/hooks/useSectionAnimation";

export const Education: React.FC = () => {
  const isVisible = useSectionAnimation();
  return (
    <div className="min-h-screen flex pt-16 flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-50">

      {/* Main content container */}
      <main className="flex-1 relative pb-8 sm:pb-12 lg:pb-20">
        {/* Subtle background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/30 via-white to-cyan-50/30" />
        </div>

        {/* Content sections */}
        <div className="relative space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Colleges Section */}
          <section
            id="colleges"
            data-animate
            className={`py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 xl:px-8 max-w-6xl mx-auto transition-all duration-800 ${
              isVisible["colleges"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-cyan-100">
              <CollegesFacultiesSchools />
            </div>
          </section>

          {/* Academic Calendar Section */}
          <section
            id="academic-calendar"
            data-animate
            className={`py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 xl:px-8 max-w-6xl mx-auto transition-all duration-800 ${
              isVisible["academic-calendar"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-cyan-100">
              <AcademicCalendar />
            </div>
          </section>

          {/* Need Help Section */}
          <section
            id="need-help"
            data-animate
            className={`py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 xl:px-8 max-w-6xl mx-auto transition-all duration-800 ${
              isVisible["need-help"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-cyan-100">
              <NeedHelp />
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