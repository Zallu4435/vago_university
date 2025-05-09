import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaCalendar, FaCheckSquare, FaRegClock, FaListOl, FaStar, FaRegFileAlt } from 'react-icons/fa';

const EssentialSteps = () => {
  const [expandedItems, setExpandedItems] = useState([]);
  const [expandAll, setExpandAll] = useState(false);
  
  const steps = [
    {
      id: 'dates',
      title: 'Note Down Important Dates',
      icon: <FaCalendar className="w-5 h-5 text-white" />,
      content: `
        <p>Pay close attention to these key dates in the admissions calendar:</p>
        <ul>
          <li>Application opening date: Early November</li>
          <li>Application deadline: Mid-March</li>
          <li>Supporting document submission deadline: Late March</li>
          <li>Interview/test periods (for applicable programs): April-May</li>
          <li>Admission offer release: May-June</li>
          <li>Acceptance deadline: Two weeks after offer</li>
        </ul>
        <p>Missing these deadlines may result in your application not being considered.</p>
      `
    },
    {
      id: 'options',
      title: 'Consider Your Application Options',
      icon: <FaCheckSquare className="w-5 h-5 text-white" />,
      content: `
        <p>Before applying, carefully review:</p>
        <ul>
          <li>Available undergraduate programs and their requirements</li>
          <li>Subject prerequisites for your desired courses</li>
          <li>Admission criteria and selection processes</li>
          <li>Special program requirements (portfolios, interviews, etc.)</li>
          <li>Tuition fees and available financial aid options</li>
        </ul>
        <p>Research thoroughly to find programs that match your academic strengths and career goals.</p>
      `
    },
    {
      id: 'apply',
      title: 'Apply when Admissions Applications Open',
      icon: <FaRegClock className="w-5 h-5 text-white" />,
      content: `
        <p>Submit your application as soon as possible after the portal opens:</p>
        <ul>
          <li>Create an account on the online application portal</li>
          <li>Complete all required sections of the application form</li>
          <li>Upload necessary documents in the specified format</li>
          <li>Review your application thoroughly before submission</li>
          <li>Pay the non-refundable application fee</li>
        </ul>
        <p>Early applications may receive priority consideration for certain programs.</p>
      `
    },
    {
      id: 'rank',
      title: 'Rank Your Selection in order of Preference',
      icon: <FaListOl className="w-5 h-5 text-white" />,
      content: `
        <p>You can apply for up to five programs, ranked in order of preference:</p>
        <ul>
          <li>Your first choice should be your most desired program</li>
          <li>Consider realistic options based on your qualifications</li>
          <li>Include at least one "safe" option where you exceed requirements</li>
          <li>Once submitted, your preference order cannot be changed</li>
          <li>You will be considered for each choice in sequence</li>
        </ul>
        <p>The university will offer you a place in your highest-ranked program for which you qualify.</p>
      `
    },
    {
      id: 'showcase',
      title: 'Showcase Your Aptitude, Passions and Interests',
      icon: <FaStar className="w-5 h-5 text-white" />,
      content: `
        <p>The university values well-rounded applicants. Highlight:</p>
        <ul>
          <li>Academic achievements and awards</li>
          <li>Extracurricular activities and leadership roles</li>
          <li>Community service and volunteer work</li>
          <li>Relevant work experience or internships</li>
          <li>Special skills or talents related to your chosen field</li>
        </ul>
        <p>Your personal statement should demonstrate your passion and suitability for your chosen programs.</p>
      `
    },
    {
      id: 'accuracy',
      title: 'Ensure Accuracy of Information',
      icon: <FaRegFileAlt className="w-5 h-5 text-white" />,
      content: `
        <p>Verify all information before submission:</p>
        <ul>
          <li>Personal details must match your identification documents</li>
          <li>Academic records should be complete and accurate</li>
          <li>Supporting documents must be clear and legible</li>
          <li>Contact information should be current and regularly monitored</li>
          <li>Any discrepancies may delay processing or result in rejection</li>
        </ul>
        <p>False information may lead to withdrawal of offers or termination of enrollment.</p>
      `
    }
  ];

  const toggleItem = (id) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (expandAll) {
      setExpandedItems([]);
    } else {
      setExpandedItems(steps.map(step => step.id));
    }
    setExpandAll(!expandAll);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-12">
      <div className="border-b border-blue-500">
        <h1 className="text-3xl font-bold text-center py-6 text-blue-800">ESSENTIAL STEPS</h1>
        <p className="text-center text-gray-600 pb-4">
          Essential steps to complete your undergraduate admissions application.
        </p>
      </div>

      <div className="p-6">
        <div className="flex justify-end mb-4">
          <button 
            onClick={toggleAll} 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            {expandAll ? 'Collapse All' : 'Expand All'}
            {expandAll ? 
              <FaChevronUp className="ml-1 w-4 h-4" /> : 
              <FaChevronDown className="ml-1 w-4 h-4" />
            }
          </button>
        </div>

        <div className="space-y-3">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <button 
                onClick={() => toggleItem(step.id)}
                className="w-full flex items-center justify-between p-4 bg-gray-600 text-white focus:outline-none hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <div className="mr-3 bg-blue-600 p-2 rounded-full">
                    {step.icon}
                  </div>
                  <h2 className="text-lg font-medium">{step.title}</h2>
                </div>
                {expandedItems.includes(step.id) ? 
                  <FaChevronUp className="w-5 h-5" /> : 
                  <FaChevronDown className="w-5 h-5" />
                }
              </button>
              
              {expandedItems.includes(step.id) && (
                <div className="p-5 bg-white border-t border-gray-200">
                  <div 
                    dangerouslySetInnerHTML={{ __html: step.content }}
                    className="prose max-w-none text-gray-700"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EssentialSteps;