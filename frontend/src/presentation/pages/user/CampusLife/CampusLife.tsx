import { useState } from 'react';
import CampusLifeTabs from './CampusLifeTabs';
import EventsSection from './EventsSection';
import ClubsSection from './ClubsSection';
import AthleticsSection from './AthleticsSection';
import { useCampusLife } from '../../../../application/hooks/useCampusLife';
import { FaUsers } from 'react-icons/fa';
import { usePreferences } from '../../../context/PreferencesContext';

export default function CampusLife() {
  const [activeTab, setActiveTab] = useState('Events');
  const { styles, theme } = usePreferences();
  const {
    events,
    sports,
    clubs,
    isLoadingEvents,
    isLoadingSports,
    isLoadingClubs,
    eventsError,
    sportsError,
    clubsError,
  } = useCampusLife(activeTab);

  const isLoading =
    (activeTab === 'Events' && isLoadingEvents) ||
    (activeTab === 'Clubs' && isLoadingClubs) ||
    (activeTab === 'Athletics' && isLoadingSports);

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${styles.background}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${styles.button.primary.split(' ')[0]}`}></div>
      </div>
    );
  }

  const error =
    (activeTab === 'Events' && eventsError) ||
    (activeTab === 'Clubs' && clubsError) ||
    (activeTab === 'Athletics' && sportsError);

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${styles.background}`}>
        <div className={`relative overflow-hidden rounded-2xl shadow-xl ${styles.card.background} border ${styles.border} p-4 sm:p-6 max-w-md w-full`}>
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
          <div className={`relative z-10 ${styles.status.error} text-sm sm:text-base text-center`}>
            Error loading {activeTab.toLowerCase()} data. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden ${styles.background}`}>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`group relative overflow-hidden rounded-2xl shadow-xl ${styles.card.background} border ${styles.border} hover:${styles.card.hover} transition-all duration-300`}>
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
          <div className="relative z-10 p-4 sm:p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${styles.accent} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                  <FaUsers size={20} className="text-white relative z-10" />
                </div>
                <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
              <div>
                <h2 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} bg-clip-text`}>
                  Campus Life
                </h2>
                <div className={`h-1 w-16 bg-gradient-to-r ${styles.accent} rounded-full mt-1 group-hover:w-24 transition-all duration-300`}></div>
              </div>
            </div>
            <p className={`mt-2 text-sm ${styles.textSecondary}`}>
              {activeTab === 'Events' && `${(events?.data || events || []).length} Upcoming Events`}
              {activeTab === 'Clubs' && `${(clubs?.data || clubs || []).length} Clubs Available`}
              {activeTab === 'Athletics' && `${(sports?.data || sports || []).length} Sports Teams`}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <CampusLifeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="mt-6">
          {activeTab === 'Events' && <EventsSection events={events?.data || events || []} />}
          {activeTab === 'Clubs' && <ClubsSection clubs={clubs?.data || clubs || []} />}
          {activeTab === 'Athletics' && <AthleticsSection sports={sports?.data || sports || []} />}
        </div>
      </div>
    </div>
  );
}