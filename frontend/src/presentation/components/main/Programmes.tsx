import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaClock } from 'react-icons/fa';

export const Programmes: React.FC = () => {
    return (
        <section className="w-full bg-gradient-to-b from-cyan-50 via-white to-cyan-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Title Section */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-cyan-800 mb-4">
                        Our Programmes
                    </h1>
                    <p className="text-lg text-cyan-600 max-w-2xl mx-auto mb-6">
                        Discover our comprehensive range of programmes designed to empower the next
                        generation of leaders and innovators.
                    </p>
                    <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
                </div>

                {/* Programme Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Undergraduate Card */}
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
                        <div className="bg-gradient-to-r from-cyan-700 via-blue-600 to-cyan-600 p-6 text-white">
                            <h2 className="text-2xl font-bold mb-2">Undergraduate Studies</h2>
                            <p className="text-cyan-100">Now accepting applications for 2024</p>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-3 mb-6 text-cyan-700">
                                <li>•
                                    <strong>Computing:</strong> AI, CSE, Data Science
                                </li>
                                <li>•
                                    <strong>Business:</strong> Finance, Marketing
                                </li>
                            </ul>
                            <Link
                                to="/programmes/undergraduate"
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition group w-full justify-center"
                            >
                                Explore Programmes
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
                            <h2 className="text-2xl font-bold mb-2">Graduate Studies</h2>
                            <p className="text-gray-200">Opening Fall 2024</p>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 mb-6">
                                Our graduate programmes are being developed in collaboration with industry
                                leaders. Register below to be notified when applications open.
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