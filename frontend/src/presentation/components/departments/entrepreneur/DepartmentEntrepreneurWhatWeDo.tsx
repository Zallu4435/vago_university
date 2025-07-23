import React from 'react';
import { VisibilityState } from '../../../../shared/hooks/useSectionAnimation';

interface WhatWeDoProps {
  whatWeDo: {
    title: string;
    description: string;
  };
  isVisible: VisibilityState;
}

const DepartmentEntrepreneurWhatWeDo: React.FC<WhatWeDoProps> = ({ whatWeDo, isVisible }) => (
  <section
    id="what-we-do"
    data-animate
    className={`w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-12 sm:py-16 lg:py-20 transition-all duration-800 ${
      isVisible['what-we-do'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}
  >
    <div className="text-center mb-8 sm:mb-12">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-3 sm:mb-4">{whatWeDo.title}</h2>
      <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
    </div>
    <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-4 sm:p-6 lg:p-8">
      <p className="text-sm sm:text-base lg:text-lg text-cyan-600 leading-relaxed">{whatWeDo.description}</p>
    </div>
  </section>
);

export default DepartmentEntrepreneurWhatWeDo; 