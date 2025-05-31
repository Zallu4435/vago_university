import React, { useState, useEffect, useRef } from 'react';
import { FaArrowRight, FaCalendarAlt } from 'react-icons/fa';

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

interface VisibilityState {
  [key: string]: boolean;
}

const DepartmentProgrammes: React.FC = () => {
  const [currentDepartment, setCurrentDepartment] = useState<string>('computer-science');
  const [isVisible, setIsVisible] = useState<VisibilityState>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

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
        className={`relative h-96 bg-gradient-to-b from-cyan-600 to-blue-600 flex items-center justify-center transition-all duration-800 ${
          isVisible.poster ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{data.poster.title}</h1>
          <p className="text-lg sm:text-2xl text-cyan-100">{data.poster.subtitle}</p>
        </div>
      </section>

      {/* Programmes Section */}
      <section
        id="programmes"
        data-animate
        className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-800 ${
          isVisible.programmes ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-cyan-800 mb-4">{data.programmes.title}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.programmes.list.map((programme, index) => (
            <div
              key={index}
              className={`group bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-6 transition-all duration-300 hover:scale-105 ${
                programme.status === 'Coming Soon' ? 'opacity-75' : ''
              }`}
            >
              <h3 className="text-xl font-bold text-cyan-800 mb-4 group-hover:text-cyan-600 transition-colors">
                {programme.title}
              </h3>
              <p className="text-cyan-600 mb-6">{programme.description}</p>
              {programme.status === 'Available' ? (
                <button className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg">
                  Learn More
                  <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                </button>
              ) : (
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg font-medium">
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