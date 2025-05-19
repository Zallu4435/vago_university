import { useState } from 'react';
import { Search, ChevronRight, Mail, Reply, ArrowUpRight } from 'lucide-react';

export default function UniversityPortal() {
  const [activeTab, setActiveTab] = useState('Sent');
  
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
        
        {/* Sent Messages */}
        <div className="bg-white rounded-b-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-orange-600 to-yellow-500 py-3 px-4">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-medium">Sent Messages</h3>
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
                    placeholder="Search sent messages..."
                  />
                </div>
              </div>
              
              {/* Sent Messages */}
              <div className="divide-y divide-gray-100">
                <div className="bg-orange-50 p-3 cursor-pointer hover:bg-orange-100 flex">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 flex-shrink-0">
                    JS
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between">
                      <span className="font-medium text-orange-800">To: Academic Advisor</span>
                      <span className="text-xs text-gray-500">Apr 29</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">Course Registration Question - I'm trying to register for the Computer Science seminar</p>
                  </div>
                </div>
                
                <div className="p-3 cursor-pointer hover:bg-orange-100 flex">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 flex-shrink-0">
                    JS
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800">To: Housing Department</span>
                      <span className="text-xs text-gray-500">Apr 22</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">Room Change Request - Due to my medical condition, I need to request a room change</p>
                  </div>
                </div>
                
                <div className="p-3 cursor-pointer hover:bg-orange-100 flex">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 flex-shrink-0">
                    JS
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800">To: IT Support</span>
                      <span className="text-xs text-gray-500">Apr 15</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">Password Reset Request - I need help resetting my student portal password</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Message Detail */}
            <div className="w-2/3 p-4">
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                    AA
                  </div>
                  <div>
                    <h4 className="font-medium text-lg text-orange-800">To: Academic Advisor</h4>
                    <div className="text-sm text-gray-500 flex items-center">
                      <span>advisor@university.edu</span>
                      <span className="mx-2">•</span>
                      <span>April 29, 2025 3:45 PM</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-orange-700 mb-3">Course Registration Question</h3>
                
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500 mb-4">
                  <p className="mb-3">Dear Academic Advisor,</p>
                  <p className="mb-3">
                    I'm trying to register for the Computer Science seminar (CS 450) for the 
                    Fall 2025 semester, but I'm receiving an error message saying I don't 
                    meet the prerequisites. I believe I've completed all required courses.
                  </p>
                  <p className="mb-3">
                    Could you please review my record and advise on how to proceed?
                  </p>
                  <p className="mb-3">Thank you for your help!</p>
                  <p className="mb-1">Sincerely,</p>
                  <p className="font-medium">John Smith</p>
                </div>
                
                <div className="bg-yellow-50 p-3 rounded-lg flex items-start border border-yellow-200 mb-4">
                  <Mail className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800 font-medium">Reply received from advisor@university.edu - April 30, 2025 9:15 AM</p>
                    <p className="text-sm text-gray-600">I've checked your records and you're missing CS 325, which is a prerequisite. Would you like to enroll in CS 325 for the summer session?</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-3">
                  <h4 className="text-gray-700 font-medium">Reply</h4>
                  <div className="flex space-x-2">
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-1" /> Forward
                    </button>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md text-sm flex items-center">
                      <Reply className="h-4 w-4 mr-1" /> Reply
                    </button>
                  </div>
                </div>
                
                <textarea 
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 text-sm"
                  placeholder="Type your reply here..."
                  defaultValue="Yes, I would like to enroll in CS 325 for the summer session. Could you please help me with the registration process?"
                ></textarea>
                
                <div className="flex justify-end mt-2">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center">
                    Send Response <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
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