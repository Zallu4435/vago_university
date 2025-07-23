import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { VisibilityState } from '../../../../shared/hooks/useSectionAnimation';

interface DepartmentHeroProps {
  poster: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
  };
  currentDepartment: string;
  isVisible: VisibilityState;
}

const DepartmentHero: React.FC<DepartmentHeroProps> = ({ poster, currentDepartment, isVisible }) => (
  <section
    id="hero"
    data-animate
    className={`relative h-64 sm:h-80 lg:h-96 flex items-center justify-center transition-all duration-800 overflow-hidden ${
      isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}
    style={{
      backgroundImage:
        currentDepartment === 'computer-science'
          ? 'url(/images/computer-science.webp)'
          : 'url(/images/business.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
  >
    {/* Enhanced overlay for better text readability */}
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/60 via-blue-600/55 to-cyan-700/60"></div>
    <div className="absolute inset-0 bg-black/25"></div>
    <div className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 text-center text-white">
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 px-2 drop-shadow-2xl">
          {poster.title}
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-cyan-100 max-w-3xl mx-auto px-2 drop-shadow-lg">
          {poster.subtitle}
        </p>
        <p className="text-xs sm:text-sm text-cyan-200 max-w-2xl mx-auto mb-4 sm:mb-6 px-2 drop-shadow-md">
          {poster.description}
        </p>
        <Link
          to={`/departments/${currentDepartment}/program`}
          className="group inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full border border-white/30 font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
        >
          {poster.ctaText}
          <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
    </div>
  </section>
);

export default DepartmentHero; 