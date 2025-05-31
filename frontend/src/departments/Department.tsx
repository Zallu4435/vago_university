import React, { useState } from 'react';
import { Search, Menu, X, ChevronDown, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

// Department configurations
const departmentConfigs = {
  'computer-science': {
    name: 'School of Computer Science',
    shortName: 'CS',
    logo: 'SoCS',
    description: 'Leading innovation in computing and technology',
    navItems: [
      { label: 'Home', href: 'home' },
      { label: 'About', href: 'about' },
      { label: 'Education', href: 'education' },
      { label: 'Research', href: 'research' },
      { label: 'Faculty', href: 'faculty' },
      { label: 'Industry', href: 'industry' },
      { label: 'Contact', href: 'contact' }
    ],
    theme: {
      primary: 'bg-blue-700',
      secondary: 'bg-blue-50',
      text: 'text-blue-900',
      accent: 'text-blue-600',
      gradient: 'from-blue-600 to-blue-800'
    },
    hero: {
      title: 'Shaping the Future of Computing',
      subtitle: 'World-class education and research in computer science, artificial intelligence, and software engineering.',
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1200&h=600&fit=crop'
    }
  },
  'business': {
    name: 'School of Business',
    shortName: 'Business',
    logo: 'SoB',
    description: 'Excellence in business education and research',
    navItems: [
      { label: 'Home', href: 'home' },
      { label: 'About', href: 'about' },
      { label: 'Education', href: 'education' },
      { label: 'Executive Programs', href: 'executive' },
      { label: 'Research', href: 'research' },
      { label: 'Alumni', href: 'alumni' },
      { label: 'Contact', href: 'contact' }
    ],
    theme: {
      primary: 'bg-green-700',
      secondary: 'bg-green-50',
      text: 'text-green-900',
      accent: 'text-green-600',
      gradient: 'from-green-600 to-green-800'
    },
    hero: {
      title: 'Leading Business Innovation',
      subtitle: 'Empowering future leaders with cutting-edge business education and research opportunities.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop'
    }
  },
  'engineering': {
    name: 'School of Engineering',
    shortName: 'Engineering',
    logo: 'SoE',
    description: 'Engineering solutions for tomorrow',
    navItems: [
      { label: 'Home', href: 'home' },
      { label: 'About', href: 'about' },
      { label: 'Education', href: 'education' },
      { label: 'Departments', href: 'departments' },
      { label: 'Research Labs', href: 'labs' },
      { label: 'Industry Partners', href: 'industry' },
      { label: 'Contact', href: 'contact' }
    ],
    theme: {
      primary: 'bg-orange-700',
      secondary: 'bg-orange-50',
      text: 'text-orange-900',
      accent: 'text-orange-600',
      gradient: 'from-orange-600 to-orange-800'
    },
    hero: {
      title: 'Engineering Excellence',
      subtitle: 'Innovative solutions through advanced engineering education and groundbreaking research.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=600&fit=crop'
    }
  }
};

// Page content configurations
const pageContents = {
  'computer-science': {
    home: {
      sections: [
        {
          title: 'Latest News',
          items: [
            'CS Department receives $2M AI research grant',
            'New Machine Learning specialization launched',
            'Students win international programming contest'
          ]
        },
        {
          title: 'Upcoming Events',
          items: [
            'Tech Industry Career Fair - March 15',
            'AI Research Symposium - March 20',
            'Alumni Networking Event - March 25'
          ]
        }
      ]
    },
    about: {
      content: 'The School of Computer Science is at the forefront of computing education and research. Our faculty and students work on cutting-edge projects in artificial intelligence, cybersecurity, software engineering, and data science.',
      stats: [
        { label: 'Faculty Members', value: '45' },
        { label: 'Students', value: '800' },
        { label: 'Research Projects', value: '25' }
      ]
    },
    education: {
      programs: [
        { name: 'Bachelor of Computer Science', duration: '4 years', description: 'Comprehensive undergraduate program covering all aspects of computer science.' },
        { name: 'Master of Computer Science', duration: '2 years', description: 'Advanced graduate program with specializations in AI, cybersecurity, and more.' },
        { name: 'PhD in Computer Science', duration: '4-6 years', description: 'Research-focused doctoral program for future academic and industry leaders.' }
      ]
    }
  },
  'business': {
    home: {
      sections: [
        {
          title: 'Latest News',
          items: [
            'MBA program ranked top 10 globally',
            'New fintech specialization introduced',
            'Partnership with Fortune 500 companies'
          ]
        },
        {
          title: 'Upcoming Events',
          items: [
            'Business Leadership Summit - April 10',
            'Entrepreneurship Workshop - April 15',
            'Alumni Success Stories - April 22'
          ]
        }
      ]
    },
    about: {
      content: 'The School of Business prepares tomorrow\'s leaders through innovative curricula, world-class faculty, and strong industry connections. We offer programs that blend theoretical knowledge with practical application.',
      stats: [
        { label: 'Faculty Members', value: '60' },
        { label: 'Students', value: '1200' },
        { label: 'Corporate Partners', value: '150' }
      ]
    },
    education: {
      programs: [
        { name: 'Bachelor of Business Administration', duration: '4 years', description: 'Comprehensive business education with multiple specialization tracks.' },
        { name: 'Master of Business Administration', duration: '2 years', description: 'Full-time MBA program with global perspective and leadership focus.' },
        { name: 'Executive MBA', duration: '18 months', description: 'Part-time program designed for working professionals.' }
      ]
    }
  },
  'engineering': {
    home: {
      sections: [
        {
          title: 'Latest News',
          items: [
            'New sustainable engineering lab opens',
            'Students design award-winning bridge',
            'Collaboration with NASA announced'
          ]
        },
        {
          title: 'Upcoming Events',
          items: [
            'Engineering Innovation Fair - May 5',
            'Industry Collaboration Day - May 12',
            'Senior Design Showcase - May 20'
          ]
        }
      ]
    },
    about: {
      content: 'The School of Engineering combines rigorous academic training with hands-on experience to prepare engineers who will solve tomorrow\'s challenges. Our programs span multiple engineering disciplines.',
      stats: [
        { label: 'Faculty Members', value: '75' },
        { label: 'Students', value: '1500' },
        { label: 'Research Labs', value: '12' }
      ]
    },
    education: {
      programs: [
        { name: 'Bachelor of Engineering', duration: '4 years', description: 'ABET-accredited programs in multiple engineering disciplines.' },
        { name: 'Master of Engineering', duration: '2 years', description: 'Advanced coursework and research in specialized engineering fields.' },
        { name: 'PhD in Engineering', duration: '4-6 years', description: 'Doctoral research programs across all engineering departments.' }
      ]
    }
  }
};

// Header Component
const Header = ({ config }) => (
  <div className="bg-gray-900 text-white py-2">
    <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
      <div className="flex items-center space-x-4">
        <span>📧 info@university.edu</span>
        <span>📞 +1 (555) 123-4567</span>
      </div>
      <div className="flex items-center space-x-4">
        <button className="hover:text-gray-300">Student Portal</button>
        <button className="hover:text-gray-300">Staff Portal</button>
        <button className="hover:text-gray-300">Alumni</button>
      </div>
    </div>
  </div>
);

// Navigation Component
const Navigation = ({ config, currentPage, setCurrentPage, isMobile, setIsMobile }) => (
  <nav className={`${config.theme.primary} text-white sticky top-0 z-50`}>
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center py-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="bg-white text-gray-900 px-3 py-2 rounded font-bold">
            {config.logo}
          </div>
          <div>
            <div className="font-bold text-lg">{config.name}</div>
            <div className="text-sm opacity-90">{config.description}</div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {config.navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(item.href)}
              className={`font-medium transition-colors relative group ${
                currentPage === item.href ? 'text-yellow-300' : 'hover:text-gray-200'
              }`}
            >
              {item.label}
              <span className={`absolute bottom-0 left-0 h-0.5 bg-yellow-300 transition-all duration-300 ${
                currentPage === item.href ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </button>
          ))}
          <Search className="w-5 h-5 cursor-pointer hover:text-gray-200" />
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden"
          onClick={() => setIsMobile(!isMobile)}
        >
          {isMobile ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="lg:hidden border-t border-opacity-20 py-4">
          {config.navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentPage(item.href);
                setIsMobile(false);
              }}
              className={`block w-full text-left py-2 px-4 hover:bg-black hover:bg-opacity-20 ${
                currentPage === item.href ? 'text-yellow-300' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  </nav>
);

// Hero Section Component
const HeroSection = ({ config }) => (
  <div className={`bg-gradient-to-r ${config.theme.gradient} text-white py-20`}>
    <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-4xl lg:text-6xl font-bold mb-6">{config.hero.title}</h1>
        <p className="text-xl mb-8 opacity-90">{config.hero.subtitle}</p>
        <div className="flex flex-wrap gap-4">
          <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Apply Now
          </button>
          <button className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors">
            Learn More
          </button>
        </div>
      </div>
      <div className="hidden lg:block">
        <img 
          src={config.hero.image} 
          alt="Department" 
          className="rounded-lg shadow-2xl w-full h-80 object-cover"
        />
      </div>
    </div>
  </div>
);

// Page Components
const HomePage = ({ config, content }) => (
  <div className="py-12">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12">
        {content.sections.map((section, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <h3 className={`text-2xl font-bold mb-6 ${config.theme.text}`}>{section.title}</h3>
            <ul className="space-y-3">
              {section.items.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className={`w-2 h-2 rounded-full ${config.theme.primary} mt-2 mr-3 flex-shrink-0`}></span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AboutPage = ({ config, content }) => (
  <div className="py-12">
    <div className="max-w-7xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
        <h2 className={`text-3xl font-bold mb-6 ${config.theme.text}`}>About {config.name}</h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-8">{content.content}</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {content.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-4xl font-bold ${config.theme.text} mb-2`}>{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const EducationPage = ({ config, content }) => (
  <div className="py-12">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className={`text-3xl font-bold mb-8 ${config.theme.text}`}>Education Programs</h2>
      <div className="grid gap-8">
        {content.programs.map((program, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h3 className={`text-2xl font-bold ${config.theme.text}`}>{program.name}</h3>
              <span className={`${config.theme.primary} text-white px-4 py-2 rounded-full text-sm font-medium mt-2 md:mt-0`}>
                {program.duration}
              </span>
            </div>
            <p className="text-gray-700">{program.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Footer Component
const Footer = ({ config }) => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="bg-white text-gray-900 px-3 py-2 rounded font-bold">
              {config.logo}
            </div>
            <span className="font-bold">{config.shortName}</span>
          </div>
          <p className="text-gray-400">{config.description}</p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white">Admissions</a></li>
            <li><a href="#" className="hover:text-white">Academic Calendar</a></li>
            <li><a href="#" className="hover:text-white">Library</a></li>
            <li><a href="#" className="hover:text-white">Campus Life</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Resources</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white">Student Services</a></li>
            <li><a href="#" className="hover:text-white">Career Center</a></li>
            <li><a href="#" className="hover:text-white">Research</a></li>
            <li><a href="#" className="hover:text-white">International</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <div className="space-y-2 text-gray-400">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span>123 University Ave</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              <span>info@university.edu</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-400">© 2025 University. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
          <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
          <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
          <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
        </div>
      </div>
    </div>
  </footer>
);

// Main App Component
const App = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('computer-science');
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobile, setIsMobile] = useState(false);

  const config = departmentConfigs[selectedDepartment];
  const content = pageContents[selectedDepartment];

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage config={config} content={content.home} />;
      case 'about':
        return <AboutPage config={config} content={content.about} />;
      case 'education':
        return <EducationPage config={config} content={content.education} />;
      default:
        return (
          <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h2 className={`text-3xl font-bold ${config.theme.text} mb-4`}>
                {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} Page
              </h2>
              <p className="text-gray-600">This page is under construction.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Department Selector (Demo Only) */}
      <div className="bg-yellow-100 p-4 border-b">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-medium mb-2">🎓 Demo: Select Department</p>
          <div className="flex flex-wrap gap-2">
            {Object.keys(departmentConfigs).map((dept) => (
              <button
                key={dept}
                onClick={() => {
                  setSelectedDepartment(dept);
                  setCurrentPage('home');
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedDepartment === dept
                    ? departmentConfigs[dept].theme.primary + ' text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                }`}
              >
                {departmentConfigs[dept].shortName}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Header config={config} />
      <Navigation 
        config={config} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isMobile={isMobile}
        setIsMobile={setIsMobile}
      />
      
      {currentPage === 'home' && <HeroSection config={config} />}
      
      <main className="flex-grow bg-gray-50">
        {renderPage()}
      </main>
      
      <Footer config={config} />
    </div>
  );
};

export default App;