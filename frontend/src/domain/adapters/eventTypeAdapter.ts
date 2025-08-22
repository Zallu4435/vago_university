import { Event as ManagementEvent, EventRequest as ManagementEventRequest, EventRequestDetails, EventStatus } from '../types/management/eventmanagement';


export function adaptDomainEventToManagement(event: any): ManagementEvent {
  return {
    ...event,
    id: event.id || event._id || '',
    _id: event._id || event.id || '',
  };
}

export function adaptDomainEventRequestToManagement(request: ManagementEventRequest): ManagementEventRequest {
  return {
    ...request,
    id: request.id || request._id || '',
    _id: request._id || request.id || '',
  };
}

export function adaptManagementEventToDomain(event: ManagementEvent) {
  return {
    ...event,
    id: event.id,
    _id: event._id,
  };
}

export function adaptManagementEventRequestToDomain(request: ManagementEventRequest) {
  return {
    ...request,
    id: request.id,
    _id: request._id,
  };
}

export function isManagementEvent(item: ManagementEvent | ManagementEventRequest): item is ManagementEvent {
  return (item as ManagementEvent).title !== undefined;
}

export function isManagementEventRequest(item: ManagementEvent | ManagementEventRequest): item is ManagementEventRequest {
  return (item as ManagementEventRequest).eventName !== undefined;
}

export function adaptToEventRequestDetails(request: ManagementEventRequest): EventRequestDetails {
  return {
    id: request.id || request._id || '',
    status: request.status as EventStatus,
    createdAt: request.requestedAt || '',
    updatedAt: request.requestedAt || '', 
    description: request.description || '',
    additionalInfo: request.description,
    eventName: request.eventName,
    requestedBy: request.requestedBy || '',
    proposedDate: request.proposedDate,
    proposedVenue: request.proposedVenue,
    expectedParticipants: request.expectedParticipants,
    type: request.type,
    whyJoin: request.description || '',
    user: {
      name: request.requestedBy,
      email: request.requestedBy || '',
    },
    event: {
      title: request.eventName,
      location: request.proposedVenue,
      date: request.proposedDate,
      description: request.description,
    },
    requestedAt: request.requestedAt,
    eventRequest: {
      id: request.id || request._id || '',
      status: request.status as EventStatus,
      createdAt: request.requestedAt || '',
      updatedAt: request.requestedAt || '',
      description: request.description || '',
      additionalInfo: request.description,
      event: {
        id: request.id || request._id || '',
        name: request.eventName || '',
        type: request.type || '',
        description: request.description || '',
        expectedParticipants: request.expectedParticipants || 0,
        proposedDate: request.proposedDate,
        proposedVenue: request.proposedVenue,
      },
      user: {
        name: request.requestedBy,
        email: request.requestedBy || '',
      },
    },
  };
}
