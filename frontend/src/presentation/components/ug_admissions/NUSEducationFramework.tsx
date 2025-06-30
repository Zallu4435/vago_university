import React from 'react';

const NUSEducationFramework = () => {
  const educationPillars = [
    {
      title: "Flexible Pathways",
      image: "/api/placeholder/500/400",
      points: [
        "Opportunity to explore a diverse range of majors, second majors, minors, specialisations and cross-disciplinary programmes",
        "Each major combines its specialised area of knowledge with broader cross-disciplinary elements",
        "Creates a unique learning portfolio that align with your educational aspirations"
      ]
    },
    {
      title: "Common Curriculum",
      image: "/api/placeholder/500/400",
      points: [
        "Develops strong foundational understanding in established and emerging fields",
        "Learn fundamental concepts and strengthen your analytical thinking",
        "Helps intellectual creativity and fosters innovation",
        "Builds the capacity to engage in lifelong learning"
      ]
    },
    {
      title: "Interdisciplinary Learning",
      image: "/api/placeholder/500/400",
      points: [
        "Connect knowledge across disciplines to pursue knowledge with perspective",
        "Enhance your ability to transfer and integrate knowledge from different disciplines to solve complex and evolving situations",
        "Provides a holistic and complete, reinforced by experiential learning"
      ]
    },
    {
      title: "Lifelong Learning",
      image: "/api/placeholder/500/400",
      points: [
        "Encourage continuous learning of new skills and knowledge through upskilling/reskilling",
        "Gain access to over 1,900 courses on emerging topics via NUS' Lifelong Learning programmes",
        "Enhance progression to the next level in your learning journey, with a comprehensive suite of Graduate Certificates, Graduate Diplomas and Master's Degrees"
      ]
    }
  ];

  return (
    <div className="bg-transparent px-0 sm:px-0 lg:px-0 pt-4 sm:pt-6 lg:pt-8 pb-8 sm:pb-12 lg:pb-16 w-full">
      {/* Header Section */}
      <div className="w-full mb-6 sm:mb-8 lg:mb-12 text-center px-3 sm:px-4 lg:px-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-4 sm:mb-6 pb-2 border-b-4 border-cyan-500 inline-block">
          AN EDUCATION AT NUS PUTS YOU AHEAD
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-cyan-600 max-w-4xl mx-auto px-2">
          Our flexible, transformative education framework sets you up to grow into a deeply passionate, curious, innovative and future-ready
          leader who is proficient in solving real-world problems and a lifelong learner.
        </p>
      </div>

      {/* Grid Layout for First Two Items */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 px-3 sm:px-4 lg:px-6">
        {/* Flexible Pathways */}
        <div className="flex flex-col lg:flex-row bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg overflow-hidden border border-cyan-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="lg:w-2/5">
            <img 
              src={educationPillars[0].image} 
              alt="Students collaborating" 
              className="w-full h-48 lg:h-full object-cover"
            />
          </div>
          <div className="lg:w-3/5 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-cyan-800 mb-3 sm:mb-4">
              {educationPillars[0].title}
            </h2>
            <ul className="space-y-2 sm:space-y-3">
              {educationPillars[0].points.map((point, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="mt-1 mr-2 flex-shrink-0">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  </div>
                  <p className="text-xs sm:text-sm text-cyan-600">{point}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Common Curriculum */}
        <div className="flex flex-col lg:flex-row bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg overflow-hidden border border-cyan-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="lg:w-2/5">
            <img 
              src={educationPillars[1].image} 
              alt="Classroom discussion" 
              className="w-full h-48 lg:h-full object-cover"
            />
          </div>
          <div className="lg:w-3/5 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-cyan-800 mb-3 sm:mb-4">
              {educationPillars[1].title}
            </h2>
            <ul className="space-y-2 sm:space-y-3">
              {educationPillars[1].points.map((point, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="mt-1 mr-2 flex-shrink-0">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  </div>
                  <p className="text-xs sm:text-sm text-cyan-600">{point}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Grid Layout for Last Two Items */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 px-3 sm:px-4 lg:px-6">
        {/* Interdisciplinary Learning */}
        <div className="flex flex-col lg:flex-row bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg overflow-hidden border border-cyan-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="lg:w-2/5">
            <img 
              src={educationPillars[2].image} 
              alt="Student project work" 
              className="w-full h-48 lg:h-full object-cover"
            />
          </div>
          <div className="lg:w-3/5 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-cyan-800 mb-3 sm:mb-4">
              {educationPillars[2].title}
            </h2>
            <ul className="space-y-2 sm:space-y-3">
              {educationPillars[2].points.map((point, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="mt-1 mr-2 flex-shrink-0">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  </div>
                  <p className="text-xs sm:text-sm text-cyan-600">{point}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Lifelong Learning */}
        <div className="flex flex-col lg:flex-row bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg overflow-hidden border border-cyan-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="lg:w-2/5">
            <img 
              src={educationPillars[3].image} 
              alt="Lecture hall" 
              className="w-full h-48 lg:h-full object-cover"
            />
          </div>
          <div className="lg:w-3/5 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-cyan-800 mb-3 sm:mb-4">
              {educationPillars[3].title}
            </h2>
            <ul className="space-y-2 sm:space-y-3">
              {educationPillars[3].points.map((point, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="mt-1 mr-2 flex-shrink-0">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  </div>
                  <p className="text-xs sm:text-sm text-cyan-600">{point}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NUSEducationFramework;