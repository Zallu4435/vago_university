import { Team, PlayerRequest, Filters } from '../../domain/types/management/sportmanagement';
import { SPORT_TYPES, TEAM_STATUSES, REQUEST_STATUSES, DATE_RANGES } from '../constants/sportManagementConstants';

// Filter teams based on search term and filters
export const filterTeams = (
  teams: Team[],
  searchTerm: string,
  filters: Filters
): Team[] => {
  return teams.filter((team) => {
    const matchesSearch = searchTerm
      ? team.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.headCoach.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    const matchesSportType = filters.sportType.toLowerCase() === 'all' || 
      team.type?.toLowerCase() === filters.sportType.toLowerCase();
    
    const matchesStatus = filters.status.toLowerCase() === 'all' || 
      team.status?.toLowerCase() === filters.status.toLowerCase();
    
    let matchesDateRange = true;
    if (filters.dateRange && filters.dateRange.toLowerCase() !== 'all' && team.createdAt) {
      const teamDate = new Date(team.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - teamDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (filters.dateRange.toLowerCase()) {
        case 'last_week':
          matchesDateRange = diffDays <= 7;
          break;
        case 'last_month':
          matchesDateRange = diffDays <= 30;
          break;
        case 'last_3_months':
          matchesDateRange = diffDays <= 90;
          break;
        case 'last_6_months':
          matchesDateRange = diffDays <= 180;
          break;
        case 'last_year':
          matchesDateRange = diffDays <= 365;
          break;
        default:
          matchesDateRange = true;
      }
    }
    
    return matchesSearch && matchesSportType && matchesStatus && matchesDateRange;
  });
};

// Filter player requests based on search term and filters
export const filterPlayerRequests = (
  playerRequests: PlayerRequest[],
  searchTerm: string,
  filters: Filters
): PlayerRequest[] => {
  return playerRequests.filter((request) => {
    const matchesSearch = searchTerm
      ? request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.teamName.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    const matchesSportType = filters.sportType.toLowerCase() === 'all' || 
      request.type?.toLowerCase() === filters.sportType.toLowerCase();
    
    const matchesStatus = filters.status.toLowerCase() === 'all' || 
      request.status?.toLowerCase() === filters.status.toLowerCase();
    
    let matchesDateRange = true;
    if (filters.dateRange && filters.dateRange.toLowerCase() !== 'all' && request.requestedDate) {
      const requestDate = new Date(request.requestedDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - requestDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (filters.dateRange.toLowerCase()) {
        case 'last_week':
          matchesDateRange = diffDays <= 7;
          break;
        case 'last_month':
          matchesDateRange = diffDays <= 30;
          break;
        case 'last_3_months':
          matchesDateRange = diffDays <= 90;
          break;
        case 'last_6_months':
          matchesDateRange = diffDays <= 180;
          break;
        case 'last_year':
          matchesDateRange = diffDays <= 365;
          break;
        default:
          matchesDateRange = true;
      }
    }
    
    return matchesSearch && matchesSportType && matchesStatus && matchesDateRange;
  });
};

// Reset filters to default values
export const resetFilters = (): Filters => ({
  sportType: 'all',
  status: 'all',
  dateRange: 'all'
});

// Format date range value for filter
export const formatDateRangeValue = (value: string): string => {
  return value.toLowerCase().replace(/\s+/g, '_');
};

// Get filter options based on active tab
export const getFilterOptions = (activeTab: 'teams' | 'requests') => {
  return {
    sportType: SPORT_TYPES,
    status: activeTab === 'teams' ? TEAM_STATUSES : REQUEST_STATUSES,
    dateRange: DATE_RANGES,
  };
}; 