import React, { useState } from 'react';
import { useSectionAnimation } from '../../../shared/hooks/useSectionAnimation';
import DepartmentPoster from '../../components/departments/common/DepartmentPoster';
import DepartmentAboutMain from '../../components/departments/about/DepartmentAboutMain';
import DepartmentAboutManagement from '../../components/departments/about/DepartmentAboutManagement';
import DepartmentAboutAlumni from '../../components/departments/about/DepartmentAboutAlumni';

interface DepartmentData {
  poster: {
    title: string;
    subtitle: string;
  };
  about: {
    title: string;
    description: string;
  };
  deanWelcome: {
    title: string;
    content: string;
    linkText: string;
  };
  management: Array<{
    name: string;
    title: string;
  }>;
  alumni: Array<{
    name: string;
    title: string;
    company: string;
  }>;
}

interface DepartmentDataMap {
  [key: string]: DepartmentData;
}

const DepartmentAbout: React.FC = () => {
  const [currentDepartment] = useState<string>('computer-science');
  const isVisible = useSectionAnimation();

  const departmentData: DepartmentDataMap = {
    'computer-science': {
      poster: {
        title: 'Unleashing Potential',
        subtitle: 'Shaping the Digital Landscape',
      },
      about: {
        title: 'About the School of Computer Science',
        description:
          'The NUS School of Computing traces its roots back to 1975, making it one of the pioneering computing schools in the region. Since then, we have grown into a leading institution, consistently ranked among the top computing schools globally. Our faculty comprises world-renowned researchers and educators who are shaping the future of technology through innovative research in artificial intelligence, cybersecurity, data science, and software engineering. We offer a comprehensive range of undergraduate and graduate programs, fostering a vibrant community of students who are passionate about technology and innovation.',
      },
      deanWelcome: {
        title: 'Dean\'s Welcome',
        content:
          'Welcome to NUS Computing! It has never been a more exciting time to be in the field of computing. Our programs are designed to equip students with the skills and knowledge to thrive in the digital age. We prepare students to become leaders and innovators, ready to tackle the challenges of tomorrow.',
        linkText: 'Read Full Message',
      },
      management: [
        { name: 'Professor Tan Kian Lee', title: 'Dean, School of Computing' },
        { name: 'Associate Professor Kan Min Yen', title: 'Vice Dean, Undergraduate Studies' },
        { name: 'Professor Chang Ee Chien', title: 'Vice Dean, Graduate Studies and Research' },
      ],
      alumni: [
        { name: 'Dr. Alice Tan', title: 'Chief Technology Officer', company: 'Tech Innovate Pte Ltd' },
        { name: 'Mr. Benjamin Lim', title: 'Senior AI Researcher', company: 'Google' },
        { name: 'Ms. Clara Ong', title: 'Founder & CEO', company: 'CyberSafe Solutions' },
      ],
    },
    'business': {
      poster: {
        title: 'Empowering Leaders',
        subtitle: 'Shaping the Global Marketplace',
      },
      about: {
        title: 'About the School of Business',
        description:
          'Established in 1965, the NUS Business School is a premier institution for business education in Asia. We are globally recognized for our rigorous academic programs and impactful research in finance, marketing, and entrepreneurship. Our faculty includes internationally acclaimed scholars and industry leaders who provide students with a deep understanding of global business trends. Through our undergraduate, graduate, and executive education programs, we cultivate a diverse community of future business leaders who are equipped to drive innovation and sustainable growth in the global economy.',
      },
      deanWelcome: {
        title: "Dean's Welcome",
        content:
          'Welcome to NUS Business School! Our mission is to develop transformative leaders who can navigate the complexities of the global marketplace. We offer a dynamic learning environment that fosters critical thinking, creativity, and ethical leadership to prepare our students for success.',
        linkText: 'Read Full Message',
      },
      management: [
        { name: 'Professor Andrew Rose', title: 'Dean, NUS Business School' },
        { name: 'Associate Professor Jane Lim', title: 'Vice Dean, Undergraduate Programs' },
        { name: 'Professor Michael Tan', title: 'Vice Dean, Research and Innovation' },
      ],
      alumni: [
        { name: 'Ms. Diana Lee', title: 'Chief Financial Officer', company: 'Global Finance Corp' },
        { name: 'Mr. Edward Ng', title: 'Managing Director', company: 'Asia Ventures Ltd' },
        { name: 'Dr. Fiona Chen', title: 'Marketing Director', company: 'Innovate Markets' },
      ],
    },
  };

  const data = departmentData[currentDepartment] || departmentData['computer-science'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
      <DepartmentPoster poster={data.poster} isVisible={isVisible} />
      <DepartmentAboutMain about={data.about} deanWelcome={data.deanWelcome} isVisible={isVisible} />
      <DepartmentAboutManagement management={data.management} isVisible={isVisible} />
      <DepartmentAboutAlumni alumni={data.alumni} isVisible={isVisible} />
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

export default DepartmentAbout;