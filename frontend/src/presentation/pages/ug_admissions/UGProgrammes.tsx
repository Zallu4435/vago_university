import React from 'react';
import { FaGraduationCap, FaArrowRight, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface ProgramCardProps {
    title: string;
    description: string;
    image: string;
    courses?: string[];
    comingSoon?: boolean;
    departmentPath?: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ title, description, image, courses, comingSoon, departmentPath }) => {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 border border-cyan-100 transform hover:-translate-y-1">
            <div
                className="w-full h-56 relative group overflow-hidden"
            >
                {!comingSoon ? (
                    <>
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 to-transparent" />
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-700">
                        <div className="text-center p-6">
                            <FaClock className="text-white text-4xl mx-auto mb-4 animate-pulse" />
                            <h3 className="text-2xl font-bold text-white">More Faculties Coming Soon</h3>
                        </div>
                    </div>
                )}

                {!comingSoon && (
                    <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white drop-shadow-md">{title}</h3>
                    </div>
                )}
            </div>

            {!comingSoon ? (
                <div className="p-6">
                    <p className="text-cyan-600 mb-5 text-lg">{description}</p>
                    {courses && (
                        <div className="space-y-3 mb-4">
                            <h4 className="font-semibold text-cyan-800 mb-2">Featured Programs:</h4>
                            {courses.map((course, index) => (
                                <div key={index} className="flex items-center text-cyan-700 bg-cyan-50 p-2 rounded-lg">
                                    <FaGraduationCap className="mr-2 text-cyan-600" />
                                    <span>{course}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    <Link
                        to={departmentPath || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 text-cyan-600 hover:text-cyan-700 flex items-center group font-medium"
                    >
                        Learn more
                        <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            ) : (
                <div className="p-6 text-center">
                    <p className="text-gray-700 mb-5">Stay tuned as we expand our academic offerings with more specialized programs.</p>
                    <button className="mt-4 text-cyan-600 hover:text-cyan-700 flex items-center group mx-auto justify-center font-medium">
                        Get notified
                        <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            )}
        </div>
    );
};

const UGProgrammes: React.FC = () => {
    const programs = [
        {
            title: "School of Computing",
            description: "Shape the digital future through innovation and technology in our cutting-edge computing programs.",
            image: "/images/computing.jpg",
            courses: ["Computer Science", "Information Systems", "Business Analytics"],
            departmentPath: "/departments/computer-science"
        },
        {
            title: "Faculty of Business",
            description: "Develop business acumen and leadership skills for the global marketplace with our renowned faculty.",
            image: "/images/business.jpg",
            courses: ["BBA", "BBA (Accountancy)", "Business Analytics"],
            departmentPath: "/departments/business"
        },
        {
            comingSoon: true,
            title: "Coming Soon",
            description: "More faculties coming soon",
            image: ""
        }
    ];

    return (
        <section className="w-full bg-gradient-to-b from-cyan-50 via-white to-cyan-50 pt-20 py-30">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm font-medium mb-4">Academic Excellence</span>
                    <h1 className="text-4xl font-bold text-cyan-800 mb-6">
                        Choose Your Academic Pathway
                    </h1>
                    <p className="text-lg text-cyan-600 max-w-3xl mx-auto mb-8">
                        With 60 majors, 54 second majors, over 80 minors, you can choose from a full spectrum of disciplines. Learning across faculties and disciplines is highly valued and practised, with other cross-disciplinary initiatives available for a well-rounded knowledge base and transferable skills.
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {programs.map((program, index) => (
                        <ProgramCard key={index} {...program} />
                    ))}
                </div>

                <div className="text-center mt-16">
                    <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                        View All Programs
                        <FaArrowRight className="ml-2" />
                    </button>

                    <p className="mt-6 text-cyan-600 italic">
                        Applications for 2025/2026 academic year now open
                    </p>
                </div>
            </div>
        </section>
    );
};

export default UGProgrammes;