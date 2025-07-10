import React from 'react';
import { FaTrophy, FaGraduationCap, FaUsers, FaGlobeAmericas, FaBriefcase } from 'react-icons/fa';

interface StatCardProps {
  title: string;
  stats: Array<{ number: string; description: string }>;
  icon: React.ElementType;
}

const StatCard: React.FC<StatCardProps> = ({ title, stats, icon: Icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 h-full flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-xl border border-cyan-100">
      <div className="flex items-center mb-3 sm:mb-4">
        <div className="p-2 sm:p-3 rounded-full bg-cyan-100 mr-3 sm:mr-4">
          <Icon className="text-cyan-600 text-lg sm:text-xl" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-cyan-800">{title}</h3>
      </div>
      <div className="space-y-3 sm:space-y-4 mt-2">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold text-cyan-600">{stat.number}</span>
            <span className="text-xs sm:text-sm text-cyan-600">{stat.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const WhatMakesNUSDifferent = () => {
  const stats = [
    {
      title: "Ranking",
      icon: FaTrophy,
      stats: [
        { number: "8th", description: "In the World*" },
        { number: "1st", description: "In Asia*" }
      ]
    },
    {
      title: "Academics",
      icon: FaGraduationCap,
      stats: [
        { number: "> 60", description: "Bachelor's Degrees" },
        { number: "> 130", description: "Double, Concurrent and Joint degrees" }
      ]
    },
    {
      title: "Student Life",
      icon: FaUsers,
      stats: [
        { number: "> 70", description: "Freshmen Orientation Projects" },
        { number: "> 200", description: "Clubs, Societies and Interest Groups" }
      ]
    },
    {
      title: "Global Exposure",
      icon: FaGlobeAmericas,
      stats: [
        { number: "> 300", description: "Partner Universities in over 40 Countries" },
        { number: "> 25", description: "NUS Overseas College Locations" }
      ]
    },
    {
      title: "Employability",
      icon: FaBriefcase,
      stats: [
        { number: "9th", description: "Most Employable Graduates In the World**" },
        { number: "> 9 in 10", description: "NUS Fresh Graduates Employed within 6 Months after Final Exams***" }
      ]
    }
  ];

  // Split the stats into two rows: 3 and 2
  const firstRow = stats.slice(0, 3);
  const secondRow = stats.slice(3);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12 bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
      <div className="text-center mb-8 sm:mb-10 lg:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-2 sm:mb-4">
          What Makes Academia Different
        </h2>
        <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto"></div>
      </div>

      {/* First Row - 3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {firstRow.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            stats={stat.stats}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Second Row - 2 Cards Centered */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8 justify-center max-w-4xl mx-auto">
        {secondRow.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            stats={stat.stats}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="mt-8 sm:mt-10 lg:mt-12 text-center text-xs sm:text-sm text-cyan-600 px-2">
        <p>* QS World University Rankings 2025</p>
        <p>** Times Higher Education Global Employability University Rankings 2025</p>
        <p>*** Graduate Employability Survey 2023</p>
      </div>
    </div>
  );
};

export default WhatMakesNUSDifferent;