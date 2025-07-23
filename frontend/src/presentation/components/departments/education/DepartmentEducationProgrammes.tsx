import React from 'react';
import { FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import { VisibilityState } from '../../../../shared/hooks/useSectionAnimation';

interface Programme {
  title: string;
  description: string;
  status: string;
  image: string;
}

interface ProgrammesProps {
  programmes: {
    title: string;
    list: Programme[];
  };
  isVisible: VisibilityState;
}

const pdfMap = {
  'Artificial Intelligence': 'ai-course-brochure.pdf',
  'Data Science': 'data-science-brochure.pdf',
  'Cybersecurity': 'cybersecurity-brochure.pdf',
  'Quantum Computing': 'quantum-brochure.pdf',
  'Finance': 'finance-brochure.pdf',
  'Marketing': 'marketing-brochure.pdf',
  'Entrepreneurship': 'entrepreneurship-brochure.pdf',
  'Global Business Strategy': 'global-business-brochure.pdf',
} as const;

type ProgrammeTitle = keyof typeof pdfMap;

const DepartmentEducationProgrammes: React.FC<ProgrammesProps> = ({ programmes, isVisible }) => (
  <section
    id="programmes"
    data-animate
    className={`w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-12 sm:py-16 lg:py-20 transition-all duration-800 ${
      isVisible['programmes'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}
  >
    <div className="text-center mb-8 sm:mb-12">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-3 sm:mb-4">{programmes.title}</h2>
      <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
      {programmes.list.map((programme, index) => (
        <div
          key={index}
          className={`group relative rounded-2xl shadow-xl border border-cyan-200 overflow-hidden transition-all duration-300 bg-white/60 backdrop-blur-md hover:scale-105 hover:shadow-2xl hover:border-cyan-400 ${programme.status === 'Coming Soon' ? 'opacity-80' : ''}`}
          style={{ minHeight: '340px' }}
        >
          {/* Accent bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400 z-20" />
          {/* Image background with colorful overlay */}
          <div className="absolute inset-0 h-44 sm:h-52 lg:h-60 w-full">
            <img
              src={programme.image}
              alt={programme.title}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/90 via-blue-900/70 to-transparent group-hover:from-cyan-900/40 group-hover:via-blue-900/20 group-hover:to-transparent transition-all duration-500" />
          </div>
          {/* Glassmorphism text container */}
          <div className="relative z-10 flex flex-col justify-between h-44 sm:h-52 lg:h-60 p-5 pt-8 bg-white/30 backdrop-blur-xl rounded-2xl shadow-lg mt-20 mx-3 -mb-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-cyan-900 mb-2 drop-shadow-2xl tracking-tight">
                {programme.title}
              </h3>
              <p className="text-cyan-800 mb-4 text-sm sm:text-base drop-shadow-lg font-medium">
                {programme.description}
              </p>
            </div>
            {programme.status === 'Available' ? (
              <button
                className="group inline-flex items-center px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-xl text-base backdrop-blur-sm"
                onClick={() => {
                  const title = programme.title as ProgrammeTitle;
                  const pdfFile = title in pdfMap ? pdfMap[title] : 'ai-brochure.pdf';
                  window.open(`/brochures/${pdfFile}`, '_blank');
                }}
              >
                Learn More
                <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </button>
            ) : (
              <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white rounded-xl font-semibold text-base shadow-md cursor-not-allowed select-none">
                <span className="mr-2">Coming Soon</span>
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default DepartmentEducationProgrammes; 