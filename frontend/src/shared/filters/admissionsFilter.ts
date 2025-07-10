import { User } from "../../domain/types/management/usermanagement";

export function filterAdmissions(
  users: User[],
  searchQuery: string,
  filters: { status: string; program: string; dateRange: string },
  customDateRange: { startDate: string; endDate: string }
): User[] {
  return users?.filter((user) => {
    const fullName = user.fullName || '';
    const email = user.email || '';
    const nameMatch = fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = email.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter - simplified
    const statusMatch =
      !filters.status ||
      filters.status === 'all' ||
      user.status.toLowerCase() === filters.status.toLowerCase();

    // Program filter - simplified
    const programMatch =
      !filters.program ||
      filters.program === 'all' ||
      user.program?.toLowerCase() === filters.program.toLowerCase();

    // Date filter - simplified
    const dateMatch =
      !filters.dateRange ||
      filters.dateRange === 'all' ||
      (customDateRange.startDate &&
        customDateRange.endDate &&
        new Date(user.createdAt) >= new Date(customDateRange.startDate) &&
        new Date(user.createdAt) <= new Date(customDateRange.endDate)) ||
      (filters.dateRange === 'last_week' &&
        new Date(user.createdAt) >= new Date(new Date().setDate(new Date().getDate() - 7))) ||
      (filters.dateRange === 'last_month' &&
        new Date(user.createdAt) >= new Date(new Date().setMonth(new Date().getMonth() - 1))) ||
      (filters.dateRange === 'last_3_months' &&
        new Date(user.createdAt) >= new Date(new Date().setMonth(new Date().getMonth() - 3)));

    return (nameMatch || emailMatch) && statusMatch && programMatch && dateMatch;
  });
} 