import React, { useState } from 'react';
import { FaUsers, FaLaptopCode, FaHandshake, FaGraduationCap, FaMoneyBillWave } from 'react-icons/fa';
import { useSectionAnimation } from '../../../shared/hooks/useSectionAnimation';
import DepartmentPoster from '../../components/departments/common/DepartmentPoster';
import DepartmentEntrepreneurWhatWeDo from '../../components/departments/entrepreneur/DepartmentEntrepreneurWhatWeDo';
import DepartmentEntrepreneurHowWeDoIt from '../../components/departments/entrepreneur/DepartmentEntrepreneurHowWeDoIt';
import DepartmentEntrepreneurAlumni from '../../components/departments/entrepreneur/DepartmentEntrepreneurAlumni';

interface AlumniTestimonial {
  name: string;
  title: string;
  company: string;
  testimonial: string;
}

interface HowWeDoItAspect {
  title: string;
  description: string;
  icon: React.ElementType;
}

interface EntrepreneurshipData {
  poster: {
    title: string;
    subtitle: string;
  };
  whatWeDo: {
    title: string;
    description: string;
  };
  howWeDoIt: {
    title: string;
    aspects: HowWeDoItAspect[];
  };
  alumni: {
    title: string;
    testimonials: AlumniTestimonial[];
  };
}

interface EntrepreneurshipDataMap {
  [key: string]: EntrepreneurshipData;
}

const Entrepreneurship: React.FC = () => {
  const [currentDepartment] = useState<string>('computer-science');
  const isVisible = useSectionAnimation();

  const entrepreneurshipData: EntrepreneurshipDataMap = {
    'computer-science': {
      poster: {
        title: 'Entrepreneurship at VAGO Computing',
        subtitle: 'Empowering the Next Generation of Tech Innovators',
      },
      whatWeDo: {
        title: 'What We Do',
        description:
          'Empower and equip VAGO Computing students with the essential entrepreneurial skills necessary to thrive within tech startups. Encourage and ensure VAGO Computing students are well-prepared to navigate and contribute to the vibrant local startup ecosystem as they embark on their entrepreneurial journey.',
      },
      howWeDoIt: {
        title: 'How We Do It',
        aspects: [
          {
            title: 'Entrepreneurship Education',
            description: 'Offering entrepreneurship courses that blend theoretical knowledge with practical insights into the startup world.',
            icon: FaGraduationCap,
          },
          {
            title: 'Funding and Recognition',
            description: "Providing awards and grants to recognize and support our students' innovative ideas and projects.",
            icon: FaMoneyBillWave,
          },
          {
            title: 'Incubation and Guidance',
            description: 'Facilitating startup incubation paired with mentorship to guide students from concept to execution.',
            icon: FaLaptopCode,
          },
          {
            title: 'Community and Networking',
            description: 'Hosting diverse events and fostering strategic relationships that connect students with industry leaders, potential investors, and fellow entrepreneurs.',
            icon: FaHandshake,
          },
        ],
      },
      alumni: {
        title: 'What Our Alumni Say',
        testimonials: [
          {
            name: 'Jeremy Hon',
            title: 'CTO & Co-Founder',
            company: 'StaffAny',
            testimonial:
              'Many thanks to Prof Francis during our stint at The Furnace. We had lots of fantastic advice and our own space for activities, like late-night coding or building a tower of cup noodles. We still',
          },
          {
            name: 'Alexandra Zhang',
            title: 'CEO & Co-Founder',
            company: 'Factora',
            testimonial:
              'Furnace has paved the way for us from ground zero to a point of substantial growth, offering a wide range of resources and access to a valuable network that supports early-stage incubator',
          },
          {
            name: 'Liau Jian Jie',
            title: 'CTO & Co-Founder',
            company: 'Mobbin',
            testimonial:
              "The no-frills office space provided was invaluable in the early days of building Mobbin. It gave us a space to work on our ideas whilst we were still pursuing our bachelor's degree. Today, Mobbin",
          },
        ],
      },
    },
    'business': {
      poster: {
        title: 'Entrepreneurship at VAGO Business',
        subtitle: 'Building the Future of Business Innovation',
      },
      whatWeDo: {
        title: 'What We Do',
        description:
          'Inspire and empower VAGO Business students with the entrepreneurial mindset and skills needed to excel in the dynamic world of startups. We ensure our students are equipped to lead, innovate, and contribute to the global startup ecosystem.',
      },
      howWeDoIt: {
        title: 'How We Do It',
        aspects: [
          {
            title: 'Entrepreneurship Education',
            description: 'Delivering courses that combine business theory with real-world entrepreneurial practices.',
            icon: FaGraduationCap,
          },
          {
            title: 'Funding Opportunities',
            description: 'Offering grants and awards to support innovative business ideas and startup ventures.',
            icon: FaMoneyBillWave,
          },
          {
            title: 'Mentorship Programs',
            description: 'Providing mentorship from experienced entrepreneurs to guide students through their startup journey.',
            icon: FaUsers,
          },
          {
            title: 'Networking Events',
            description: 'Organizing events to connect students with investors, industry leaders, and fellow entrepreneurs.',
            icon: FaHandshake,
          },
        ],
      },
      alumni: {
        title: 'What Our Alumni Say',
        testimonials: [
          {
            name: 'Sarah Lim',
            title: 'Founder',
            company: 'GrowEasy',
            testimonial:
              'The mentorship I received through VAGO Business was invaluable. It helped me refine my business idea and connect with investors who believed in my vision.',
          },
          {
            name: 'Michael Tan',
            title: 'CEO & Co-Founder',
            company: 'FinTech Innovate',
            testimonial:
              'The entrepreneurship programs at VAGO Business gave me the confidence and skills to launch my startup. The networking events were a game-changer for me.',
          },
          {
            name: 'Emily Ng',
            title: 'Co-Founder',
            company: 'EcoSolutions',
            testimonial:
              'VAGO Business provided a supportive environment to test my ideas. The funding opportunities allowed me to take my startup from concept to reality.',
          },
        ],
      },
    },
  };

  const data = entrepreneurshipData[currentDepartment] || entrepreneurshipData['computer-science'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
      <DepartmentPoster poster={data.poster} isVisible={isVisible} />
      <DepartmentEntrepreneurWhatWeDo whatWeDo={data.whatWeDo} isVisible={isVisible} />
      <DepartmentEntrepreneurHowWeDoIt howWeDoIt={data.howWeDoIt} isVisible={isVisible} />
      <DepartmentEntrepreneurAlumni alumni={data.alumni} isVisible={isVisible} />
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

export default Entrepreneurship;