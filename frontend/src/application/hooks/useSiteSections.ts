import { useQuery } from '@tanstack/react-query';
import { siteSectionsService, SiteSectionsParams } from '../services/siteSections.service';

// Hook for fetching highlights with pagination and filtering
export const useHighlights = (params?: SiteSectionsParams) => {
  return useQuery({
    queryKey: ['site-highlights', params],
    queryFn: () => siteSectionsService.getHighlights(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Hook for fetching VAGO Now with pagination and filtering
export const useVagoNow = (params?: SiteSectionsParams) => {
  return useQuery({
    queryKey: ['site-vago-now', params],
    queryFn: () => siteSectionsService.getVagoNow(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Hook for fetching leadership with pagination and filtering
export const useLeadership = (params?: SiteSectionsParams) => {
  return useQuery({
    queryKey: ['site-leadership', params],
    queryFn: () => siteSectionsService.getLeadership(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Generic hook for fetching any section type with pagination and filtering
export const useSiteSections = (sectionKey: 'highlights' | 'vagoNow' | 'leadership', params?: SiteSectionsParams) => {
  return useQuery({
    queryKey: ['site-sections', sectionKey, params],
    queryFn: () => siteSectionsService.getSectionsByType(sectionKey, params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Hook for infinite scroll with server-side filtering
export const useInfiniteHighlights = (searchQuery: string, selectedCategory: string, page: number) => {
  const params: SiteSectionsParams = {
    limit: 10,
    page,
    search: searchQuery || undefined,
    category: selectedCategory === 'all' ? undefined : selectedCategory,
  };

  return useQuery({
    queryKey: ['site-highlights-infinite', searchQuery, selectedCategory, page],
    queryFn: () => siteSectionsService.getHighlights(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Hook for infinite scroll with server-side filtering for VAGO Now
export const useInfiniteVagoNow = (searchQuery: string, selectedCategory: string, page: number) => {
  const params: SiteSectionsParams = {
    limit: 10,
    page,
    search: searchQuery || undefined,
    category: selectedCategory === 'all' ? undefined : selectedCategory,
  };

  return useQuery({
    queryKey: ['site-vago-now-infinite', searchQuery, selectedCategory, page],
    queryFn: () => siteSectionsService.getVagoNow(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Hook for infinite scroll with server-side filtering for Leadership
export const useInfiniteLeadership = (searchQuery: string, selectedCategory: string, page: number) => {
  const params: SiteSectionsParams = {
    limit: 10,
    page,
    search: searchQuery || undefined,
    category: selectedCategory === 'all' ? undefined : selectedCategory,
  };

  return useQuery({
    queryKey: ['site-leadership-infinite', searchQuery, selectedCategory, page],
    queryFn: () => siteSectionsService.getLeadership(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Hook for getting all categories (for filter dropdown)
export const useHighlightsCategories = () => {
  return useQuery({
    queryKey: ['site-highlights-categories'],
    queryFn: async () => {
      // Get a large number of highlights to extract all categories
      const highlights = await siteSectionsService.getHighlights({ limit: 100 });
      const categories = highlights
        .map(h => h.category)
        .filter((category): category is string => Boolean(category));
      return ['all', ...Array.from(new Set(categories))];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};

// Hook for getting all categories for VAGO Now
export const useVagoNowCategories = () => {
  return useQuery({
    queryKey: ['site-vago-now-categories'],
    queryFn: async () => {
      // Get a large number of VAGO Now items to extract all categories
      const vagoNowItems = await siteSectionsService.getVagoNow({ limit: 100 });
      const categories = vagoNowItems
        .map(item => item.category)
        .filter((category): category is string => Boolean(category));
      return ['all', ...Array.from(new Set(categories))];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};

// Hook for getting all categories for Leadership
export const useLeadershipCategories = () => {
  return useQuery({
    queryKey: ['site-leadership-categories'],
    queryFn: async () => {
      // Get a large number of leadership items to extract all categories
      const leadershipItems = await siteSectionsService.getLeadership({ limit: 100 });
      const categories = leadershipItems
        .map(item => item.category)
        .filter((category): category is string => Boolean(category));
      return ['all', ...Array.from(new Set(categories))];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};

// Combined hook for all sections (home page use)
export const useAllSiteSections = () => {
  const highlights = useHighlights({ limit: 4 }); // Limit to 4 for home
  const vagoNow = useVagoNow({ limit: 5 }); // Limit to 5 for home
  const leadership = useLeadership({ limit: 3 }); // Limit to 3 for home

  return {
    highlights,
    vagoNow,
    leadership,
    isLoading: highlights.isLoading || vagoNow.isLoading || leadership.isLoading,
    error: highlights.error || vagoNow.error || leadership.error,
  };
}; 