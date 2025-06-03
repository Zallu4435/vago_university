interface PaginatedResponseDTO<T> {
    data: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }
  
  export interface SimplifiedClubRequestDTO {
    clubName: string;
    requestedId: string;
    requestedBy: string;
    type: string;
    requestedAt: string;
    status: string;
  }
  
  export interface GetClubRequestsResponseDTO extends PaginatedResponseDTO<SimplifiedClubRequestDTO> {
    data: SimplifiedClubRequestDTO[];
  }
  
  export interface ClubRequestDetailsDTO {
    id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    whyJoin: string;
    additionalInfo: string;
    club: {
      id: string;
      name: string;
      type: string;
      about: string;
      nextMeeting: string;
      enteredMembers: number;
    };
    user?: {
      id: string;
      name: string;
      email: string;
    };
  }
  
  export interface GetClubRequestDetailsResponseDTO {
    clubRequest: ClubRequestDetailsDTO;
  }