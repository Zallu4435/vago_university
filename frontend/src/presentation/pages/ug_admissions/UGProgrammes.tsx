import React from 'react';
import { FaGraduationCap, FaArrowRight, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSectionAnimation } from '../../../application/hooks/useSectionAnimation';
import computingImage from '../../../assets/images/ug-programs/programs/school-of-computing.jpg'
import businessImage from '../../../assets/images/ug-programs/programs/school-of-business.jpg';

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
        <div className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-cyan-100 transform hover:-translate-y-1">
            <div
                className="w-full h-40 sm:h-48 lg:h-56 relative group overflow-hidden"
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
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-600 to-blue-600">
                        <div className="text-center p-4 sm:p-6">
                            <FaClock className="text-white text-2xl sm:text-3xl lg:text-4xl mx-auto mb-2 sm:mb-4 animate-pulse" />
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">More Faculties Coming Soon</h3>
                        </div>
                    </div>
                )}

                {!comingSoon && (
                    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow-md">{title}</h3>
                    </div>
                )}
            </div>

            {!comingSoon ? (
                <div className="p-4 sm:p-6">
                    <p className="text-cyan-600 mb-4 sm:mb-5 text-sm sm:text-base lg:text-lg">{description}</p>
                    {courses && (
                        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                            <h4 className="font-semibold text-cyan-800 mb-1 sm:mb-2 text-sm sm:text-base">Featured Programs:</h4>
                            {courses.map((course, index) => (
                                <div key={index} className="flex items-center text-cyan-700 bg-cyan-50 p-2 rounded-lg text-xs sm:text-sm">
                                    <FaGraduationCap className="mr-2 text-cyan-600 flex-shrink-0" />
                                    <span>{course}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    <Link
                        to={departmentPath || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 sm:mt-4 text-cyan-600 hover:text-cyan-700 flex items-center group font-medium text-sm sm:text-base"
                    >
                        Learn more
                        <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            ) : (
                <div className="p-4 sm:p-6 text-center">
                    <p className="text-cyan-600 mb-4 sm:mb-5 text-sm sm:text-base">Stay tuned as we expand our academic offerings with more specialized programs.</p>
                    <button className="mt-3 sm:mt-4 text-cyan-600 hover:text-cyan-700 flex items-center group mx-auto justify-center font-medium text-sm sm:text-base">
                        Get notified
                        <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            )}
        </div>
    );
};

const UGProgrammes: React.FC = () => {
    const isVisible = useSectionAnimation();
    const programs = [
        {
            title: "School of Computing",
            description: "Shape the digital future through innovation and technology in our cutting-edge computing programs.",
            image: computingImage,
            courses: ["Computer Science", "Information Systems", "Business Analytics"],
            departmentPath: "/departments/computer-science"
        },
        {
            title: "Faculty of Business",
            description: "Develop business acumen and leadership skills for the global marketplace with our renowned faculty.",
            image: businessImage,
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
        <section
            id="ug-programmes"
            data-animate
            className={`w-full bg-gradient-to-b from-cyan-50 via-white to-cyan-50 pt-16 sm:pt-20 py-20 sm:py-30 transition-all duration-800 ${
                isVisible["ug-programmes"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
            <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <span className="inline-block px-3 sm:px-4 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">Academic Excellence</span>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-4 sm:mb-6">
                        Choose Your Academic Pathway
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-cyan-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
                        With 60 majors, 54 second majors, over 80 minors, you can choose from a full spectrum of disciplines. Learning across faculties and disciplines is highly valued and practised, with other cross-disciplinary initiatives available for a well-rounded knowledge base and transferable skills.
                    </p>
                    <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {programs.map((program, index) => (
                        <ProgramCard key={index} {...program} />
                    ))}
                </div>

                <div className="text-center mt-8 sm:mt-12 lg:mt-16">
                    <button className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base">
                        View All Programs
                        <FaArrowRight className="ml-2" />
                    </button>

                    <p className="mt-4 sm:mt-6 text-cyan-600 italic text-sm sm:text-base">
                        Applications for 2025/2026 academic year now open
                    </p>
                </div>
            </div>
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
            `}</style>
        </section>
    );
};

export default UGProgrammes;