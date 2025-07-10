import React from 'react';
import { FaUniversity, FaGraduationCap, FaUsers, FaChartLine } from 'react-icons/fa';

const InNumbers: React.FC = () => {
  const stats = {
    campus: [
      { number: '3', label: 'Campuses: Kent Ridge, Bukit Timah and Outram', icon: FaUniversity },
      { number: '16', label: 'Colleges, faculties and schools', icon: FaUniversity },
      { number: '37', label: 'University-level research institutes and centres', icon: FaChartLine },
      { number: '6', label: 'Research Centres of Excellence', icon: FaChartLine }
    ],
    programs: [
      { number: '60', label: "Bachelor's degrees" },
      { number: '54', label: 'Second majors' },
      { number: '24', label: 'Concurrent degrees' },
      { number: '35', label: 'Joint degrees' },
      { number: '73', label: 'Double degrees' },
      { number: '174', label: "Master's degrees, Doctoral degrees, Graduate diplomas" }
    ],
    community: [
      { number: '31.5K', label: 'Undergraduates' },
      { number: '20.1K', label: 'Graduate students' },
      { number: '2.5K', label: 'Faculty' },
      { number: '4.2K', label: 'Research staff' },
      { number: '4.4K', label: 'Executive & professional staff' },
      { number: '1.5K', label: 'Administrative staff' }
    ]
  };

  return (
    <section className="w-full bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
      {/* Hero Image Section */}
      <div className="relative h-[200px] sm:h-[300px] lg:h-[400px] w-full overflow-hidden group">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{
            backgroundImage: 'url("/images/university-town.jpg")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/80 to-blue-900/70 sm:from-cyan-900/90 sm:to-blue-900/80 group-hover:from-cyan-900/70 group-hover:to-blue-900/60 transition-all duration-500" />
        </div>
        <div className="relative h-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 flex flex-col justify-center text-white">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500">
            University Town
          </h1>
          <p className="text-sm sm:text-base lg:text-xl text-cyan-100 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 delay-100">
            Study. Play. Live.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-cyan-800 mb-2 sm:mb-4">Academia in Numbers</h2>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
        </div>

        {/* Campus Stats */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h3 className="text-lg sm:text-xl font-semibold text-cyan-700 mb-4 sm:mb-6 text-center">Campus & Research</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {stats.campus.map((stat, index) => (
              <div key={index} className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl border border-cyan-100 text-center transform hover:-translate-y-1 transition-all duration-300">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  {stat.number}
                </p>
                <p className="text-xs sm:text-sm text-cyan-600 mt-1 sm:mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Programs Stats */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h3 className="text-lg sm:text-xl font-semibold text-cyan-700 mb-4 sm:mb-6 text-center">Academic Programs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {stats.programs.map((stat, index) => (
              <div key={index} className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl border border-cyan-100 text-center transform hover:-translate-y-1 transition-all duration-300">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  {stat.number}
                </p>
                <p className="text-xs sm:text-sm text-cyan-600 mt-1 sm:mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Community Stats */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-cyan-700 mb-4 sm:mb-6 text-center">Our Community</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {stats.community.map((stat, index) => (
              <div key={index} className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl border border-cyan-100 text-center transform hover:-translate-y-1 transition-all duration-300">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  {stat.number}
                </p>
                <p className="text-xs sm:text-sm text-cyan-600 mt-1 sm:mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InNumbers;