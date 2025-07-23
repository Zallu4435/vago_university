import { FaBookOpen, FaAward, FaDollarSign } from 'react-icons/fa';

// Import images from assets
import viewbookImage from '../../../../assets/images/ug-programs/publications/undergraduate-viewbook.jpg';
import prospectusImage from '../../../../assets/images/ug-programs/publications/international-prospectus.jpg';
import brochureImage from '../../../../assets/images/ug-programs/publications/scholarship-financial-aid.jpg';

const UndergraduatePublications: React.FC = () => {
  const publications = [
    {
      title: "AY2025/2026 Undergraduate Viewbook",
      icon: <FaBookOpen size={24} />,
      color: "bg-gradient-to-r from-cyan-600 to-blue-600",
      description: "Comprehensive overview of our undergraduate programs, campus life, and admission requirements.",
      image: viewbookImage
    },
    {
      title: "AY2025/2026 Undergraduate Prospectus for International Students",
      icon: <FaAward size={24} />,
      color: "bg-gradient-to-r from-cyan-500 to-blue-500",
      description: "Detailed information for international applicants, including visa requirements and global opportunities.",
      image: prospectusImage
    },
    {
      title: "AY2025/2026 Scholarship & Financial Aid Brochure",
      icon: <FaDollarSign size={24} />,
      color: "bg-gradient-to-r from-cyan-700 to-blue-700",
      description: "Complete guide to available scholarships, grants, and financial assistance programs.",
      image: brochureImage
    }
  ];

  return (
    <div className="flex flex-col items-center w-full p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-cyan-50 via-white to-cyan-50 min-h-screen">
      <div className="max-w-6xl w-full mx-auto">
        <div className="mb-8 sm:mb-10 lg:mb-12 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4 text-cyan-800">
            Undergraduate Admissions Publications
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-cyan-600 max-w-3xl mx-auto px-2">
            Explore our comprehensive resources designed to help you make informed decisions about your academic future.
          </p>
          <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mt-3 sm:mt-4" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {publications.map((pub, index) => (
            <div 
              key={index} 
              className="flex flex-col bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl border border-cyan-100"
            >
              <div className={`${pub.color} p-4 sm:p-6 flex justify-center`}>
                <div className="w-24 sm:w-28 lg:w-32 h-32 sm:h-36 lg:h-40 bg-white rounded-lg shadow-md flex items-center justify-center overflow-hidden">
                  <img 
                    src={pub.image} 
                    alt={pub.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
              
              <div className="p-4 sm:p-6 flex-1 flex flex-col">
                <div className="flex items-center mb-2 sm:mb-3">
                  <div className={`p-2 rounded-full bg-cyan-100 text-cyan-600 mr-2 sm:mr-3`}>
                    {pub.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-cyan-800 line-clamp-2 text-sm sm:text-base">
                    {pub.title}
                  </h3>
                </div>
                
                <p className="text-cyan-600 mb-3 sm:mb-4 flex-1 text-xs sm:text-sm">
                  {pub.description}
                </p>
                
                <div className="mt-auto flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-2 px-3 sm:px-4 rounded-md font-medium transition shadow-md hover:shadow-lg text-xs sm:text-sm">
                    View Online
                  </button>
                  <button className="flex items-center justify-center bg-cyan-100 hover:bg-cyan-200 text-cyan-800 py-2 px-3 sm:px-4 rounded-md font-medium transition text-xs sm:text-sm">
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 sm:mt-10 lg:mt-12 text-center">
          <p className="text-cyan-600 mb-4 sm:mb-6 text-sm sm:text-base px-2">
            Need help or have questions about our publications?
          </p>
          <button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition shadow-md hover:shadow-lg text-sm sm:text-base">
            Contact Admissions Office
          </button>
        </div>
      </div>
    </div>
  );
};

export default UndergraduatePublications;