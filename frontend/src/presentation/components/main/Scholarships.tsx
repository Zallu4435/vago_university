import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaArrowRight, FaClock } from 'react-icons/fa';

export const Scholarships: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-b from-cyan-50 via-white to-cyan-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-cyan-800 mb-4">
            Find Your Perfect Scholarship
          </h1>
          <p className="text-lg text-cyan-600 max-w-2xl mx-auto">
            We believe every talented student deserves the opportunity to excel. 
            Explore our scholarship options and take the next step in your academic journey.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mt-4" />
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Undergraduate Card */}
          <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
            <div className="bg-gradient-to-r from-cyan-700 via-blue-600 to-cyan-600 p-6 text-white">
              <h2 className="text-2xl font-bold">Undergraduate</h2>
              <p className="text-cyan-100 mt-2">Available for 2024 intake</p>
            </div>
            <div className="p-6">
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-cyan-700">
                  <FaCheck className="text-cyan-500 mr-3" />
                  <span>Full tuition coverage</span>
                </li>
                <li className="flex items-center text-cyan-700">
                  <FaCheck className="text-cyan-500 mr-3" />
                  <span>Monthly stipend</span>
                </li>
                <li className="flex items-center text-cyan-700">
                  <FaCheck className="text-cyan-500 mr-3" />
                  <span>No bond required</span>
                </li>
              </ul>
              <Link 
                to="/undergraduate-scholarships"
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
                Our graduate scholarship program is currently under development. 
                Sign up to be notified when applications open.
              </p>
              <button 
                disabled
                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-500 rounded-lg w-full justify-center cursor-not-allowed"
              >
                Notify Me When Available
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-cyan-600">
            Need help with your application? Contact our scholarship office at{' '}
            <a href="mailto:scholarships@academia.edu" className="text-cyan-700 hover:text-cyan-800 underline">
              scholarships@academia.edu
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Scholarships;