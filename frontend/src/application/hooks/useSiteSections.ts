import { useQuery } from '@tanstack/react-query';
import { siteSectionsService, SiteSectionsParams } from '../services/siteSections.service';

export const useHighlights = (params?: SiteSectionsParams) => {
  return useQuery({
    queryKey: ['site-highlights', params],
    queryFn: () => siteSectionsService.getHighlights(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useVagoNow = (params?: SiteSectionsParams) => {
  return useQuery({
    queryKey: ['site-vago-now', params],
    queryFn: () => siteSectionsService.getVagoNow(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useLeadership = (params?: SiteSectionsParams) => {
  return useQuery({
    queryKey: ['site-leadership', params],
    queryFn: () => siteSectionsService.getLeadership(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSiteSections = (sectionKey: 'highlights' | 'vagoNow' | 'leadership', params?: SiteSectionsParams) => {
  return useQuery({
    queryKey: ['site-sections', sectionKey, params],
    queryFn: () => siteSectionsService.getSectionsByType(sectionKey, params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

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
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

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
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

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
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useHighlightsCategories = () => {
  return useQuery({
    queryKey: ['site-highlights-categories'],
    queryFn: async () => {
      const highlights = await siteSectionsService.getHighlights({ limit: 100 });
      const categories = highlights
        .map(h => h.category)
        .filter((category): category is string => Boolean(category));
      return ['all', ...Array.from(new Set(categories))];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
};

export const useVagoNowCategories = () => {
  return useQuery({
    queryKey: ['site-vago-now-categories'],
    queryFn: async () => {
      const vagoNowItems = await siteSectionsService.getVagoNow({ limit: 100 });
      const categories = vagoNowItems
        .map(item => item.category)
        .filter((category): category is string => Boolean(category));
      return ['all', ...Array.from(new Set(categories))];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
};

export const useLeadershipCategories = () => {
  return useQuery({
    queryKey: ['site-leadership-categories'],
    queryFn: async () => {
      const leadershipItems = await siteSectionsService.getLeadership({ limit: 100 });
      const categories = leadershipItems
        .map(item => item.category)
        .filter((category): category is string => Boolean(category));
      return ['all', ...Array.from(new Set(categories))];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
};

export const useAllSiteSections = () => {
  const highlights = useHighlights({ limit: 4 });
  const vagoNow = useVagoNow({ limit: 5 });
  const leadership = useLeadership({ limit: 3 });

  return {
    highlights,
    vagoNow,
    leadership,
    isLoading: highlights.isLoading || vagoNow.isLoading || leadership.isLoading,
    error: highlights.error || vagoNow.error || leadership.error,
  };
}; 