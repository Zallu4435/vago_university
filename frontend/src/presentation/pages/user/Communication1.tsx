import { useState } from 'react';
import { Bell, Search, User, ChevronRight } from 'lucide-react';

export default function UniversityPortal() {
  const [activeTab, setActiveTab] = useState('Inbox');
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header with gradient - orange to yellow */}
      <header className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold">University Portal</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">John Smith</span>
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-white text-orange-600 flex items-center justify-center font-semibold">
                JS
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full text-xs flex items-center justify-center text-orange-600 font-bold">
                3
              </span>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="bg-orange-600">
          <div className="container mx-auto px-4">
            <ul className="flex overflow-x-auto">
              <li className="px-4 py-3 hover:bg-orange-700 cursor-pointer text-white font-medium">Dashboard</li>
              <li className="px-4 py-3 hover:bg-orange-700 cursor-pointer text-white font-medium">Academics</li>
              <li className="px-4 py-3 hover:bg-orange-700 cursor-pointer text-white font-medium">Financial</li>
              <li className="px-4 py-3 bg-orange-700 cursor-pointer text-white font-medium">Communication</li>
              <li className="px-4 py-3 hover:bg-orange-700 cursor-pointer text-white font-medium">Campus Life</li>
            </ul>
          </div>
        </nav>
      </header>
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        {/* Communication Center */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg shadow-sm mb-4">
          <h2 className="text-xl font-semibold text-orange-700">Communication Center</h2>
          <div className="text-sm text-gray-600">
            3 Unread Messages | Last Checked: April 29, 2025 | Connected Accounts: 2
          </div>
        </div>
        
        {/* Inbox/Sent Tabs */}
        <div className="bg-gray-200 rounded-t-lg overflow-hidden">
          <div className="flex">
            <button 
              className={`py-2 px-8 ${activeTab === 'Inbox' ? 'bg-white font-medium text-orange-700' : 'text-gray-700 hover:bg-gray-300'}`}
              onClick={() => setActiveTab('Inbox')}
            >
              Inbox
            </button>
            <button 
              className={`py-2 px-8 ${activeTab === 'Sent' ? 'bg-white font-medium text-orange-700' : 'text-gray-700 hover:bg-gray-300'}`}
              onClick={() => setActiveTab('Sent')}
            >
              Sent
            </button>
          </div>
        </div>
        
        {/* Message Inbox */}
        <div className="bg-white rounded-b-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-orange-600 to-yellow-500 py-3 px-4">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-medium">Message Inbox</h3>
              <span className="text-white text-sm">Spring 2025</span>
            </div>
          </div>
          
          {/* Message Content Area */}
          <div className="flex">
            {/* Message List */}
            <div className="w-1/3 border-r border-gray-200">
              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input 
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="Search messages..."
                  />
                </div>
              </div>
              
              {/* Messages */}
              <div className="divide-y divide-gray-100">
                <div className="bg-orange-50 p-3 cursor-pointer hover:bg-orange-100 flex">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center mr-3 flex-shrink-0">
                    FA
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between">
                      <span className="font-medium text-orange-800">Financial Aid Office</span>
                      <span className="text-xs text-gray-500">10:32AM</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">Scholarship Awarded - Your application has been approved</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 self-center ml-2"></div>
                </div>
                
                <div className="p-3 cursor-pointer hover:bg-orange-100 flex">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mr-3 flex-shrink-0">
                    AD
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800">Academic Department</span>
                      <span className="text-xs text-gray-500">Yesterday</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">Course Registration Reminder - Please complete by May 15</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 self-center ml-2"></div>
                </div>
                
                <div className="p-3 cursor-pointer hover:bg-orange-100 flex">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center mr-3 flex-shrink-0">
                    HD
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800">Housing Department</span>
                      <span className="text-xs text-gray-500">Apr 28</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">Room Assignment Update - Your housing request has been processed</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 self-center ml-2"></div>
                </div>
                
                <div className="p-3 cursor-pointer hover:bg-orange-100 flex">
                  <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center mr-3 flex-shrink-0">
                    IT
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800">IT Services</span>
                      <span className="text-xs text-gray-500">Apr 24</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">System Maintenance Notice - The student portal will be unavailable on May 10</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Message Detail */}
            <div className="w-2/3 p-4">
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center mr-3">
                    FA
                  </div>
                  <div>
                    <h4 className="font-medium text-lg text-orange-800">Financial Aid Office</h4>
                    <div className="text-sm text-gray-500 flex items-center">
                      <span>financial.aid@university.edu</span>
                      <span className="mx-2">•</span>
                      <span>April 30, 2025 10:32AM</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-orange-700 mb-3">Scholarship Awarded</h3>
                
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                  <p className="mb-3">Dear John Smith,</p>
                  <p className="mb-3">
                    We are pleased to inform you that you have been awarded the Academic 
                    Excellence Scholarship for the 2025-2028 academic year. This scholarship 
                    will provide $5,000 towards your tuition and fees.
                  </p>
                  <p className="mb-3">
                    The scholarship funds will be applied to your student account by May 15, 2025.
                  </p>
                  <p className="mb-3">
                    Please log into the Financial Services section to review the details and 
                    acknowledge receipt of this award.
                  </p>
                  <p className="mb-3">Congratulations on your achievement!</p>
                  <p className="mb-1">Sincerely,</p>
                  <p className="font-medium">University Financial Aid Office</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center">
                  View Financial Details <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-orange-600 text-white py-2 text-center text-sm">
        <div className="container mx-auto">
          © 2025 University Portal System • Privacy Policy • Help Center
        </div>
      </footer>
    </div>
  );
}