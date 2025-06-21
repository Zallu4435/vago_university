import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useHighlights } from "../../../application/hooks/useSiteSections";

export const ArticleGrid: React.FC = () => {
  const { data: highlights, isLoading, error } = useHighlights();

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 text-cyan-800">VAGO Highlights</h2>
          <p className="text-cyan-600 text-lg max-w-2xl mx-auto">
            Learn how our transformative education and research nurtures leaders and society.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mt-4" />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="bg-white rounded-xl overflow-hidden border border-cyan-100 shadow-sm animate-pulse">
              <div className="h-56 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-3 text-cyan-800">VAGO Highlights</h2>
          <p className="text-red-600">Failed to load highlights. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Enhanced heading section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3 text-cyan-800">
          VAGO Highlights
        </h2>
        <p className="text-cyan-600 text-lg max-w-2xl mx-auto">
          Learn how our transformative education and research nurtures leaders and society.
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mt-4" />
      </div>

      {/* Enhanced grid layout */}
      <div className="grid md:grid-cols-2 gap-8">
        {highlights?.map((highlight) => (
          <div
            key={highlight.id}
            className="group bg-white rounded-xl overflow-hidden border border-cyan-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative overflow-hidden">
              <img
                src={highlight.image}
                alt={highlight.title}
                className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-gradient-to-r from-cyan-600 to-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                  {highlight.category || 'General'}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-cyan-900 group-hover:text-cyan-600 transition-colors">
                {highlight.title}
              </h3>
              <p className="text-cyan-700 text-sm mb-4 line-clamp-2">
                {highlight.description}
              </p>
              <div className="flex justify-end">
                <Link
                  to={highlight.link || '#'}
                  className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-semibold text-sm group/link"
                >
                  Read More 
                  <FaArrowRight className="ml-2 transform group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Optional: Add "View All" button */}
      <div className="text-center mt-12">
        <Link
          to="/news"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          View All Articles
          <FaArrowRight className="ml-2" />
        </Link>
      </div>
    </section>
  );
};
