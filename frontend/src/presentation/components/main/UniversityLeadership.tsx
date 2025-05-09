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
    <section className="w-full bg-gradient-to-b from-cyan-50 via-white to-cyan-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-cyan-800 mb-4">
            University Leadership
          </h2>
          <p className="text-lg text-cyan-600 max-w-3xl mx-auto mb-6">
            Meet our visionary leaders who shape our University's future and drive 
            excellence in education and research.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('board')}
            className={`flex items-center px-6 py-3 rounded-lg transition-all duration-300
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
            className={`flex items-center px-6 py-3 rounded-lg transition-all duration-300
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaders[activeTab].map((leader, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-cyan-50 rounded-xl p-6 border border-cyan-100 
              transform hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {activeTab === 'board' ? (
                    <FaStar className="text-2xl text-white" />
                  ) : (
                    <FaUniversity className="text-2xl text-white" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-cyan-800 mb-2">
                  {leader.name}
                </h3>
                <p className="text-cyan-600 mb-4">{leader.role}</p>
                <div className="flex items-center text-cyan-500 text-sm">
                  <FaAward className="mr-2" />
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