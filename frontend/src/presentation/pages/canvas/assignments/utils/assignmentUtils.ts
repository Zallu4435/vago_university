import { Assignment, SortOption, FilterStatus } from '../types/AssignmentTypes';

export const getDaysLeft = (dueDate: Date): number => {
  const now = new Date();
  const diff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
};

export const formatDueDate = (dueDate: Date): string => {
  return dueDate.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusColor = (status: Assignment['status'], isLate: boolean = false, styles: any) => {
  if (isLate) return `${styles.status.error} ${styles.button.primary}`;
  switch (status) {
    case 'pending': return `${styles.status.warning} ${styles.button.primary}`;
    case 'submitted': return `${styles.status.info} ${styles.button.primary}`;
    case 'graded': return `${styles.status.success} ${styles.button.primary}`;
    default: return `${styles.button.secondary}`;
  }
};

export const getUrgencyColor = (urgency: Assignment['urgency'], daysLeft: number, styles: any) => {
  if (urgency === 'urgent' || daysLeft <= 2) return `${styles.status.error} ${styles.button.primary}`;
  return `${styles.status.success} ${styles.button.primary}`;
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
                           assignment.course.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || assignment.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate': return a.dueDate.getTime() - b.dueDate.getTime();
        case 'priority': return b.priority - a.priority;
        case 'status': return a.status.localeCompare(b.status);
        case 'course': return a.course.localeCompare(b.course);
        default: return 0;
      }
    });
}; 