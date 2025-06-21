import { useQuery } from '@tanstack/react-query';
import { siteSectionsService, SiteSection } from '../services/siteSections.service';

// Hook for fetching highlights
export const useHighlights = () => {
  return useQuery<SiteSection[], Error>({
    queryKey: ['site-highlights'],
    queryFn: () => siteSectionsService.getHighlights(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching VAGO Now
export const useVagoNow = () => {
  return useQuery<SiteSection[], Error>({
    queryKey: ['site-vago-now'],
    queryFn: () => siteSectionsService.getVagoNow(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching leadership
export const useLeadership = () => {
  return useQuery<SiteSection[], Error>({
    queryKey: ['site-leadership'],
    queryFn: () => siteSectionsService.getLeadership(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Generic hook for fetching any section type
export const useSiteSections = (sectionKey: 'highlights' | 'vagoNow' | 'leadership') => {
  return useQuery<SiteSection[], Error>({
    queryKey: ['site-sections', sectionKey],
    queryFn: () => siteSectionsService.getSectionsByType(sectionKey),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Combined hook for all sections
export const useAllSiteSections = () => {
  const highlights = useHighlights();
  const vagoNow = useVagoNow();
  const leadership = useLeadership();

  return {
    highlights,
    vagoNow,
    leadership,
    isLoading: highlights.isLoading || vagoNow.isLoading || leadership.isLoading,
    error: highlights.error || vagoNow.error || leadership.error,
  };
}; 