interface PaginatedResponseDTO<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface SimplifiedEventRequestDTO {
  eventName: string;
  requestedId: string;
  requestedBy: string;
  type: string;
  requestedDate: string;
  status: string;
  proposedDate: string;
}

export interface GetEventRequestsResponseDTO extends PaginatedResponseDTO<SimplifiedEventRequestDTO> {
  data: SimplifiedEventRequestDTO[];
}

export interface EventRequestDetailsDTO {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  whyJoin: string;
  additionalInfo: string;
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    participantsCount: number;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface GetEventRequestDetailsResponseDTO {
  eventRequest: EventRequestDetailsDTO;
}