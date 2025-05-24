import { useState } from 'react';
import CampusLifeTabs from './CampusLifeTabs';
import EventsSection from './EventsSection';
import ClubsSection from './ClubsSection';
import AthleticsSection from './AthleticsSection';
import { useCampusLife } from '../../../../application/hooks/useCampusLife';

export default function CampusLife() {
  const [activeTab, setActiveTab] = useState('Events');
  
  const {
    events,
    sports,
    clubs,
    isLoadingEvents,
    isLoadingSports,
    isLoadingClubs,
    eventsError,
    sportsError,
    clubsError
  } = useCampusLife();

  // Loading state
  if (isLoadingEvents || isLoadingSports || isLoadingClubs) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (eventsError || sportsError || clubsError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error loading campus life data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 mb-4 shadow-md">
        <h2 className="text-xl font-bold text-gray-800">Campus Life</h2>
        <p className="text-gray-600">
          {events.length} Upcoming Events | Spring 2025 | Club: {clubs.length} Memberships
        </p>
      </div>
      <CampusLifeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'Events' && <EventsSection events={events} />}
      {activeTab === 'Clubs' && <ClubsSection clubs={clubs} />}
      {activeTab === 'Athletics' && <AthleticsSection sports={sports} />}
    </div>
  );
}