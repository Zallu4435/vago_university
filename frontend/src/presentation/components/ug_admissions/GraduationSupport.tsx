
const GraduationSupport = () => {
  const supportItems = [
    {
      id: 'entrepreneurship',
      title: 'Entrepreneurship',
      image: '/api/placeholder/400/250',
      description: 'Whether it is to turn ground breaking research into a deep tech start-up, deep dive into the academic and experiential part of entrepreneurship, or incubate your early or growth stage start-up, we can give you a hand.',
      buttonText: 'Learn more'
    },
    {
      id: 'further-education',
      title: 'Further Education',
      image: '/api/placeholder/400/250',
      description: "If your inclination is to continue from where you left off, NUS Graduate School offers Graduate Diplomas or Doctoral and Master's Degrees. What's more – you'll get to do them in an environment and at a pace you are familiar with.",
      buttonText: 'Learn more'
    },
    {
      id: 'lifelong-learning',
      title: 'Lifelong Learning',
      image: '/api/placeholder/400/250',
      description: "With over 1,000 courses on emerging topics, NUS Lifelong Learning (L³) for Alumni keeps you on top of your professional game. You can even stack them towards micro-certifications like Graduate Certificates, or a Master's Degree or another Bachelor's Degree.",
      buttonText: 'Learn more'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="border-b border-blue-500">
        <h1 className="text-3xl font-bold text-center py-6 text-blue-800">SUPPORT BEYOND YOUR GRADUATION</h1>
        <p className="text-center text-gray-600 pb-6 px-4">
          Your connection with NUS continues even after graduation. We'll just support you in a different way.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 p-6">
        {supportItems.map((item) => (
          <div key={item.id} className="flex flex-col h-full bg-gray-50 rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="h-48 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold text-blue-700 mb-2">{item.title}</h2>
              <p className="text-gray-600 flex-grow">{item.description}</p>
              <div className="mt-4">
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300">
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