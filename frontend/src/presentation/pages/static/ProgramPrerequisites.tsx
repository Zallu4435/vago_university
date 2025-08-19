import { useState, useEffect } from 'react';
import { FaDownload, FaChevronRight, FaUsers, FaGlobe, FaGraduationCap, FaFileAlt, FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaChevronDown, FaChevronUp, FaBars, FaTimes } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';

export default function ProgramPrerequisites() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('admission');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['admission', 'dates', 'aptitude', 'guides', 'offer', 'before', 'after', 'international', 'transfer'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

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

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleNavItemClick = (itemId: string) => {
    setActiveTab(itemId);
    setIsMobileMenuOpen(false);
  };

  const getContentForTab = () => {
    switch (activeTab) {
      case 'admission':
        return {
          title: 'Admission Requirements',
          content: (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100 animate-in slide-in-from-top-2">
                <p className="text-cyan-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                  Admission to NUS undergraduate programs is highly competitive and based on academic merit. International students must maintain a GPA of 3.5–3.8 on a 4.0 scale to boost their chances of admission.
                </p>
                <p className="text-cyan-700 leading-relaxed text-sm sm:text-base">
                  Application fees range from SGD 20 to 100 based on the program. Undergraduate applicants need a strong Standard XII record, while graduate applicants require additional documentation.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
                  <h4 className="font-semibold text-cyan-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <FaUsers className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />
                    For Singapore Citizens/PRs
                  </h4>
                  <ul className="text-cyan-700 space-y-2 text-xs sm:text-sm">
                    <li>• Minimum age of 18 years as of January 1st</li>
                    <li>• Completion of 12 years formal education</li>
                    <li>• Singapore-Cambridge GCE 'A' Level or equivalent</li>
                    <li>• Subject-specific prerequisites for chosen program</li>
                  </ul>
                </div>
                <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
                  <h4 className="font-semibold text-cyan-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <FaGlobe className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />
                    For International Students
                  </h4>
                  <ul className="text-cyan-700 space-y-2 text-xs sm:text-sm">
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
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100 animate-in slide-in-from-top-2">
                <p className="text-cyan-700 leading-relaxed text-sm sm:text-base">
                  The university deadline for undergraduate admission is February 26, 2026 (tentative). Application deadlines vary by program and student category.
                </p>
              </div>
              <div className="grid gap-4">
                <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100">
                  <h4 className="font-semibold text-cyan-800 mb-3 sm:mb-4 text-sm sm:text-base">AY2026/2027 Application Timeline (Tentative)</h4>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-cyan-100">
                      <span className="text-cyan-700 text-sm sm:text-base">Application Opens</span>
                      <span className="font-semibold text-cyan-600 text-sm sm:text-base">October 1, 2025</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-cyan-100">
                      <span className="text-cyan-700 text-sm sm:text-base">Early Application Deadline</span>
                      <span className="font-semibold text-cyan-600 text-sm sm:text-base">December 31, 2025</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-cyan-100">
                      <span className="text-cyan-700 text-sm sm:text-base">Regular Application Deadline</span>
                      <span className="font-semibold text-cyan-600 text-sm sm:text-base">February 26, 2026</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
                      <span className="text-cyan-700 text-sm sm:text-base">Results Release</span>
                      <span className="font-semibold text-cyan-600 text-sm sm:text-base">May 2026</span>
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
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100 animate-in slide-in-from-top-2">
                <p className="text-cyan-700 leading-relaxed text-sm sm:text-base">
                  Some programs at NUS require additional aptitude tests or assessments beyond academic qualifications. These may include portfolio submissions, interviews, or standardized tests.
                </p>
              </div>
              <div className="grid gap-4">
                <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
                  <h4 className="font-semibold text-cyan-800 mb-3 text-sm sm:text-base">Programs Requiring Additional Assessments</h4>
                  <ul className="text-cyan-700 space-y-2 text-sm sm:text-base">
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
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100 animate-in slide-in-from-top-2">
                <p className="text-cyan-700 leading-relaxed text-sm sm:text-base">
                  The online application forms are best viewed on Google Chrome and Firefox. All prospective applicants will require an account with Google, Facebook, Microsoft, or LinkedIn to access the online application system.
                </p>
              </div>
              <div className="grid gap-3 sm:gap-4">
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
                    className="bg-white/80 border border-cyan-100 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <FaFileAlt className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />
                      <span className="text-cyan-700 font-medium text-sm sm:text-base">{item}</span>
                    </div>
                    <button
                      className="px-3 sm:px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 focus:ring-2 focus:ring-cyan-400 text-xs sm:text-sm"
                      aria-label={`Download ${item}`}
                    >
                      <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
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
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100 animate-in slide-in-from-top-2">
                <p className="text-cyan-700 leading-relaxed text-sm sm:text-base">
                  Congratulations on receiving an offer! You must respond to your offer by the stated deadline. Failure to respond will result in the offer being withdrawn.
                </p>
              </div>
              <div className="grid gap-4 sm:gap-6">
                <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
                  <h4 className="font-semibold text-cyan-800 mb-3 sm:mb-4 text-sm sm:text-base">Steps to Accept Your Offer</h4>
                  <ol className="text-cyan-700 space-y-2 sm:space-y-3 text-sm sm:text-base">
                    <li className="flex gap-2 sm:gap-3">
                      <span className="bg-cyan-100 text-cyan-800 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold">1</span>
                      <span>Log into your application portal</span>
                    </li>
                    <li className="flex gap-2 sm:gap-3">
                      <span className="bg-cyan-100 text-cyan-800 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold">2</span>
                      <span>Review your offer conditions carefully</span>
                    </li>
                    <li className="flex gap-2 sm:gap-3">
                      <span className="bg-cyan-100 text-cyan-800 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold">3</span>
                      <span>Pay the acceptance fee (SGD 500)</span>
                    </li>
                    <li className="flex gap-2 sm:gap-3">
                      <span className="bg-cyan-100 text-cyan-800 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold">4</span>
                      <span>Submit required documents</span>
                    </li>
                  </ol>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
                  <h4 className="font-semibold text-red-800 mb-2 text-sm sm:text-base">Important Deadlines</h4>
                  <p className="text-red-700 text-xs sm:text-sm">
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
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100 animate-in slide-in-from-top-2">
                <p className="text-cyan-700 leading-relaxed text-sm sm:text-base">
                  Preparation is key to a successful application. Make sure you have researched thoroughly and prepared all necessary documents before starting your application.
                </p>
              </div>
              <div className="grid gap-4">
                <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
                  <h4 className="font-semibold text-cyan-800 mb-3 sm:mb-4 text-sm sm:text-base">Essential Checklist</h4>
                  <div className="space-y-2 sm:space-y-3">
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
                      <div key={index} className="flex items-start gap-2 sm:gap-3">
                        <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                        <span className="text-cyan-700 text-sm sm:text-base">{item}</span>
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
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100 animate-in slide-in-from-top-2">
                <p className="text-cyan-700 leading-relaxed text-sm sm:text-base">
                  After submitting your application, there are several important steps and things to expect during the review process.
                </p>
              </div>
              <div className="grid gap-4 sm:gap-6">
                <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
                  <h4 className="font-semibold text-cyan-800 mb-3 sm:mb-4 text-sm sm:text-base">What Happens Next</h4>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      { step: 'Application Acknowledgment', desc: 'You\'ll receive a confirmation email within 2 business days' },
                      { step: 'Document Verification', desc: 'We may request additional documents or clarifications' },
                      { step: 'Review Process', desc: 'Applications are reviewed by academic committees' },
                      { step: 'Decision Notification', desc: 'Results will be communicated via email and application portal' },
                    ].map((item, index) => (
                      <div key={index} className="flex gap-3 sm:gap-4">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-cyan-600 font-semibold text-xs sm:text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <h5 className="font-medium text-cyan-800 text-sm sm:text-base">{item.step}</h5>
                          <p className="text-cyan-700 text-xs sm:text-sm">{item.desc}</p>
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
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100 animate-in slide-in-from-top-2">
                <p className="text-cyan-700 leading-relaxed text-sm sm:text-base">
                  Minimum requirement to apply: At least 90% in all subjects including English but excluding other languages and technical subjects such as Home Science, Art, Fashion Design in the Standard 12 Board exam.
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <button
                  onClick={() => toggleSection('qualifications')}
                  className="w-full bg-cyan-50 hover:bg-cyan-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between transition-colors group rounded-xl"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <FaGlobe className="text-cyan-600 group-hover:text-cyan-800 transition-colors text-sm sm:text-base" />
                    <span className="font-semibold text-cyan-800 group-hover:text-cyan-900 transition-colors text-sm sm:text-base">
                      Accepted International Qualifications
                    </span>
                  </div>
                  {expandedSections['qualifications'] ? (
                    <FaChevronUp className="text-cyan-600 group-hover:text-cyan-800 transition-colors text-sm" />
                  ) : (
                    <FaChevronDown className="text-cyan-600 group-hover:text-cyan-800 transition-colors text-sm" />
                  )}
                </button>
                {expandedSections['qualifications'] && (
                  <div className="space-y-3 sm:space-y-4 animate-in slide-in-from-top-2">
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
                        className="bg-white/80 border border-cyan-100 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                          <div>
                            <h5 className="font-semibold text-cyan-800 text-sm sm:text-base">{item.country}</h5>
                            <p className="text-cyan-700 text-xs sm:text-sm">{item.qualification}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-cyan-700 text-sm sm:text-base">{item.requirement}</p>
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
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100 animate-in slide-in-from-top-2">
                <p className="text-cyan-700 leading-relaxed text-sm sm:text-base">
                  Transfer admission is available for students who have completed at least one year of undergraduate study at another recognized university. Transfer applications are evaluated based on both high school and university performance.
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <button
                  onClick={() => toggleSection('transfer-details')}
                  className="w-full bg-cyan-50 hover:bg-cyan-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between transition-colors group rounded-xl"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <FaFileAlt className="text-cyan-600 group-hover:text-cyan-800 transition-colors text-sm sm:text-base" />
                    <span className="font-semibold text-cyan-800 group-hover:text-cyan-900 transition-colors text-sm sm:text-base">
                      Transfer Requirements & Process
                    </span>
                  </div>
                  {expandedSections['transfer-details'] ? (
                    <FaChevronUp className="text-cyan-600 group-hover:text-cyan-800 transition-colors text-sm" />
                  ) : (
                    <FaChevronDown className="text-cyan-600 group-hover:text-cyan-800 transition-colors text-sm" />
                  )}
                </button>
                {expandedSections['transfer-details'] && (
                  <div className="grid gap-4 sm:gap-6 animate-in slide-in-from-top-2">
                    <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
                      <h4 className="font-semibold text-cyan-800 mb-3 sm:mb-4 text-sm sm:text-base">Transfer Requirements</h4>
                      <ul className="text-cyan-700 space-y-2 text-sm sm:text-base">
                        <li>• Completed at least 1 year of undergraduate study</li>
                        <li>• University GPA of 3.5 or higher</li>
                        <li>• Original high school qualifications meeting NUS standards</li>
                        <li>• Course syllabi for credit transfer evaluation</li>
                        <li>• Personal statement explaining reasons for transfer</li>
                      </ul>
                    </div>
                    <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
                      <h4 className="font-semibold text-cyan-800 mb-3 sm:mb-4 text-sm sm:text-base">Credit Transfer Process</h4>
                      <p className="text-cyan-700 mb-3 text-sm sm:text-base">Credit transfer is evaluated on a case-by-case basis. Generally:</p>
                      <ul className="text-cyan-700 space-y-2 text-sm sm:text-base">
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
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100 animate-in slide-in-from-top-2">
                <p className="text-cyan-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                  Admission to NUS undergraduate programs is highly competitive and based on academic merit. International students must maintain a GPA of 3.5–3.8 on a 4.0 scale to boost their chances of admission.
                </p>
                <p className="text-cyan-700 leading-relaxed text-sm sm:text-base">
                  Application fees range from SGD 20 to 100 based on the program. Undergraduate applicants need a strong Standard XII record, while graduate applicants require additional documentation.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
                  <h4 className="font-semibold text-cyan-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <FaUsers className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />
                    For Singapore Citizens/PRs
                  </h4>
                  <ul className="text-cyan-700 space-y-2 text-xs sm:text-sm">
                    <li>• Minimum age of 18 years as of January 1st</li>
                    <li>• Completion of 12 years formal education</li>
                    <li>• Singapore-Cambridge GCE 'A' Level or equivalent</li>
                    <li>• Subject-specific prerequisites for chosen program</li>
                  </ul>
                </div>
                <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-100 transform hover:-translate-y-1 transition-all duration-300">
                  <h4 className="font-semibold text-cyan-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <FaGlobe className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />
                    For International Students
                  </h4>
                  <ul className="text-cyan-700 space-y-2 text-xs sm:text-sm">
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
      <div 
        className="relative text-white py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 overflow-hidden"
        style={{
          backgroundImage: 'url(/images/university-town.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/90 via-blue-600/85 to-cyan-700/90"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-2 left-2 w-8 h-8 border-2 border-cyan-300/30 rounded-full"></div>
          <div className="absolute top-4 right-4 w-6 h-6 border-2 border-cyan-200/40 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-10 h-10 border-2 border-cyan-300/20 rounded-full"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-2 border-cyan-200/50 rounded-full"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex justify-center sm:justify-start mb-2">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 border border-white/30">
              <FaGraduationCap className="text-lg sm:text-xl text-white" />
            </div>
          </div>
          
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 drop-shadow-2xl leading-tight">
              <span className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                UNDERGRADUATE
              </span>
              <br />
              <span className="text-white">ADMISSIONS</span>
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-3 mb-4">
              <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-full"></div>
              <p className="text-cyan-100 text-sm sm:text-base md:text-lg font-medium drop-shadow-lg">
                Apply to NUS Undergraduate Programmes
              </p>
              <div className="w-8 h-0.5 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full"></div>
            </div>
            
            <div className="flex justify-center sm:justify-start">
              <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-full border border-white/30 font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2 text-sm">
                <FaFileAlt className="text-xs" />
                Start Application
              </button>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20 text-center">
              <div className="text-lg sm:text-xl font-bold text-white mb-1">2026</div>
              <div className="text-cyan-200 text-xs sm:text-sm">Academic Year</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20 text-center">
              <div className="text-lg sm:text-xl font-bold text-white mb-1">Global</div>
              <div className="text-cyan-200 text-xs sm:text-sm">Recognition</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20 text-center">
              <div className="text-lg sm:text-xl font-bold text-white mb-1">100+</div>
              <div className="text-cyan-200 text-xs sm:text-sm">Programmes</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-between"
          >
            <span>Navigation Menu</span>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div className={`lg:w-80 bg-gradient-to-b from-cyan-50 to-white border border-cyan-100 rounded-xl shadow-md backdrop-blur-sm h-fit ${
          isMobileMenuOpen ? 'block' : 'hidden lg:block'
        }`}>
          <nav className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-cyan-800 mb-4 sm:mb-6">Navigation</h2>
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavItemClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-all duration-300 text-sm sm:text-base ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg transform scale-[1.02]'
                        : 'text-cyan-700 hover:bg-cyan-50 hover:text-cyan-800 hover:shadow-md'
                    }`}
                  >
                    <Icon
                      className={`text-base sm:text-lg ${isActive ? 'text-cyan-200' : 'text-cyan-400 group-hover:text-cyan-600'}`}
                    />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        <div className="flex-1">
          <div className="bg-white/80 rounded-xl shadow-lg border border-cyan-100 backdrop-blur-sm p-4 sm:p-6 lg:p-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-cyan-800 mb-4 sm:mb-6 lg:mb-8">
              {currentContent.title}
            </h1>
            <div className="space-y-4 sm:space-y-6">{currentContent.content}</div>
          </div>
        </div>
      </div>
    </div>
  );
}