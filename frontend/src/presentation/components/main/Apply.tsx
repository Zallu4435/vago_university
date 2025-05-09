import React from 'react';
import { Link } from 'react-router-dom';
import { FaDownload, FaArrowRight, FaClock } from 'react-icons/fa';

const Apply: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-b from-cyan-50 via-white to-cyan-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-cyan-800 mb-4">
            Begin Your Journey at Academia
          </h1>
          <p className="text-lg text-cyan-600 max-w-2xl mx-auto">
            Take the first step towards your future. Choose your program level below 
            to start your application process.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mt-4" />
        </div>

        {/* Application Guide */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 mb-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-cyan-800">
              <h3 className="text-xl font-semibold mb-2">Application Guide 2024</h3>
              <p className="text-cyan-600">
                Download our comprehensive guide to learn about admission requirements and deadlines
              </p>
            </div>
            <Link
              to="/viewbook"
              className="inline-flex items-center px-6 py-3 bg-white text-cyan-700 rounded-lg border border-cyan-200 hover:bg-cyan-50 transition group whitespace-nowrap"
            >
              <FaDownload className="mr-2" />
              Download Guide
            </Link>
          </div>
        </div>

        {/* Application Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Undergraduate Card */}
          <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
            <div className="bg-gradient-to-r from-cyan-700 via-blue-600 to-cyan-600 p-6 text-white">
              <h2 className="text-2xl font-bold">Undergraduate</h2>
              <p className="text-cyan-100 mt-2">Now accepting applications</p>
            </div>
            <div className="p-6">
              <ul className="space-y-3 mb-6 text-cyan-700">
                <li>• Fall 2024 intake open</li>
                <li>• Rolling admissions</li>
                <li>• Merit scholarships available</li>
              </ul>
              <Link 
                to="/apply/undergraduate"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition group w-full justify-center"
              >
                Apply Now
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Graduate Card (Coming Soon) */}
          <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-cyan-100 opacity-90">
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-6 text-white relative">
              <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                <FaClock className="mr-1" />
                Coming Soon
              </div>
              <h2 className="text-2xl font-bold">Graduate</h2>
              <p className="text-gray-200 mt-2">Opening Fall 2024</p>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Graduate admissions will open soon. Register below to receive updates 
                and important deadlines.
              </p>
              <button 
                disabled
                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-500 rounded-lg w-full justify-center cursor-not-allowed"
              >
                Get Notified
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <p className="text-cyan-600">
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