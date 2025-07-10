import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaClock } from 'react-icons/fa';

export const Programmes: React.FC = () => {
    return (
        <section className="w-full bg-gradient-to-b from-cyan-50 via-white to-cyan-50 py-8 sm:py-10 md:py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Title Section */}
                <div className="text-center mb-8 sm:mb-10 md:mb-12">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-3 sm:mb-4">
                        Our Programmes
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-cyan-600 max-w-2xl mx-auto mb-4 sm:mb-6 px-4">
                        Discover our comprehensive range of programmes designed to empower the next
                        generation of leaders and innovators.
                    </p>
                    <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
                </div>

                {/* Programme Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
                    {/* Undergraduate Card */}
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
                        <div className="bg-gradient-to-r from-cyan-700 via-blue-600 to-cyan-600 p-4 sm:p-6 text-white">
                            <h2 className="text-xl sm:text-2xl font-bold mb-2">Undergraduate Studies</h2>
                            <p className="text-cyan-100 text-sm sm:text-base">Now accepting applications for 2024</p>
                        </div>
                        <div className="p-4 sm:p-6">
                            <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 text-cyan-700 text-sm sm:text-base">
                                <li>•
                                    <strong>Computing:</strong> AI, CSE, Data Science
                                </li>
                                <li>•
                                    <strong>Business:</strong> Finance, Marketing
                                </li>
                            </ul>
                            <Link
                                to="/ug"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition group w-full justify-center text-sm sm:text-base"
                            >
                                Explore Programmes
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
                            <h2 className="text-xl sm:text-2xl font-bold mb-2">Graduate Studies</h2>
                            <p className="text-gray-200 text-sm sm:text-base">Opening Fall 2024</p>
                        </div>
                        <div className="p-4 sm:p-6">
                            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                                Our graduate programmes are being developed in collaboration with industry
                                leaders. Register below to be notified when applications open.
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
                        Questions about our programmes? Contact academic advisory at{' '}
                        <a href="mailto:academic@academia.edu" className="text-cyan-700 hover:text-cyan-800 underline">
                            academic@academia.edu
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Programmes;