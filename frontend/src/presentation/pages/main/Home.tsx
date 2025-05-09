import { ArticleGrid } from "../../components/main/ArticleGrid";
import { PresidentsWelcome } from "../../components/main/PresidentsWelcome";
import { VagoNow } from "../../components/main/VagoNow";
import { ThoughtLeadership } from "../../components/main/ThoughtLeadership";

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
      {/* Main content container */}
      <main className="flex-1 relative pb-20">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-50/30 to-transparent pointer-events-none" />
        
        {/* Content sections */}
        <div className="relative">
          <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <ArticleGrid />
          </section>

          <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <PresidentsWelcome />
          </section>

          <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <VagoNow />
          </section>

          <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <ThoughtLeadership />
          </section>
        </div>
      </main>
    </div>
  );
};