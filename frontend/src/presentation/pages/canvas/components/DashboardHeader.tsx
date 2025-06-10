import React from 'react';
import { FaBell } from 'react-icons/fa';
import { FiTrendingUp } from 'react-icons/fi';

interface DashboardHeaderProps {
  courses: {
    id: number;
    locked: boolean;
  }[];
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ courses }) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 sm:mb-8">
        <div className="mb-4 lg:mb-0">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg">
              S
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, Student!
              </h1>
              <p className="text-gray-600 text-sm sm:text-lg">Ready to continue your learning journey? 🚀</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FaBell className="text-gray-400 hover:text-blue-600 cursor-pointer text-lg sm:text-xl transition-colors" />
            <div className="absolute -top-1 -right-1 w-2 sm:w-3 h-2 sm:h-3 bg-red-500 rounded-full"></div>
          </div>
          <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
            A
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Active Courses</p>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {courses.filter(c => !c.locked).length}
              </p>
              <p className="text-xs text-green-600 flex items-center mt-2">
                <FiTrendingUp className="mr-1" />
                +2 this semester
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader; 