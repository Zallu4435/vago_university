import React from 'react';
import  CollegesFacultiesSchools  from "../../components/main/CollegesFacultiesSchools";
import  AcademicCalendar  from "../../components/main/AcademicCalendar";
import  NeedHelp  from "../../components/main/NeedHelp";

export const Education: React.FC = () => {
  return (
    <div className="min-h-screen flex pt-16 flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-50">

      {/* Main content container */}
      <main className="flex-1 relative pb-20 ">
        {/* Subtle background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/30 via-white to-cyan-50/30" />
        </div>

        {/* Content sections */}
        <div className="relative space-y-8">
          {/* Colleges Section */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-100">
              <CollegesFacultiesSchools />
            </div>
          </section>

          {/* Academic Calendar Section */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-100">
              <AcademicCalendar />
            </div>
          </section>

          {/* Need Help Section */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-100">
              <NeedHelp />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};