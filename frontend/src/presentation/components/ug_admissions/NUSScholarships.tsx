import { useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';

export default function NUSScholarships() {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const scholarshipCategories = [
    {
      id: 'citizens',
      title: 'Singapore Citizens',
      image: '/api/placeholder/400/300',
      description: 'Scholarships available for Singapore citizens entering NUS as freshmen.'
    },
    {
      id: 'pr',
      title: 'Singapore Permanent Residents',
      image: '/api/placeholder/400/300',
      description: 'Scholarship options for Singapore PRs starting their undergraduate journey.'
    },
    {
      id: 'international',
      title: 'International Students',
      image: '/api/placeholder/400/300',
      description: 'Financial aid opportunities for international students joining NUS.'
    },
    {
      id: 'current',
      title: 'Current NUS Undergraduates',
      image: '/api/placeholder/400/300',
      description: 'Merit-based scholarships for existing NUS students with outstanding performance.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 bg-white">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-blue-800 mb-3">DISCOVER NUS SCHOLARSHIPS</h1>
        <div className="w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          NUS offers different types of undergraduate scholarships to recognize academic excellence, 
          leadership qualities and special talents of our freshmen and undergraduate students.
        </p>
      </div>

      {/* Scholarship Categories */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">Scholarships for Freshmen</h2>
        <p className="text-center text-gray-600 mb-8">Explore the various scholarships you are eligible for.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {scholarshipCategories.slice(0, 3).map(category => (
            <div
              key={category.id}
              className="rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.title} 
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
                  style={{
                    transform: hoveredCategory === category.id ? 'scale(1.05)' : 'scale(1)'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 text-white font-semibold text-xl">{category.title}</h3>
              </div>
              <div className="p-4 bg-white">
                <p className="text-gray-600 mb-4">{category.description}</p>
                <button className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors">
                  Learn more <FaChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Undergraduates */}
      <div>
        <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">Scholarships for Current Undergraduate Students</h2>
        <p className="text-center text-gray-600 mb-8">Check out the scholarship options available to you.</p>
        
        <div className="max-w-2xl mx-auto rounded-lg overflow-hidden shadow-lg">
          <div className="relative h-64 overflow-hidden">
            <img 
              src={scholarshipCategories[3].image} 
              alt={scholarshipCategories[3].title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <h3 className="absolute bottom-4 left-4 text-white font-semibold text-xl">Current NUS Undergraduates</h3>
          </div>
          <div className="p-6 bg-white">
            <p className="text-gray-600 mb-4">{scholarshipCategories[3].description}</p>
            <button className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors">
              Explore opportunities <FaChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center p-8 bg-blue-50 rounded-lg">
        <h3 className="text-xl font-semibold text-blue-800 mb-3">Ready to pursue excellence?</h3>
        <p className="text-gray-600 mb-6">Apply for NUS scholarships and unlock your potential.</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
          Apply Now
        </button>
      </div>
    </div>
  );
}