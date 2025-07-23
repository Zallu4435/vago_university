import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaGraduationCap, FaGlobeAmericas, FaRupeeSign, FaUsers, FaCalendarAlt, FaStar } from 'react-icons/fa';
import { useSectionAnimation } from '../../../shared/hooks/useSectionAnimation';
import { useLocation } from 'react-router-dom';

// Import images from assets
import computerImage from '../../../assets/images/departments/computer-science/ai-research-security.jpg';
import awardImage from '../../../assets/images/departments/computer-science/acm-paper-award.jpg';
import studentImage from '../../../assets/images/departments/computer-science/phd-student-award.jpg';
import educationImage from '../../../assets/images/departments/computer-science/cs-education-undergraduate.jpg';

import businessImage from '../../../assets/images/departments/business/future-global-markets.jpg';
import businessAwardImage from '../../../assets/images/departments/business/mba-ranking-award.jpg';
import businessStudentImage from '../../../assets/images/departments/business/mba-case-competition.jpg';
import businessEducationImage from '../../../assets/images/departments/business/business-education-undergrad.jpg';

import DepartmentEducation from '../../components/departments/home/DepartmentEducation';
import DepartmentStats from '../../components/departments/home/DepartmentStats';
import DepartmentSpotlight from '../../components/departments/home/DepartmentSpotlight';
import DepartmentEvents from '../../components/departments/home/DepartmentEvents';
import DepartmentHero from '../../components/departments/home/DepartmentHero';

interface DepartmentData {
  poster: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
  };
  inMemoriam: {
    title: string;
    content: string;
    linkText: string;
  };
  spotlight: Array<{
    image: string;
    title: string;
    date: string;
    description: string;
    category: string;
    readTime: string;
  }>;
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
  byTheNumbers: {
    title: string;
    stats: Array<{
      value: string;
      label: string;
      icon: React.ElementType;
    }>;
  };
  events: Array<{
    date: string;
    month: string;
    title: string;
    description: string;
    type: string;
    attendees: string;
  }>;
}

interface DepartmentDataMap {
  [key: string]: DepartmentData;
}

