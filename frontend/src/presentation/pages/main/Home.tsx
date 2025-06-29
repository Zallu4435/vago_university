import { ArticleGrid } from "../../components/main/ArticleGrid";
import { PresidentsWelcome } from "../../components/main/PresidentsWelcome";
import { VagoNow } from "../../components/main/VagoNow";
import { ThoughtLeadership } from "../../components/main/ThoughtLeadership";
import { useSectionAnimation } from "../../../application/hooks/useSectionAnimation";
import React from "react";

export const Home: React.FC = () => {
  const isVisible = useSectionAnimation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
      {/* Main content container */}
      <main className="flex-1 relative pb-8 sm:pb-12 md:pb-16 lg:pb-20">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-50/30 to-transparent pointer-events-none" />
        
        {/* Content sections */}
        <div className="relative space-y-6 sm:space-y-8 lg:space-y-12">
          <section
            id="article-grid"
            data-animate
            className={`py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-800 ${
              isVisible["article-grid"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <ArticleGrid />
          </section>

          <section
            id="presidents-welcome"
            data-animate
            className={`py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-800 ${
              isVisible["presidents-welcome"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <PresidentsWelcome />
          </section>

          <section
            id="vago-now"
            data-animate
            className={`py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-800 ${
              isVisible["vago-now"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <VagoNow />
          </section>

          <section
            id="thought-leadership"
            data-animate
            className={`py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-800 ${
              isVisible["thought-leadership"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <ThoughtLeadership />
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