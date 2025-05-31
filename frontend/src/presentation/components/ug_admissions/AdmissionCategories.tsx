import { FaArrowRight, FaUsers, FaGlobe, FaUser } from 'react-icons/fa';

const AdmissionCategories = () => {
  const categories = [
    {
      id: 'transfer',
      title: 'Transfer Applicants',
      icon: <FaUsers className="w-10 h-10 text-white" />,
      description: 'For students transferring from other universities or institutions.',
      note: 'Refer to the Important Dates page for details on relevant application windows',
      gradient: 'from-cyan-600 to-blue-600'
    },
    {
      id: 'international',
      title: 'International Students with International Qualifications',
      icon: <FaGlobe className="w-10 h-10 text-white" />,
      description: 'For international students applying with non-Singapore qualifications.',
      note: 'Refer to the Important Dates page for details on relevant application windows',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'citizens',
      title: 'Our Citizens',
      icon: <FaUser className="w-10 h-10 text-white" />,
      description: 'For Singapore citizens and permanent residents.',
      note: 'Refer to the Important Dates page for details on relevant application windows',
      gradient: 'from-cyan-700 to-blue-700'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto bg-white shadow-md rounded-xl overflow-hidden mb-12 border border-cyan-100">
      <div className="border-b border-cyan-200">
        <h1 className="text-3xl font-bold text-center py-6 text-cyan-800">Admissions to NUS Undergraduate Programmes</h1>
        <p className="text-center text-cyan-600 px-6 pb-6 max-w-4xl mx-auto">
          Identify your application group based on the qualification you hold and click on the corresponding link to access detailed information about the admissions requirements and procedures.
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col border border-cyan-100 transform hover:-translate-y-1"
            >
              {/* Header with gradient */}
              <div className={`bg-gradient-to-br ${category.gradient} p-6 text-white text-center flex flex-col items-center`}>
                <div className="rounded-full bg-white bg-opacity-20 p-4 mb-4">
                  {category.icon}
                </div>
                <h2 className="text-xl font-bold mb-2 leading-tight">
                  {category.title}
                </h2>
                <p className="text-sm text-white text-opacity-90">
                  {category.description}
                </p>
              </div>

              {/* Footer with note and link */}
              <div className="bg-cyan-50 p-4 flex flex-col flex-grow">
                <p className="text-sm text-cyan-700 mb-4 flex-grow">
                  {category.note}
                </p>
                <a 
                  href="#" 
                  className="flex items-center justify-center py-2 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-md transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg"
                >
                  <span>Learn more</span>
                  <FaArrowRight className="ml-2 w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdmissionCategories;