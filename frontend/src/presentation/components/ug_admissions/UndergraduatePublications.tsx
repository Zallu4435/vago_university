import { FaBookOpen, FaAward, FaDollarSign } from 'react-icons/fa';

const UndergraduatePublications: React.FC = () => {
  const publications = [
    {
      title: "AY2025/2026 Undergraduate Viewbook",
      icon: <FaBookOpen size={24} />,
      color: "bg-gradient-to-r from-cyan-600 to-blue-600",
      description: "Comprehensive overview of our undergraduate programs, campus life, and admission requirements."
    },
    {
      title: "AY2025/2026 Undergraduate Prospectus for International Students",
      icon: <FaAward size={24} />,
      color: "bg-gradient-to-r from-cyan-500 to-blue-500",
      description: "Detailed information for international applicants, including visa requirements and global opportunities."
    },
    {
      title: "AY2025/2026 Scholarship & Financial Aid Brochure",
      icon: <FaDollarSign size={24} />,
      color: "bg-gradient-to-r from-cyan-700 to-blue-700",
      description: "Complete guide to available scholarships, grants, and financial assistance programs."
    }
  ];

  return (
    <div className="flex flex-col items-center w-full p-8 bg-gradient-to-b from-cyan-50 via-white to-cyan-50 min-h-screen">
      <div className="max-w-6xl w-full mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-cyan-800">
            Undergraduate Admissions Publications
          </h1>
          <p className="text-lg text-cyan-600 max-w-3xl mx-auto">
            Explore our comprehensive resources designed to help you make informed decisions about your academic future.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mt-4" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {publications.map((pub, index) => (
            <div 
              key={index} 
              className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl border border-cyan-100"
            >
              <div className={`${pub.color} p-6 flex justify-center`}>
                <div className="w-32 h-40 bg-white rounded-lg shadow-md flex items-center justify-center">
                  <img 
                    src="/api/placeholder/240/320" 
                    alt={pub.title} 
                    className="w-24 object-cover" 
                  />
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center mb-3">
                  <div className={`p-2 rounded-full bg-cyan-100 text-cyan-600 mr-3`}>
                    {pub.icon}
                  </div>
                  <h3 className="text-xl font-bold text-cyan-800 line-clamp-2">
                    {pub.title}
                  </h3>
                </div>
                
                <p className="text-cyan-600 mb-4 flex-1">
                  {pub.description}
                </p>
                
                <div className="mt-auto flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-2 px-4 rounded-md font-medium transition shadow-md hover:shadow-lg">
                    View Online
                  </button>
                  <button className="flex items-center justify-center bg-cyan-100 hover:bg-cyan-200 text-cyan-800 py-2 px-4 rounded-md font-medium transition">
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-cyan-600 mb-6">
            Need help or have questions about our publications?
          </p>
          <button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg">
            Contact Admissions Office
          </button>
        </div>
      </div>
    </div>
  );
};

export default UndergraduatePublications;