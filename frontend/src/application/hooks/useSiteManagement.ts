import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { siteManagementService, SiteSection, CreateSiteSectionData, UpdateSiteSectionData } from '../services/siteManagement.service';
import { toast } from 'react-hot-toast';

export type SiteSectionKey = 'highlights' | 'vagoNow' | 'leadership';

export const useSiteManagement = (
  search?: string,
  category?: string,
  dateRange?: string,
  startDate?: string,
  endDate?: string
) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<SiteSectionKey>('highlights');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    data: sections = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['site-sections', activeTab, page, search, category, dateRange, startDate, endDate],
    queryFn: () => siteManagementService.getSections(activeTab, 10, page, search, category, dateRange, startDate, endDate),
  });

  const {
    data: selectedSection,
    isLoading: isLoadingSection,
    error: sectionError,
  } = useQuery({
    queryKey: ['site-section', selectedId],
    queryFn: () => siteManagementService.getSectionById(selectedId!),
    enabled: !!selectedId,
  });

  const createSection = useMutation({
    mutationFn: (data: CreateSiteSectionData) => siteManagementService.createSection(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['site-sections', data.sectionKey] });
      toast.success(`${data.sectionKey === 'highlights' ? 'Highlight' : data.sectionKey === 'vagoNow' ? 'VAGO Now' : 'Leadership'} created successfully`);
    },
    onError: () => toast.error('Failed to create section'),
  });

  const updateSection = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSiteSectionData }) => 
      siteManagementService.updateSection(id, data),
    onSuccess: (data) => {
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
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ['site-sections', activeTab] });
      toast.success('Section deleted successfully');
    },
    onError: () => toast.error('Failed to delete section'),
  });

  const createHighlight = (data: Omit<CreateSiteSectionData, 'sectionKey'>) => 
    createSection.mutateAsync({ ...data, sectionKey: 'highlights' });
  
  const createVagoNow = (data: Omit<CreateSiteSectionData, 'sectionKey'>) => 
    createSection.mutateAsync({ ...data, sectionKey: 'vagoNow' });
  
  const createLeadership = (data: Omit<CreateSiteSectionData, 'sectionKey'>) => 
    createSection.mutateAsync({ ...data, sectionKey: 'leadership' });

  const handleViewSection = (sectionId: string) => {
    setSelectedId(sectionId);
  };

  const handleEditSection = (sectionId: string) => {
    setSelectedId(sectionId);
  };

  return {
    activeTab,
    setActiveTab,
    page,
    setPage,
    selectedId,
    setSelectedId,
    sections, 
    selectedSection, 
    isLoading,
    isLoadingSection,
    error,
    sectionError,

    createSection,
    updateSection,
    deleteSection,

    createHighlight,
    createVagoNow,
    createLeadership,

    handleViewSection,
    handleEditSection,
  };
}; 