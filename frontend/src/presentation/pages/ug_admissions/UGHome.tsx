import React from 'react';
import UndergraduateProgrammes from "../../components/ug_admissions/UndergraduateProgrammes";
import UndergraduatePublications from "../../components/ug_admissions/UndergraduatePublications";
import WhatMakesNUSDifferent from "../../components/ug_admissions/WhatMakesNUSDifferent";

export const UGHome: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col pt-16">
      {/* Main content container */}
      <main className="flex-1 relative pb-20 bg-gradient-to-b from-cyan-50/30 via-white to-cyan-50/30">
        <div className="relative space-y-8">
          {/* Section 1 */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-100">
              <WhatMakesNUSDifferent />
            </div>
          </section>

          {/* Section 2 */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-100">
              <UndergraduateProgrammes />
            </div>
          </section>

          {/* Section 3 */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-100">
              <UndergraduatePublications />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};