import { Event, EventRequest, Filters } from '../../domain/types/management/eventmanagement';

export const filterEvents = (events: Event[], filters: Filters, searchTerm: string): Event[] => {
  return events.filter((event) => {
    const matchesSearch = searchTerm
      ? event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizerType?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesEventType =
      filters.eventType === 'All' || event.eventType?.toLowerCase() === filters.eventType.toLowerCase();

    const matchesStatus =
      filters.status === 'All' || event.status?.toLowerCase() === filters.status.toLowerCase();

    let matchesDateRange = true;
    if (filters.dateRange && filters.dateRange !== 'All' && event.date) {
      const eventDate = new Date(event.date);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - eventDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (filters.dateRange) {
        case 'Last Week':
          matchesDateRange = diffDays <= 7;
          break;
        case 'Last Month':
          matchesDateRange = diffDays <= 30;
          break;
        case 'Last 3 Months':
          matchesDateRange = diffDays <= 90;
          break;
        case 'Last 6 Months':
          matchesDateRange = diffDays <= 180;
          break;
        case 'Last Year':
          matchesDateRange = diffDays <= 365;
          break;
        default:
          matchesDateRange = true;
      }
    }

    return matchesSearch && matchesEventType && matchesStatus && matchesDateRange;
  });
};

export const filterEventRequests = (eventRequests: EventRequest[], filters: Filters, searchTerm: string): EventRequest[] => {
  return eventRequests.filter((request) => {
    const matchesSearch = searchTerm
      ? request.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requestedBy?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesEventType =
      filters.eventType === 'All' || request.type?.toLowerCase() === filters.eventType.toLowerCase();

    const matchesStatus =
      filters.status === 'All' || request.status?.toLowerCase() === filters.status.toLowerCase();

    let matchesDateRange = true;
    if (filters.dateRange && filters.dateRange !== 'All' && request.proposedDate) {
      const requestDate = new Date(request.proposedDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - requestDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (filters.dateRange) {
        case 'Last Week':
          matchesDateRange = diffDays <= 7;
          break;
        case 'Last Month':
          matchesDateRange = diffDays <= 30;
          break;
        case 'Last 3 Months':
          matchesDateRange = diffDays <= 90;
          break;
        case 'Last 6 Months':
          matchesDateRange = diffDays <= 180;
          break;
        case 'Last Year':
          matchesDateRange = diffDays <= 365;
          break;
        default:
          matchesDateRange = true;
      }
    }

    return matchesSearch && matchesEventType && matchesStatus && matchesDateRange;
  });
}; 