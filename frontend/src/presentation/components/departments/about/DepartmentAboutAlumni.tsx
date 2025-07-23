import React from 'react';
import { FaArrowRight, FaUserCircle } from 'react-icons/fa';
import { VisibilityState } from '../../../../shared/hooks/useSectionAnimation';

interface AlumniMember {
  name: string;
  title: string;
  company: string;
}

interface AlumniProps {
  alumni: AlumniMember[];
  isVisible: VisibilityState;
}

const DepartmentAboutAlumni: React.FC<AlumniProps> = ({ alumni, isVisible }) => (
  <section
    id="alumni"
    data-animate
    className={`w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-12 sm:py-16 lg:py-20 transition-all duration-800 ${
      isVisible['alumni'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}
  >
    <div className="text-center mb-8 sm:mb-12">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-3 sm:mb-4">Our Prominent Alumni</h2>
      <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {alumni.map((alumnus, index) => (
        <div
          key={index}
          className="group bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-4 sm:p-6 transition-all duration-300 hover:scale-105 flex flex-col items-center"
        >
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <FaUserCircle className="text-cyan-400 text-5xl sm:text-6xl lg:text-7xl rounded-full bg-gray-100" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-cyan-800 mb-1 sm:mb-2 text-center">{alumnus.name}</h3>
          <p className="text-cyan-600 mb-1 text-sm sm:text-base text-center">{alumnus.title}</p>
          <p className="text-cyan-600 text-sm sm:text-base text-center">{alumnus.company}</p>
        </div>
      ))}
    </div>
  </section>
);

export default DepartmentAboutAlumni; 