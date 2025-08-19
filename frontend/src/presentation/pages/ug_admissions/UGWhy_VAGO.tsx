import GraduationSupport from "../../components/public/ug_admissions/GraduationSupport";
import NUSEducationFramework from "../../components/public/ug_admissions/NUSEducationFramework";
import StudentTestimonials from "../../components/public/ug_admissions/StudentTestimonials";
import { useSectionAnimation } from "../../../shared/hooks/useSectionAnimation";

export const UGWhy_VAGO: React.FC = () => {
  const isVisible = useSectionAnimation();
  return (
    <div className="min-h-screen flex flex-col pt-16 bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/30 via-white to-cyan-50/30" />
      </div>

      <main className="flex-1 relative z-10 pb-20 w-full">
        <div className="relative space-y-8 w-full sm:max-w-6xl mx-auto">
          <section
            id="nus-education-framework"
            data-animate
            className={`py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 xl:px-8 w-full transition-all duration-800 ${
              isVisible["nus-education-framework"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-cyan-100 shadow-sm w-full">
              <NUSEducationFramework />
            </div>
          </section>

          <section
            id="graduation-support"
            data-animate
            className={`py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 xl:px-8 w-full transition-all duration-800 ${
              isVisible["graduation-support"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-cyan-100 shadow-sm w-full">
              <GraduationSupport />
            </div>
          </section>

          <section
            id="student-testimonials"
            data-animate
            className={`py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 xl:px-8 w-full transition-all duration-800 ${
              isVisible["student-testimonials"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-cyan-100 shadow-sm w-full">
              <StudentTestimonials />
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
