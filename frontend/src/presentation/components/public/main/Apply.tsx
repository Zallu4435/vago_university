import React from 'react';
import { Link } from 'react-router-dom';
import { FaDownload, FaArrowRight, FaClock } from 'react-icons/fa';

const Apply: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-b from-cyan-50 via-white to-cyan-50 py-8 sm:py-10 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-3 sm:mb-4">
            Begin Your Journey at Academia
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-cyan-600 max-w-2xl mx-auto px-4">
            Take the first step towards your future. Choose your program level below 
            to start your application process.
          </p>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mt-3 sm:mt-4" />
        </div>

        {/* Application Guide */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-cyan-800 text-center md:text-left">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Application Guide 2024</h3>
              <p className="text-cyan-600 text-sm sm:text-base">
                Download our comprehensive guide to learn about admission requirements and deadlines
              </p>
            </div>
            <Link
              to="/viewbook"
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white text-cyan-700 rounded-lg border border-cyan-200 hover:bg-cyan-50 transition group whitespace-nowrap text-sm sm:text-base"
            >
              <FaDownload className="mr-2" />
              Download Guide
            </Link>
          </div>
        </div>

        {/* Application Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {/* Undergraduate Card */}
          <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
            <div className="bg-gradient-to-r from-cyan-700 via-blue-600 to-cyan-600 p-4 sm:p-6 text-white">
              <h2 className="text-xl sm:text-2xl font-bold">Undergraduate</h2>
              <p className="text-cyan-100 mt-2 text-sm sm:text-base">Now accepting applications</p>
            </div>
            <div className="p-4 sm:p-6">
              <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 text-cyan-700 text-sm sm:text-base">
                <li>• Fall 2024 intake open</li>
                <li>• Rolling admissions</li>
                <li>• Merit scholarships available</li>
              </ul>
              <Link 
                to="/apply/undergraduate"
                className="inline-flex items-center px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition group w-full justify-center text-sm sm:text-base"
              >
                Apply Now
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Graduate Card (Coming Soon) */}
          <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-cyan-100 opacity-90">
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-4 sm:p-6 text-white relative">
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-yellow-400 text-gray-900 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center">
                <FaClock className="mr-1" />
                Coming Soon
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">Graduate</h2>
              <p className="text-gray-200 mt-2 text-sm sm:text-base">Opening Fall 2024</p>
            </div>
            <div className="p-4 sm:p-6">
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Graduate admissions will open soon. Register below to receive updates 
                and important deadlines.
              </p>
              <button 
                disabled
                className="inline-flex items-center px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 text-gray-500 rounded-lg w-full justify-center cursor-not-allowed text-sm sm:text-base"
              >
                Get Notified
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 sm:mt-10 md:mt-12 text-center">
          <p className="text-cyan-600 text-sm sm:text-base px-4">
            Need assistance? Our admissions team is here to help:{' '}
            <a href="mailto:admissions@academia.edu" className="text-cyan-700 hover:text-cyan-800 underline">
              admissions@academia.edu
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Apply;