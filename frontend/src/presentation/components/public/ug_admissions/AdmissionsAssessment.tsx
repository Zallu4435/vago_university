import { FaFileAlt, FaUsers, FaGraduationCap, FaCheck } from 'react-icons/fa';

const AdmissionsAssessment = () => {
  const admissionInfo = [
    {
      id: 'holistic',
      icon: <FaFileAlt className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />,
      title: 'Holistic Approach',
      description: 'Admission to the University is assessed based on a holistic approach. Prospective students are generally expected to have a good academic record in addition to satisfying the subject prerequisites for the programmes they are applying to. Besides academic grades, other factors such as the application profile, prior preparation, and aptitude for the chosen undergraduate degree programme can be used to admit the applicant.'
    },
    {
      id: 'interviews',
      icon: <FaUsers className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />,
      title: 'Interviews & Tests',
      description: 'Interviews/tests are required for specific undergraduate degree programmes, including Architecture, Dentistry, Industrial Design, Landscape Architecture, Law, Medicine, Music, Nursing and Pharmacy, Politics, and Economics (PPE).'
    },
    {
      id: 'eligibility',
      icon: <FaGraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />,
      title: 'Eligibility Requirements',
      description: 'Applicants who are Singapore Citizens, Permanent Residents, or Flow-through foreign students* must be at least 18 years old by 1st January of matriculation year or have completed at least 12 years of formal education starting from Primary 1 or equivalent. Those not meeting this requirement will be contacted by the University for educational history verification for MOE assessment.'
    },
    {
      id: 'foreignStudents',
      icon: <FaCheck className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />,
      title: 'Flow-through Foreign Students',
      description: '* Flow-through foreign students are those who completed tertiary education in schools in Singapore such as Junior Colleges, Millennia Institute, polytechnics, or Specialized Independent Schools like NUS High School, School of the Arts, and Singapore Sports School.'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-8 sm:mb-10 lg:mb-12 border border-cyan-100">
      <div className="border-b border-cyan-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-center py-4 sm:py-6 text-cyan-800">Admissions Assessment</h1>
        <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mb-4 sm:mb-6" />
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {admissionInfo.map((item) => (
            <div 
              key={item.id} 
              className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 sm:p-5 shadow-md transition-all duration-300 hover:shadow-xl border border-cyan-100 hover:border-cyan-200"
            >
              <div className="flex items-start">
                <div className="rounded-full bg-cyan-100 p-2 sm:p-3 mr-3 sm:mr-4 flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-cyan-800 mb-2 text-sm sm:text-base">{item.title}</h2>
                  <p className="text-cyan-700 text-xs sm:text-sm">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-500 p-3 sm:p-4 rounded">
          <p className="text-xs sm:text-sm text-cyan-700">
            <span className="font-semibold">Note:</span> This approach reflects the university's commitment to considering the broader qualities and experiences that applicants bring to the academic community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdmissionsAssessment;