import CampusLifeTabs from './CampusLifeTabs';
import EventsSection from './EventsSection';
import ClubsSection from './ClubsSection';
import AthleticsSection from './AthleticsSection';
import { useState } from 'react';

export default function CampusLife() {
  const [activeTab, setActiveTab] = useState('Events');

  // Event data
  const events = [
    {
      id: 1,
      title: 'Spring Concert',
      date: 'May 3, 2025',
      time: '7:00 PM',
      location: 'Main Quad',
      organizer: 'Student Activities Board',
      timeframe: '3 days',
      icon: 'SC',
      color: 'bg-orange-500',
      description: 'This year\'s headliner is indie rock band "The Campus Echoes" with special guests "Quantum Theory" and local favorite "The Professors."',
      fullTime: '7:00 PM - 11:00 PM',
      additionalInfo: 'Food trucks and refreshments will be available starting at 5:30 PM.',
      requirements: 'Student ID required for entry. Each student may bring one guest.'
    },
    {
      id: 2,
      title: 'Career Fair',
      date: 'May 7, 2025',
      time: '10:00 AM',
      location: 'Student Center',
      organizer: 'Career Services',
      timeframe: '1 week',
      icon: 'CF',
      color: 'bg-green-500'
    },
    {
      id: 3,
      title: 'Grad Week Kickoff',
      date: 'May 15, 2025',
      time: '4:00 PM',
      location: 'Alumni Hall',
      organizer: 'Alumni Association',
      timeframe: '2 weeks',
      icon: 'GW',
      color: 'bg-amber-500'
    },
    {
      id: 4,
      title: 'Film Festival',
      date: 'May 20, 2025',
      time: '6:00 PM',
      location: 'Media Center',
      organizer: 'Film Club',
      timeframe: '3 weeks',
      icon: 'FF',
      color: 'bg-purple-500'
    }
  ];

  // Sports data
  const sports = [
    {
      id: 1,
      title: 'Basketball',
      type: 'VARSITY SPORTS',
      teams: 'Men\'s & Women\'s Teams',
      icon: 'BB',
      color: 'bg-red-500',
      division: 'Division I • Conference Champions 2024',
      headCoach: 'Michael Reynolds (Men\'s), Sarah Johnson (Women\'s)',
      homeGames: 'University Arena (Capacity: 10,000)',
      record: 'Men\'s 18-7, Women\'s 21-4',
      upcomingGames: [
        { date: 'May 3', description: 'Women\'s vs. State University - Home, 2:00 PM' },
        { date: 'May 5', description: 'Men\'s vs. Tech Institute - Away, 7:00 PM' },
        { date: 'May 12', description: 'Women\'s Conference Finals - TBD, 5:00 PM' }
      ]
    },
    {
      id: 2,
      title: 'Soccer',
      type: 'VARSITY SPORTS',
      teams: 'Men\'s & Women\'s Teams',
      icon: 'SC',
      color: 'bg-green-500'
    },
    {
      id: 3,
      title: 'Volleyball',
      type: 'INTRAMURAL SPORTS',
      teams: 'Co-ed Leagues Available',
      icon: 'VB',
      color: 'bg-yellow-500'
    }
  ];

  // Clubs data
  const clubs = [
    {
      id: 1,
      name: 'Computer Science Society',
      type: 'Academic & Professional Organization',
      members: '87 Members',
      icon: 'CS',
      color: 'bg-green-500',
      status: 'Active',
      role: 'Member',
      nextMeeting: 'Next Meeting: May 2, 5:00 PM',
      about: 'The Computer Science Society is a student-led organization dedicated to expanding technical knowledge, professional development, and networking opportunities for students interested in computer science and technology.',
      upcomingEvents: [
        { date: 'May 2', description: 'Technical Workshop - "Introduction to AI" - Tech Lab 103, 5:00 PM' },
        { date: 'May 15', description: 'Industry Panel - "Careers in Tech" - Student Center, 6:30 PM' },
        { date: 'May 22', description: 'End of Year Social - Off-campus, 7:00 PM' }
      ]
    },
    {
      id: 2,
      name: 'Drama & Theater Club',
      type: 'Arts & Culture',
      members: '45 Members',
      icon: 'DT',
      color: 'bg-orange-500',
      role: 'Member',
      nextMeeting: 'Next Event: May 10, 7:00 PM'
    },
    {
      id: 3,
      name: 'Volunteer Corps',
      type: 'Community Service',
      members: '120 Members',
      icon: 'VC',
      color: 'bg-purple-500',
      role: 'Officer',
      nextMeeting: 'Next Project: May 5, 9:00 AM'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 mb-4 shadow-md">
        <h2 className="text-xl font-bold text-gray-800">Campus Life</h2>
        <p className="text-gray-600">5 Upcoming Events | Spring 2025 | Club: 3 Memberships</p>
      </div>
      <CampusLifeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'Events' && <EventsSection events={events} />}
      {activeTab === 'Clubs' && <ClubsSection clubs={clubs} />}
      {activeTab === 'Athletics' && <AthleticsSection sports={sports} />}
    </div>
  );
}