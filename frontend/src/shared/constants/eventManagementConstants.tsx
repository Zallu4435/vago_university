import React from 'react';

// Event Management Constants
export const EVENT_TYPES = ['All', 'Workshop', 'Seminar', 'Fest', 'Competition', 'Exhibition'] as const;
export const EVENT_STATUSES = ['All', 'Upcoming', 'Completed', 'Cancelled'] as const;
export const REQUEST_STATUSES = ['All', 'Pending', 'Approved', 'Rejected'] as const;
export const DATE_RANGES = ['All', 'Last Week', 'Last Month', 'Last 3 Months', 'Last 6 Months', 'Last Year'] as const;
export const ORGANIZERS = ['All', 'Department', 'Club', 'Student'] as const;

// Event Type Options for Forms
export const EVENT_TYPE_OPTIONS = [
  { value: 'workshop', label: 'Workshop', emoji: '🔧' },
  { value: 'seminar', label: 'Seminar', emoji: '📚' },
  { value: 'fest', label: 'Fest', emoji: '🎉' },
  { value: 'competition', label: 'Competition', emoji: '🏆' },
  { value: 'exhibition', label: 'Exhibition', emoji: '🎨' },
  { value: 'conference', label: 'Conference', emoji: '🎤' },
  { value: 'hackathon', label: 'Hackathon', emoji: '💻' },
  { value: 'cultural', label: 'Cultural', emoji: '🎭' },
  { value: 'sports', label: 'Sports', emoji: '⚽' },
  { value: 'academic', label: 'Academic', emoji: '🎓' },
] as const;

// Organizer Type Options for Forms
export const ORGANIZER_TYPE_OPTIONS = [
  { value: 'department', label: 'Department', emoji: '🏢' },
  { value: 'club', label: 'Club', emoji: '🎪' },
  { value: 'student', label: 'Student', emoji: '👨‍🎓' },
  { value: 'administration', label: 'Administration', emoji: '👔' },
  { value: 'external', label: 'External', emoji: '🌐' },
] as const;

// Timeframe Options for Forms
export const TIMEFRAME_OPTIONS = [
  { value: 'morning', label: 'Morning (9 AM - 12 PM)', emoji: '🌅' },
  { value: 'afternoon', label: 'Afternoon (12 PM - 5 PM)', emoji: '☀️' },
  { value: 'evening', label: 'Evening (5 PM - 9 PM)', emoji: '🌆' },
  { value: 'full-day', label: 'Full Day (9 AM - 6 PM)', emoji: '📅' },
  { value: 'multi-day', label: 'Multi-Day Event', emoji: '📆' },
] as const;

// Icon Options for Events
export const EVENT_ICONS = [
  '🎓', '🎉', '🏆', '🎨', '🎭', '🎤', '🎵', '🎬', '📚', '🔬',
  '💻', '⚽', '🏀', '🎾', '🏈', '⚾', '🎯', '🎪', '🎨', '🎭',
  '🎤', '🎵', '🎬', '📚', '🔬', '💻', '⚽', '🏀', '🎾', '🏈'
] as const;

// Color Options for Events
export const EVENT_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1',
  '#14B8A6', '#FBBF24', '#F87171', '#A78BFA', '#22D3EE',
  '#4ADE80', '#FB923C', '#F472B6', '#818CF8', '#2DD4BF'
] as const;

// Status Badge Colors
export const STATUS_BADGE_COLORS = {
  upcoming: 'bg-blue-900/30 text-blue-400 border-blue-500/30',
  completed: 'bg-green-900/30 text-green-400 border-green-500/30',
  cancelled: 'bg-red-900/30 text-red-400 border-red-500/30',
  pending: 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30',
  approved: 'bg-green-900/30 text-green-400 border-green-500/30',
  rejected: 'bg-red-900/30 text-red-400 border-red-500/30',
} as const;

// Event Statistics Labels
export const EVENT_STATS_LABELS = {
  totalEvents: 'Total Events',
  upcomingEvents: 'Upcoming Events',
  completedEvents: 'Completed Events',
  cancelledEvents: 'Cancelled Events',
  totalParticipants: 'Total Participants',
  averageParticipants: 'Average Participants',
} as const;

// Form Validation Messages
export const EVENT_VALIDATION_MESSAGES = {
  titleRequired: 'Event title is required',
  dateRequired: 'Event date is required',
  timeRequired: 'Event time is required',
  locationRequired: 'Event location is required',
  organizerRequired: 'Event organizer is required',
  organizerTypeRequired: 'Organizer type is required',
  eventTypeRequired: 'Event type is required',
  descriptionRequired: 'Event description is required',
  maxParticipantsRequired: 'Maximum participants is required',
  maxParticipantsPositive: 'Maximum participants must be a positive number',
  invalidDate: 'Please select a valid date',
  invalidTime: 'Please select a valid time',
} as const;

// Success Messages
export const EVENT_SUCCESS_MESSAGES = {
  eventCreated: 'Event created successfully',
  eventUpdated: 'Event updated successfully',
  eventDeleted: 'Event deleted successfully',
  requestApproved: 'Event request approved',
  requestRejected: 'Event request rejected',
} as const;

