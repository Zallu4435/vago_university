import React from 'react';
import { FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import { VisibilityState } from '../../../../shared/hooks/useSectionAnimation';

interface CommunityAspect {
  title: string;
  description: string;
  icon: React.ElementType;
}

interface CommunityEvent {
  date: string;
  title: string;
  description: string;
}

interface CommunityProps {
  community: {
    title: string;
    studentLife: {
      description: string;
      aspects: CommunityAspect[];
    };
    events: {
      title: string;
      list: CommunityEvent[];
    };
  };
  isVisible: VisibilityState;
}

const DepartmentCommunityMain: React.FC<CommunityProps> = ({ community, isVisible }) => (
  <section
    id="community"
    data-animate
    className={`w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-12 sm:py-16 lg:py-20 transition-all duration-800 ${
      isVisible['community'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}
  >
    <div className="text-center mb-8 sm:mb-12">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-3 sm:mb-4">{community.title}</h2>
      <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
    </div>
    <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
      {/* Student Life */}
      <div className="lg:w-2/3">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-cyan-800 mb-3 sm:mb-4">Student Life</h3>
          <p className="text-sm sm:text-base lg:text-lg text-cyan-600 leading-relaxed mb-4 sm:mb-6">{community.studentLife.description}</p>
          <button className="group inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base">
            Join Now
            <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {community.studentLife.aspects.map((aspect, index) => (
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
      </div>
      {/* Upcoming Events */}
      <div className="lg:w-1/3">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-4 sm:p-6 lg:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-cyan-800 mb-4 sm:mb-6">{community.events.title}</h3>
          <div className="space-y-4 sm:space-y-6">
            {community.events.list.map((event, index) => (
              <div key={index} className="border-l-4 border-cyan-600 pl-3 sm:pl-4">
                <p className="text-xs sm:text-sm text-cyan-700">{event.date}</p>
                <h4 className="text-base sm:text-lg font-bold text-cyan-800 mb-1 sm:mb-2">{event.title}</h4>
                <p className="text-cyan-600 text-sm sm:text-base">{event.description}</p>
              </div>
            ))}
          </div>
          <button className="group inline-flex items-center mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base">
            View All Events
            <FaCalendarAlt className="ml-2 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default DepartmentCommunityMain; 