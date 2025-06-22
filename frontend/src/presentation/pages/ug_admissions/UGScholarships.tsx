import NUSScholarships from "../../components/ug_admissions/NUSScholarships";
import StudentTestimonials from "../../components/ug_admissions/StudentTestimonials";
import { useSectionAnimation } from "../../../application/hooks/useSectionAnimation";

export const UGScholarships: React.FC = () => {
  const isVisible = useSectionAnimation();
  return (
    <div className="min-h-screen flex flex-col pt-16 bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/30 via-white to-cyan-50/30" />
      </div>

      {/* Main content container */}
      <main className="flex-1 relative z-10 pb-20">
        <div className="relative space-y-8">
          {/* Section 1 */}
          <section
            id="nus-scholarships"
            data-animate
            className={`py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto transition-all duration-800 ${
              isVisible["nus-scholarships"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-100">
              <NUSScholarships />
            </div>
          </section>
          {/* Section 3 */}
          <section
            id="student-testimonials"
            data-animate
            className={`py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto transition-all duration-800 ${
              isVisible["student-testimonials"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-100">
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
