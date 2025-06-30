import React, { useState } from 'react';
import { FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import { useSectionAnimation } from '../../../application/hooks/useSectionAnimation';

interface Programme {
  title: string;
  description: string;
  status: string;
}

interface DepartmentData {
  poster: {
    title: string;
    subtitle: string;
  };
  programmes: {
    title: string;
    list: Programme[];
  };
}

interface DepartmentDataMap {
  [key: string]: DepartmentData;
}

const DepartmentProgrammes: React.FC = () => {
  const [currentDepartment, setCurrentDepartment] = useState<string>('computer-science');
  const isVisible = useSectionAnimation();

  const departmentData: DepartmentDataMap = {
    'computer-science': {
      poster: {
        title: 'Explore Our Programmes',
        subtitle: 'Innovate, Create, and Lead in Technology',
      },
      programmes: {
        title: 'Our Programmes',
        list: [
          {
            title: 'Artificial Intelligence',
            description: 'Dive into the world of AI with hands-on projects and cutting-edge research in machine learning, NLP, and computer vision.',
            status: 'Available',
          },
          {
            title: 'Data Science',
            description: 'Master the art of data analysis, visualization, and predictive modeling to solve real-world problems.',
            status: 'Available',
          },
          {
            title: 'Cybersecurity',
            description: 'Learn to protect digital systems with advanced techniques in encryption, network security, and ethical hacking.',
            status: 'Coming Soon',
          },
          {
            title: 'Quantum Computing',
            description: 'Explore the future of computing with quantum algorithms, quantum cryptography, and quantum machine learning.',
            status: 'Coming Soon',
          },
        ],
      },
    },
    'business': {
      poster: {
        title: 'Discover Our Programmes',
        subtitle: 'Lead and Innovate in the Global Marketplace',
      },
      programmes: {
        title: 'Our Programmes',
        list: [
          {
            title: 'Finance',
            description: 'Gain expertise in financial analysis, investment strategies, and risk management to excel in global markets.',
            status: 'Available',
          },
          {
            title: 'Marketing',
            description: 'Develop skills in digital marketing, consumer behavior, and brand management to drive business growth.',
            status: 'Available',
          },
          {
            title: 'Entrepreneurship',
            description: 'Learn to launch and scale startups with innovative strategies and mentorship from industry leaders.',
            status: 'Coming Soon',
          },
          {
            title: 'Global Business Strategy',
            description: 'Master strategic planning and cross-cultural management to lead in international business environments.',
            status: 'Coming Soon',
          },
        ],
      },
    },
  };

  const data = departmentData[currentDepartment] || departmentData['computer-science'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
      {/* Poster Section */}
      <section
        id="poster"
        data-animate
        className={`relative h-64 sm:h-80 lg:h-96 bg-gradient-to-b from-cyan-600 to-blue-600 flex items-center justify-center transition-all duration-800 ${
          isVisible.poster ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 to-transparent" />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 text-center text-white">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 px-2">{data.poster.title}</h1>
          <p className="text-sm sm:text-base lg:text-lg xl:text-2xl text-cyan-100 px-2">{data.poster.subtitle}</p>
        </div>
      </section>

      {/* Programmes Section */}
      <section
        id="programmes"
        data-animate
        className={`w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-12 sm:py-16 lg:py-20 transition-all duration-800 ${
          isVisible.programmes ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-3 sm:mb-4">{data.programmes.title}</h2>
          <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {data.programmes.list.map((programme, index) => (
            <div
              key={index}
              className={`group bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-4 sm:p-6 transition-all duration-300 hover:scale-105 ${
                programme.status === 'Coming Soon' ? 'opacity-75' : ''
              }`}
            >
              <h3 className="text-lg sm:text-xl font-bold text-cyan-800 mb-3 sm:mb-4 group-hover:text-cyan-600 transition-colors">
                {programme.title}
              </h3>
              <p className="text-cyan-600 mb-4 sm:mb-6 text-sm sm:text-base">{programme.description}</p>
              {programme.status === 'Available' ? (
                <button className="group inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base">
                  Learn More
                  <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                </button>
              ) : (
                <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg font-medium text-sm sm:text-base">
                  {programme.status}
                  <FaCalendarAlt className="ml-2" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <style>
        {`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.8s ease-out forwards;
          }

          .backdrop-blur-sm {
            backdrop-filter: blur(4px);
          }
        `}
      </style>
    </div>
  );
};

export default DepartmentProgrammes;