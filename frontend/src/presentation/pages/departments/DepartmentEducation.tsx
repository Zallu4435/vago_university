import React, { useState, useEffect } from 'react';
import { useSectionAnimation } from '../../../shared/hooks/useSectionAnimation';
import { useLocation } from 'react-router-dom';
import DepartmentPoster from '../../components/departments/common/DepartmentPoster';
import DepartmentEducationProgrammes from '../../components/departments/education/DepartmentEducationProgrammes';
import { DepartmentEducationDataMap } from '../../../domain/types/department';

const DepartmentProgrammes: React.FC = () => {
  const location = useLocation();
  const [currentDepartment, setCurrentDepartment] = useState<string>('computer-science');
  const isVisible = useSectionAnimation();

  const departmentData: DepartmentEducationDataMap = {
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
            image: '/brochures/images/ai.jpeg',
          },
          {
            title: 'Data Science',
            description: 'Master the art of data analysis, visualization, and predictive modeling to solve real-world problems.',
            status: 'Available',
            image: '/brochures/images/data-science.jpeg',
          },
          {
            title: 'Cybersecurity',
            description: 'Learn to protect digital systems with advanced techniques in encryption, network security, and ethical hacking.',
            status: 'Coming Soon',
            image: '/brochures/images/cybersecurity.jpeg',
          },
          {
            title: 'Quantum Computing',
            description: 'Explore the future of computing with quantum algorithms, quantum cryptography, and quantum machine learning.',
            status: 'Coming Soon',
            image: '/brochures/images/quantum.jpeg',
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
            image: '/brochures/images/finance.jpeg',
          },
          {
            title: 'Marketing',
            description: 'Develop skills in digital marketing, consumer behavior, and brand management to drive business growth.',
            status: 'Available',
            image: '/brochures/images/marketing.jpeg',
          },
          {
            title: 'Entrepreneurship',
            description: 'Learn to launch and scale startups with innovative strategies and mentorship from industry leaders.',
            status: 'Coming Soon',
            image: '/brochures/images/entrepreneurship.jpeg',
          },
          {
            title: 'Global Business Strategy',
            description: 'Master strategic planning and cross-cultural management to lead in international business environments.',
            status: 'Coming Soon',
            image: '/brochures/images/global-business.jpeg',
          },
        ],
      },
    },
  };

  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const departmentFromPath = pathSegments[2]; // /departments/business -> business
    if (departmentFromPath && departmentData[departmentFromPath]) {
      setCurrentDepartment(departmentFromPath);
    } else {
      setCurrentDepartment('computer-science');
    }
  }, [location.pathname]);

  const data = departmentData[currentDepartment] || departmentData['computer-science'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
      <DepartmentPoster poster={data.poster} isVisible={isVisible} />
      <DepartmentEducationProgrammes programmes={data.programmes} isVisible={isVisible} />
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