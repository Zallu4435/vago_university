import GraduationSupport from "../../components/ug_admissions/GraduationSupport";
import NUSEducationFramework from "../../components/ug_admissions/NUSEducationFramework";
import StudentTestimonials from "../../components/ug_admissions/StudentTestimonials";

export const UGWhy_VAGO: React.FC = () => {
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
          <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-100">
              <NUSEducationFramework />
            </div>
          </section>

          {/* Section 2 */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-100">
              <GraduationSupport />
            </div>
          </section>

          {/* Section 3 */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-100">
              <StudentTestimonials />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
