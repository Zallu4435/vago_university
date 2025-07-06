import { FaGraduationCap, FaUniversity, FaBook, FaUsers, FaCalendarAlt, FaLaptopCode, FaDollarSign, FaGlobeAmericas, FaHandshake, FaTrophy, FaMicroscope, FaChartLine, FaShieldAlt, FaMobileAlt, FaCloud, FaGamepad, FaBrain, FaDatabase, FaNetworkWired, FaPalette, FaMusic, FaVolleyballBall, FaLeaf, FaLightbulb, FaBriefcase, FaGraduationCap as FaDegree, FaClock, FaFileAlt, FaCheckCircle, FaStar, FaAward, FaGlobe, FaUserGraduate, FaIndustry, FaRocket, FaCode, FaPython, FaJava, FaJs, FaReact, FaNodeJs, FaDocker, FaAws, FaGoogle, FaMicrosoft } from 'react-icons/fa';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'scholarship' | 'program' | 'department' | 'event' | 'faculty' | 'admission' | 'research' | 'career' | 'academic' | 'technology' | 'international' | 'achievement';
  icon: () => React.ReactNode;
  keywords: string[];
  category: string;
  priority: number; // 1-5, where 5 is highest priority
}

export const searchDatabase: SearchResult[] = [
  // ===== SCHOLARSHIPS & FINANCIAL AID =====
  {
    id: 'merit-scholarship',
    title: 'Merit Scholarship Program',
    description: 'Full tuition coverage for outstanding students with S$5,800 annual living allowance',
    url: '/undergraduate-scholarships',
    type: 'scholarship',
    icon: () => <FaGraduationCap className="w-4 h-4" />,
    keywords: ['merit', 'scholarship', 'tuition', 'coverage', 'financial aid', 'outstanding', 'academic excellence'],
    category: 'Scholarships',
    priority: 5
  },
  {
    id: 'need-based-scholarship',
    title: 'Need-Based Scholarships',
    description: 'Financial aid for students in need with comprehensive support packages',
    url: '/undergraduate-scholarships',
    type: 'scholarship',
    icon: () => <FaDollarSign className="w-4 h-4" />,
    keywords: ['need-based', 'financial aid', 'support', 'assistance', 'tuition help'],
    category: 'Scholarships',
    priority: 4
  },
  {
    id: 'global-merit-scholarship',
    title: 'Global Merit Scholarships',
    description: 'International student scholarships with S$6,000 annual allowance and global opportunities',
    url: '/undergraduate-scholarships',
    type: 'scholarship',
    icon: () => <FaGlobeAmericas className="w-4 h-4" />,
    keywords: ['global', 'international', 'scholarship', 'foreign students', 'overseas'],
    category: 'Scholarships',
    priority: 4
  },
  {
    id: 'sports-scholarship',
    title: 'NUS Sports Scholarship',
    description: 'For sporting excellence with S$6,500 monthly allowance and premium facilities',
    url: '/undergraduate-scholarships',
    type: 'scholarship',
    icon: () => <FaVolleyballBall className="w-4 h-4" />,
    keywords: ['sports', 'athletic', 'sporting excellence', 'competition', 'physical fitness'],
    category: 'Scholarships',
    priority: 3
  },
  {
    id: 'entrepreneur-scholarship',
    title: 'Entrepreneur Scholarships',
    description: 'Startup funding with S$5,000 project support and mentorship programs',
    url: '/undergraduate-scholarships',
    type: 'scholarship',
    icon: () => <FaLightbulb className="w-4 h-4" />,
    keywords: ['entrepreneur', 'startup', 'innovation', 'business', 'mentorship'],
    category: 'Scholarships',
    priority: 3
  },
  {
    id: 'asean-scholarship',
    title: 'ASEAN Undergraduate Scholarship',
    description: 'For citizens of ASEAN countries with regional partnership opportunities',
    url: '/undergraduate-scholarships',
    type: 'scholarship',
    icon: () => <FaGlobe className="w-4 h-4" />,
    keywords: ['asean', 'regional', 'partnership', 'southeast asia'],
    category: 'Scholarships',
    priority: 3
  },

  // ===== COMPUTER SCIENCE PROGRAMS =====
  {
    id: 'ai-program',
    title: 'Artificial Intelligence',
    description: 'Machine learning, NLP, and computer vision with hands-on projects',
    url: '/departments/computer-science/program',
    type: 'program',
    icon: () => <FaBrain className="w-4 h-4" />,
    keywords: ['artificial intelligence', 'ai', 'machine learning', 'nlp', 'computer vision', 'deep learning'],
    category: 'Computer Science',
    priority: 5
  },
  {
    id: 'data-science-program',
    title: 'Data Science',
    description: 'Data analysis, visualization, and predictive modeling for real-world problems',
    url: '/departments/computer-science/program',
    type: 'program',
    icon: () => <FaChartLine className="w-4 h-4" />,
    keywords: ['data science', 'analytics', 'visualization', 'predictive modeling', 'big data'],
    category: 'Computer Science',
    priority: 5
  },
  {
    id: 'cybersecurity-program',
    title: 'Cybersecurity',
    description: 'Advanced techniques in encryption, network security, and ethical hacking',
    url: '/departments/computer-science/program',
    type: 'program',
    icon: () => <FaShieldAlt className="w-4 h-4" />,
    keywords: ['cybersecurity', 'security', 'encryption', 'network security', 'ethical hacking', 'information security'],
    category: 'Computer Science',
    priority: 4
  },
  {
    id: 'quantum-computing-program',
    title: 'Quantum Computing',
    description: 'Quantum algorithms, quantum cryptography, and quantum machine learning',
    url: '/departments/computer-science/program',
    type: 'program',
    icon: () => <FaMicroscope className="w-4 h-4" />,
    keywords: ['quantum computing', 'quantum algorithms', 'quantum cryptography', 'quantum machine learning'],
    category: 'Computer Science',
    priority: 3
  },
  {
    id: 'software-engineering-program',
    title: 'Software Engineering',
    description: 'Programming, development methodologies, and software architecture',
    url: '/departments/computer-science/program',
    type: 'program',
    icon: () => <FaCode className="w-4 h-4" />,
    keywords: ['software engineering', 'programming', 'development', 'software architecture', 'coding'],
    category: 'Computer Science',
    priority: 4
  },

  // ===== BUSINESS PROGRAMS =====
  {
    id: 'finance-program',
    title: 'Finance',
    description: 'Financial analysis, investment strategies, and risk management for global markets',
    url: '/departments/business/program',
    type: 'program',
    icon: () => <FaChartLine className="w-4 h-4" />,
    keywords: ['finance', 'financial analysis', 'investment', 'risk management', 'global markets'],
    category: 'Business',
    priority: 4
  },
  {
    id: 'marketing-program',
    title: 'Marketing',
    description: 'Digital marketing, consumer behavior, and brand management for business growth',
    url: '/departments/business/program',
    type: 'program',
    icon: () => <FaHandshake className="w-4 h-4" />,
    keywords: ['marketing', 'digital marketing', 'consumer behavior', 'brand management', 'advertising'],
    category: 'Business',
    priority: 4
  },
  {
    id: 'entrepreneurship-program',
    title: 'Entrepreneurship',
    description: 'Launch and scale startups with innovative strategies and industry mentorship',
    url: '/departments/business/program',
    type: 'program',
    icon: () => <FaRocket className="w-4 h-4" />,
    keywords: ['entrepreneurship', 'startup', 'business innovation', 'venture', 'business strategy'],
    category: 'Business',
    priority: 3
  },

  // ===== DEPARTMENTS =====
  {
    id: 'computer-science-dept',
    title: 'School of Computer Science',
    description: 'Leading computing school since 1975, ranked among top globally with cutting-edge research',
    url: '/departments/computer-science',
    type: 'department',
    icon: () => <FaUniversity className="w-4 h-4" />,
    keywords: ['computer science', 'computing', 'school of computing', 'nus computing', 'technology'],
    category: 'Departments',
    priority: 5
  },
  {
    id: 'business-dept',
    title: 'Faculty of Business',
    description: 'Develop business acumen and leadership skills for the global marketplace',
    url: '/departments/business',
    type: 'department',
    icon: () => <FaUniversity className="w-4 h-4" />,
    keywords: ['business', 'faculty of business', 'business school', 'management', 'commerce'],
    category: 'Departments',
    priority: 4
  },

  // ===== ADMISSIONS =====
  {
    id: 'admission-process',
    title: 'Application Process',
    description: '5-step admission procedure: Apply Online → Track Status → Check Outcome → Accept Offer',
    url: '/ug/admissions',
    type: 'admission',
    icon: () => <FaFileAlt className="w-4 h-4" />,
    keywords: ['application process', 'admission process', 'apply', 'application steps', 'admission procedure'],
    category: 'Admissions',
    priority: 5
  },
  {
    id: 'admission-requirements',
    title: 'Admission Requirements',
    description: 'GPA 3.5-3.8 for international students, academic merit-based selection',
    url: '/program-prerequisites',
    type: 'admission',
    icon: () => <FaCheckCircle className="w-4 h-4" />,
    keywords: ['admission requirements', 'gpa', 'academic merit', 'eligibility', 'prerequisites'],
    category: 'Admissions',
    priority: 5
  },
  {
    id: 'application-deadlines',
    title: 'Application Deadlines',
    description: 'February 26, 2026 (tentative) for undergraduate admission',
    url: '/program-prerequisites',
    type: 'admission',
    icon: () => <FaClock className="w-4 h-4" />,
    keywords: ['application deadline', 'deadline', 'due date', 'application period', 'timeline'],
    category: 'Admissions',
    priority: 4
  },
  {
    id: 'application-fee',
    title: 'Application Fee',
    description: 'SGD 20-100 based on program, non-refundable application cost',
    url: '/program-prerequisites',
    type: 'admission',
    icon: () => <FaDollarSign className="w-4 h-4" />,
    keywords: ['application fee', 'fee', 'cost', 'payment', 'sgd'],
    category: 'Admissions',
    priority: 3
  },

  // ===== FACULTY & STAFF =====
  {
    id: 'dean-tan-kian-lee',
    title: 'Professor Tan Kian Lee',
    description: 'Dean, School of Computing - Leading the future of technology education',
    url: '/about',
    type: 'faculty',
    icon: () => <FaUserGraduate className="w-4 h-4" />,
    keywords: ['professor tan kian lee', 'dean', 'school of computing', 'faculty', 'leadership'],
    category: 'Faculty',
    priority: 3
  },
  {
    id: 'vice-dean-kan-min-yen',
    title: 'Associate Professor Kan Min Yen',
    description: 'Vice Dean, Undergraduate Studies - Overseeing undergraduate education',
    url: '/about',
    type: 'faculty',
    icon: () => <FaUserGraduate className="w-4 h-4" />,
    keywords: ['associate professor kan min yen', 'vice dean', 'undergraduate studies'],
    category: 'Faculty',
    priority: 2
  },

  // ===== EVENTS & ACTIVITIES =====
  {
    id: 'ai-symposium-2025',
    title: 'AI Symposium 2025',
    description: 'Join us for a day of talks and workshops on the latest advancements in AI',
    url: '/departments/computer-science/community',
    type: 'event',
    icon: () => <FaCalendarAlt className="w-4 h-4" />,
    keywords: ['ai symposium', 'artificial intelligence', 'symposium', 'workshop', 'ai conference'],
    category: 'Events',
    priority: 3
  },
  {
    id: 'codefest-hackathon',
    title: 'CodeFest Hackathon',
    description: 'A 24-hour coding challenge with teams from across the region',
    url: '/departments/computer-science/community',
    type: 'event',
    icon: () => <FaLaptopCode className="w-4 h-4" />,
    keywords: ['codefest', 'hackathon', 'coding challenge', 'programming competition', '24-hour'],
    category: 'Events',
    priority: 3
  },
  {
    id: 'career-fair',
    title: 'Tech Industry Career Fair',
    description: 'Connect with leading tech companies and explore career opportunities',
    url: '/departments/computer-science/community',
    type: 'event',
    icon: () => <FaBriefcase className="w-4 h-4" />,
    keywords: ['career fair', 'tech industry', 'job opportunities', 'recruitment', 'career'],
    category: 'Events',
    priority: 3
  },

  // ===== TECHNICAL SKILLS =====
  {
    id: 'machine-learning',
    title: 'Machine Learning',
    description: 'AI algorithms and models for intelligent systems development',
    url: '/departments/computer-science/program',
    type: 'technology',
    icon: () => <FaBrain className="w-4 h-4" />,
    keywords: ['machine learning', 'ml', 'algorithms', 'models', 'intelligent systems'],
    category: 'Technology',
    priority: 4
  },
  {
    id: 'python-programming',
    title: 'Python Programming',
    description: 'Learn Python for data science, AI, and software development',
    url: '/departments/computer-science/program',
    type: 'technology',
    icon: () => <FaPython className="w-4 h-4" />,
    keywords: ['python', 'programming language', 'coding', 'data science', 'ai'],
    category: 'Technology',
    priority: 3
  },
  {
    id: 'java-programming',
    title: 'Java Programming',
    description: 'Object-oriented programming with Java for enterprise applications',
    url: '/departments/computer-science/program',
    type: 'technology',
    icon: () => <FaJava className="w-4 h-4" />,
    keywords: ['java', 'object-oriented', 'enterprise', 'programming', 'software development'],
    category: 'Technology',
    priority: 3
  },
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Frontend, backend, and full-stack web development skills',
    url: '/departments/computer-science/program',
    type: 'technology',
    icon: () => <FaCode className="w-4 h-4" />,
    keywords: ['web development', 'frontend', 'backend', 'full-stack', 'html', 'css', 'javascript'],
    category: 'Technology',
    priority: 4
  },
  {
    id: 'mobile-development',
    title: 'Mobile Development',
    description: 'iOS and Android app development for mobile platforms',
    url: '/departments/computer-science/program',
    type: 'technology',
    icon: () => <FaMobileAlt className="w-4 h-4" />,
    keywords: ['mobile development', 'ios', 'android', 'app development', 'mobile apps'],
    category: 'Technology',
    priority: 3
  },
  {
    id: 'cloud-computing',
    title: 'Cloud Computing',
    description: 'AWS, Azure, and Google Cloud platforms for scalable solutions',
    url: '/departments/computer-science/program',
    type: 'technology',
    icon: () => <FaCloud className="w-4 h-4" />,
    keywords: ['cloud computing', 'aws', 'azure', 'google cloud', 'scalable', 'infrastructure'],
    category: 'Technology',
    priority: 3
  },

  // ===== RESEARCH AREAS =====
  {
    id: 'ai-research',
    title: 'AI Research',
    description: 'Cutting-edge artificial intelligence research projects and innovations',
    url: '/departments/computer-science',
    type: 'research',
    icon: () => <FaMicroscope className="w-4 h-4" />,
    keywords: ['ai research', 'artificial intelligence research', 'research projects', 'innovation'],
    category: 'Research',
    priority: 4
  },
  {
    id: 'cybersecurity-research',
    title: 'Cybersecurity Research',
    description: 'Digital security studies and advanced protection methodologies',
    url: '/departments/computer-science',
    type: 'research',
    icon: () => <FaShieldAlt className="w-4 h-4" />,
    keywords: ['cybersecurity research', 'digital security', 'protection', 'security studies'],
    category: 'Research',
    priority: 3
  },

  // ===== ACHIEVEMENTS =====
  {
    id: 'programming-contest-win',
    title: 'International Programming Contest Win',
    description: 'NUS students win prestigious international programming competition',
    url: '/departments/computer-science',
    type: 'achievement',
    icon: () => <FaTrophy className="w-4 h-4" />,
    keywords: ['programming contest', 'competition win', 'international', 'achievement', 'trophy'],
    category: 'Achievements',
    priority: 3
  },
  {
    id: 'ai-research-grant',
    title: 'AI Research Grant',
    description: 'CS Department receives $2M AI research grant for cutting-edge projects',
    url: '/departments/computer-science',
    type: 'achievement',
    icon: () => <FaAward className="w-4 h-4" />,
    keywords: ['ai research grant', '2m grant', 'research funding', 'ai projects'],
    category: 'Achievements',
    priority: 3
  },

  // ===== ACADEMIC PROGRAMS =====
  {
    id: 'bachelor-computer-science',
    title: 'Bachelor of Computer Science',
    description: '4-year comprehensive undergraduate program covering all aspects of computer science',
    url: '/departments/computer-science/program',
    type: 'program',
    icon: () => <FaDegree className="w-4 h-4" />,
    keywords: ['bachelor', 'computer science', 'undergraduate', '4-year', 'degree program'],
    category: 'Academic Programs',
    priority: 4
  },
  {
    id: 'master-computer-science',
    title: 'Master of Computer Science',
    description: '2-year advanced graduate program with specializations in AI, cybersecurity, and more',
    url: '/departments/computer-science/program',
    type: 'program',
    icon: () => <FaDegree className="w-4 h-4" />,
    keywords: ['master', 'graduate program', '2-year', 'specializations', 'advanced'],
    category: 'Academic Programs',
    priority: 3
  },
  {
    id: 'phd-computer-science',
    title: 'PhD in Computer Science',
    description: '4-6 year research-focused doctoral program for future academic and industry leaders',
    url: '/departments/computer-science/program',
    type: 'program',
    icon: () => <FaDegree className="w-4 h-4" />,
    keywords: ['phd', 'doctorate', 'research', 'doctoral program', 'academic leadership'],
    category: 'Academic Programs',
    priority: 3
  },

  // ===== INTERNATIONAL PROGRAMS =====
  {
    id: 'international-students',
    title: 'International Students',
    description: 'Global community with diverse cultural backgrounds and perspectives',
    url: '/ug/admissions',
    type: 'international',
    icon: () => <FaGlobe className="w-4 h-4" />,
    keywords: ['international students', 'global', 'foreign students', 'diverse', 'cultural'],
    category: 'International',
    priority: 4
  },
  {
    id: 'english-proficiency',
    title: 'English Proficiency Requirements',
    description: 'IELTS 7.0, TOEFL iBT 100, or equivalent for international applicants',
    url: '/program-prerequisites',
    type: 'international',
    icon: () => <FaGlobeAmericas className="w-4 h-4" />,
    keywords: ['english proficiency', 'ielts', 'toefl', 'language requirements', 'international'],
    category: 'International',
    priority: 3
  },

  // ===== CAREER & INDUSTRY =====
  {
    id: 'career-development',
    title: 'Career Development',
    description: 'Professional growth opportunities and career guidance services',
    url: '/departments/computer-science/community',
    type: 'career',
    icon: () => <FaBriefcase className="w-4 h-4" />,
    keywords: ['career development', 'professional growth', 'career guidance', 'job preparation'],
    category: 'Career',
    priority: 3
  },
  {
    id: 'industry-partnerships',
    title: 'Industry Partnerships',
    description: 'Collaborations with leading companies for real-world experience',
    url: '/departments/computer-science/community',
    type: 'career',
    icon: () => <FaHandshake className="w-4 h-4" />,
    keywords: ['industry partnerships', 'company collaborations', 'real-world experience', 'industry'],
    category: 'Career',
    priority: 3
  },

  // ===== ACADEMIC SUPPORT =====
  {
    id: 'academic-support',
    title: 'Academic Support Services',
    description: 'Comprehensive student assistance and learning resources',
    url: '/departments/computer-science/community',
    type: 'academic',
    icon: () => <FaBook className="w-4 h-4" />,
    keywords: ['academic support', 'student assistance', 'learning resources', 'help'],
    category: 'Academic Support',
    priority: 3
  },
  {
    id: 'mentorship-programs',
    title: 'Mentorship Programs',
    description: 'Faculty guidance and industry mentorship for student success',
    url: '/departments/computer-science/community',
    type: 'academic',
    icon: () => <FaUsers className="w-4 h-4" />,
    keywords: ['mentorship', 'faculty guidance', 'industry mentorship', 'student success'],
    category: 'Academic Support',
    priority: 3
  }
];

