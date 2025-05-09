import { FaBookOpen, FaAward, FaDollarSign } from 'react-icons/fa';

const UndergraduatePublications: React.FC = () => {
  const publications = [
    {
      title: "AY2025/2026 Undergraduate Viewbook",
      icon: <FaBookOpen size={24} />,
      color: "bg-blue-600",
      description: "Comprehensive overview of our undergraduate programs, campus life, and admission requirements."
    },
    {
      title: "AY2025/2026 Undergraduate Prospectus for International Students",
      icon: <FaAward size={24} />,
      color: "bg-green-600",
      description: "Detailed information for international applicants, including visa requirements and global opportunities."
    },
    {
      title: "AY2025/2026 Scholarship & Financial Aid Brochure",
      icon: <FaDollarSign size={24} />,
      color: "bg-amber-600",
      description: "Complete guide to available scholarships, grants, and financial assistance programs."
    }
  ];

  return (
    <div className="flex flex-col items-center w-full p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl w-full mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Undergraduate Admissions Publications
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive resources designed to help you make informed decisions about your academic future.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {publications.map((pub, index) => (
            <div 
              key={index} 
              className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
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
                  <div className={`p-2 rounded-full ${pub.color} text-white mr-3`}>
                    {pub.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                    {pub.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 mb-4 flex-1">
                  {pub.description}
                </p>
                
                <div className="mt-auto flex gap-3">
                  <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md font-medium transition">
                    View Online
                  </button>
                  <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md font-medium transition">
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            Need help or have questions about our publications?
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition">
            Contact Admissions Office
          </button>
        </div>
      </div>
    </div>
  );
};

export default UndergraduatePublications;