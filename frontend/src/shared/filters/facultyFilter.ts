import { Faculty } from "../../domain/types/management/facultyManagement";

export function filterFaculty(
  faculty: Faculty[],
  searchQuery: string,
  filters: { status: string; department: string; dateRange: string },
  customDateRange: { startDate: string; endDate: string }
): Faculty[] {
  return faculty?.filter((member) => {
    const fullName = member.fullName || '';
    const email = member.email || '';
    const nameMatch = fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = email.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch =
      filters.status === 'all' ||
      member.status.toLowerCase() === filters.status.toLowerCase();
    const departmentMatch =
      filters.department === 'all_departments' ||
      member.department.toLowerCase().replace(/\s+/g, '_') === filters.department;
    const dateMatch =
      filters.dateRange === 'all' ||
      (customDateRange.startDate &&
        customDateRange.endDate &&
        new Date(member.createdAt) >= new Date(customDateRange.startDate) &&
        new Date(member.createdAt) <= new Date(customDateRange.endDate)) ||
      (filters.dateRange === 'last_week' &&
        new Date(member.createdAt) >=
          new Date(new Date().setDate(new Date().getDate() - 7))) ||
      (filters.dateRange === 'last_month' &&
        new Date(member.createdAt) >=
          new Date(new Date().setMonth(new Date().getMonth() - 1))) ||
      (filters.dateRange === 'last_3_months' &&
        new Date(member.createdAt) >=
          new Date(new Date().setMonth(new Date().getMonth() - 3)));
    return (nameMatch || emailMatch) && statusMatch && departmentMatch && dateMatch;
  });
} 