// Search function that matches keywords and returns relevant results
export const performSearch = (query: string): SearchResult[] => {
  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase();
  
  return searchDatabase
    .filter(item => {
      // Check title, description, keywords, and category
      const searchableText = [
        item.title.toLowerCase(),
        item.description.toLowerCase(),
        ...item.keywords.map(k => k.toLowerCase()),
        item.category.toLowerCase(),
        item.type.toLowerCase()
      ].join(' ');

      return searchableText.includes(searchTerm);
    })
    .sort((a, b) => {
      // Sort by priority first (higher priority first)
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      
      // Then by relevance (exact matches first)
      const aExactMatch = a.title.toLowerCase().includes(searchTerm) || 
                         a.keywords.some(k => k.toLowerCase() === searchTerm);
      const bExactMatch = b.title.toLowerCase().includes(searchTerm) || 
                         b.keywords.some(k => k.toLowerCase() === searchTerm);
      
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;
      
      return 0;
    });
};

// Get search suggestions based on partial matches
export const getSearchSuggestions = (query: string): string[] => {
  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase();
  const suggestions = new Set<string>();

  searchDatabase.forEach(item => {
    // Add matching keywords
    item.keywords.forEach(keyword => {
      if (keyword.toLowerCase().includes(searchTerm)) {
        suggestions.add(keyword);
      }
    });

    // Add matching titles
    if (item.title.toLowerCase().includes(searchTerm)) {
      suggestions.add(item.title);
    }
  });

  return Array.from(suggestions).slice(0, 5); // Return top 5 suggestions
};

// Get categories for filtering
export const getSearchCategories = (): string[] => {
  const categories = new Set(searchDatabase.map(item => item.category));
  return Array.from(categories).sort();
};

// Filter results by category
export const filterByCategory = (results: SearchResult[], category: string): SearchResult[] => {
  if (!category || category === 'All') return results;
  return results.filter(item => item.category === category);
}; 