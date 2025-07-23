import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { VisibilityState } from '../../../../shared/hooks/useSectionAnimation';

interface AlumniTestimonial {
  name: string;
  title: string;
  company: string;
  testimonial: string;
}

interface AlumniProps {
  alumni: {
    title: string;
    testimonials: AlumniTestimonial[];
  };
  isVisible: VisibilityState;
}

const DepartmentEntrepreneurAlumni: React.FC<AlumniProps> = ({ alumni, isVisible }) => (
  <section
    id="alumni"
    data-animate
    className={`w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-12 sm:py-16 lg:py-20 transition-all duration-800 ${
      isVisible['alumni'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}
  >
    <div className="text-center mb-8 sm:mb-12">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-3 sm:mb-4">{alumni.title}</h2>
      <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {alumni.testimonials.map((testimonial, index) => (
        <div
          key={index}
          className="group bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-4 sm:p-6 transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <div className="w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-cyan-600 text-lg sm:text-xl lg:text-2xl font-bold">{testimonial.name.charAt(0)}</span>
            </div>
          </div>
          <h4 className="text-base sm:text-lg font-bold text-cyan-800 mb-1 text-center">{testimonial.name}</h4>
          <p className="text-xs sm:text-sm text-cyan-600 mb-2 text-center">{testimonial.title}, {testimonial.company}</p>
          <p className="text-cyan-600 text-sm sm:text-base text-center">{testimonial.testimonial}</p>
        </div>
      ))}
    </div>
    <div className="text-center mt-6 sm:mt-8">
      <button className="group inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base">
        Read More Stories
        <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
      </button>
    </div>
  </section>
);

export default DepartmentEntrepreneurAlumni; 