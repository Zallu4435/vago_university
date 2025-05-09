import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaGraduationCap, FaUserGraduate, FaQuestionCircle, FaBookReader, FaClock } from 'react-icons/fa';

const NeedHelp: React.FC = () => {
  const helpLinks = [
    {
      title: 'Undergraduate Admission',
      icon: FaGraduationCap,
      path: '/help/undergraduate',
      available: true
    },
    {
      title: 'Graduate Admission',
      icon: FaUserGraduate,
      path: '/help/graduate',
      available: false,
      comingSoon: true
    },
    {
      title: 'Student Services',
      icon: FaBookReader,
      path: '/help/services',
      available: false
    },
    {
      title: 'Financial Aid',
      icon: FaQuestionCircle,
      path: '/help/financial',
      available: false
    }
  ];

  return (
    <section className="w-full bg-gradient-to-b from-cyan-50 via-white to-cyan-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-cyan-800 mb-4">Need Help?</h2>
          <p className="text-lg text-cyan-600">
            We're here to assist you with any questions about your academic journey
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
          {helpLinks.map((link, index) => (
            link.available ? (
              <Link
                key={index}
                to={link.path}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4 rounded-lg 
                hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 flex flex-col 
                items-center justify-center gap-2 group"
              >
                <link.icon className="text-2xl" />
                <span className="text-center">{link.title}</span>
              </Link>
            ) : (
              <div
                key={index}
                className={`p-4 rounded-lg flex flex-col items-center justify-center gap-2 cursor-not-allowed border
                  ${link.comingSoon 
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white border-gray-500' 
                    : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}
              >
                {link.comingSoon ? (
                  <>
                    <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full text-xs font-semibold flex items-center">
                      <FaClock className="mr-1" />
                      Coming Soon
                    </div>
                    <link.icon className="text-2xl" />
                    <span className="text-center">{link.title}</span>
                    <span className="text-sm text-gray-300">Opening Fall 2024</span>
                  </>
                ) : (
                  <>
                    <link.icon className="text-2xl" />
                    <span className="text-center">Coming Soon</span>
                  </>
                )}
              </div>
            )
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/help"
            className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-semibold group"
          >
            View All Help Topics
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-cyan-600">
            Can't find what you're looking for?{' '}
            <a 
              href="mailto:support@academia.edu" 
              className="text-cyan-700 hover:text-cyan-800 underline"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default NeedHelp;