import React from 'react';
import { VisibilityState } from '../../../../shared/hooks/useSectionAnimation';

interface HowWeDoItAspect {
  title: string;
  description: string;
  icon: React.ElementType;
}

interface HowWeDoItProps {
  howWeDoIt: {
    title: string;
    aspects: HowWeDoItAspect[];
  };
  isVisible: VisibilityState;
}

const DepartmentEntrepreneurHowWeDoIt: React.FC<HowWeDoItProps> = ({ howWeDoIt, isVisible }) => (
  <section
    id="how-we-do-it"
    data-animate
    className={`w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-12 sm:py-16 lg:py-20 transition-all duration-800 ${
      isVisible['how-we-do-it'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}
  >
    <div className="text-center mb-8 sm:mb-12">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-3 sm:mb-4">{howWeDoIt.title}</h2>
      <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {howWeDoIt.aspects.map((aspect, index) => (
        <div
          key={index}
          className="group bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-4 sm:p-6 transition-all duration-300 hover:scale-105"
        >
          <div className="p-2 sm:p-3 rounded-full bg-cyan-100 mb-3 sm:mb-4 w-fit">
            <aspect.icon className="text-cyan-600 text-lg sm:text-xl" />
          </div>
          <h4 className="text-base sm:text-lg font-bold text-cyan-800 mb-1 sm:mb-2 group-hover:text-cyan-600 transition-colors">
            {aspect.title}
          </h4>
          <p className="text-cyan-600 text-sm sm:text-base">{aspect.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default DepartmentEntrepreneurHowWeDoIt; 