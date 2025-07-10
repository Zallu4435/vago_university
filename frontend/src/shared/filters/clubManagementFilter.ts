import { Club, ClubRequest } from '../../domain/types/clubmanagement';

export function filterClubs(
  clubs: Club[],
  searchQuery: string,
  filters: { category: string; status: string; dateRange: string }
): Club[] {
  return clubs.filter((club) => {
    const matchesSearch = searchQuery
      ? club.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.createdBy?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesCategory =
      filters.category === 'All' || club.type?.toLowerCase() === filters.category.toLowerCase();
    
    const matchesStatus =
      filters.status === 'All' || club.status?.toLowerCase() === filters.status.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
}

export function filterClubRequests(
  clubRequests: ClubRequest[],
  searchQuery: string,
  filters: { category: string; status: string; dateRange: string }
): ClubRequest[] {
  return clubRequests.filter((request) => {
    const matchesSearch = searchQuery
      ? request.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.requestedBy?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesCategory =
      filters.category === 'All' || request.type?.toLowerCase() === filters.category.toLowerCase();
    
    const matchesStatus =
      filters.status === 'All' || request.status?.toLowerCase() === filters.status.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
} 