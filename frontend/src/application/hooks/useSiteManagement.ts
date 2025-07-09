import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { siteManagementService, SiteSection, CreateSiteSectionData, UpdateSiteSectionData } from '../services/siteManagement.service';
import { toast } from 'react-hot-toast';

export type SiteSectionKey = 'highlights' | 'vagoNow' | 'leadership';

export const useSiteManagement = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<SiteSectionKey>('highlights');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Fetch sections only for the active tab
  const {
    data: sections = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['site-sections', activeTab, page],
    queryFn: () => siteManagementService.getSections(activeTab, 10, page),
  });

  // Fetch individual section by ID
  const {
    data: selectedSection,
    isLoading: isLoadingSection,
    error: sectionError,
  } = useQuery({
    queryKey: ['site-section', selectedId],
    queryFn: () => siteManagementService.getSectionById(selectedId!),
    enabled: !!selectedId,
  });

  // Unified CRUD mutations
  const createSection = useMutation({
    mutationFn: (data: CreateSiteSectionData) => siteManagementService.createSection(data),
    onSuccess: (data) => {
      console.log(data, "kaojspaijsoiajs")
      queryClient.invalidateQueries({ queryKey: ['site-sections', data.sectionKey] });
      toast.success(`${data.sectionKey === 'highlights' ? 'Highlight' : data.sectionKey === 'vagoNow' ? 'VAGO Now' : 'Leadership'} created successfully`);
    },
    onError: () => toast.error('Failed to create section'),
  });

  const updateSection = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSiteSectionData }) => 
      siteManagementService.updateSection(id, data),
    onSuccess: (data) => {
  
      console.log('[updateSection onSuccess] sectionKey:', data.sectionKey);
      const key = data.sectionKey || activeTab;
      queryClient.setQueryData(['site-sections', key, page], (oldSections: SiteSection[] | undefined) => {
        if (!oldSections) return oldSections;
        return oldSections.map(section => section.id === data.id ? { ...data, sectionKey: key } : section);
      });
      queryClient.setQueryData(['site-section', data.id], { ...data, sectionKey: key });
      toast.success(`${key === 'highlights' ? 'Highlight' : key === 'vagoNow' ? 'VAGO Now' : 'Leadership'} updated successfully`);
    },
    onError: () => toast.error('Failed to update section'),
  });

  const deleteSection = useMutation({
    mutationFn: (id: string) => siteManagementService.deleteSection(id),
    onSuccess: (_, id) => {
      // Invalidate the current tab's query
      queryClient.invalidateQueries({ queryKey: ['site-sections', activeTab] });
      toast.success('Section deleted successfully');
    },
    onError: () => toast.error('Failed to delete section'),
  });

  // Helper functions for specific section types
  const createHighlight = (data: Omit<CreateSiteSectionData, 'sectionKey'>) => 
    createSection.mutateAsync({ ...data, sectionKey: 'highlights' });
  
  const createVagoNow = (data: Omit<CreateSiteSectionData, 'sectionKey'>) => 
    createSection.mutateAsync({ ...data, sectionKey: 'vagoNow' });
  
  const createLeadership = (data: Omit<CreateSiteSectionData, 'sectionKey'>) => 
    createSection.mutateAsync({ ...data, sectionKey: 'leadership' });

  // Handler functions
  const handleViewSection = (sectionId: string) => {
    console.log("Viewing section:", sectionId);
    setSelectedId(sectionId);
  };

  const handleEditSection = (sectionId: string) => {
    console.log("Editing section:", sectionId);
    setSelectedId(sectionId);
  };

  return {
    activeTab,
    setActiveTab,
    page,
    setPage,
    selectedId,
    setSelectedId,
    sections, // Single sections array for current tab
    selectedSection, // Individual section data
    isLoading,
    isLoadingSection,
    error,
    sectionError,
    // Unified CRUD
    createSection,
    updateSection,
    deleteSection,
    // Convenience methods
    createHighlight,
    createVagoNow,
    createLeadership,
    // Handler functions
    handleViewSection,
    handleEditSection,
  };
}; 