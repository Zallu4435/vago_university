import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const mockImages = [
    {
        id: 1,
        src: "https://via.placeholder.com/300x300?text=Campus+Life",
        alt: "Campus Life",
        title: "Campus Life",
        category: "Student Life"
    },
    {
        id: 2,
        src: "https://via.placeholder.com/300x300?text=Research",
        alt: "Research Labs",
        title: "Research Excellence",
        category: "Research"
    },
    {
        id: 3,
        src: "https://via.placeholder.com/300x300?text=Sports",
        alt: "Sports Facilities",
        title: "Sports Center",
        category: "Athletics"
    },
    {
        id: 4,
        src: "https://via.placeholder.com/300x300?text=Library",
        alt: "Library",
        title: "Modern Library",
        category: "Facilities"
    },
    {
        id: 5,
        src: "https://via.placeholder.com/300x300?text=Events",
        alt: "Events",
        title: "Student Events",
        category: "Events"
    },
];

export const VagoNow: React.FC = () => {
    return (
        <section className="bg-transparent_65 rounded-xl border border-cyan-100 shadow-sm p-8">
            <div className="max-w-6xl mx-auto text-center mb-10">
                <h2 className="text-3xl font-bold mb-3 text-cyan-800">VAGO Now</h2>
                <p className="text-cyan-600 text-lg mb-6 max-w-2xl mx-auto">
                    Come discover our exciting and vibrant campus and find out why #VagoLife is invigorating and fulfilling.
                </p>
                <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mb-10" />
            </div>

            <div className="max-w-6xl mx-auto">
                {/* First row - 3 items */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                    {mockImages.slice(0, 3).map((image) => (
                        <div
                            key={image.id}
                            className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-[280px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/90 via-cyan-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <span className="text-xs font-semibold px-3 py-1 bg-cyan-500/80 rounded-full mb-2 inline-block">
                                        {image.category}
                                    </span>
                                    <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                                    <Link
                                        to={`/campus/${image.id}`}
                                        className="inline-flex items-center text-sm font-semibold hover:text-cyan-300 transition-colors"
                                    >
                                        Learn More <FaArrowRight className="ml-2 text-xs" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Second row - 2 items centered */}
                <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {mockImages.slice(3, 5).map((image) => (
                        <div
                            key={image.id}
                            className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-[280px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/90 via-cyan-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <span className="text-xs font-semibold px-3 py-1 bg-cyan-500/80 rounded-full mb-2 inline-block">
                                        {image.category}
                                    </span>
                                    <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                                    <Link
                                        to={`/campus/${image.id}`}
                                        className="inline-flex items-center text-sm font-semibold hover:text-cyan-300 transition-colors"
                                    >
                                        Learn More <FaArrowRight className="ml-2 text-xs" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center mt-10">
                <Link
                    to="/campus-life"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    Explore More
                    <FaArrowRight className="ml-2" />
                </Link>
            </div>
        </section>
    );
};
