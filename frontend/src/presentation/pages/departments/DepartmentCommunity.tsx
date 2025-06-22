import React, { useState } from 'react';
import { FaArrowRight, FaCalendarAlt, FaUsers, FaLaptopCode, FaGlobe, FaHandshake, FaPhone, FaEnvelope, FaHeart } from 'react-icons/fa';
import { useSectionAnimation } from '../../../application/hooks/useSectionAnimation';

interface CommunityEvent {
  date: string;
  title: string;
  description: string;
}

interface CommunityAspect {
  title: string;
  description: string;
  icon: React.ElementType;
}

interface SupportResource {
  title: string;
  description: string;
  icon: React.ElementType;
}

interface EmergencyContact {
  title: string;
  phone: string;
  email: string;
}

interface DepartmentData {
  poster: {
    title: string;
    subtitle: string;
  };
  about: {
    title: string;
    description: string;
  };
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
  supportWellness: {
    title: string;
    resources: SupportResource[];
  };
  emergencyContact: {
    title: string;
    contacts: EmergencyContact[];
  };
}

interface DepartmentDataMap {
  [key: string]: DepartmentData;
}

const DepartmentCommunity: React.FC = () => {
  const [currentDepartment, setCurrentDepartment] = useState<string>('computer-science');
  const isVisible = useSectionAnimation();

  const departmentData: DepartmentDataMap = {
    'computer-science': {
      poster: {
        title: 'Join Our Community',
        subtitle: 'Connect, Collaborate, and Innovate in Tech',
      },
      about: {
        title: 'About Our Community',
        description:
          'The School of Computing community is a vibrant hub of innovation and collaboration. We bring together students, faculty, and industry professionals to foster creativity, learning, and growth through events, clubs, and support initiatives.',
      },
      community: {
        title: 'Community',
        studentLife: {
          description:
            'At the School of Computing, our vibrant community fosters collaboration, innovation, and lifelong connections. From coding clubs to hackathons, there’s something for everyone to engage, learn, and grow.',
          aspects: [
            { title: 'Tech Clubs', description: 'Join AI, robotics, and coding clubs to explore your passions.', icon: FaLaptopCode },
            { title: 'Hackathons', description: 'Compete and collaborate in exciting coding challenges.', icon: FaUsers },
            { title: 'Industry Talks', description: 'Learn from tech leaders through regular seminars.', icon: FaHandshake },
          ],
        },
        events: {
          title: 'Upcoming Events',
          list: [
            {
              date: 'June 5, 2025',
              title: 'AI Symposium 2025',
              description: 'Join us for a day of talks and workshops on the latest advancements in AI.',
            },
            {
              date: 'June 12, 2025',
              title: 'CodeFest Hackathon',
              description: 'A 24-hour coding challenge with teams from across the region.',
            },
          ],
        },
      },
      supportWellness: {
        title: 'Support and Wellness',
        resources: [
          {
            title: 'Counseling Services',
            description: 'Access professional counseling to support your mental health and well-being.',
            icon: FaHeart,
          },
          {
            title: 'Peer Support Groups',
            description: 'Join peer-led groups to share experiences and build a support network.',
            icon: FaUsers,
          },
        ],
      },
      emergencyContact: {
        title: 'Emergency Contact',
        contacts: [
          {
            title: 'Campus Security',
            phone: '+65 1234 5678',
            email: 'security@nuscomputing.edu.sg',
          },
          {
            title: 'Health Services',
            phone: '+65 8765 4321',
            email: 'healthservices@nuscomputing.edu.sg',
          },
        ],
      },
    },
    'business': {
      poster: {
        title: 'Join Our Community',
        subtitle: 'Lead, Network, and Thrive in Business',
      },
      about: {
        title: 'About Our Community',
        description:
          'The NUS Business School community thrives on leadership, innovation, and global networking. We connect students, alumni, and industry leaders through events, clubs, and wellness programs to support your journey.',
      },
      community: {
        title: 'Community',
        studentLife: {
          description:
            'The NUS Business School community is a hub of creativity, leadership, and global networking. Engage in business clubs, case competitions, and networking events to build your future.',
          aspects: [
            { title: 'Business Clubs', description: 'Join finance, marketing, and entrepreneurship societies.', icon: FaUsers },
            { title: 'Case Competitions', description: 'Solve real-world business challenges with peers.', icon: FaGlobe },
            { title: 'Networking Events', description: 'Connect with industry leaders and alumni.', icon: FaHandshake },
          ],
        },
        events: {
          title: 'Upcoming Events',
          list: [
            {
              date: 'June 7, 2025',
              title: 'Global Business Summit',
              description: 'A summit featuring talks by global business leaders and networking sessions.',
            },
            {
              date: 'June 15, 2025',
              title: 'Entrepreneurship Fair',
              description: 'Showcase your startup ideas and meet potential investors.',
            },
          ],
        },
      },
      supportWellness: {
        title: 'Support and Wellness',
        resources: [
          {
            title: 'Career Counseling',
            description: 'Get guidance on career planning and professional development.',
            icon: FaHeart,
          },
          {
            title: 'Wellness Workshops',
            description: 'Attend workshops on stress management and work-life balance.',
            icon: FaUsers,
          },
        ],
      },
      emergencyContact: {
        title: 'Emergency Contact',
        contacts: [
          {
            title: 'Campus Security',
            phone: '+65 2345 6789',
            email: 'security@nusbusiness.edu.sg',
          },
          {
            title: 'Health Services',
            phone: '+65 9876 5432',
            email: 'healthservices@nusbusiness.edu.sg',
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

      {/* About Section */}
      <section
        id="about"
        data-animate
        className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-800 ${
          isVisible.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-cyan-800 mb-4">{data.about.title}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-8">
          <p className="text-lg text-cyan-600 leading-relaxed">{data.about.description}</p>
        </div>
      </section>

      {/* Community Section */}
      <section
        id="community"
        data-animate
        className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-800 ${
          isVisible.community ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-cyan-800 mb-4">{data.community.title}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Student Life */}
          <div className="lg:w-2/3">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-8 mb-8">
              <h3 className="text-2xl font-bold text-cyan-800 mb-4">Student Life</h3>
              <p className="text-lg text-cyan-600 leading-relaxed mb-6">{data.community.studentLife.description}</p>
              <button className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg">
                Join Now
                <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.community.studentLife.aspects.map((aspect, index) => (
                <div
                  key={index}
                  className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-6 transition-all duration-300 hover:scale-105"
                >
                  <div className="p-3 rounded-full bg-cyan-100 mb-4 w-fit">
                    <aspect.icon className="text-cyan-600 text-xl" />
                  </div>
                  <h4 className="text-lg font-bold text-cyan-800 mb-2 group-hover:text-cyan-600 transition-colors">
                    {aspect.title}
                  </h4>
                  <p className="text-cyan-600">{aspect.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="lg:w-1/3">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-8">
              <h3 className="text-2xl font-bold text-cyan-800 mb-6">{data.community.events.title}</h3>
              <div className="space-y-6">
                {data.community.events.list.map((event, index) => (
                  <div key={index} className="border-l-4 border-cyan-600 pl-4">
                    <p className="text-sm text-cyan-700">{event.date}</p>
                    <h4 className="text-lg font-bold text-cyan-800 mb-2">{event.title}</h4>
                    <p className="text-cyan-600">{event.description}</p>
                  </div>
                ))}
              </div>
              <button className="group inline-flex items-center mt-6 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg">
                View All Events
                <FaCalendarAlt className="ml-2 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Support and Wellness Section */}
      <section
        id="support-wellness"
        data-animate
        className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-800 ${
          isVisible['support-wellness'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-cyan-800 mb-4">{data.supportWellness.title}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {data.supportWellness.resources.map((resource, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-6 transition-all duration-300 hover:scale-105"
            >
              <div className="p-3 rounded-full bg-cyan-100 mb-4 w-fit">
                <resource.icon className="text-cyan-600 text-xl" />
              </div>
              <h4 className="text-lg font-bold text-cyan-800 mb-2 group-hover:text-cyan-600 transition-colors">
                {resource.title}
              </h4>
              <p className="text-cyan-600">{resource.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg">
            Get Support
            <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

      {/* Emergency Contact Section */}
      <section
        id="emergency-contact"
        data-animate
        className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-800 ${
          isVisible['emergency-contact'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-cyan-800 mb-4">{data.emergencyContact.title}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-8">
          <div className="space-y-6">
            {data.emergencyContact.contacts.map((contact, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-cyan-100 pb-4 last:border-b-0">
                <div>
                  <h4 className="text-lg font-bold text-cyan-800 mb-2">{contact.title}</h4>
                  <div className="flex items-center space-x-2 text-cyan-600">
                    <FaPhone />
                    <p>{contact.phone}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-cyan-600">
                    <FaEnvelope />
                    <p>{contact.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

export default DepartmentCommunity;