// Error Messages
export const EVENT_ERROR_MESSAGES = {
  fetchEventsFailed: 'Failed to fetch events',
  fetchRequestsFailed: 'Failed to fetch event requests',
  createEventFailed: 'Failed to create event',
  updateEventFailed: 'Failed to update event',
  deleteEventFailed: 'Failed to delete event',
  approveRequestFailed: 'Failed to approve request',
  rejectRequestFailed: 'Failed to reject request',
  fetchEventDetailsFailed: 'Failed to fetch event details',
  fetchRequestDetailsFailed: 'Failed to fetch request details',
} as const;

// Table Column Definitions
export const getEventColumns = (
  Calendar: React.ComponentType<{ size?: number | string; className?: string }>,
  MapPin: React.ComponentType<{ size?: number | string; className?: string }>,
  Building: React.ComponentType<{ size?: number | string; className?: string }>,
  GraduationCap: React.ComponentType<{ size?: number | string; className?: string }>,
  User: React.ComponentType<{ size?: number | string; className?: string }>,
  formatDate: (date: string) => string
) => [
  {
    header: 'Event',
    key: 'title',
    render: (event: any) => (
      <div>
        <p className="font-medium text-gray-200">{event.title}</p>
        <p className="text-xs text-gray-400">ID: {event.id?.slice(0, 7)}</p>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Organizer Type',
    key: 'organizerType',
    render: (event: any) => (
      <div className="flex items-center text-gray-300">
        {event.organizerType?.toLowerCase() === 'department' ? (
          <Building size={14} className="text-purple-400 mr-2" />
        ) : event.organizerType?.toLowerCase() === 'club' ? (
          <GraduationCap size={14} className="text-purple-400 mr-2" />
        ) : (
          <User size={14} className="text-purple-400 mr-2" />
        )}
        <div>
          <p className="text-sm capitalize">{event.organizerType}</p>
        </div>
      </div>
    ),
  },
  {
    header: 'Type',
    key: 'eventType',
    render: (event: any) => (
      <div className="text-sm text-gray-300 capitalize">{event.eventType}</div>
    ),
  },
  {
    header: 'Date & Time',
    key: 'date',
    render: (event: any) => (
      <div className="flex items-center text-gray-300">
        <Calendar size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{formatDate(event.date)}</span>
      </div>
    ),
  },
  {
    header: 'Venue',
    key: 'location',
    render: (event: any) => (
      <div className="flex items-center text-gray-300">
        <MapPin size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{event.location}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (event: any) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${event.status === 'upcoming'
            ? 'bg-blue-900/30 text-blue-400 border-blue-500/30'
            : event.status === 'completed'
              ? 'bg-green-900/30 text-green-400 border-green-500/30'
              : 'bg-red-900/30 text-red-400 border-red-500/30'
          }`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full mr-1.5"
          style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
        ></span>
        {event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
      </span>
    ),
  },
];

export const getEventRequestColumns = (
  Calendar: React.ComponentType<{ size?: number | string; className?: string }>,
  Building: React.ComponentType<{ size?: number | string; className?: string }>,
  GraduationCap: React.ComponentType<{ size?: number | string; className?: string }>,
  User: React.ComponentType<{ size?: number | string; className?: string }>,
  formatDate: (date: string) => string
) => [
  {
    header: 'Request',
    key: 'eventName',
    render: (request: any) => (
      <div>
        <p className="font-medium text-gray-200">{request.eventName}</p>
        <p className="text-xs text-gray-400">ID: {request.id?.slice(0, 7)}</p>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Requested By',
    key: 'requestedBy',
    render: (request: any) => (
      <div className="flex items-center text-gray-300">
        {request.requesterType?.toLowerCase() === 'department' ? (
          <Building size={14} className="text-purple-400 mr-2" />
        ) : request.requesterType?.toLowerCase() === 'club' ? (
          <GraduationCap size={14} className="text-purple-400 mr-2" />
        ) : (
          <User size={14} className="text-purple-400 mr-2" />
        )}
        <div>
          <p className="text-sm">{request.requestedBy}</p>
          <p className="text-xs text-gray-400 capitalize">{request?.requesterType}</p>
        </div>
      </div>
    ),
  },
  {
    header: 'Type',
    key: 'type',
    render: (request: any) => (
      <div className="text-sm text-gray-300 capitalize">{request.type}</div>
    ),
  },
  {
    header: 'Proposed Date',
    key: 'proposedDate',
    render: (request: any) => (
      <div className="flex items-center text-gray-300">
        <Calendar size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{formatDate(request.proposedDate)}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (request: any) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${request.status === 'pending'
            ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
            : request.status === 'approved'
              ? 'bg-green-900/30 text-green-400 border-green-500/30'
              : 'bg-red-900/30 text-red-400 border-red-500/30'
          }`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full mr-1.5"
          style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
        ></span>
        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
      </span>
    ),
  },
]; 