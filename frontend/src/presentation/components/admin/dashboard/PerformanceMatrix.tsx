import React from 'react';
import { PerformanceMatrixProps } from '../../../../domain/types/dashboard/admin';

const PerformanceMatrix: React.FC<PerformanceMatrixProps> = ({ performanceData }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 p-2">
    {performanceData.map((item, index) => (
      <div key={index} className="text-center group hover:scale-105 transition-transform duration-200 flex flex-col justify-center items-center h-32 bg-gray-700/30 backdrop-blur-sm rounded-lg p-3 hover:bg-gray-700/50 border border-gray-600/20 hover:border-purple-500/30">
        <div className="relative w-14 h-14 mx-auto mb-2">
          <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#374151"
              strokeWidth="2"
            />
            <path
              d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={item.color}
              strokeWidth="2"
              strokeDasharray={`${item.value}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-white">{item.value}%</span>
          </div>
        </div>
        <p className="text-xs font-medium text-gray-300 leading-tight">{item.name}</p>
      </div>
    ))}
  </div>
);

export default PerformanceMatrix; 