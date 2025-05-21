import { FaBell, FaBookOpen, FaSearch, FaBars, FaTimes } from 'react-icons/fa';

export default function Header({ activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen }) {
  const tabs = ['Dashboard', 'Academics', 'Financial', 'Communication', 'Campus Life'];

  return (
    <header className="relative z-10 bg-gradient-to-r from-amber-100 to-orange-100 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-200 via-orange-100 to-amber-100 opacity-95 backdrop-blur-lg"></div>
      
      <div className="container mx-auto px-4 py-3 relative z-10">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-lg">
              <FaBookOpen className="text-orange-500" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 hidden md:block">University Portal</h1>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 bg-white/70 rounded-full px-4 py-2 backdrop-blur-md shadow-sm">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" size={18} />
              <input 
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-1 rounded-full bg-white/70 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                aria-label="Search"
              />
            </div>
          </div>

          {/* Icons & User */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full hover:bg-white/20 transition" aria-label="Notifications">
              <FaBell className="text-orange-500" size={20} />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                3
              </span>
            </button>

            <div className="hidden md:flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1 backdrop-blur-md">
              <div className="bg-white text-orange-500 rounded-full w-8 h-8 flex items-center justify-center font-medium shadow-md">
                JS
              </div>
              <span className="text-gray-800">John Smith</span>
            </div>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-white/20 transition"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen 
                ? <FaTimes className="text-orange-500" size={20} /> 
                : <FaBars className="text-orange-500" size={20} />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block mt-4">
          <ul className="flex space-x-6">
            {tabs.map((tab) => (
              <li key={tab}>
                <button 
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 transition-all ${
                    activeTab === tab 
                      ? 'border-b-2 border-orange-500 font-semibold text-gray-800' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50 transform transition-all duration-300">
            <div className="p-4">
              <ul className="space-y-4">
                {tabs.map((tab) => (
                  <li key={tab}>
                    <button 
                      onClick={() => {
                        setActiveTab(tab);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                        activeTab === tab
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                          : 'text-gray-700 hover:bg-orange-100'
                      }`}
                    >
                      {tab}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
