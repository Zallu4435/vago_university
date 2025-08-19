import { Club as DomainClub, ClubRequest as DomainClubRequest } from '../types/management/clubmanagement';
import { Club as ManagementClub, ClubRequest as ManagementClubRequest } from '../types/management/clubmanagement';

export function adaptDomainClubToManagement(club: DomainClub): ManagementClub {
  return {
    ...club,
    id: club.id || club._id || '',
    _id: club._id || club.id || '',
  };
}

export function adaptDomainClubRequestToManagement(request: DomainClubRequest): ManagementClubRequest {
  return {
    ...request,
    _id: request._id || request.requestedId || '',
    requestedId: request.requestedId || request._id || '',
  };
}

export function adaptManagementClubToDomain(club: ManagementClub): DomainClub {
  return {
    ...club,
    id: club.id,
    _id: club._id,
  };
}

export function adaptManagementClubRequestToDomain(request: ManagementClubRequest): DomainClubRequest {
  return {
    ...request,
    _id: request._id,
    requestedId: request.requestedId,
  };
}

export function isDomainClub(item: DomainClub | DomainClubRequest): item is DomainClub {
  return (item as DomainClub).createdBy !== undefined;
}

export function isDomainClubRequest(item: DomainClub | DomainClubRequest): item is DomainClubRequest {
  return (item as DomainClubRequest).requestedId !== undefined;
}

export function adaptToClubRequestDetails(request: DomainClubRequest) {
  return {
    clubRequest: {
      id: request.requestedId || request._id || '',
      status: request.status,
      createdAt: request.createdAt,
      updatedAt: request.createdAt,
      whyJoin: request.about || '',
      additionalInfo: request.about,
      club: {
        id: request.requestedId || request._id || '',
        name: request.name,
        type: request.type,
        about: request.about,
        enteredMembers: parseInt(request.members) || 0,
        nextMeeting: request.nextMeeting,
      },
      user: {
        name: request.requestedBy,
        email: request.requestedBy,
      },
    },
  };
}
