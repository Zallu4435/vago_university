
import { useState } from 'react';
import CommunicationTabs from './CommunicationTabs';
import InboxSection from './InboxSection';
import SentSection from './SentSection';
import { FaEnvelope } from 'react-icons/fa';

export default function Communication() {
  const [activeTab, setActiveTab] = useState('Inbox');

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-white/90">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/80 to-white/90"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100/20 to-amber-100/20"></div>
      <div className="absolute -bottom-16 -right-16 w-96 h-96 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-300/30 blur-3xl animate-pulse"></div>
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-gradient-to-br from-amber-200/20 to-orange-200/20 blur-2xl animate-pulse delay-700"></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="group relative overflow-hidden rounded-2xl shadow-xl bg-white/70 backdrop-blur-md mb-6 border border-amber-100/50 hover:border-orange-200/50 hover:shadow-2xl transition-all duration-300">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 group-hover:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
          <div className="relative z-10 p-4 sm:p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                  <FaEnvelope size={20} className="text-white relative z-10" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-orange-400/30 to-amber-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
                  Communication Center
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mt-1 group-hover:w-24 transition-all duration-300"></div>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
              <span>3 Unread Messages</span>
              <span>|</span>
              <span>Last Checked: April 29, 2025</span>
              <span>|</span>
              <span>Connected Accounts: 2</span>
            </div>
          </div>
        </div>

        <CommunicationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-6">
          {activeTab === 'Inbox' && <InboxSection />}
          {activeTab === 'Sent' && <SentSection />}
        </div>
      </div>
    </div>
  );
}