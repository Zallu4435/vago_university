import AdmissionCategories from "../../components/ug_admissions/AdmissionCategories";
import AdmissionsAssessment from "../../components/ug_admissions/AdmissionsAssessment";
import ApplicationProcess from "../../components/ug_admissions/ApplicationProcess";
import EssentialSteps from "../../components/ug_admissions/EssentialSteps";

export const UGAdmissions: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col pt-16 bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-50/30 to-transparent" />
      </div>

      {/* Main content container */}
      <main className="flex-1 relative z-10 pb-20">
        <div className="relative space-y-8">
          {/* Section 1 */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-100 shadow-sm">
              <AdmissionsAssessment />
            </div>
          </section>

          {/* Section 2 */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-100 shadow-sm">
              <AdmissionCategories />
            </div>
          </section>

          {/* Section 3 */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-100 shadow-sm">
              <ApplicationProcess />
            </div>
          </section>

          <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-100 shadow-sm">
              <EssentialSteps />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};