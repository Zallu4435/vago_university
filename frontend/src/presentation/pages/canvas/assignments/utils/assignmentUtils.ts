import { Assignment, SortOption, FilterStatus } from '../types/AssignmentTypes';

export const getDaysLeft = (dueDate: string): number => {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
};

export const formatDueDate = (dueDate: string): string => {
  const date = new Date(dueDate);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusColor = (status: Assignment['status'] | 'needs_correction', styles: any) => {
  switch (status) {
    case 'draft': return `${styles?.status.warning} ${styles?.button.primary}`;
    case 'published': return `${styles?.status.info} ${styles?.button.primary}`;
    case 'submitted': return `${styles?.status.success} ${styles?.button.primary}`;
    case 'graded': return `${styles?.status.success} ${styles?.button.primary}`;
    case 'needs_correction': return `${styles?.status.error} ${styles?.button.primary}`;
    default: return `${styles?.button.secondary}`;
  }
};

export const filterAndSortAssignments = (
  assignments: Assignment[],
  searchTerm: string,
  filterStatus: FilterStatus,
  sortBy: SortOption
) => {
  return assignments
    .filter(assignment => {
      const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Determine actual status based on submission
      const getActualStatus = (assignment: Assignment) => {
        if (assignment.submission) {
          if (assignment.submission.status === 'reviewed') {
            return 'graded';
          } else if (assignment.submission.status === 'pending') {
            return 'submitted';
          } else if (assignment.submission.status === 'late') {
            return 'submitted';
          } else if (assignment.submission.status === 'needs_correction') {
            return 'needs_correction';
          }
        }
        return assignment.status;
      };

      const actualStatus = getActualStatus(assignment);
      const matchesFilter = filterStatus === 'all' || actualStatus === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate': 
          const dateA = new Date(a.dueDate).getTime();
          const dateB = new Date(b.dueDate).getTime();
          return dateA - dateB;
        case 'priority': 
          return (b.totalSubmissions || 0) - (a.totalSubmissions || 0);
        case 'status': 
          const statusA = a.submission ? (a.submission.status === 'reviewed' ? 'graded' : 'submitted') : a.status;
          const statusB = b.submission ? (b.submission.status === 'reviewed' ? 'graded' : 'submitted') : b.status;
          return statusA.localeCompare(statusB);
        case 'course': 
          return (a.subject || '').localeCompare(b.subject || '');
        default: 
          return 0;
      }
    });
}; 