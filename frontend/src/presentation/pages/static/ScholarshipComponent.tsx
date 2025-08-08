import { useState, useEffect } from 'react';
import {
  FaGraduationCap,
  FaGlobe,
  FaTrophy,
  FaRocket,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaFlag,
  FaUserGraduate,
  FaCheck,
  FaDollarSign,
  FaFileAlt,
  FaPaperPlane,
  FaListAlt,
  FaUmbrellaBeach,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';

export default function ScholarshipComponent() {
  const [searchParams] = useSearchParams();
  const [activeNavItem, setActiveNavItem] = useState('Sports Scholarships');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      const decodedTab = decodeURIComponent(tabFromUrl);
      if (['Scholarships for Freshman (Our Citizen)', 'Undergraduate Scholarships', 'Global Merit Scholarships', 'Sports Scholarships', 'Entrepreneur Scholarships', 'Beach Scholarships'].includes(decodedTab)) {
        setActiveNavItem(decodedTab);
      }
    }
  }, [searchParams]);

  const navItems = [
    { name: 'Scholarships for Freshman (Our Citizen)', icon: FaUser },
    { name: 'Undergraduate Scholarships', icon: FaGraduationCap },
    { name: 'Global Merit Scholarships', icon: FaGlobe },
    { name: 'Sports Scholarships', icon: FaTrophy },
    { name: 'Entrepreneur Scholarships', icon: FaRocket },
    { name: 'Beach Scholarships', icon: FaUmbrellaBeach },
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleNavItemClick = (itemName: string) => {
    setActiveNavItem(itemName);
    setIsMobileMenuOpen(false);
  };

  const getContentForNavItem = () => {
    switch (activeNavItem) {
      case 'Scholarships for Freshman (Our Citizen)':
        return {
          title: 'Scholarships for Freshman (Singapore Citizens)',
          sections: [
            {
              id: 'eligibility',
              title: 'Eligibility Criteria',
              icon: FaCheck,
              content: [
                'Singapore Citizens only',
                'Must be applying for or enrolled in the first year of undergraduate study at NUS',
                'Outstanding academic performance: Minimum 3 H2 distinctions for A-Level candidates or equivalent (e.g., IB score of 38+ or Polytechnic GPA of 3.7+)',
                'Demonstrated leadership qualities through co-curricular activities (CCAs) or community service',
                'Strong character and conduct with a clean disciplinary record',
                'Commitment to contribute to NUS student life and community engagement',
                'Must not hold any other full scholarships or sponsorships',
              ],
            },
            {
              id: 'benefits',
              title: 'Scholarship Benefits',
              icon: FaDollarSign,
              content: [
                'Full coverage of subsidized tuition fees (after MOE Tuition Grant)',
                'Annual living allowance of S$5,800',
                'One-time settling-in allowance of S$2,000',
                'Accommodation allowance of S$3,000 annually for on-campus living',
                'One-time computer allowance of S$1,750 upon enrollment',
                'Access to exclusive leadership development programs and networking events',
                'Priority registration for courses and academic support services',
              ],
            },
            {
              id: 'terms',
              title: 'Terms and Conditions',
              icon: FaFileAlt,
              content: [
                'Maintain a minimum Cumulative Average Point (CAP) of 3.5 throughout studies',
                'Complete a minimum of 40 hours of community service annually',
                'Participate in NUS freshman orientation and leadership programs',
                'Cannot switch academic programs without scholarship committee approval',
                'Must inform scholarship office of changes in academic or personal circumstances',
                'Breach of terms may result in scholarship termination and repayment of benefits',
              ],
            },
            {
              id: 'apply',
              title: 'How to Apply',
              icon: FaPaperPlane,
              content: [
                'Apply through the NUS Undergraduate Admissions portal (January to March annually)',
                'Indicate interest in scholarships during the admission application',
                'Submit certified academic transcripts and CCA records',
                'Provide one letter of recommendation from a teacher or CCA advisor',
                'Write a personal statement (500-800 words) on leadership and contributions to NUS',
                'Pay a non-refundable application fee of S$20',
                'Application deadline: 31 March (late applications not accepted)',
                'Shortlisted candidates will be notified for interviews by mid-April',
              ],
            },
            {
              id: 'shortlisting',
              title: 'Shortlisting Process',
              icon: FaListAlt,
              content: [
                'Stage 1: Screening of academic and CCA records',
                'Stage 2: Review of personal statement and recommendation letter',
                'Stage 3: Panel interview (30 minutes) assessing leadership and motivation',
                'Stage 4: Final selection by the scholarship committee',
                'Results notification: By mid-July via email and NUS portal',
                'Unsuccessful candidates receive feedback for improvement',
                'Appeals must be submitted within 14 days of results',
              ],
            },
          ],
        };

      case 'Undergraduate Scholarships':
        return {
          title: 'Undergraduate Scholarships',
          sections: [
            {
              id: 'overview',
              title: 'Overview',
              icon: FaGraduationCap,
              content: [
                'NUS offers a range of undergraduate scholarships to support academic excellence, leadership, and holistic development.',
                'Open to both Singapore Citizens and international students (eligibility varies by scholarship).',
                'Covers various disciplines including sciences, engineering, business, arts, and social sciences.',
                'Aims to nurture global leaders and scholars in a dynamic academic environment.',
              ],
            },
            {
              id: 'benefits',
              title: 'Common Benefits',
              icon: FaDollarSign,
              content: [
                'Full or partial tuition fee coverage (after MOE Tuition Grant)',
                'Annual living allowance ranging from S$5,800 to S$6,500',
                'One-time settling-in allowance (S$1,500–S$2,000)',
                'Accommodation allowance for on-campus housing (up to S$5,000 annually)',
                'Computer allowance (S$1,750) for new students',
                'Funding for overseas exchange programs or research opportunities',
                'Access to mentorship and career development programs',
              ],
            },
            {
              id: 'application',
              title: 'Application Process',
              icon: FaPaperPlane,
              content: [
                'Apply via the NUS Undergraduate Admissions portal during the admission cycle (October–March).',
                'Indicate scholarship interest in the application form; no separate application required for most scholarships.',
                'Submit academic transcripts, CCA records, and proof of leadership achievements.',
                'Provide one or two letters of recommendation (depending on scholarship).',
                'Write a personal statement (500–1,000 words) outlining academic and career goals.',
                'Shortlisted candidates are invited for interviews from January to July.',
                'Results announced by mid-July via email and NUS portal.',
              ],
            },
            {
              id: 'examples',
              title: 'Available Scholarships',
              icon: FaListAlt,
              content: [
                'NUS Merit Scholarship: For outstanding academic and leadership achievements.',
                'ASEAN Undergraduate Scholarship: For citizens of ASEAN countries (excluding Singapore).',
                'Science & Technology (S&T) Scholarship: For Asian students in STEM fields.',
                'Dr. Goh Keng Swee Scholarship: For students from 15 Asia-Pacific countries.',
                'NUS Sports Scholarship: For students with exceptional sporting achievements.',
                'NUS Performing & Visual Arts Scholarship: For talents in music, dance, or arts.',
              ],
            },
          ],
        };

      case 'Global Merit Scholarships':
        return {
          title: 'Global Merit Scholarships',
          sections: [
            {
              id: 'eligibility',
              title: 'Eligibility Criteria',
              icon: FaCheck,
              content: [
                'Open to international students from all countries (excluding Singapore).',
                'Outstanding academic record: Minimum 90% in high school or equivalent (e.g., IB 40+, A-Level AAA).',
                'Demonstrated leadership through co-curricular activities or community initiatives.',
                'Strong English proficiency (IELTS 7.0, TOEFL iBT 100, or equivalent).',
                'Applying for a full-time undergraduate program at NUS.',
                'Commitment to contribute to NUS\'s diverse and global community.',
                'Must not hold other full scholarships or sponsorships.',
              ],
            },
            {
              id: 'benefits',
              title: 'Scholarship Benefits',
              icon: FaDollarSign,
              content: [
                '100% coverage of subsidized tuition fees (after MOE Tuition Grant).',
                'Annual living allowance of S$6,000.',
                'One-time settling-in allowance of S$2,000.',
                'Annual accommodation allowance of S$5,000 for on-campus housing.',
                'One-time computer allowance of S$1,750.',
                'Travel allowance for one return trip from home country to Singapore.',
                'Funding for one overseas exchange program or research attachment.',
                'Access to exclusive global leadership and networking programs.',
              ],
            },
            {
              id: 'terms',
              title: 'Terms and Conditions',
              icon: FaFileAlt,
              content: [
                'Maintain a minimum CAP of 3.5 throughout studies.',
                'Participate in NUS global engagement activities (e.g., cultural events, international forums).',
                'Complete 40 hours of community service annually, preferably in global or diversity initiatives.',
                'Three-year service bond with a Singapore-registered company post-graduation (for international students taking MOE Tuition Grant).',
                'Cannot switch programs without scholarship committee approval.',
                'Breach of terms may result in scholarship termination and repayment of benefits.',
              ],
            },
            {
              id: 'apply',
              title: 'How to Apply',
              icon: FaPaperPlane,
              content: [
                'Apply through the NUS Undergraduate Admissions portal (October–March).',
                'Automatically considered during admission; shortlisted candidates submit a scholarship application.',
                'Provide certified academic transcripts, CCA records, and proof of leadership.',
                'Submit two letters of recommendation (one academic, one from a community leader).',
                'Write a personal statement (800–1,000 words) on global perspectives and contributions to NUS.',
                'Application deadline: 31 March; interviews from January to July.',
                'Results announced by mid-July via email and NUS portal.',
              ],
            },
            {
              id: 'shortlisting',
              title: 'Shortlisting Process',
              icon: FaListAlt,
              content: [
                'Stage 1: Initial screening of academic and leadership records.',
                'Stage 2: Review of personal statement and recommendation letters.',
                'Stage 3: Panel interview (45 minutes) assessing global awareness and leadership.',
                'Stage 4: Final selection by the scholarship committee.',
                'Medical examination required for shortlisted candidates.',
                'Results notification: By mid-July via email and NUS portal.',
                'Appeals must be submitted within 14 days of results.',
              ],
            },
          ],
        };

      case 'Sports Scholarships':
        return {
          title: 'NUS Sports Scholarship',
          sections: [
            {
              id: 'eligibility',
              title: 'Eligibility Criteria',
              icon: FaCheck,
              content: [
                'Singapore Citizens or Permanent Residents only',
                'Must be applying for or enrolled in first year of undergraduate study at NUS',
                'Outstanding academic performance: Minimum 3 H2 distinctions for A-Level candidates or equivalent',
                'Demonstrated sporting excellence at national level or regional level with outstanding potential',
                'Strong leadership qualities demonstrated through captaincy roles or community sports initiatives',
                'Excellent character and conduct with clean disciplinary record',
                'Commitment to contribute to NUS sports culture and represent the university in competitions',
                'Must not be receiving any other full scholarships or sponsorships',
                'Age limit: Must be below 25 years old at the time of application',
                'Physical fitness assessment and medical clearance required',
              ],
            },
            {
              id: 'benefits',
              title: 'Scholarship Benefits',
              icon: FaDollarSign,
              content: [
                'Full tuition fee coverage for entire undergraduate program (4 years for most courses)',
                'Monthly living allowance of S$6,500 (reviewed annually)',
                'One-time settling-in allowance of S$2,000 for new students',
                'Guaranteed on-campus accommodation with subsidized hostel fees',
                'Annual book and study materials allowance of S$1,500',
                'Sports equipment and training gear allowance up to S$2,000 annually',
                'Full funding for competition travel (local and overseas)',
                'Access to premium sports facilities and training programs',
                'Personal sports coaching and specialized training support',
                'Medical and sports injury coverage through enhanced insurance plan',
              ],
            },
            {
              id: 'terms',
              title: 'Terms and Conditions',
              icon: FaFileAlt,
              content: [
                'Maintain minimum Cumulative Average Point (CAP) of 3.20 throughout undergraduate studies',
                'Compulsory participation in university sports teams and inter-university competitions',
                'Attend all scheduled training sessions unless excused for academic or medical reasons',
                'Complete minimum 60 hours of community service annually, preferably sports-related',
                'Serve as sports ambassador for NUS at official events',
                'Bond obligation: Serve Singapore for minimum 4 years post-graduation in approved sectors',
                'Breach of terms may result in scholarship termination and repayment of benefits',
              ],
            },
            {
              id: 'apply',
              title: 'How to Apply',
              icon: FaPaperPlane,
              content: [
                'Submit online application through NUS Undergraduate Admissions portal (January to March)',
                'Complete the NUS Sports Scholarship supplementary form with sports achievements',
                'Upload certified academic transcripts (A-Level, IB, Polytechnic Diploma, or equivalent)',
                'Provide comprehensive sports portfolio including competition results and awards',
                'Submit two letters of recommendation: one academic, one from sports coach',
                'Write a personal statement (800–1,000 words) on motivation and contribution to NUS sports',
                'Application deadline: 31 March (late applications not accepted)',
                'Shortlisted candidates notified by email within 4 weeks of deadline',
              ],
            },
            {
              id: 'shortlisting',
              title: 'Shortlisting Process',
              icon: FaListAlt,
              content: [
                'Stage 1: Screening of academic qualifications and sports achievements',
                'Stage 2: Detailed portfolio review by academic and sports professionals',
                'Stage 3: Academic interview (45 minutes) assessing intellectual capability',
                'Stage 4: Sports assessment including practical demonstration and fitness test',
                'Stage 5: Panel interview (30 minutes) focusing on leadership and motivation',
                'Results notification: Within 8–10 weeks of application deadline',
                'Unsuccessful candidates receive feedback for improvement',
              ],
            },
          ],
        };

      case 'Entrepreneur Scholarships':
        return {
          title: 'NUS Entrepreneur Scholarships',
          sections: [
            {
              id: 'eligibility',
              title: 'Eligibility Criteria',
              icon: FaCheck,
              content: [
                'Open to Singapore Citizens, Permanent Residents, and international students',
                'Applying for or enrolled in a full-time undergraduate program at NUS',
                'Strong academic record: Minimum 3 H2 distinctions or equivalent (e.g., IB 38+, GPA 3.7+)',
                'Demonstrated entrepreneurial achievements (e.g., startups, business competitions, or innovative projects)',
                'Leadership in entrepreneurial or innovation-related co-curricular activities',
                'Commitment to contribute to NUS\'s entrepreneurial ecosystem',
                'Must not hold other full scholarships or sponsorships',
              ],
            },
            {
              id: 'benefits',
              title: 'Scholarship Benefits',
              icon: FaDollarSign,
              content: [
                'Full coverage of subsidized tuition fees (after MOE Tuition Grant)',
                'Annual living allowance of S$6,000',
                'One-time settling-in allowance of S$2,000',
                'Annual accommodation allowance of S$5,000 for on-campus housing',
                'One-time computer allowance of S$1,750',
                'Funding for entrepreneurial projects or startup initiatives (up to S$5,000)',
                'Access to NUS Enterprise incubation programs and mentorship',
                'Networking with industry leaders and NUS alumni entrepreneurs',
              ],
            },
            {
              id: 'terms',
              title: 'Terms and Conditions',
              icon: FaFileAlt,
              content: [
                'Maintain a minimum CAP of 3.5 throughout studies',
                'Participate in NUS Enterprise programs and entrepreneurial events',
                'Complete 40 hours of community service annually, preferably in innovation or startup initiatives',
                'International students must serve a three-year bond with a Singapore-registered company post-graduation',
                'Submit annual progress reports on entrepreneurial activities',
                'Breach of terms may result in scholarship termination and repayment of benefits',
              ],
            },
            {
              id: 'apply',
              title: 'How to Apply',
              icon: FaPaperPlane,
              content: [
                'Apply through the NUS Undergraduate Admissions portal (January–March)',
                'Submit a supplementary entrepreneurial scholarship form with project portfolio',
                'Provide certified academic transcripts and proof of entrepreneurial achievements',
                'Submit two letters of recommendation (one academic, one from a business mentor)',
                'Write a personal statement (800–1,000 words) on entrepreneurial vision and contributions to NUS',
                'Application deadline: 31 March; interviews from January to July',
                'Shortlisted candidates notified within 4 weeks of deadline',
              ],
            },
            {
              id: 'shortlisting',
              title: 'Shortlisting Process',
              icon: FaListAlt,
              content: [
                'Stage 1: Screening of academic and entrepreneurial records',
                'Stage 2: Review of project portfolio and recommendation letters',
                'Stage 3: Panel interview (45 minutes) assessing entrepreneurial vision and leadership',
                'Stage 4: Presentation of a business idea or project to the scholarship committee',
                'Results notification: By mid-July via email and NUS portal',
                'Appeals must be submitted within 14 days of results',
              ],
            },
          ],
        };

      case 'Beach Scholarships':
        return {
          title: 'NUS Beach Scholarships',
          sections: [
            {
              id: 'eligibility',
              title: 'Eligibility Criteria',
              icon: FaCheck,
              content: [
                'Open to Singapore Citizens and international students',
                'Applying for or enrolled in a full-time undergraduate program at NUS',
                'Strong academic record: Minimum 3 H2 distinctions or equivalent (e.g., IB 38+, GPA 3.7+)',
                'Demonstrated excellence in beach-related sports or activities (e.g., beach volleyball, surfing, or coastal conservation)',
                'Leadership in environmental or community initiatives related to coastal areas',
                'Commitment to contribute to NUS\'s sustainability and coastal community efforts',
                'Must not hold other full scholarships or sponsorships',
              ],
            },
            {
              id: 'benefits',
              title: 'Scholarship Benefits',
              icon: FaDollarSign,
              content: [
                'Full coverage of subsidized tuition fees (after MOE Tuition Grant)',
                'Annual living allowance of S$5,800',
                'One-time settling-in allowance of S$2,000',
                'Annual accommodation allowance of S$5,000 for on-campus housing',
                'One-time computer allowance of S$1,750',
                'Funding for beach-related activities or conservation projects (up to S$3,000 annually)',
                'Access to NUS sustainability programs and coastal research initiatives',
                'Networking with environmental leaders and coastal sports professionals',
              ],
            },
            {
              id: 'terms',
              title: 'Terms and Conditions',
              icon: FaFileAlt,
              content: [
                'Maintain a minimum CAP of 3.5 throughout studies',
                'Participate in NUS sustainability or beach sports initiatives',
                'Complete 40 hours of community service annually, preferably in coastal conservation',
                'International students must serve a three-year bond with a Singapore-registered company post-graduation',
                'Submit annual progress reports on beach-related activities',
                'Breach of terms may result in scholarship termination and repayment of benefits',
              ],
            },
            {
              id: 'apply',
              title: 'How to Apply',
              icon: FaPaperPlane,
              content: [
                'Apply through the NUS Undergraduate Admissions portal (January–March)',
                'Submit a supplementary beach scholarship form with activity portfolio',
                'Provide certified academic transcripts and proof of beach-related achievements',
                'Submit two letters of recommendation (one academic, one from a relevant mentor)',
                'Write a personal statement (800–1,000 words) on contributions to coastal sustainability or sports',
                'Application deadline: 31 March; interviews from January to July',
                'Shortlisted candidates notified within 4 weeks of deadline',
              ],
            },
            {
              id: 'shortlisting',
              title: 'Shortlisting Process',
              icon: FaListAlt,
              content: [
                'Stage 1: Screening of academic and beach-related records',
                'Stage 2: Review of portfolio and recommendation letters',
                'Stage 3: Panel interview (45 minutes) assessing commitment to coastal activities',
                'Stage 4: Practical assessment for beach sports or presentation for conservation projects',
                'Results notification: By mid-July via email and NUS portal',
                'Appeals must be submitted within 14 days of results',
              ],
            },
          ],
        };

      default:
        return {
          title: 'NUS Sports Scholarship',
          sections: [
            {
              id: 'eligibility',
              title: 'Eligibility Criteria',
              icon: FaCheck,
              content: [
                'Singapore Citizens or Permanent Residents only',
                'Must be applying for or enrolled in first year of undergraduate study at NUS',
                'Outstanding academic performance: Minimum 3 H2 distinctions for A-Level candidates or equivalent',
                'Demonstrated sporting excellence at national level or regional level with outstanding potential',
                'Strong leadership qualities demonstrated through captaincy roles or community sports initiatives',
                'Excellent character and conduct with clean disciplinary record',
                'Commitment to contribute to NUS sports culture and represent the university in competitions',
                'Must not be receiving any other full scholarships or sponsorships',
                'Age limit: Must be below 25 years old at the time of application',
                'Physical fitness assessment and medical clearance required',
              ],
            },
            {
              id: 'benefits',
              title: 'Scholarship Benefits',
              icon: FaDollarSign,
              content: [
                'Full tuition fee coverage for entire undergraduate program (4 years for most courses)',
                'Monthly living allowance of S$6,500 (reviewed annually)',
                'One-time settling-in allowance of S$2,000 for new students',
                'Guaranteed on-campus accommodation with subsidized hostel fees',
                'Annual book and study materials allowance of S$1,500',
                'Sports equipment and training gear allowance up to S$2,000 annually',
                'Full funding for competition travel (local and overseas)',
                'Access to premium sports facilities and training programs',
                'Personal sports coaching and specialized training support',
                'Medical and sports injury coverage through enhanced insurance plan',
              ],
            },
            {
              id: 'terms',
              title: 'Terms and Conditions',
              icon: FaFileAlt,
              content: [
                'Maintain minimum Cumulative Average Point (CAP) of 3.20 throughout undergraduate studies',
                'Compulsory participation in university sports teams and inter-university competitions',
                'Attend all scheduled training sessions unless excused for academic or medical reasons',
                'Complete minimum 60 hours of community service annually, preferably sports-related',
                'Serve as sports ambassador for NUS at official events',
                'Bond obligation: Serve Singapore for minimum 4 years post-graduation in approved sectors',
                'Breach of terms may result in scholarship termination and repayment of benefits',
              ],
            },
            {
              id: 'apply',
              title: 'How to Apply',
              icon: FaPaperPlane,
              content: [
                'Submit online application through NUS Undergraduate Admissions portal (January to March)',
                'Complete the NUS Sports Scholarship supplementary form with sports achievements',
                'Upload certified academic transcripts (A-Level, IB, Polytechnic Diploma, or equivalent)',
                'Provide comprehensive sports portfolio including competition results and awards',
                'Submit two letters of recommendation: one academic, one from sports coach',
                'Write a personal statement (800–1,000 words) on motivation and contribution to NUS sports',
                'Application deadline: 31 March (late applications not accepted)',
                'Shortlisted candidates notified by email within 4 weeks of deadline',
              ],
            },
            {
              id: 'shortlisting',
              title: 'Shortlisting Process',
              icon: FaListAlt,
              content: [
                'Stage 1: Screening of academic qualifications and sports achievements',
                'Stage 2: Detailed portfolio review by academic and sports professionals',
                'Stage 3: Academic interview (45 minutes) assessing intellectual capability',
                'Stage 4: Sports assessment including practical demonstration and fitness test',
                'Stage 5: Panel interview (30 minutes) focusing on leadership and motivation',
                'Results notification: Within 8–10 weeks of application deadline',
                'Unsuccessful candidates receive feedback for improvement',
              ],
            },
          ],
        };
    }
  };

  const currentContent = getContentForNavItem();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
      {/* Header */}
      <div 
        className="relative text-white py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 overflow-hidden"
        style={{
          backgroundImage: 'url(/images/scholarships.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Enhanced overlay with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/90 via-blue-600/85 to-cyan-700/90"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-2 left-2 w-8 h-8 border-2 border-cyan-300/30 rounded-full"></div>
          <div className="absolute top-4 right-4 w-6 h-6 border-2 border-cyan-200/40 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-10 h-10 border-2 border-cyan-300/20 rounded-full"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-2 border-cyan-200/50 rounded-full"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Badge/Icon */}
          <div className="flex justify-center sm:justify-start mb-2">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 border border-white/30">
              <FaGraduationCap className="text-lg sm:text-xl text-white" />
            </div>
          </div>
          
          {/* Main heading with enhanced styling */}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 drop-shadow-2xl leading-tight">
              <span className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                UNDERGRADUATE
              </span>
              <br />
              <span className="text-white">SCHOLARSHIPS</span>
            </h1>
            
            {/* Subtitle with enhanced styling */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-3 mb-4">
              <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-full"></div>
              <p className="text-cyan-100 text-sm sm:text-base md:text-lg font-medium drop-shadow-lg">
                Scholarships for Freshmen and International Students
              </p>
              <div className="w-8 h-0.5 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full"></div>
            </div>
            
            {/* Call to action button */}
            <div className="flex justify-center sm:justify-start">
              <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-full border border-white/30 font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2 text-sm">
                <FaRocket className="text-xs" />
                Explore Opportunities
              </button>
            </div>
          </div>
          
          {/* Stats or highlights */}
          <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20 text-center">
              <div className="text-lg sm:text-xl font-bold text-white mb-1">100%</div>
              <div className="text-cyan-200 text-xs sm:text-sm">Merit-Based</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20 text-center">
              <div className="text-lg sm:text-xl font-bold text-white mb-1">Global</div>
              <div className="text-cyan-200 text-xs sm:text-sm">Opportunities</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20 text-center">
              <div className="text-lg sm:text-xl font-bold text-white mb-1">24/7</div>
              <div className="text-cyan-200 text-xs sm:text-sm">Support</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-between"
          >
            <span>Scholarship Types</span>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className={`lg:w-80 bg-gradient-to-b from-cyan-50 to-white border border-cyan-100 rounded-xl shadow-md backdrop-blur-sm h-fit ${
          isMobileMenuOpen ? 'block' : 'hidden lg:block'
        }`}>
          <nav className="p-4 sm:p-6">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = item.name === activeNavItem;
              return (
                <button
                  key={index}
                  onClick={() => handleNavItemClick(item.name)}
                  className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 mb-2 rounded-lg text-left transition-all duration-300 text-sm sm:text-base ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg transform scale-[1.02]'
                      : 'text-cyan-700 hover:bg-cyan-50 hover:text-cyan-800 hover:shadow-md'
                  }`}
                >
                  <Icon
                    className={`text-base sm:text-lg ${isActive ? 'text-cyan-200' : 'text-cyan-400 group-hover:text-cyan-600'}`}
                  />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white/80 rounded-xl shadow-lg border border-cyan-100 backdrop-blur-sm p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-cyan-800 mb-4 sm:mb-6 lg:mb-8 flex items-center gap-2 sm:gap-3">
              {navItems.find((item) => item.name === activeNavItem)?.icon({ className: 'text-yellow-400 text-lg sm:text-xl lg:text-2xl' })}
              <span className="break-words">{currentContent.title}</span>
            </h2>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white/80 rounded-xl p-4 sm:p-6 border border-cyan-100 shadow-md transform hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-2 text-cyan-800 font-semibold mb-2">
                  <FaGraduationCap className="text-cyan-600 text-sm sm:text-base" />
                  <span className="text-sm sm:text-base">Scholarship Type:</span>
                </div>
                <p className="text-cyan-700 text-sm sm:text-base">University Level</p>
              </div>
              <div className="bg-white/80 rounded-xl p-4 sm:p-6 border border-cyan-100 shadow-md transform hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-2 text-cyan-800 font-semibold mb-2">
                  <FaFlag className="text-cyan-600 text-sm sm:text-base" />
                  <span className="text-sm sm:text-base">Nationality:</span>
                </div>
                <p className="text-cyan-700 text-sm sm:text-base">
                  {activeNavItem === 'Global Merit Scholarships' || activeNavItem === 'Entrepreneur Scholarships' || activeNavItem === 'Beach Scholarships'
                    ? 'Open to All'
                    : 'Singapore Citizens'}
                </p>
              </div>
              <div className="bg-white/80 rounded-xl p-4 sm:p-6 border border-cyan-100 shadow-md transform hover:-translate-y-1 transition-all duration-300 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 text-cyan-800 font-semibold mb-2">
                  <FaUserGraduate className="text-cyan-600 text-sm sm:text-base" />
                  <span className="text-sm sm:text-base">Student Type:</span>
                </div>
                <p className="text-cyan-700 text-sm sm:text-base">Freshmen</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100 shadow-md backdrop-blur-sm">
              <p className="text-cyan-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                {activeNavItem === 'Scholarships for Freshman (Our Citizen)'
                  ? 'The Scholarships for Freshman (Singapore Citizens) support outstanding Singaporean students with strong academic and leadership records, fostering their contributions to NUS and the community.'
                  : activeNavItem === 'Undergraduate Scholarships'
                  ? 'NUS Undergraduate Scholarships provide financial support and opportunities for students across various disciplines, nurturing global leaders and scholars.'
                  : activeNavItem === 'Global Merit Scholarships'
                  ? 'The NUS Global Merit Scholarship attracts exceptional international students, promoting diversity and global perspectives within the NUS community.'
                  : activeNavItem === 'Sports Scholarships'
                  ? 'The NUS Sports Scholarship is awarded to highly-talented individuals who possess outstanding academic and sports participation records, committed to elevating NUS sports.'
                  : activeNavItem === 'Entrepreneur Scholarships'
                  ? 'The NUS Entrepreneur Scholarship supports students with entrepreneurial talent, fostering innovation and leadership within NUS\'s startup ecosystem.'
                  : 'The NUS Beach Scholarship supports students excelling in beach-related sports or coastal conservation, contributing to NUS\'s sustainability and community efforts.'}
              </p>
              <p className="text-cyan-700 leading-relaxed text-sm sm:text-base">
                Interested students should submit <span className="font-semibold text-cyan-800">one scholarship application</span> during the admission process to be considered for eligible scholarships.
              </p>
            </div>

            {/* Expand All Button */}
            <div className="flex justify-end mb-4 sm:mb-6">
              <button
                onClick={() => {
                  const allExpanded = currentContent.sections.every((section) => expandedSections[section.id]);
                  const newState: Record<string, boolean> = {};
                  currentContent.sections.forEach((section) => {
                    newState[section.id] = !allExpanded;
                  });
                  setExpandedSections(newState);
                }}
                className="text-cyan-600 hover:text-cyan-800 font-medium flex items-center gap-2 transition-colors text-sm sm:text-base"
              >
                Expand All
                <FaChevronDown className="text-sm" />
              </button>
            </div>

            {/* Expandable Sections */}
            <div className="space-y-3 sm:space-y-4">
              {currentContent.sections.map((section) => {
                const Icon = section.icon;
                const isExpanded = expandedSections[section.id];
                return (
                  <div key={section.id} className="border border-cyan-100 rounded-xl overflow-hidden shadow-md">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full bg-cyan-50 hover:bg-cyan-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Icon className="text-cyan-600 group-hover:text-cyan-800 transition-colors text-sm sm:text-base" />
                        <span className="font-semibold text-cyan-800 group-hover:text-cyan-900 transition-colors text-sm sm:text-base">
                          {section.title}
                        </span>
                      </div>
                      {isExpanded ? (
                        <FaChevronUp className="text-cyan-600 group-hover:text-cyan-800 transition-colors text-sm" />
                      ) : (
                        <FaChevronDown className="text-cyan-600 group-hover:text-cyan-800 transition-colors text-sm" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
                        <ul className="space-y-2 sm:space-y-3">
                          {section.content.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 sm:gap-3">
                              <FaCheck className="text-cyan-600 mt-1 flex-shrink-0 text-xs sm:text-sm" />
                              <span className="text-cyan-700 leading-relaxed text-sm sm:text-base">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Apply Button */}
            <div className="mt-6 sm:mt-8 text-center">
              <button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 sm:gap-3 mx-auto">
                <FaPaperPlane className="text-sm sm:text-base" />
                <span>Apply for Scholarship</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}