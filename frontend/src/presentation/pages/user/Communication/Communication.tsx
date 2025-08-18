import { useState } from 'react';
import CommunicationTabs from './CommunicationTabs';
import InboxSection from './InboxSection';
import SentSection from './SentSection';
import { FaEnvelope } from 'react-icons/fa';
import { usePreferences } from '../../../../application/context/PreferencesContext';

export default function Communication() {
  const [activeTab, setActiveTab] = useState('Inbox');
  const { styles, theme } = usePreferences();

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden ${styles.background}`}>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`group relative overflow-hidden rounded-2xl shadow-xl ${styles.card.background} border ${styles.border} hover:${styles.card.hover} transition-all duration-300`}>
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
          <div className="relative z-10 p-4 sm:p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${styles.accent} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                  <FaEnvelope size={20} className="text-white relative z-10" />
                </div>
                <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
              <div>
                <h2 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} bg-clip-text`}>
                  Communication Center
                </h2>
                <div className={`h-1 w-16 bg-gradient-to-r ${styles.accent} rounded-full mt-1 group-hover:w-24 transition-all duration-300`}></div>
              </div>
            </div>
            <div className="mt-2 text-sm flex flex-wrap gap-x-4 gap-y-1">
              <span className={`${styles.textSecondary}`}>Inbox Messages</span>
              <span className={`${styles.textSecondary}`}>|</span>
              <span className={`${styles.textSecondary}`}>Last Checked: April 29, 2025</span>
              <span className={`${styles.textSecondary}`}>|</span>
              <span className={`${styles.textSecondary}`}>Connected Accounts: 2</span>
            </div>
          </div>
        </div>

        <div className='mt-6'>
          <CommunicationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="mt-6">
          {activeTab === 'Inbox' && <InboxSection />}
          {activeTab === 'Sent' && <SentSection />}
        </div>
      </div>
    </div>
  );
}