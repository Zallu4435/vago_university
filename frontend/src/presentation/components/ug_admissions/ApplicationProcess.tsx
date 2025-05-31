import React, { useState } from 'react';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';

const ApplicationProcess = () => {
  const [activeStep, setActiveStep] = useState(1);
  
  const processSteps = [
    {
      id: 1,
      title: 'Apply Online',
      details: [
        'Check the Admission Requirements and Programme Prerequisites for different applicant types.',
        'Apply online via the application form (refer to Application Guides and Sample Forms).',
        'Submit supporting documents electronically.',
        'Pay application fee.'
      ]
    },
    {
      id: 2,
      title: 'Track Application Status via Your Application Portal',
      details: [
        'Log in to your application portal to check your application status.',
        'Ensure all required documents are uploaded correctly.',
        'Monitor for any updates or requests for additional information.'
      ]
    },
    {
      id: 3,
      title: 'Check Admission Outcome/Shortlisted for Tests',
      details: [
        'Receive notification of your admission outcome.',
        'If shortlisted, you may be required to attend interviews or tests.',
        'Check your email regularly for important communications.'
      ]
    },
    {
      id: 4,
      title: 'Application Outcome Released (Offer to Applicant)',
      details: [
        'Successful applicants will receive an offer of admission.',
        'Review your offer package carefully.',
        'Note any deadlines for acceptance of the offer.'
      ]
    },
    {
      id: 5,
      title: 'Accept Offer Online',
      details: [
        'Accept your offer through the online portal.',
        'Pay any required acceptance fees.',
        'Complete any additional steps required to secure your place.'
      ]
    }
  ];

  const handleStepClick = (stepId) => {
    setActiveStep(stepId);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-12">
      <div className="border-b border-blue-500">
        <h1 className="text-3xl font-bold text-center py-6 text-blue-800">APPLICATION PROCESS</h1>
      </div>

      <div className="p-6">
        {/* Process Timeline */}
        <div className="relative mb-12">
          {/* Timeline Line */}
          <div className="absolute left-0 right-0 h-1 bg-gray-200 top-12 md:top-16"></div>
          
          {/* Timeline Steps */}
          <div className="flex justify-between relative">
            {processSteps.map((step, index) => (
              <div 
                key={step.id} 
                className={`relative flex flex-col items-center w-1/5 cursor-pointer transition-all duration-300 ${
                  activeStep === step.id ? 'transform scale-105' : ''
                }`}
                onClick={() => handleStepClick(step.id)}
              >
                <div className={`w-20 h-20 md:w-36 md:h-32 flex items-center justify-center mb-2 rounded-lg border-2 ${
                  activeStep === step.id 
                    ? 'bg-orange-50 border-orange-500 text-orange-600' 
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}>
                  <p className="text-xs md:text-sm text-center font-medium px-1">
                    {step.title}
                  </p>
                </div>
                <div className={`rounded-full w-8 h-8 flex items-center justify-center z-10 font-bold ${
                  activeStep === step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step.id}
                </div>
                {index < processSteps.length - 1 && (
                  <FaArrowRight className={`absolute right-0 top-10 md:top-12 transform translate-x-1/2 w-4 h-4 hidden md:block ${
                    activeStep === step.id || activeStep === step.id + 1
                      ? 'text-blue-500'
                      : 'text-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Details */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 shadow-md">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                {activeStep}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                {processSteps.find(step => step.id === activeStep)?.title}
              </h2>
              <ul className="space-y-3">
                {processSteps.find(step => step.id === activeStep)?.details.map((detail, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">{detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Links Section */}
        {activeStep === 1 && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <p className="text-blue-700 font-medium mb-2">Helpful Resources:</p>
            <ul className="text-blue-600 space-y-1">
              <li>
                <a href="#" className="hover:underline">Application Guides and Sample Forms</a>
              </li>
              <li>
                <a href="#" className="hover:underline">Programme Prerequisites</a>
              </li>
              <li>
                <a href="#" className="hover:underline">Application Fee Information</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationProcess;