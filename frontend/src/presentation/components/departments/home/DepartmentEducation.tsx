import React from 'react';
import { FaGraduationCap, FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface EducationProps {
  education: {
    title: string;
    undergraduate: {
      title: string;
      content: string;
      features: string[];
      image: string;
    };
    graduate: {
      title: string;
      content: string;
      features: string[];
      status: string;
    };
  };
  currentDepartment: string;
}

const DepartmentEducation: React.FC<EducationProps> = ({ education, currentDepartment }) => {
  console.log(currentDepartment, "mskoomokmkomm")
  return (
    <section
      id="education"
      data-animate
      className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-cyan-50 via-white to-cyan-50 transition-all duration-1000"
    >
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-3 sm:mb-4">
            {education.title}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-cyan-600 max-w-3xl mx-auto px-2">
            Empowering minds through innovative education and research
          </p>
          <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mt-3 sm:mt-4" />
        </div>
        <div className="space-y-8 sm:space-y-12">
          {/* Undergraduate Programs */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row items-center transition-all duration-300">
            <div className="lg:w-1/2 space-y-4 sm:space-y-6 w-full">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 rounded-full bg-cyan-100">
                  <FaGraduationCap className="text-cyan-600 text-lg sm:text-xl" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-cyan-800">{education.undergraduate.title}</h3>
              </div>
              <p className="text-cyan-600 leading-relaxed text-sm sm:text-base">{education.undergraduate.content}</p>
              <div className="space-y-2 sm:space-y-3">
                {education.undergraduate.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                    <FaGraduationCap className="text-cyan-600 w-4 h-4" />
                    <span className="text-cyan-700 text-sm sm:text-base">{feature}</span>
                  </div>
                ))}
              </div>
              <Link
                to={`/departments/${currentDepartment}/community`}
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg group text-sm sm:text-base"
              >
                Learn More
                <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
            <div className="lg:w-1/2 mt-6 sm:mt-8 lg:mt-0 lg:pl-6 lg:pl-8 w-full">
              <div className="relative h-48 sm:h-56 lg:h-64 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg sm:rounded-xl overflow-hidden">
                <img
                  src={education.undergraduate.image}
                  alt={education.undergraduate.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 to-transparent" />
              </div>
            </div>
          </div>
          {/* Graduate Programs */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row-reverse items-center transition-all duration-300 opacity-75">
            <div className="lg:w-1/2 space-y-4 sm:space-y-6 w-full">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 rounded-full bg-cyan-100">
                  <FaGraduationCap className="text-cyan-600 text-lg sm:text-xl" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-cyan-800">{education.graduate.title}</h3>
              </div>
              <p className="text-cyan-600 leading-relaxed text-sm sm:text-base">{education.graduate.content}</p>
              <div className="space-y-2 sm:space-y-3">
                {education.graduate.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                    <FaGraduationCap className="text-cyan-600 w-4 h-4" />
                    <span className="text-cyan-700 text-sm sm:text-base">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg font-medium text-sm sm:text-base">
                {education.graduate.status}
                <FaCalendarAlt className="ml-2" />
              </div>
            </div>
            <div className="lg:w-1/2 mt-6 sm:mt-8 lg:mt-0 lg:pr-6 lg:pr-8 w-full">
              <div className="relative h-48 sm:h-56 lg:h-64 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg sm:rounded-xl flex items-center justify-center overflow-hidden">
                {/* Coming Soon Visual Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 opacity-80"></div>
                <div className="relative z-10 text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <FaCalendarAlt className="text-white text-2xl sm:text-3xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg sm:text-xl font-bold text-cyan-800">Coming Soon</h4>
                    <p className="text-cyan-600 text-sm sm:text-base">Graduate Programs</p>
                    <div className="flex justify-center space-x-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-8 h-8 border-2 border-cyan-300/30 rounded-full"></div>
                <div className="absolute top-8 right-8 w-6 h-6 border-2 border-cyan-200/40 rounded-full"></div>
                <div className="absolute bottom-8 left-8 w-10 h-10 border-2 border-cyan-300/20 rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 border-2 border-cyan-200/50 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepartmentEducation; 