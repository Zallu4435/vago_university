import { useQuery } from '@tanstack/react-query';
import { siteSectionsService, SiteSection } from '../services/siteSections.service';

// Hook for fetching highlights with pagination
export const useHighlights = (limit?: number, page?: number) => {
  return useQuery({
    queryKey: ['site-highlights', limit, page],
    queryFn: () => siteSectionsService.getHighlights(limit, page),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Hook for fetching VAGO Now with pagination
export const useVagoNow = (limit?: number, page?: number) => {
  return useQuery({
    queryKey: ['site-vago-now', limit, page],
    queryFn: () => siteSectionsService.getVagoNow(limit, page),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Hook for fetching leadership with pagination
export const useLeadership = (limit?: number, page?: number) => {
  return useQuery({
    queryKey: ['site-leadership', limit, page],
    queryFn: () => siteSectionsService.getLeadership(limit, page),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Generic hook for fetching any section type with pagination
export const useSiteSections = (sectionKey: 'highlights' | 'vagoNow' | 'leadership', limit?: number, page?: number) => {
  return useQuery({
    queryKey: ['site-sections', sectionKey, limit, page],
    queryFn: () => siteSectionsService.getSectionsByType(sectionKey, limit, page),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Combined hook for all sections (home page use)
export const useAllSiteSections = () => {
  const highlights = useHighlights(4); // Limit to 4 for home
  const vagoNow = useVagoNow(5); // Limit to 5 for home
  const leadership = useLeadership(3); // Limit to 3 for home

  return {
    highlights,
    vagoNow,
    leadership,
    isLoading: highlights.isLoading || vagoNow.isLoading || leadership.isLoading,
    error: highlights.error || vagoNow.error || leadership.error,
  };
}; 