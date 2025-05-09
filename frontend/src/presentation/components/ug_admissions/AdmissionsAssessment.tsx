import { FaFileAlt, FaUsers, FaGraduationCap, FaCheck } from 'react-icons/fa';

const AdmissionsAssessment = () => {
  const admissionInfo = [
    {
      id: 'holistic',
      icon: <FaFileAlt className="w-6 h-6 text-blue-600" />,
      title: 'Holistic Approach',
      description: 'Admission to the University is assessed based on a holistic approach. Prospective students are generally expected to have a good academic record in addition to satisfying the subject prerequisites for the programmes they are applying to. Besides academic grades, other factors such as the application profile, prior preparation, and aptitude for the chosen undergraduate degree programme can be used to admit the applicant.'
    },
    {
      id: 'interviews',
      icon: <FaUsers className="w-6 h-6 text-blue-600" />,
      title: 'Interviews & Tests',
      description: 'Interviews/tests are required for specific undergraduate degree programmes, including Architecture, Dentistry, Industrial Design, Landscape Architecture, Law, Medicine, Music, Nursing and Pharmacy, Politics, and Economics (PPE).'
    },
    {
      id: 'eligibility',
      icon: <FaGraduationCap className="w-6 h-6 text-blue-600" />,
      title: 'Eligibility Requirements',
      description: 'Applicants who are Singapore Citizens, Permanent Residents, or Flow-through foreign students* must be at least 18 years old by 1st January of matriculation year or have completed at least 12 years of formal education starting from Primary 1 or equivalent. Those not meeting this requirement will be contacted by the University for educational history verification for MOE assessment.'
    },
    {
      id: 'foreignStudents',
      icon: <FaCheck className="w-6 h-6 text-blue-600" />,
      title: 'Flow-through Foreign Students',
      description: '* Flow-through foreign students are those who completed tertiary education in schools in Singapore such as Junior Colleges, Millennia Institute, polytechnics, or Specialized Independent Schools like NUS High School, School of the Arts, and Singapore Sports School.'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-12">
      <div className="border-b border-blue-500">
        <h1 className="text-3xl font-bold text-center py-6 text-blue-800">Admissions Assessment</h1>
      </div>

      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {admissionInfo.map((item) => (
            <div 
              key={item.id} 
              className="bg-gray-50 rounded-lg p-5 shadow-md transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-start">
                <div className="rounded-full bg-blue-100 p-3 mr-4 flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-blue-700 mb-2">{item.title}</h2>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Note:</span> This approach reflects the university's commitment to considering the broader qualities and experiences that applicants bring to the academic community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdmissionsAssessment;