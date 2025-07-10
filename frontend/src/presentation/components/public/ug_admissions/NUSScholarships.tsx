import { useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Import scholarship category images from assets
import citizensScholarshipImage from '../../../assets/images/ug-programs/scholarshipCategories/scholarships-singapore-citizens.jpg';
import prScholarshipImage from '../../../assets/images/ug-programs/scholarshipCategories/scholarships-singapore-pr.jpg';
import internationalScholarshipImage from '../../../assets/images/ug-programs/scholarshipCategories/scholarships-international-students.jpg';
import currentStudentsScholarshipImage from '../../../assets/images/ug-programs/scholarshipCategories/current-nus-undergraduates.jpg';

export default function NUSScholarships() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const scholarshipCategories = [
    {
      id: 'citizens',
      title: 'Singapore Citizens',
      image: citizensScholarshipImage,
      description: 'Scholarships available for Singapore citizens entering NUS as freshmen.',
      tab: 'Scholarships for Freshman (Our Citizen)'
    },
    {
      id: 'pr',
      title: 'Singapore Permanent Residents',
      image: prScholarshipImage,
      description: 'Scholarship options for Singapore PRs starting their undergraduate journey.',
      tab: 'Undergraduate Scholarships'
    },
    {
      id: 'international',
      title: 'International Students',
      image: internationalScholarshipImage,
      description: 'Financial aid opportunities for international students joining NUS.',
      tab: 'Undergraduate Scholarships'
    },
    {
      id: 'current',
      title: 'Current NUS Undergraduates',
      image: currentStudentsScholarshipImage,
      description: 'Merit-based scholarships for existing NUS students with outstanding performance.',
      tab: 'Undergraduate Scholarships'
    }
  ];

  const handleLearnMore = (category: any) => {
    navigate(`/undergraduate-scholarships?tab=${encodeURIComponent(category.tab)}`);
  };

  const handleApplyNow = () => {
    navigate('/undergraduate-scholarships?tab=Undergraduate%20Scholarships');
  };

  return (
    <div className="w-full py-6 sm:py-8 lg:py-12 px-0 sm:px-0 lg:px-0 bg-transparent">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 lg:mb-12 lg:mb-16">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-2 sm:mb-3">DISCOVER NUS SCHOLARSHIPS</h1>
        <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mb-4 sm:mb-6"></div>
        <p className="text-sm sm:text-base lg:text-lg text-cyan-600 w-full sm:max-w-3xl mx-auto px-3 sm:px-4 lg:px-6">
          NUS offers different types of undergraduate scholarships to recognize academic excellence, 
          leadership qualities and special talents of our freshmen and undergraduate students.
        </p>
      </div>

      {/* Scholarship Categories */}
      <div className="mb-6 sm:mb-8 lg:mb-12 lg:mb-16 px-3 sm:px-4 lg:px-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-cyan-800 mb-2 sm:mb-4 text-center">Scholarships for Freshmen</h2>
        <p className="text-center text-cyan-600 mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-base px-2">Explore the various scholarships you are eligible for.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {scholarshipCategories.slice(0, 3).map(category => (
            <div
              key={category.id}
              className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className="relative h-32 sm:h-40 lg:h-48 overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.title} 
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
                  style={{
                    transform: hoveredCategory === category.id ? 'scale(1.05)' : 'scale(1)'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 to-transparent"></div>
                <h3 className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-white font-semibold text-sm sm:text-lg lg:text-xl">{category.title}</h3>
              </div>
              <div className="p-3 sm:p-4 bg-transparent">
                <p className="text-cyan-600 mb-3 sm:mb-4 text-xs sm:text-sm">{category.description}</p>
                <button 
                  onClick={() => handleLearnMore(category)}
                  className="flex items-center text-cyan-600 font-medium hover:text-cyan-800 transition-colors text-xs sm:text-sm"
                >
                  Learn more <FaChevronRight size={14} className="ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Undergraduates */}
      <div className="px-3 sm:px-4 lg:px-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-cyan-800 mb-2 sm:mb-4 text-center">Scholarships for Current Undergraduate Students</h2>
        <p className="text-center text-cyan-600 mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-base px-2">Check out the scholarship options available to you.</p>
        
        <div className="w-full rounded-lg overflow-hidden shadow-sm border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50">
          <div className="relative h-40 sm:h-48 lg:h-64 overflow-hidden">
            <img 
              src={scholarshipCategories[3].image} 
              alt={scholarshipCategories[3].title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 to-transparent"></div>
            <h3 className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-white font-semibold text-sm sm:text-lg lg:text-xl">Current NUS Undergraduates</h3>
          </div>
          <div className="p-4 sm:p-6 bg-transparent">
            <p className="text-cyan-600 mb-3 sm:mb-4 text-xs sm:text-sm">{scholarshipCategories[3].description}</p>
            <button 
              onClick={() => handleLearnMore(scholarshipCategories[3])}
              className="flex items-center text-cyan-600 font-medium hover:text-cyan-800 transition-colors text-xs sm:text-sm"
            >
              Explore opportunities <FaChevronRight size={14} className="ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 sm:mt-8 lg:mt-12 lg:mt-16 text-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-100 mx-3 sm:mx-4 lg:mx-6 shadow-sm">
        <h3 className="text-lg sm:text-xl font-semibold text-cyan-800 mb-2 sm:mb-3">Ready to pursue excellence?</h3>
        <p className="text-cyan-600 mb-4 sm:mb-6 text-sm sm:text-base">Apply for NUS scholarships and unlock your potential.</p>
        <button 
          onClick={handleApplyNow}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-md transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}