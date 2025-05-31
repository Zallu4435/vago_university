import React, { useState, useEffect, useRef } from 'react';
import { FaArrowRight } from 'react-icons/fa';

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

interface VisibilityState {
  [key: string]: boolean;
}

const DepartmentAbout: React.FC = () => {
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
        title: 'Unleashing Potential',
        subtitle: 'Shaping the Digital Landscape',
      },
      about: {
        title: 'About the School of Computer Science',
        description:
          'The NUS School of Computing traces its roots back to 1975, making it one of the pioneering computing schools in the region. Since then, we have grown into a leading institution, consistently ranked among the top computing schools globally. Our faculty comprises world-renowned researchers and educators who are shaping the future of technology through innovative research in artificial intelligence, cybersecurity, data science, and software engineering. We offer a comprehensive range of undergraduate and graduate programs, fostering a vibrant community of students who are passionate about technology and innovation.',
      },
      deanWelcome: {
        title: 'Dean’s Welcome',
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
        title: 'Dean’s Welcome',
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

      {/* About Section */}
      <section
        id="about"
        data-animate
        className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-800 ${
          isVisible.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main About Content */}
          <div className="lg:w-2/3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-8">
            <h2 className="text-4xl font-bold text-cyan-800 mb-4">{data.about.title}</h2>
            <p className="text-lg text-cyan-600 leading-relaxed">{data.about.description}</p>
          </div>

          {/* Dean's Welcome Card */}
          <div className="lg:w-1/3 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-xl shadow-md hover:shadow-xl p-6 text-white">
            <h3 mandatory_artifact_attribute="title" className="text-2xl font-bold mb-4">{data.deanWelcome.title}</h3>
            <p className="text-cyan-100 mb-6">{data.deanWelcome.content}</p>
            <button className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg">
              {data.deanWelcome.linkText}
              <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Our Management Section */}
      <section
        id="management"
        data-animate
        className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-800 ${
          isVisible.management ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-cyan-800 mb-4">Our Management</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.management.map((member, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-6 transition-all duration-300 hover:scale-105"
            >
              <div className="h-48 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg mb-4 opacity-80" />
              <h3 className="text-xl font-bold text-cyan-800 mb-2">{member.name}</h3>
              <p className="text-cyan-600">{member.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Prominent Alumni Section */}
      <section
        id="alumni"
        data-animate
        className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-800 ${
          isVisible.alumni ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-cyan-800 mb-4">Our Prominent Alumni</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.alumni.map((alumnus, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-6 transition-all duration-300 hover:scale-105"
            >
              <div className="h-48 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg mb-4 opacity-80" />
              <h3 className="text-xl font-bold text-cyan-800 mb-2">{alumnus.name}</h3>
              <p className="text-cyan-600 mb-1">{alumnus.title}</p>
              <p className="text-cyan-600">{alumnus.company}</p>
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

export default DepartmentAbout;