// Import images from assets
import entrepreneurshipImage from '../../../assets/images/ug-programs/graduation-support/entrepreneurship.jpg';
import furtherEducationImage from '../../../assets/images/ug-programs/graduation-support/further-education.jpg';
import lifelongLearningImage from '../../../assets/images/ug-programs/graduation-support/lifelong-learning.jpg';

const GraduationSupport = () => {
  const supportItems = [
    {
      id: 'entrepreneurship',
      title: 'Entrepreneurship',
      image: entrepreneurshipImage,
      description: 'Whether it is to turn ground breaking research into a deep tech start-up, deep dive into the academic and experiential part of entrepreneurship, or incubate your early or growth stage start-up, we can give you a hand.',
      buttonText: 'Learn more'
    },
    {
      id: 'further-education',
      title: 'Further Education',
      image: furtherEducationImage,
      description: "If your inclination is to continue from where you left off, NUS Graduate School offers Graduate Diplomas or Doctoral and Master's Degrees. What's more – you'll get to do them in an environment and at a pace you are familiar with.",
      buttonText: 'Learn more'
    },
    {
      id: 'lifelong-learning',
      title: 'Lifelong Learning',
      image: lifelongLearningImage,
      description: "With over 1,000 courses on emerging topics, NUS Lifelong Learning (L³) for Alumni keeps you on top of your professional game. You can even stack them towards micro-certifications like Graduate Certificates, or a Master's Degree or another Bachelor's Degree.",
      buttonText: 'Learn more'
    }
  ];

  return (
    <div className="w-full bg-transparent shadow-sm rounded-lg overflow-hidden border border-cyan-100">
      <div className="border-b border-cyan-100">
        <h1 className="text-2xl sm:text-3xl font-bold text-center py-4 sm:py-6 text-cyan-800">SUPPORT BEYOND YOUR GRADUATION</h1>
        <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mb-4 sm:mb-6" />
        <p className="text-center text-cyan-600 pb-4 sm:pb-6 px-3 sm:px-4 text-sm sm:text-base">
          Your connection with NUS continues even after graduation. We'll just support you in a different way.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
        {supportItems.map((item) => (
          <div key={item.id} className="flex flex-col h-full bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-cyan-100">
            <div className="h-32 sm:h-40 lg:h-48 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 sm:p-4 flex flex-col flex-grow">
              <h2 className="text-lg sm:text-xl font-semibold text-cyan-800 mb-2">{item.title}</h2>
              <p className="text-cyan-600 flex-grow text-xs sm:text-sm">{item.description}</p>
              <div className="mt-3 sm:mt-4">
                <button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium py-2 px-3 sm:px-4 rounded-md transition-all duration-300 shadow-sm hover:shadow-md text-xs sm:text-sm">
                  {item.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraduationSupport;