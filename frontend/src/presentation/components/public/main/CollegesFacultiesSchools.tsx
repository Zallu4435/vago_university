import { FaGraduationCap, FaClock } from 'react-icons/fa';

const colleges = [
  { id: 1, name: 'Computing', available: true, path: '/departments/computer-science' },
  { id: 2, name: 'Business', available: true, path: '/departments/business' },
  { id: 3, name: 'Engineering', available: false },
  { id: 4, name: 'Sciences', available: false },
  { id: 5, name: 'Arts & Social Sciences', available: false },
  { id: 6, name: 'Medicine', available: false },
];

const CollegesFacultiesSchools = () => {
  return (
    <section className="w-full bg-gradient-to-b from-cyan-50 via-white to-cyan-50 py-6 sm:py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-2 sm:mb-4">
            16 Colleges, Faculties & Schools
          </h1>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-cyan-700 mb-2 sm:mb-4">
            4,000+ courses each semester
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-cyan-600 max-w-3xl mx-auto mb-4 sm:mb-6 px-2">
            Infinite possibilities. We offer a global and Asian experience that is 
            broad, deep and rigorous. Your experience will be intellectually 
            fulfilling within and outside the classroom.
          </p>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {colleges.map((college) => (
            college.available ? (
              <a
                key={college.id}
                href={college.path}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg 
                hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 flex items-center 
                justify-center gap-2 group text-sm sm:text-base"
              >
                <FaGraduationCap className="text-lg sm:text-xl" />
                <span>{college.name}</span>
              </a>
            ) : (
              <div
                key={college.id}
                className="bg-gray-100 text-gray-500 px-4 sm:px-6 py-3 sm:py-4 rounded-lg flex items-center 
                justify-center gap-2 cursor-not-allowed border border-gray-200 text-sm sm:text-base"
              >
                <FaClock className="text-lg sm:text-xl" />
                <span>Coming Soon</span>
              </div>
            )
          ))}
        </div>

        <div className="mt-8 sm:mt-10 lg:mt-12 text-center">
          <p className="text-sm sm:text-base text-cyan-600 px-2">
            Want to learn more about our colleges?{' '}
            <a 
              href="mailto:academic@academia.edu" 
              className="text-cyan-700 hover:text-cyan-800 underline"
            >
              Contact our academic advisors
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CollegesFacultiesSchools;