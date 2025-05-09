import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

type Article = {
  title: string;
  summary: string;
  image: string;
  category: string;
  link: string;
};

const dummyArticles: Article[] = [
  {
    title: "Patrick Tan appointed as Duke-NUS Dean to lead next era of medical innovation and education",
    summary:
      "Professor Patrick Tan has been appointed the next Dean of Duke-NUS Medical School, effective 1 January 2025...",
    image: "https://via.placeholder.com/400x250?text=Dean+Appointed",
    category: "General News",
    link: "#",
  },
  {
    title: "NUS researchers combine 3D bioprinting with AI to personalise oral soft tissue grafts",
    summary:
      "AI helps optimise 3D bioprinting parameters for oral soft tissue, enabling efficient personalised dental treatments.",
    image: "https://via.placeholder.com/400x250?text=3D+Bioprinting",
    category: "Research",
    link: "#",
  },
  {
    title: "Connecting classrooms to communities",
    summary:
      "At Tembusu College, students are not just learning about society—they are learning with it.",
    image: "https://via.placeholder.com/400x250?text=Community+Learning",
    category: "Education",
    link: "#",
  },
  {
    title: "45 years with Kent Ridge Hall",
    summary:
      "In celebration of its 45th anniversary, Kent Ridge Hall held a gala recognizing student achievements.",
    image: "https://via.placeholder.com/400x250?text=Kent+Ridge+Hall",
    category: "General News",
    link: "#",
  },
];

export const ArticleGrid: React.FC = () => {
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
        {dummyArticles.map((article, idx) => (
          <div
            key={idx}
            className="group bg-white rounded-xl overflow-hidden border border-cyan-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-gradient-to-r from-cyan-600 to-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                  {article.category}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-cyan-900 group-hover:text-cyan-600 transition-colors">
                {article.title}
              </h3>
              <p className="text-cyan-700 text-sm mb-4 line-clamp-2">
                {article.summary}
              </p>
              <div className="flex justify-end">
                <Link
                  to={article.link}
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
