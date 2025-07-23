import React from 'react';

interface StatsData {
  title: string;
  stats: Array<{
    value: string;
    label: string;
    icon: React.ElementType;
  }>;
}

interface DepartmentStatsProps {
  statsData: StatsData;
}

const DepartmentStats: React.FC<DepartmentStatsProps> = ({ statsData }) => (
  <section
    id="stats"
    data-animate
    className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-cyan-50 via-white to-cyan-50 transition-all duration-1000"
  >
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-3 sm:mb-4">{statsData.title}</h2>
        <p className="text-sm sm:text-base lg:text-lg text-cyan-600 max-w-3xl mx-auto px-2">
          Our achievements speak for themselves
        </p>
        <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mt-3 sm:mt-4" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {statsData.stats.map((stat, index) => (
          <div
            key={index}
            className="group bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-6 sm:p-8 text-center transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex flex-col items-center mb-3 sm:mb-4">
              <div className="p-3 sm:p-4 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 mb-2">
                <stat.icon className="text-cyan-600 text-2xl sm:text-3xl" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                {stat.value}
              </div>
            </div>
            <div className="text-xs sm:text-sm text-cyan-700 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default DepartmentStats; 