const DepartmentHome: React.FC = () => {
  const location = useLocation();
  const [currentDepartment, setCurrentDepartment] = useState<string>('computer-science');
  const isVisible = useSectionAnimation();

  // Set current department based on URL path
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const departmentFromPath = pathSegments[2]; // /departments/business -> business
    
    console.log('URL Path:', location.pathname);
    console.log('Path Segments:', pathSegments);
    console.log('Department from path:', departmentFromPath);
    console.log('Available departments:', Object.keys(departmentData));
    
    if (departmentFromPath && departmentData[departmentFromPath]) {
      console.log('Setting department to:', departmentFromPath);
      setCurrentDepartment(departmentFromPath);
    } else {
      console.log('Department not found, defaulting to computer-science');
      setCurrentDepartment('computer-science'); // default fallback
    }
  }, [location.pathname]);

  const departmentData: DepartmentDataMap = {
    'computer-science': {
      poster: {
        title: 'Welcome to the School of Computer Science',
        subtitle: 'Leading the future of technology through innovation and research.',
        description: 'Where cutting-edge research meets practical application. Join us in shaping the digital landscape of tomorrow.',
        ctaText: 'Explore Programs',
      },
      inMemoriam: {
        title: 'In Memoriam',
        content: 'A pillar of 35+ years, Associate Professor Stephen Harris leaves behind a legacy in databases, data science, and quantum computing.',
        linkText: 'Read More',
      },
      spotlight: [
        {
          image: computerImage,
          title: 'The Hidden Dangers of AI',
          date: '06-20-2025',
          description: 'Can we determine what makes AI systems trustworthy and secure?',
          category: 'Research',
          readTime: '5 min read'
        },
        {
          image: awardImage,
          title: 'Best Paper Award at ACM 2025',
          date: '04-15-2025',
          description: 'Faculty, student, and alumni team wins prestigious award.',
          category: 'Achievement',
          readTime: '3 min read'
        },
        {
          image: studentImage,
          title: 'PhD Student Xu Poison Receives Honorable Mention',
          date: '03-10-2025',
          description: 'Awarded for outstanding research contributions.',
          category: 'Student Success',
          readTime: '4 min read'
        },
      ],
      education: {
        title: 'Education Excellence',
        undergraduate: {
          title: 'Undergraduate Programs',
          content: 'Nurturing the next generation of leaders in tech through a diverse range of multidisciplinary programs.',
          features: ['Hands-on Learning', 'Industry Partnerships', 'Research Opportunities'],
          image: educationImage,
        },
        graduate: {
          title: 'Graduate Programs',
          content: 'Advanced degrees designed for tomorrow\'s innovators and researchers.',
          features: ['Cutting-edge Research', 'Expert Faculty', 'Global Network'],
          status: 'Coming Soon'
        },
      },
      byTheNumbers: {
        title: 'Excellence by the Numbers',
        stats: [
          { value: '67', label: 'World-Class Faculty', icon: FaGraduationCap },
          { value: '19,000+', label: 'Global Alumni Network', icon: FaGlobeAmericas },
          { value: '₹200M+', label: 'Research Funding', icon: FaRupeeSign },
          { value: '16+', label: 'Innovative Programs', icon: FaUsers },
        ],
      },
      events: [
        {
          date: '07',
          month: 'Mar',
          title: 'Integrating Speech Recognition into NLP',
          description: 'University Scholar Series',
          type: 'Conference',
          attendees: '200+'
        },
        {
          date: '10',
          month: 'Mar',
          title: 'Soft Skills Workshop for Tech Students',
          description: 'Career Center Event',
          type: 'Workshop',
          attendees: '50+'
        },
        {
          date: '20',
          month: 'Mar',
          title: 'Tech Networking Event',
          description: 'Alumni Mixer',
          type: 'Networking',
          attendees: '300+'
        },
      ],
    },
    'business': {
      poster: {
        title: 'Welcome to the School of Business',
        subtitle: 'Shaping global leaders through excellence in business education.',
        description: 'Transform your career with our world-renowned business programs. Lead with confidence in the global marketplace.',
        ctaText: 'Discover Opportunities',
      },
      inMemoriam: {
        title: 'In Memoriam',
        content: 'Professor Emily Carter, a 40-year veteran, leaves a legacy in finance, leadership, and economic policy.',
        linkText: 'Read More',
      },
      spotlight: [
        {
          image: businessImage,
          title: 'The Future of Global Markets',
          date: '06-18-2025',
          description: 'How will emerging economies shape the next decade?',
          category: 'Market Analysis',
          readTime: '7 min read'
        },
        {
          image: businessAwardImage,
          title: 'Best MBA Program 2025',
          date: '04-12-2025',
          description: 'Recognized by Global Business Review.',
          category: 'Recognition',
          readTime: '2 min read'
        },
        {
          image: businessStudentImage,
          title: 'MBA Student Wins National Case Competition',
          date: '03-05-2025',
          description: 'Team excels in strategic analysis and innovation.',
          category: 'Student Success',
          readTime: '5 min read'
        },
      ],
      education: {
        title: 'Educational Excellence',
        undergraduate: {
          title: 'Undergraduate Programs',
          content: 'Preparing future business leaders through innovative programs in finance, marketing, and entrepreneurship.',
          features: ['Real-world Projects', 'Mentorship Program', 'Global Exposure'],
          image: businessEducationImage,
        },
        graduate: {
          title: 'Graduate Programs',
          content: 'Executive MBA and specialized master\'s programs for working professionals.',
          features: ['Executive Education', 'Leadership Development', 'Strategic Thinking'],
          status: 'Coming Soon'
        },
      },
      byTheNumbers: {
        title: 'Impact by the Numbers',
        stats: [
          { value: '45', label: 'Expert Faculty', icon: FaGraduationCap },
          { value: '15,000+', label: 'Alumni Leaders', icon: FaUsers },
          { value: '₹ 150M+', label: 'Endowment Fund', icon: FaRupeeSign },
          { value: '12+', label: 'Specialized Programs', icon: FaGlobeAmericas },
        ],
      },
      events: [
        {
          date: '05',
          month: 'Mar',
          title: 'Global Business Summit 2025',
          description: 'Annual Conference',
          type: 'Summit',
          attendees: '500+'
        },
        {
          date: '12',
          month: 'Mar',
          title: 'Entrepreneurship Workshop',
          description: 'Startup Bootcamp',
          type: 'Workshop',
          attendees: '100+'
        },
        {
          date: '22',
          month: 'Mar',
          title: 'Finance Networking Night',
          description: 'Alumni and Industry Mixer',
          type: 'Networking',
          attendees: '250+'
        },
      ],
    },
  };

  const data = departmentData[currentDepartment] || departmentData['computer-science'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-cyan-50 overflow-hidden">

      <div className="relative">
        {/* Hero Section */}
        <DepartmentHero poster={data.poster} currentDepartment={currentDepartment} isVisible={isVisible} />

        {/* Spotlight Section */}
        <DepartmentSpotlight spotlight={data.spotlight} />

        {/* Education Section */}
        <DepartmentEducation education={data.education} currentDepartment={currentDepartment} />

        {/* Statistics Section */}
        <DepartmentStats statsData={data.byTheNumbers} />

        {/* Events Section */}
        <DepartmentEvents events={data.events} />
      </div>

      <style>{`
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
      `}</style>
    </div>
  );
};

export default DepartmentHome;