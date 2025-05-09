import React from 'react';
import { FaTrophy, FaGraduationCap, FaUsers, FaGlobeAmericas, FaBriefcase } from 'react-icons/fa';

interface StatCardProps {
  title: string;
  stats: Array<{ number: string; description: string }>;
  icon: React.ElementType;
}

const StatCard: React.FC<StatCardProps> = ({ title, stats, icon: Icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col transition-transform duration-300 hover:scale-105">
      <div className="flex items-center mb-4">
        <div className="p-3 rounded-full bg-blue-100 mr-4">
          <Icon className="text-blue-600 text-xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-4 mt-2">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-3xl font-bold text-blue-600">{stat.number}</span>
            <span className="text-sm text-gray-600">{stat.description}</span>
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
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          What Makes Academia Different
        </h2>
        <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
      </div>

      {/* First Row - 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-8 justify-center max-w-4xl mx-auto">
        {secondRow.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            stats={stat.stats}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="mt-12 text-center text-sm text-gray-600">
        <p>* QS World University Rankings 2025</p>
        <p>** Times Higher Education Global Employability University Rankings 2025</p>
        <p>*** Graduate Employability Survey 2023</p>
      </div>
    </div>
  );
};

export default WhatMakesNUSDifferent;
