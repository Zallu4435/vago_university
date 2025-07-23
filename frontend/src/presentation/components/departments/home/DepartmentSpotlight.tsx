import React from 'react';
import { FaArrowRight, FaStar } from 'react-icons/fa';

interface SpotlightItem {
  image: string;
  title: string;
  date: string;
  description: string;
  category: string;
  readTime: string;
}

interface DepartmentSpotlightProps {
  spotlight: SpotlightItem[];
}

const DepartmentSpotlight: React.FC<DepartmentSpotlightProps> = ({ spotlight }) => (
  <section
    id="spotlight"
    data-animate
    className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-cyan-50 via-white to-cyan-50 transition-all duration-1000"
  >
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-3 sm:mb-4">
          In the Spotlight
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-cyan-600 max-w-3xl mx-auto px-2">
          Discover our latest achievements, breakthroughs, and success stories
        </p>
        <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mt-3 sm:mt-4" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {spotlight.map((item, index) => (
          <article
            key={index}
            className="group bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md hover:shadow-xl border border-cyan-100 transform hover:scale-105 transition-all duration-300"
          >
            <div className="relative h-40 sm:h-48 lg:h-56 bg-gradient-to-r from-cyan-600 to-blue-600 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 to-transparent" />
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-cyan-400 to-blue-400 text-white">
                  {item.category}
                </span>
              </div>
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white text-xs sm:text-sm bg-cyan-900/60 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1">
                {item.readTime}
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <time className="text-xs sm:text-sm text-cyan-600 font-medium">{item.date}</time>
                <div className="flex items-center text-yellow-400">
                  <FaStar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <FaStar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <FaStar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <FaStar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <FaStar className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-cyan-800 mb-2 sm:mb-3 group-hover:text-cyan-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-cyan-600 mb-4 sm:mb-6 text-sm sm:text-base">{item.description}</p>
              <button className="inline-flex items-center text-cyan-600 font-medium hover:text-cyan-700 group text-sm sm:text-base">
                Read More
                <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default DepartmentSpotlight; 