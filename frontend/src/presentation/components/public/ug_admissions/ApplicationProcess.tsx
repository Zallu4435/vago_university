import { useState } from 'react';
import { FaCheckCircle, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

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

  const handleStepClick = (stepId: any) => {
    setActiveStep(stepId);
  };

  const nextStep = () => {
    setActiveStep(prev => prev === processSteps.length ? 1 : prev + 1);
  };

  const prevStep = () => {
    setActiveStep(prev => prev === 1 ? processSteps.length : prev - 1);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-8 sm:mb-10 lg:mb-12 border border-cyan-100">
      <div className="border-b border-cyan-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-center py-4 sm:py-6 text-cyan-800">APPLICATION PROCESS</h1>
        <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mb-4 sm:mb-6" />
      </div>

      <div className="p-4 sm:p-6">
        {/* Mobile Slider View */}
        <div className="block lg:hidden">
          {/* Step Indicators */}
          <div className="flex justify-center items-center mb-6">
            <div className="flex space-x-2">
              {processSteps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(step.id)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeStep === step.id ? 'bg-cyan-600 scale-125' : 'bg-cyan-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Mobile Step Display */}
          <div className="relative">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 shadow-md border border-cyan-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm mr-3">
                    {activeStep}
                  </div>
                  <h2 className="text-lg font-semibold text-cyan-800">
                    {processSteps.find(step => step.id === activeStep)?.title}
                  </h2>
                </div>
              </div>
              
              <ul className="space-y-3">
                {processSteps.find(step => step.id === activeStep)?.details.map((detail, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheckCircle className="w-5 h-5 text-cyan-600 mr-3 flex-shrink-0 mt-0.5" />
                    <p className="text-cyan-700 text-sm">{detail}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Navigation */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={prevStep}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                disabled={activeStep === 1}
              >
                <FaArrowLeft className="w-4 h-4" />
                <span className="text-sm">Previous</span>
              </button>
              
              <span className="text-sm font-medium text-cyan-600">
                {activeStep} of {processSteps.length}
              </span>
              
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                disabled={activeStep === processSteps.length}
              >
                <span className="text-sm">Next</span>
                <FaArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Timeline View */}
        <div className="hidden lg:block">
          {/* Process Timeline */}
          <div className="relative mb-8 sm:mb-10 lg:mb-12">
            {/* Timeline Line */}
            <div className="absolute left-0 right-0 h-1 bg-cyan-200 top-8 sm:top-10 md:top-12 lg:top-16"></div>
            
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
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-36 md:h-32 flex items-center justify-center mb-2 rounded-lg border-2 ${
                    activeStep === step.id 
                      ? 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-500 text-cyan-700' 
                      : 'bg-cyan-50 border-cyan-200 text-cyan-600'
                  }`}>
                    <p className="text-xs sm:text-sm text-center font-medium px-1">
                      {step.title}
                    </p>
                  </div>
                  <div className={`rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center z-10 font-bold text-xs sm:text-sm ${
                    activeStep === step.id 
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white' 
                      : 'bg-cyan-200 text-cyan-600'
                  }`}>
                    {step.id}
                  </div>
                  {index < processSteps.length - 1 && (
                    <FaArrowRight className={`absolute right-0 top-6 sm:top-8 md:top-10 lg:top-12 transform translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 hidden md:block ${
                      activeStep === step.id || activeStep === step.id + 1
                        ? 'text-cyan-500'
                        : 'text-cyan-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Details */}
          <div className="mt-6 sm:mt-8 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 sm:p-6 shadow-md border border-cyan-100">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3 sm:mr-4">
                <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-xs sm:text-sm">
                  {activeStep}
                </div>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-cyan-800 mb-3 sm:mb-4 text-sm sm:text-base">
                  {processSteps.find(step => step.id === activeStep)?.title}
                </h2>
                <ul className="space-y-2 sm:space-y-3">
                  {processSteps.find(step => step.id === activeStep)?.details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-cyan-700 text-xs sm:text-sm">{detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Links Section */}
        {activeStep === 1 && (
          <div className="mt-4 sm:mt-6 border-t border-cyan-200 pt-3 sm:pt-4">
            <p className="text-cyan-700 font-medium mb-2 text-sm sm:text-base">Helpful Resources:</p>
            <ul className="text-cyan-600 space-y-1 text-xs sm:text-sm">
              <li>
                <a href="#" className="hover:text-cyan-800 hover:underline transition-colors">Application Guides and Sample Forms</a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-800 hover:underline transition-colors">Programme Prerequisites</a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-800 hover:underline transition-colors">Application Fee Information</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationProcess;