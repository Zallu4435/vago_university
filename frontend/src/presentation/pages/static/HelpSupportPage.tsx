import { useState } from 'react';
import { 
  FaQuestionCircle, 
  FaComments, 
  FaPhone, 
  FaEnvelope, 
  FaBook, 
  FaUsers, 
  FaCreditCard, 
  FaMapMarkerAlt, 
  FaClock, 
  FaSearch,
  FaChevronRight,
  FaExternalLinkAlt,
  FaUser,
  FaGraduationCap,
  FaLaptop,
  FaFileAlt,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowLeft,
  FaHome
} from 'react-icons/fa';
import { FiHelpCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../appStore/store';

const HelpSupportPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const supportCategories = [
    { id: 'all', name: 'All Topics', icon: FaQuestionCircle },
    { id: 'academic', name: 'Academic', icon: FaBook },
    { id: 'technical', name: 'Technical', icon: FaLaptop },
    { id: 'account', name: 'Account', icon: FaUser },
    { id: 'financial', name: 'Financial', icon: FaCreditCard },
    { id: 'campus', name: 'Campus Life', icon: FaUsers }
  ];

  const faqItems = [
    {
      category: 'academic',
      question: 'How do I register for classes?',
      answer: 'You can register for classes through the Student Portal during your designated registration period. Check your academic calendar for specific dates and speak with your academic advisor if you need assistance.',
      priority: 'high'
    },
    {
      category: 'academic',
      question: 'How do I drop or add a class?',
      answer: 'Use the Student Portal to drop or add classes during the add/drop period. After this period, you may need to petition for a late drop with approval from your academic advisor.',
      priority: 'medium'
    },
    {
      category: 'technical',
      question: 'I forgot my student portal password',
      answer: 'Click "Forgot Password" on the login page or visit the IT Help Desk with your student ID. You can also call (555) 123-4567 for immediate assistance.',
      priority: 'high'
    },
    {
      category: 'technical',
      question: 'WiFi connection issues on campus',
      answer: 'Try disconnecting and reconnecting to the university WiFi. If issues persist, contact IT Support at itsupport@university.edu or visit the IT Help Desk in the library.',
      priority: 'medium'
    },
    {
      category: 'financial',
      question: 'How do I pay my tuition?',
      answer: 'Tuition can be paid online through the Student Portal, by phone at (555) 234-5678, or in person at the Bursar\'s Office. Payment plans are available.',
      priority: 'high'
    },
    {
      category: 'financial',
      question: 'When are tuition payments due?',
      answer: 'Tuition payments are typically due before the start of each semester. Check your student account for specific due dates and payment options.',
      priority: 'medium'
    },
    {
      category: 'account',
      question: 'How do I update my contact information?',
      answer: 'Log into the Student Portal and navigate to "Personal Information" to update your address, phone number, and emergency contacts.',
      priority: 'low'
    },
    {
      category: 'campus',
      question: 'How do I get a parking permit?',
      answer: 'Parking permits can be purchased online through the Campus Safety website or in person at the Campus Safety Office in the Administration Building.',
      priority: 'medium'
    }
  ];

  const contactMethods = [
    {
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: FaComments,
      available: 'Mon-Fri, 8AM-6PM',
      action: 'Start Chat',
      color: 'bg-sky-500'
    },
    {
      title: 'Phone Support',
      description: 'Call our main support line',
      icon: FaPhone,
      available: '24/7 Emergency Line',
      action: '(555) 123-HELP',
      color: 'bg-emerald-500'
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: FaEnvelope,
      available: 'Response within 24 hours',
      action: 'support@university.edu',
      color: 'bg-purple-500'
    },
    {
      title: 'Campus Visit',
      description: 'Visit our help desk in person',
      icon: FaMapMarkerAlt,
      available: 'Mon-Fri, 9AM-5PM',
      action: 'Library, 1st Floor',
      color: 'bg-amber-500'
    }
  ];

  const quickLinks = [
    { title: 'Student Portal', icon: FaGraduationCap, url: '#' },
    { title: 'Academic Calendar', icon: FaCalendarAlt, url: '#' },
    { title: 'Course Catalog', icon: FaBook, url: '#' },
    { title: 'Library Resources', icon: FaFileAlt, url: '#' },
    { title: 'IT Services', icon: FaLaptop, url: '#' },
    { title: 'Campus Map', icon: FaMapMarkerAlt, url: '#' }
  ];

  const filteredFAQs = faqItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getPriorityIcon = (priority: 'high' | 'medium' | 'low') => {
    switch(priority) {
      case 'high': return <FaExclamationTriangle className="text-red-500" />;
      case 'medium': return <FaClock className="text-amber-500" />;
      default: return <FaCheckCircle className="text-emerald-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-full mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Back Button and Title */}
            <div className="flex items-center space-x-6">
              <button
                onClick={handleBackToDashboard}
                className="group flex items-center space-x-2 px-4 py-2 bg-white hover:bg-slate-50 rounded-lg text-slate-700 hover:text-slate-900 transition-all duration-200 shadow-sm hover:shadow border border-slate-200 hover:border-slate-300"
              >
                <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
                <FaHome className="w-4 h-4" />
                <span className="font-medium text-sm">Dashboard</span>
              </button>
              
              <div className="h-6 w-px bg-slate-200"></div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                  <FiHelpCircle className="w-4 h-4 text-sky-600" />
                </div>
                <h1 className="text-xl font-bold text-slate-800">
                  Help & Support
                </h1>
              </div>
            </div>

            <div className="flex items-center">
              <div className="px-3 py-1.5 bg-sky-50 rounded-lg text-sm text-sky-700 font-medium border border-sky-200">
                {user?.firstName || 'User'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-16">
        <div className="bg-sky-600 text-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">Help & Support Center</h2>
              <p className="text-xl text-sky-100 mb-8">We're here to help you succeed. Find answers, get support, and connect with our team.</p>
              
              <div className="max-w-2xl mx-auto relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search for help articles, FAQs, or topics..."
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-slate-800 text-lg focus:outline-none focus:ring-2 focus:ring-sky-300 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Contact Methods */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Get Immediate Help</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <div key={index} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all duration-200">
                  <div className={`${method.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <method.icon className="text-white text-xl" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-800">{method.title}</h3>
                  <p className="text-slate-600 mb-3">{method.description}</p>
                  <p className="text-sm text-slate-500 mb-4">{method.available}</p>
                  <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 px-4 rounded-lg font-medium transition-colors">
                    {method.action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Quick Access</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickLinks.map((link, index) => (
                <a key={index} href={link.url} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-all duration-200 text-center group">
                  <link.icon className="text-2xl text-sky-600 mb-3 mx-auto group-hover:text-sky-700" />
                  <p className="text-sm font-medium text-slate-800 group-hover:text-sky-700">{link.title}</p>
                  <FaExternalLinkAlt className="text-xs text-slate-400 mt-1 mx-auto" />
                </a>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Frequently Asked Questions</h2>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {supportCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <category.icon className="text-sm" />
                  {category.name}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getPriorityIcon(faq.priority as 'high' | 'medium' | 'low')}
                            <h3 className="font-semibold text-slate-800">{faq.question}</h3>
                          </div>
                          <p className="text-slate-600">{faq.answer}</p>
                        </div>
                        <FaChevronRight className="text-slate-400 ml-4" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FaQuestionCircle className="text-4xl text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No results found. Try adjusting your search or category filter.</p>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <FaExclamationTriangle className="text-red-600 text-xl" />
              <h3 className="text-lg font-bold text-red-800">Emergency Support</h3>
            </div>
            <p className="text-red-700 mb-4">
              For urgent technical issues or emergencies that affect your academic progress, contact our emergency support line.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:555-123-9999" className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                <FaPhone />
                Emergency: (555) 123-9999
              </a>
              <a href="mailto:emergency@university.edu" className="flex items-center gap-2 bg-white text-red-600 border border-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
                <FaEnvelope />
                emergency@university.edu
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;