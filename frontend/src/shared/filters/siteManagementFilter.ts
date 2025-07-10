import { SiteSection } from '../../application/services/siteManagement.service';

interface DateFilters {
  startDate?: string;
  endDate?: string;
}

export function filterSiteSections(
  sections: SiteSection[],
  filters: { [key: string]: string },
  searchQuery: string,
  dateFilters: DateFilters
): SiteSection[] {
  return sections.filter(item => {
    // Global search
    if (searchQuery && !Object.values(item).some(val => String(val).toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }

    // Field filters
    for (const key in filters) {
      if (filters[key] && String(item[key as keyof SiteSection] ?? '').toLowerCase() !== filters[key].toLowerCase()) {
        return false;
      }
    }

    // Date filters
    if (dateFilters.startDate || dateFilters.endDate) {
      const itemDate = new Date(item.createdAt);
      const startDate = dateFilters.startDate ? new Date(dateFilters.startDate) : null;
      const endDate = dateFilters.endDate ? new Date(dateFilters.endDate) : null;

      if (startDate && itemDate < startDate) {
        return false;
      }
      if (endDate && itemDate > endDate) {
        return false;
      }
    }

    return true;
  });
} 