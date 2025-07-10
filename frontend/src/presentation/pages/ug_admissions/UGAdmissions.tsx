import AdmissionCategories from "../../components/public/ug_admissions/AdmissionCategories";
import AdmissionsAssessment from "../../components/public/ug_admissions/AdmissionsAssessment";
import ApplicationProcess from "../../components/public/ug_admissions/ApplicationProcess";
import EssentialSteps from "../../components/public/ug_admissions/EssentialSteps";
import { useSectionAnimation } from "../../../shared/hooks/useSectionAnimation";

export const UGAdmissions: React.FC = () => {
  const isVisible = useSectionAnimation();
  return (
    <div className="min-h-screen flex flex-col pt-16 bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-50/30 to-transparent" />
      </div>

      {/* Main content container */}
      <main className="flex-1 relative z-10 pb-8 sm:pb-12 lg:pb-20">
        <div className="relative space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Section 1 */}
          <section
            id="admissions-assessment"
            data-animate
            className={`py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 xl:px-8 max-w-6xl mx-auto transition-all duration-800 ${
              isVisible["admissions-assessment"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-cyan-100 shadow-sm">
              <AdmissionsAssessment />
            </div>
          </section>

          {/* Section 2 */}
          <section
            id="admission-categories"
            data-animate
            className={`py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 xl:px-8 max-w-6xl mx-auto transition-all duration-800 ${
              isVisible["admission-categories"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-cyan-100 shadow-sm">
              <AdmissionCategories />
            </div>
          </section>

          {/* Section 3 */}
          <section
            id="application-process"
            data-animate
            className={`py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 xl:px-8 max-w-6xl mx-auto transition-all duration-800 ${
              isVisible["application-process"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-cyan-100 shadow-sm">
              <ApplicationProcess />
            </div>
          </section>

          <section
            id="essential-steps"
            data-animate
            className={`py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 xl:px-8 max-w-6xl mx-auto transition-all duration-800 ${
              isVisible["essential-steps"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-cyan-100 shadow-sm">
              <EssentialSteps />
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