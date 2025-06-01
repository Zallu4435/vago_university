import React, { useState } from 'react';
import { FaDownload, FaChevronRight, FaUsers, FaGlobe, FaGraduationCap, FaFileAlt, FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function ProgramPrerequisites() {
  const [activeTab, setActiveTab] = useState('admission');
  const [expandedSections, setExpandedSections] = useState({});

  const navigationItems = [
    { id: 'admission', label: 'Admission', icon: FaGraduationCap },
    { id: 'dates', label: 'Important Dates', icon: FaCalendarAlt },
    { id: 'aptitude', label: 'Aptitude-Based Admissions', icon: FaCheckCircle },
    { id: 'guides', label: 'Application Guides & Sample Forms', icon: FaFileAlt },
    { id: 'offer', label: 'Accept or Reject Offer', icon: FaExclamationCircle },
    { id: 'before', label: 'Before you Apply', icon: FaUsers },
    { id: 'after', label: 'After you Apply', icon: FaChevronRight },
    { id: 'international', label: 'International Qualifications', icon: FaGlobe },
    { id: 'transfer', label: 'Transfer Applicants', icon: FaFileAlt },
  ];

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const getContentForTab = () => {
    switch (activeTab) {
      case 'admission':
        return {
          title: 'Admission Requirements',
          content: (
            <div className="space-y-6">
              <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100 animate-in slide-in-from-top-2">
                <p className="text-cyan-700 leading-relaxed mb-4">
                  Admission to NUS undergraduate programs is highly competitive and based on academic merit. International students must maintain a GPA of 3.5–3.8 on a 4.0 scale to boost their chances of admission.
                </p>
                <p className="text-cyan-700 leading-relaxed">
                  Application fees range from SGD 20 to 100 based on the program. Undergraduate applicants need a strong Standard XII record, while graduate applicants require additional documentation.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
                  <h4 className="font-semibold text-cyan-800 mb-3 flex items-center gap-2">
                    <FaUsers className="w-5 h-5 text-cyan-600" />
                    For Singapore Citizens/PRs
                  </h4>
                  <ul className="text-cyan-700 space-y-2 text-sm">
                    <li>• Minimum age of 18 years as of January 1st</li>
                    <li>• Completion of 12 years formal education</li>
                    <li>• Singapore-Cambridge GCE 'A' Level or equivalent</li>
                    <li>• Subject-specific prerequisites for chosen program</li>
                  </ul>
                </div>
                <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
                  <h4 className="font-semibold text-cyan-800 mb-3 flex items-center gap-2">
                    <FaGlobe className="w-5 h-5 text-cyan-600" />
                    For International Students
                  </h4>
                  <ul className="text-cyan-700 space-y-2 text-sm">
                    <li>• Strong academic record (minimum 90% for Indian students)</li>
                    <li>• English language proficiency proof</li>
                    <li>• Supporting documents and transcripts</li>
                    <li>• Program-specific requirements</li>
                  </ul>
                </div>
              </div>
            </div>
          ),
        };

      case 'dates':
        return {
          title: 'Important Dates',
          content: (
            <div className="space-y-6">
              <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100 animate-in slide-in-from-top-2">
                <p className="text-cyan-700 leading-relaxed">
                  The university deadline for undergraduate admission is February 26, 2026 (tentative). Application deadlines vary by program and student category.
                </p>
              </div>
              <div className="grid gap-4">
                <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100">
                  <h4 className="font-semibold text-cyan-800 mb-4">AY2026/2027 Application Timeline (Tentative)</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-cyan-100">
                      <span className="text-cyan-700">Application Opens</span>
                      <span className="font-semibold text-cyan-600">October 1, 2025</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-cyan-100">
                      <span className="text-cyan-700">Early Application Deadline</span>
                      <span className="font-semibold text-cyan-600">December 31, 2025</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-cyan-100">
                      <span className="text-cyan-700">Regular Application Deadline</span>
                      <span className="font-semibold text-cyan-600">February 26, 2026</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-cyan-700">Results Release</span>
                      <span className="font-semibold text-cyan-600">May 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ),
        };

      case 'aptitude':
        return {
          title: 'Aptitude-Based Admissions',
          content: (
            <div className="space-y-6">
              <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100 animate-in slide-in-from-top-2">
                <p className="text-cyan-700 leading-relaxed">
                  Some programs at NUS require additional aptitude tests or assessments beyond academic qualifications. These may include portfolio submissions, interviews, or standardized tests.
                </p>
              </div>
              <div className="grid gap-4">
                <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
                  <h4 className="font-semibold text-cyan-800 mb-3">Programs Requiring Additional Assessments</h4>
                  <ul className="text-cyan-700 space-y-2">
                    <li>• Architecture - Portfolio submission required</li>
                    <li>• Medicine - Multiple Mini Interviews (MMI)</li>
                    <li>• Dentistry - Aptitude test and interview</li>
                    <li>• Law - Writing assessment and interview</li>
                    <li>• Music - Audition and practical assessment</li>
                    <li>• Design & Environment - Portfolio review</li>
                  </ul>
                </div>
              </div>
            </div>
          ),
        };

      case 'guides':
        return {
          title: 'Application Guides & Sample Forms',
          content: (
            <div className="space-y-6">
              <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100 animate-in slide-in-from-top-2">
                <p className="text-cyan-700 leading-relaxed">
                  The online application forms are best viewed on Google Chrome and Firefox. All prospective applicants will require an account with Google, Facebook, Microsoft, or LinkedIn to access the online application system.
                </p>
              </div>
              <div className="grid gap-4">
                {[
                  'Undergraduate Application Guide',
                  'Document Submission Guidelines',
                  'Personal Statement Template',
                  'Reference Letter Format',
                  'International Transcript Evaluation Form',
                  'English Proficiency Requirements',
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/80 border border-cyan-100 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3">
                      <FaFileAlt className="w-5 h-5 text-cyan-600" />
                      <span className="text-cyan-700 font-medium">{item}</span>
                    </div>
                    <button
                      className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 focus:ring-2 focus:ring-cyan-400"
                      aria-label={`Download ${item}`}
                    >
                      <FaDownload className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ),
        };

      case 'offer':
        return {
          title: 'Accept or Reject Offer',
          content: (
            <div className="space-y-6">
              <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100 animate-in slide-in-from-top-2">
                <p className="text-cyan-700 leading-relaxed">
                  Congratulations on receiving an offer! You must respond to your offer by the stated deadline. Failure to respond will result in the offer being withdrawn.
                </p>
              </div>
              <div className="grid gap-6">
                <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
                  <h4 className="font-semibold text-cyan-800 mb-4">Steps to Accept Your Offer</h4>
                  <ol className="text-cyan-700 space-y-3">
                    <li className="flex gap-3">
                      <span className="bg-cyan-100 text-cyan-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                      <span>Log into your application portal</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="bg-cyan-100 text-cyan-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                      <span>Review your offer conditions carefully</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="bg-cyan-100 text-cyan-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                      <span>Pay the acceptance fee (SGD 500)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="bg-cyan-100 text-cyan-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold">4</span>
                      <span>Submit required documents</span>
                    </li>
                  </ol>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h4 className="font-semibold text-red-800 mb-2">Important Deadlines</h4>
                  <p className="text-red-700 text-sm">
                    You must accept or reject your offer within 2 weeks of the offer date. Late responses will not be accepted.
                  </p>
                </div>
              </div>
            </div>
          ),
        };

      case 'before':
        return {
          title: 'Before You Apply',
          content: (
            <div className="space-y-6">
              <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100 animate-in slide-in-from-top-2">
                <p className="text-cyan-700 leading-relaxed">
                  Preparation is key to a successful application. Make sure you have researched thoroughly and prepared all necessary documents before starting your application.
                </p>
              </div>
              <div className="grid gap-4">
                <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
                  <h4 className="font-semibold text-cyan-800 mb-4">Essential Checklist</h4>
                  <div className="space-y-3">
                    {[
                      'Research program requirements and prerequisites',
                      'Check admission deadlines for your program',
                      'Prepare academic transcripts and certificates',
                      'Obtain English proficiency test scores',
                      'Request recommendation letters early',
                      'Draft personal statement/essay',
                      'Prepare portfolio (if required)',
                      'Calculate estimated costs and explore funding options',
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FaCheckCircle className="w-5 h-5 text-cyan-600 mt-0.5" />
                        <span className="text-cyan-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ),
        };

      case 'after':
        return {
          title: 'After You Apply',
          content: (
            <div className="space-y-6">
              <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100 animate-in slide-in-from-top-2">
                <p className="text-cyan-700 leading-relaxed">
                  After submitting your application, there are several important steps and things to expect during the review process.
                </p>
              </div>
              <div className="grid gap-6">
                <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
                  <h4 className="font-semibold text-cyan-800 mb-4">What Happens Next</h4>
                  <div className="space-y-4">
                    {[
                      { step: 'Application Acknowledgment', desc: 'You’ll receive a confirmation email within 2 business days' },
                      { step: 'Document Verification', desc: 'We may request additional documents or clarifications' },
                      { step: 'Review Process', desc: 'Applications are reviewed by academic committees' },
                      { step: 'Decision Notification', desc: 'Results will be communicated via email and application portal' },
                    ].map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                          <span className="text-cyan-600 font-semibold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <h5 className="font-medium text-cyan-800">{item.step}</h5>
                          <p className="text-cyan-700 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ),
        };

      case 'international':
        return {
          title: 'International Qualifications',
          content: (
            <div className="space-y-6">
              <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100 animate-in slide-in-from-top-2">
                <p className="text-cyan-700 leading-relaxed">
                  Minimum requirement to apply: At least 90% in all subjects including English but excluding other languages and technical subjects such as Home Science, Art, Fashion Design in the Standard 12 Board exam.
                </p>
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => toggleSection('qualifications')}
                  className="w-full bg-cyan-50 hover:bg-cyan-100 px-6 py-4 flex items-center justify-between transition-colors group rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <FaGlobe className="text-cyan-600 group-hover:text-cyan-800 transition-colors" />
                    <span className="font-semibold text-cyan-800 group-hover:text-cyan-900 transition-colors">
                      Accepted International Qualifications
                    </span>
                  </div>
                  {expandedSections['qualifications'] ? (
                    <FaChevronUp className="text-cyan-600 group-hover:text-cyan-800 transition-colors" />
                  ) : (
                    <FaChevronDown className="text-cyan-600 group-hover:text-cyan-800 transition-colors" />
                  )}
                </button>
                {expandedSections['qualifications'] && (
                  <div className="space-y-4 animate-in slide-in-from-top-2">
                    {[
                      { country: 'India', qualification: 'CBSE/ISC/State Boards Class 12', requirement: 'Minimum 90% aggregate' },
                      { country: 'United Kingdom', qualification: 'GCE A-Levels', requirement: 'AAA to AAB grades' },
                      { country: 'Australia', qualification: 'ATAR', requirement: 'Score of 85–95' },
                      { country: 'Canada', qualification: 'High School Diploma', requirement: 'GPA of 3.5–4.0' },
                      { country: 'International', qualification: 'IB Diploma', requirement: 'Score of 36–42 points' },
                      { country: 'United States', qualification: 'High School Diploma + SAT/ACT', requirement: 'SAT 1450+ or ACT 32+' },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="bg-white/80 border border-cyan-100 rounded-xl p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <h5 className="font-semibold text-cyan-800">{item.country}</h5>
                            <p className="text-cyan-700 text-sm">{item.qualification}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-cyan-700">{item.requirement}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ),
        };

      case 'transfer':
        return {
          title: 'Transfer Applicants',
          content: (
            <div className="space-y-6">
              <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100 animate-in slide-in-from-top-2">
                <p className="text-cyan-700 leading-relaxed">
                  Transfer admission is available for students who have completed at least one year of undergraduate study at another recognized university. Transfer applications are evaluated based on both high school and university performance.
                </p>
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => toggleSection('transfer-details')}
                  className="w-full bg-cyan-50 hover:bg-cyan-100 px-6 py-4 flex items-center justify-between transition-colors group rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <FaFileAlt className="text-cyan-600 group-hover:text-cyan-800 transition-colors" />
                    <span className="font-semibold text-cyan-800 group-hover:text-cyan-900 transition-colors">
                      Transfer Requirements & Process
                    </span>
                  </div>
                  {expandedSections['transfer-details'] ? (
                    <FaChevronUp className="text-cyan-600 group-hover:text-cyan-800 transition-colors" />
                  ) : (
                    <FaChevronDown className="text-cyan-600 group-hover:text-cyan-800 transition-colors" />
                  )}
                </button>
                {expandedSections['transfer-details'] && (
                  <div className="grid gap-6 animate-in slide-in-from-top-2">
                    <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
                      <h4 className="font-semibold text-cyan-800 mb-4">Transfer Requirements</h4>
                      <ul className="text-cyan-700 space-y-2">
                        <li>• Completed at least 1 year of undergraduate study</li>
                        <li>• University GPA of 3.5 or higher</li>
                        <li>• Original high school qualifications meeting NUS standards</li>
                        <li>• Course syllabi for credit transfer evaluation</li>
                        <li>• Personal statement explaining reasons for transfer</li>
                      </ul>
                    </div>
                    <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
                      <h4 className="font-semibold text-cyan-800 mb-4">Credit Transfer Process</h4>
                      <p className="text-cyan-700 mb-3">Credit transfer is evaluated on a case-by-case basis. Generally:</p>
                      <ul className="text-cyan-700 space-y-2">
                        <li>• Maximum 50% of degree requirements can be transferred</li>
                        <li>• Courses must be substantially similar to NUS equivalents</li>
                        <li>• Minimum grade of B required for transfer consideration</li>
                        <li>• Final decision made by respective faculties</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ),
        };

      default:
        return {
          title: 'Admission Requirements',
          content: (
            <div className="space-y-6">
              <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100 animate-in slide-in-from-top-2">
                <p className="text-cyan-700 leading-relaxed mb-4">
                  Admission to NUS undergraduate programs is highly competitive and based on academic merit. International students must maintain a GPA of 3.5–3.8 on a 4.0 scale to boost their chances of admission.
                </p>
                <p className="text-cyan-700 leading-relaxed">
                  Application fees range from SGD 20 to 100 based on the program. Undergraduate applicants need a strong Standard XII record, while graduate applicants require additional documentation.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
                  <h4 className="font-semibold text-cyan-800 mb-3 flex items-center gap-2">
                    <FaUsers className="w-5 h-5 text-cyan-600" />
                    For Singapore Citizens/PRs
                  </h4>
                  <ul className="text-cyan-700 space-y-2 text-sm">
                    <li>• Minimum age of 18 years as of January 1st</li>
                    <li>• Completion of 12 years formal education</li>
                    <li>• Singapore-Cambridge GCE 'A' Level or equivalent</li>
                    <li>• Subject-specific prerequisites for chosen program</li>
                  </ul>
                </div>
                <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-6 border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
                  <h4 className="font-semibold text-cyan-800 mb-3 flex items-center gap-2">
                    <FaGlobe className="w-5 h-5 text-cyan-600" />
                    For International Students
                  </h4>
                  <ul className="text-cyan-700 space-y-2 text-sm">
                    <li>• Strong academic record (minimum 90% for Indian students)</li>
                    <li>• English language proficiency proof</li>
                    <li>• Supporting documents and transcripts</li>
                    <li>• Program-specific requirements</li>
                  </ul>
                </div>
              </div>
            </div>
          ),
        };
    }
  };

  const currentContent = getContentForTab();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Undergraduate Admissions</h1>
          <p className="text-cyan-200 text-lg">Apply to NUS Undergraduate Programmes</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-white/80 rounded-xl shadow-lg border border-cyan-100 backdrop-blur-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar Navigation */}
            <div className="lg:w-80 bg-gradient-to-b from-cyan-50 to-white border-r border-cyan-100">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-cyan-800 mb-6">Navigation</h2>
                <nav className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 group focus:ring-2 focus:ring-cyan-400 ${
                          activeTab === item.id
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg transform scale-[1.02]'
                            : 'text-cyan-700 hover:bg-cyan-50 hover:shadow-md hover:text-cyan-800'
                        }`}
                        aria-current={activeTab === item.id ? 'page' : undefined}
                        aria-label={`Navigate to ${item.label}`}
                      >
                        <Icon
                          className={`w-4 h-4 ${activeTab === item.id ? 'text-cyan-200' : 'text-cyan-400 group-hover:text-cyan-600'}`}
                        />
                        <span className="text-sm font-medium leading-tight">{item.label}</span>
                        {activeTab === item.id && <FaChevronRight className="w-4 h-4 ml-auto text-cyan-200" />}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              <h1 className="text-2xl font-bold text-cyan-800 mb-6">{currentContent.title}</h1>
              <div className="space-y-6">{currentContent.content}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}