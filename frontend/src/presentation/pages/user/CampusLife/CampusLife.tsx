import { useState } from 'react';
import CampusLifeTabs from './CampusLifeTabs';
import EventsSection from './EventsSection';
import ClubsSection from './ClubsSection';
import AthleticsSection from './AthleticsSection';
import { useCampusLife } from '../../../../application/hooks/useCampusLife';
import { FaUsers } from 'react-icons/fa';

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
    clubsError,
  } = useCampusLife(activeTab);

  // Loading state
  const isLoading =
    (activeTab === 'Events' && isLoadingEvents) ||
    (activeTab === 'Clubs' && isLoadingClubs) ||
    (activeTab === 'Athletics' && isLoadingSports);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-white/90">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Error state
  const error =
    (activeTab === 'Events' && eventsError) ||
    (activeTab === 'Clubs' && clubsError) ||
    (activeTab === 'Athletics' && sportsError);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-white/90">
        <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-amber-100/50 p-4 sm:p-6 max-w-md w-full">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 group-hover:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
          <div className="relative z-10 text-red-600 text-sm sm:text-base text-center">
            Error loading {activeTab.toLowerCase()} data. Please try again later.
          </div>
        </div>
      </div>
    );
  }

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
                  <FaUsers size={20} className="text-white relative z-10" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-orange-400/30 to-amber-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
                  Campus Life
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mt-1 group-hover:w-24 transition-all duration-300"></div>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {activeTab === 'Events' && `${(events?.data || events || []).length} Upcoming Events`}
              {activeTab === 'Clubs' && `${(clubs?.data || clubs || []).length} Clubs Available`}
              {activeTab === 'Athletics' && `${(sports?.data || sports || []).length} Sports Teams`}
            </p>
          </div>
        </div>

        <CampusLifeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-6">
          {activeTab === 'Events' && <EventsSection events={events?.data || events || []} />}
          {activeTab === 'Clubs' && <ClubsSection clubs={clubs?.data || clubs || []} />}
          {activeTab === 'Athletics' && <AthleticsSection sports={sports?.data || sports || []} />}
        </div>
      </div>
    </div>
  );
}
