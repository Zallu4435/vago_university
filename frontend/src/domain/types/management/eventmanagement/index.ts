export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  organizerType: string;
  eventType: string;
  icon: string;
  color: string;
  description: string;
  fullTime: boolean;
  additionalInfo?: string;
  requirements?: string;
  status: string;
  maxParticipants: number;
  registrationRequired: boolean;
  createdAt: string;
  organizer: string;

  _id?: string;
  _title?: string;
  _date?: string;
  _time?: string;
  _location?: string;
  _organizerType?: string;
  _eventType?: string;
  _icon?: string;
  _color?: string;
  _description?: string;
  _fullTime?: boolean;
  _additionalInfo?: string;
  _requirements?: string;
  _status?: string;
  _maxParticipants?: number;
  _registrationRequired?: boolean;
  _organizer?: string;
  _participants?: number;
  _timeframe?: string;
}

export interface EventRequest {
  id: string;
  requestedId?: string; 
  eventId?: string;
  eventName?: string;
  requestedBy?: string;
  requesterType?: string;
  type?: string;
  proposedDate?: string;
  proposedVenue?: string;
  status: string;
  requestedAt?: string;
  description: string;
  expectedParticipants?: number;
  createdAt?: string;
  updatedAt?: string;
  whyJoin?: string;
  additionalInfo?: string;
  
  event?: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };

  _id?: string;
  _title?: string;
  _date?: string;
  _time?: string;
  _location?: string;
  _organizerType?: string;
  _eventType?: string;
  _icon?: string;
  _color?: string;
  _description?: string;
  _fullTime?: boolean;
  _additionalInfo?: string;
  _requirements?: string;
  _status?: string;
  _maxParticipants?: number;
  _registrationRequired?: boolean;
  _organizer?: string;
  _participants?: number;
  _timeframe?: string;
}

export interface EventApiResponse {
  data: {
    events: Event[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
  };
}

// API Response for event requests
export interface EventRequestsApiResponse {
  data: {
    eventRequests: EventRequest[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
  };
}

export interface EventServiceResponse {
  events: Event[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface EventRequestsServiceResponse {
  eventRequests: EventRequest[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface EventApiResponseSingle {
  data: {
    event: Event;
  };
}

export interface EventRequestApiResponseSingle {
  data: {
    eventRequest: EventRequest;
  };
}

export type EventStatus = 'upcoming' | 'completed' | 'cancelled' | 'pending' | 'approved' | 'rejected';
export type EventType = 'academic' | 'cultural' | 'sports' | 'social' | 'workshop' | 'conference' | 'seminar';
export type OrganizerType = 'department' | 'club' | 'student' | 'faculty' | 'admin';

export interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | EventRequest | null;
  onEdit?: (event: Event) => void;
}

export interface EventDetailsStatusBadgeProps {
  status: string;
}

export interface EventDetailsInfoCardProps {
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  label: string;
  value: string;
}

export interface EventFormData {
  title: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  organizerType: 'department' | 'club' | 'student' | 'administration' | 'external';
  eventType: 'workshop' | 'seminar' | 'fest' | 'competition' | 'exhibition' | 'conference' | 'hackathon' | 'cultural' | 'sports' | 'academic';
  timeframe?: string;
  icon: string;
  color: string;
  description?: string;
  fullTime: boolean;
  additionalInfo?: string;
  requirements?: string;
  maxParticipants: number;
  registrationRequired: boolean;
}

export interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
  initialData?: Partial<EventFormData>;
  isEditing?: boolean;
}

export interface EventAction {
  id: string;
  type: 'event' | 'request';
  action: 'delete' | 'reject' | 'approve' | 'edit';
}

export interface EventActionConfig {
  icon: React.ReactNode;
  label: string;
  onClick: (item: Event | EventRequest) => void;
  color: 'blue' | 'green' | 'red' | 'yellow';
  disabled?: boolean | ((item: Event | EventRequest) => boolean);
}

export interface EventColumn {
  header: string;
  key: string;
  render: (item: Event | EventRequest) => React.ReactNode;
  width?: string;
}

export interface EventFilters {
  status?: EventStatus;
  type?: EventType;
  organizerType?: OrganizerType;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface Filters {
  [key: string]: string;
  eventType: string;
  dateRange: string;
  status: string;
}

export interface ItemToAction {
  id: string;
  type: 'event' | 'eventRequest';
  action: 'delete' | 'reject' | 'approve';
}

export interface EventRequestDetails {
  id: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
  description: string;
  additionalInfo?: string;
  eventName?: string;
  requestedBy: string;
  proposedDate?: string;
  proposedVenue?: string;
  expectedParticipants?: number;
  type?: string;
  whyJoin?: string;
  user?: {
    name?: string;
    email: string;
  };
  event?: {
    title?: string;
    location?: string;
    date?: string;
    description?: string;
  };
  requestedAt?: string;
  eventRequest: {
    id: string;
    status: EventStatus;
    createdAt: string;
    updatedAt: string;
    description: string;
    additionalInfo?: string;
    event: {
      id: string;
      name: string;
      type: string;
      description: string;
      expectedParticipants: number;
      proposedDate?: string;
      proposedVenue?: string;
    };
    user: {
      name?: string;
      email: string;
    };
  };
}

export interface EventRequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: EventRequest | null;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export interface EventRequestDetailsStatusBadgeProps {
  status: EventStatus;
}

export interface EventRequestDetailsInfoCardProps {
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  label: string;
  value: string;
  highlight?: boolean;
}

export interface ParticleConfig {
  size: number;
  top: number;
  left: number;
  animDuration: number;
  animDelay: number;
}

export interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  cancelledEvents: number;
  totalParticipants: number;
  averageParticipants: number;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  registeredAt: string;
  status: 'registered' | 'attended' | 'cancelled';
}

export interface EventRegistrationProps {
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
}

export interface TimeframeOption {
  value: string;
  label: string;
  emoji: string;
}

export interface OrganizerTypeOption {
  value: string;
  label: string;
  emoji: string;
}

export interface EventTypeOption {
  value: string;
  label: string;
  emoji: string;
}

export interface IconOption {
  icon: string;
  index: number;
}

export interface ColorOption {
  color: string;
} 

export interface Filters {
  eventType: string;
  dateRange: string;
  status: string;
  organizerType: string;
}