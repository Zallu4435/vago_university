
import { Programmes } from "../../components/main/Programmes";
import Scholarships from "../../components/main/Scholarships";
import Apply from "../../components/main/Apply";

export const Admissions: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-50 mt-16 via-white to-cyan-50">
      {/* Main content container */}
      <main className="flex-1 relative pb-16">
        {/* Subtle background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/30 via-white to-cyan-50/30" />
        </div>

        {/* Content sections */}
        <div className="relative space-y-8">
          {/* Programmes Section */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100">
              <Programmes />
            </div>
          </section>

          {/* Scholarships Section */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100">
              <Scholarships />
            </div>
          </section>

          {/* Apply Section */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100">
              <Apply />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};