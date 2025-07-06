import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaGraduationCap, FaGlobeAmericas, FaDollarSign, FaUsers, FaCalendarAlt, FaStar } from 'react-icons/fa';
import { useSectionAnimation } from '../../../application/hooks/useSectionAnimation';
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
          { value: '$200M+', label: 'Research Funding', icon: FaDollarSign },
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
          { value: '$150M+', label: 'Endowment Fund', icon: FaDollarSign },
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
        <section
          id="hero"
          data-animate
          className={`relative h-64 sm:h-80 lg:h-96 flex items-center justify-center transition-all duration-800 overflow-hidden ${
            isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{
            backgroundImage: currentDepartment === 'computer-science' 
              ? 'url(/images/computer-science.webp)'
              : 'url(/images/business.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Enhanced overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/60 via-blue-600/55 to-cyan-700/60"></div>
          <div className="absolute inset-0 bg-black/25"></div>
          
          <div className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 text-center text-white">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 px-2 drop-shadow-2xl">
                {data.poster.title}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-cyan-100 max-w-3xl mx-auto px-2 drop-shadow-lg">
                {data.poster.subtitle}
              </p>
              <p className="text-xs sm:text-sm text-cyan-200 max-w-2xl mx-auto mb-4 sm:mb-6 px-2 drop-shadow-md">
                {data.poster.description}
              </p>
              <button
                className="group inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full border border-white/30 font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
              >
                {data.poster.ctaText}
                <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* Spotlight Section */}
        <section
          id="spotlight"
          data-animate
          className={`py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-cyan-50 via-white to-cyan-50 transition-all duration-1000 ${isVisible.spotlight ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
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
              {data.spotlight.map((item, index) => (
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

        {/* Education Section */}
        <section
          id="education"
          data-animate
          className={`py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-cyan-50 via-white to-cyan-50 transition-all duration-1000 ${isVisible.education ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-3 sm:mb-4">
                {data.education.title}
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
                    <h3 className="text-xl sm:text-2xl font-bold text-cyan-800">{data.education.undergraduate.title}</h3>
                  </div>
                  <p className="text-cyan-600 leading-relaxed text-sm sm:text-base">{data.education.undergraduate.content}</p>
                  <div className="space-y-2 sm:space-y-3">
                    {data.education.undergraduate.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                        <FaGraduationCap className="text-cyan-600 w-4 h-4" />
                        <span className="text-cyan-700 text-sm sm:text-base">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg group text-sm sm:text-base">
                    Learn More
                    <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
                <div className="lg:w-1/2 mt-6 sm:mt-8 lg:mt-0 lg:pl-6 lg:pl-8 w-full">
                  <div className="relative h-48 sm:h-56 lg:h-64 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg sm:rounded-xl overflow-hidden">
                    <img
                      src={data.education.undergraduate.image}
                      alt={data.education.undergraduate.title}
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
                    <h3 className="text-xl sm:text-2xl font-bold text-cyan-800">{data.education.graduate.title}</h3>
                  </div>
                  <p className="text-cyan-600 leading-relaxed text-sm sm:text-base">{data.education.graduate.content}</p>
                  <div className="space-y-2 sm:space-y-3">
                    {data.education.graduate.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                        <FaGraduationCap className="text-cyan-600 w-4 h-4" />
                        <span className="text-cyan-700 text-sm sm:text-base">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg font-medium text-sm sm:text-base">
                    {data.education.graduate.status}
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

        {/* Statistics Section */}
        <section
          id="stats"
          data-animate
          className={`py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-cyan-600 to-blue-600 transition-all duration-1000 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 text-white">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">{data.byTheNumbers.title}</h2>
              <p className="text-sm sm:text-base lg:text-lg text-cyan-100 max-w-3xl mx-auto px-2">
                Our achievements speak for themselves
              </p>
              <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mt-3 sm:mt-4" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {data.byTheNumbers.stats.map((stat, index) => (
                <div
                  key={index}
                  className="group bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-4 sm:p-6 text-center transition-all duration-300 hover:scale-105"
                >
                  <div className="p-2 sm:p-3 rounded-full bg-cyan-100 mx-auto mb-3 sm:mb-4">
                    <stat.icon className="text-cyan-600 text-xl sm:text-2xl" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-cyan-600 mb-1 sm:mb-2">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-cyan-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section
          id="events"
          data-animate
          className={`py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-cyan-50 via-white to-cyan-50 transition-all duration-1000 ${isVisible.events ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-3 sm:mb-4">
                Upcoming Events
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-cyan-600 max-w-3xl mx-auto px-2">
                Join us for exciting events, workshops, and networking opportunities
              </p>
              <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mt-3 sm:mt-4" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {data.events.map((event, index) => (
                <div
                  key={index}
                  className="group bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-4 sm:p-6 transition-all duration-300 hover:scale-105 relative"
                >
                  <div className="absolute -top-3 sm:-top-4 -left-3 sm:-left-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg shadow-lg flex flex-col items-center justify-center text-white">
                      <div className="text-sm sm:text-xl font-bold">{event.date}</div>
                      <div className="text-xs font-medium">{event.month}</div>
                    </div>
                  </div>
                  <div className="pt-6 sm:pt-8">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-cyan-100 text-cyan-600">
                        {event.type}
                      </span>
                      <span className="text-xs sm:text-sm text-cyan-600 font-medium">
                        {event.attendees} attendees
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-cyan-800 mb-2 sm:mb-3 group-hover:text-cyan-600 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-cyan-600 mb-4 sm:mb-6 text-sm sm:text-base">{event.description}</p>
                    <button className="inline-flex items-center text-cyan-600 font-medium hover:text-cyan-700 group text-sm sm:text-base">
                      View Details
                      <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

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

export default DepartmentHome;