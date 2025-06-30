import React, { useState } from 'react';
import { FaArrowRight, FaUsers, FaLaptopCode, FaHandshake, FaGraduationCap, FaMoneyBillWave } from 'react-icons/fa';
import { useSectionAnimation } from '../../../application/hooks/useSectionAnimation';

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
  const [currentDepartment, setCurrentDepartment] = useState<string>('computer-science');
  const isVisible = useSectionAnimation();

  const entrepreneurshipData: EntrepreneurshipDataMap = {
    'computer-science': {
      poster: {
        title: 'Entrepreneurship at NUS Computing',
        subtitle: 'Empowering the Next Generation of Tech Innovators',
      },
      whatWeDo: {
        title: 'What We Do',
        description:
          'Empower and equip NUS Computing students with the essential entrepreneurial skills necessary to thrive within tech startups. Encourage and ensure NUS Computing students are well-prepared to navigate and contribute to the vibrant local startup ecosystem as they embark on their entrepreneurial journey.',
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
        title: 'Entrepreneurship at NUS Business',
        subtitle: 'Building the Future of Business Innovation',
      },
      whatWeDo: {
        title: 'What We Do',
        description:
          'Inspire and empower NUS Business students with the entrepreneurial mindset and skills needed to excel in the dynamic world of startups. We ensure our students are equipped to lead, innovate, and contribute to the global startup ecosystem.',
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
              'The mentorship I received through NUS Business was invaluable. It helped me refine my business idea and connect with investors who believed in my vision.',
          },
          {
            name: 'Michael Tan',
            title: 'CEO & Co-Founder',
            company: 'FinTech Innovate',
            testimonial:
              'The entrepreneurship programs at NUS Business gave me the confidence and skills to launch my startup. The networking events were a game-changer for me.',
          },
          {
            name: 'Emily Ng',
            title: 'Co-Founder',
            company: 'EcoSolutions',
            testimonial:
              'NUS Business provided a supportive environment to test my ideas. The funding opportunities allowed me to take my startup from concept to reality.',
          },
        ],
      },
    },
  };

  const data = entrepreneurshipData[currentDepartment] || entrepreneurshipData['computer-science'];

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

      {/* What We Do Section */}
      <section
        id="what-we-do"
        data-animate
        className={`w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-12 sm:py-16 lg:py-20 transition-all duration-800 ${
          isVisible['what-we-do'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-3 sm:mb-4">{data.whatWeDo.title}</h2>
          <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-4 sm:p-6 lg:p-8">
          <p className="text-sm sm:text-base lg:text-lg text-cyan-600 leading-relaxed">{data.whatWeDo.description}</p>
        </div>
      </section>

      {/* How We Do It Section */}
      <section
        id="how-we-do-it"
        data-animate
        className={`w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-12 sm:py-16 lg:py-20 transition-all duration-800 ${
          isVisible['how-we-do-it'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-3 sm:mb-4">{data.howWeDoIt.title}</h2>
          <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {data.howWeDoIt.aspects.map((aspect, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-4 sm:p-6 transition-all duration-300 hover:scale-105"
            >
              <div className="p-2 sm:p-3 rounded-full bg-cyan-100 mb-3 sm:mb-4 w-fit">
                <aspect.icon className="text-cyan-600 text-lg sm:text-xl" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-cyan-800 mb-1 sm:mb-2 group-hover:text-cyan-600 transition-colors">
                {aspect.title}
              </h4>
              <p className="text-cyan-600 text-sm sm:text-base">{aspect.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What Our Alumni Say Section */}
      <section
        id="alumni"
        data-animate
        className={`w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-12 sm:py-16 lg:py-20 transition-all duration-800 ${
          isVisible.alumni ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-3 sm:mb-4">{data.alumni.title}</h2>
          <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {data.alumni.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-4 sm:p-6 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <div className="w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-cyan-600 text-lg sm:text-xl lg:text-2xl font-bold">{testimonial.name.charAt(0)}</span>
                </div>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-cyan-800 mb-1 text-center">{testimonial.name}</h4>
              <p className="text-xs sm:text-sm text-cyan-600 mb-2 text-center">{testimonial.title}, {testimonial.company}</p>
              <p className="text-cyan-600 text-sm sm:text-base text-center">{testimonial.testimonial}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-6 sm:mt-8">
          <button className="group inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base">
            Read More Stories
            <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
          </button>
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

export default Entrepreneurship;