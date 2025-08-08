import React, { useState } from 'react';
import { FaUsers, FaLaptopCode, FaGlobe, FaHandshake, FaHeart } from 'react-icons/fa';
import { useSectionAnimation } from '../../../shared/hooks/useSectionAnimation';
import DepartmentPoster from '../../components/departments/common/DepartmentPoster';
import DepartmentCommunityAbout from '../../components/departments/community/DepartmentCommunityAbout';
import DepartmentCommunityMain from '../../components/departments/community/DepartmentCommunityMain';
import DepartmentCommunitySupport from '../../components/departments/community/DepartmentCommunitySupport';
import DepartmentCommunityEmergency from '../../components/departments/community/DepartmentCommunityEmergency';

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
  const [currentDepartment] = useState<string>('computer-science');
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
            "At the School of Computing, our vibrant community fosters collaboration, innovation, and lifelong connections. From coding clubs to hackathons, there's something for everyone to engage, learn, and grow.",
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
            phone: '+91 9876543210',
            email: 'security@vagocomputing.edu.sg',
          },
          {
            title: 'Health Services',
            phone: '+91 9876543210',
            email: 'healthservices@vagocomputing.edu.sg',
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
            phone: '+91 9876543210',
            email: 'security@vagobusiness.edu.sg',
          },
          {
            title: 'Health Services',
            phone: '+91 9876543210',
            email: 'healthservices@vagobusiness.edu.sg',
          },
        ],
      },
    },
  };

  const data = departmentData[currentDepartment] || departmentData['computer-science'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
      <DepartmentPoster poster={data.poster} isVisible={isVisible} />
      <DepartmentCommunityAbout about={data.about} isVisible={isVisible} />
      <DepartmentCommunityMain community={data.community} isVisible={isVisible} />
      <DepartmentCommunitySupport supportWellness={data.supportWellness} isVisible={isVisible} />
      <DepartmentCommunityEmergency emergencyContact={data.emergencyContact} isVisible={isVisible} />
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

export default DepartmentCommunity;