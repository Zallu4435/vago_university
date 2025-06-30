import React, { useState } from 'react';
import { FaUserTie, FaUsers, FaStar, FaAward, FaUniversity } from 'react-icons/fa';

const UniversityLeadership: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'board' | 'management'>('board');

  const leaders = {
    board: [
      { 
        name: 'Dr. John Smith', 
        role: 'Chairman of the Board',
        achievement: 'Leading strategic initiatives since 2020'
      },
      { 
        name: 'Prof. Sarah Johnson', 
        role: 'Vice Chairman',
        achievement: 'Excellence in Academic Leadership'
      },
      { 
        name: 'Dr. David Wilson', 
        role: 'Board Member',
        achievement: 'Research & Innovation Champion'
      }
    ],
    management: [
      { 
        name: 'Dr. Michael Chen', 
        role: 'President',
        achievement: 'Driving educational excellence'
      },
      { 
        name: 'Dr. Emily Brown', 
        role: 'Vice President',
        achievement: 'International partnerships lead'
      },
      { 
        name: 'Prof. James Anderson', 
        role: 'Academic Dean',
        achievement: 'Curriculum innovation expert'
      }
    ]
  };

  return (
    <section className="w-full bg-gradient-to-b from-cyan-50 via-white to-cyan-50 py-6 sm:py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-cyan-800 mb-2 sm:mb-4">
            University Leadership
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-cyan-600 max-w-3xl mx-auto mb-4 sm:mb-6 px-2">
            Meet our visionary leaders who shape our University's future and drive 
            excellence in education and research.
          </p>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
          <button
            onClick={() => setActiveTab('board')}
            className={`flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base
              ${activeTab === 'board'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                : 'bg-white text-cyan-600 hover:bg-cyan-50'
              } border border-cyan-200`}
          >
            <FaUsers className="mr-2" />
            Board of Trustees
          </button>
          <button
            onClick={() => setActiveTab('management')}
            className={`flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base
              ${activeTab === 'management'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                : 'bg-white text-cyan-600 hover:bg-cyan-50'
              } border border-cyan-200`}
          >
            <FaUserTie className="mr-2" />
            Management
          </button>
        </div>

        {/* Leaders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {leaders[activeTab].map((leader, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-cyan-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-cyan-100 
              transform hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  {activeTab === 'board' ? (
                    <FaStar className="text-lg sm:text-2xl text-white" />
                  ) : (
                    <FaUniversity className="text-lg sm:text-2xl text-white" />
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-cyan-800 mb-1 sm:mb-2 text-center">
                  {leader.name}
                </h3>
                <p className="text-cyan-600 mb-3 sm:mb-4 text-sm sm:text-base text-center">{leader.role}</p>
                <div className="flex items-center text-cyan-500 text-xs sm:text-sm text-center">
                  <FaAward className="mr-1 sm:mr-2 flex-shrink-0" />
                  <span>{leader.achievement}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UniversityLeadership;