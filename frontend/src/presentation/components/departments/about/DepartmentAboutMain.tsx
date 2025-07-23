import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { VisibilityState } from '../../../../shared/hooks/useSectionAnimation';

interface AboutProps {
  about: {
    title: string;
    description: string;
  };
  deanWelcome: {
    title: string;
    content: string;
    linkText: string;
  };
  isVisible: VisibilityState;
}

const DepartmentAboutMain: React.FC<AboutProps> = ({ about, deanWelcome, isVisible }) => (
  <section
    id="about"
    data-animate
    className={`w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-12 sm:py-16 lg:py-20 transition-all duration-800 ${
      isVisible['about'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}
  >
    <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
      {/* Main About Content */}
      <div className="lg:w-2/3 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-3 sm:mb-4">{about.title}</h2>
        <p className="text-sm sm:text-base lg:text-lg text-cyan-600 leading-relaxed">{about.description}</p>
      </div>
      {/* Dean's Welcome Card */}
      <div className="lg:w-1/3 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-lg sm:rounded-xl shadow-md hover:shadow-xl p-4 sm:p-6 text-white">
        <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{deanWelcome.title}</h3>
        <p className="text-cyan-100 mb-4 sm:mb-6 text-sm sm:text-base">{deanWelcome.content}</p>
        <button className="group inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base">
          {deanWelcome.linkText}
          <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  </section>
);

export default DepartmentAboutMain; 