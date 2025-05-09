import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const articles = [
  {
    id: 1,
    title: "How financial influencers can make or break investment platforms like Chocolate Finance",
    description: "Influencers contributed to the rapid growth of Singapore financial services firm Chocolate Finance, but also to its upheaval.",
    image: "https://via.placeholder.com/600x400?text=Finance+Influencers",
    category: "Finance",
    link: "/insights/finance-influencers"
  },
  {
    id: 2,
    title: "Cold Storage, Giant acquisition signals room for growth in Singapore's supermarket landscape",
    description: "The supermarket of the future may not look like a supermarket at all.",
    image: "https://via.placeholder.com/600x400?text=Supermarket+Growth",
    category: "Business",
    link: "/insights/supermarket-landscape"
  },
];

export const ThoughtLeadership: React.FC = () => {
  return (
    <section className="bg-transparent_65 rounded-xl border border-cyan-100 shadow-sm p-8">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold mb-3 text-cyan-800">Thought Leadership</h2>
        <p className="text-cyan-600 text-lg mb-6 max-w-2xl mx-auto">
          Distinguished thought leaders, movers and shakers in Singapore and across the globe gather regularly on
          campus to share their insights and engage in intellectual discourse.
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {articles.map((article) => (
          <div 
            key={article.id} 
            className="group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-cyan-50"
          >
            <div className="relative overflow-hidden h-60">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute top-4 right-4">
                <span className="bg-gradient-to-r from-cyan-600 to-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                  {article.category}
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-cyan-700 via-blue-600 to-cyan-600 text-white p-6 flex flex-col justify-between min-h-[240px]">
              <div>
                <h3 className="text-xl font-semibold mb-3 leading-tight">
                  {article.title}
                </h3>
                <p className="text-cyan-50 text-sm leading-relaxed">
                  {article.description}
                </p>
              </div>
              <Link 
                to={article.link}
                className="inline-flex items-center mt-4 bg-white/20 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/30 transition group/btn self-start"
              >
                Read More
                <FaArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          to="/thought-leadership"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          View All Insights
          <FaArrowRight className="ml-2" />
        </Link>
      </div>
    </section>
  );
};
