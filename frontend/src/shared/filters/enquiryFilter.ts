import { Enquiry } from '../../domain/types/enquiry';

/**
 * Filters enquiries based on search query and status filter.
 * @param enquiries Array of Enquiry objects
 * @param searchQuery Search string
 * @param status Status filter (e.g., 'All Statuses', 'pending', etc.)
 */
export function filterEnquiries(
  enquiries: Enquiry[],
  searchQuery: string,
  status: string
): Enquiry[] {
  return enquiries.filter((enquiry) => {
    const matchesSearch =
      searchQuery === '' ||
      enquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = status === 'All Statuses' || enquiry.status === status;

    return matchesSearch && matchesStatus;
  });
} 