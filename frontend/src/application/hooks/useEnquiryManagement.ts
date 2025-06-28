import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { enquiryService } from '../services/enquiry.service';
import { 
  Enquiry, 
  CreateEnquiryData
} from '../../domain/types/enquiry';

interface Filters {
  status: string;
  dateRange: string;
}

export const useEnquiryManagement = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    status: 'All Statuses',
    dateRange: 'All Time',
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({
    startDate: '',
    endDate: '',
  });
  const limit = 10;

  const { data: enquiriesData, isLoading: isLoadingEnquiries, error: enquiriesError } = useQuery({
    queryKey: ['enquiries', page, filters, searchQuery, dateRange, limit],
    queryFn: () => {
      const status = filters.status !== 'All Statuses' ? filters.status : undefined;
      const dateRangeParam = filters.dateRange !== 'All Time' ? filters.dateRange : undefined;
      
      return enquiryService.getEnquiries(
        page,
        limit,
        status,
        dateRangeParam,
        dateRange.startDate,
        dateRange.endDate,
        searchQuery
      );
    },
  });

  const { data: enquiryDetails, isLoading: isLoadingEnquiryDetails } = useQuery({
    queryKey: ['enquiry-details', selectedEnquiryId],
    queryFn: () => enquiryService.getEnquiryById(selectedEnquiryId!),
    enabled: !!selectedEnquiryId,
  });

  const { mutateAsync: createEnquiry } = useMutation({
    mutationFn: (data: CreateEnquiryData) => enquiryService.createEnquiry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      toast.success('Enquiry created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create enquiry');
    },
  });

  const { mutateAsync: updateEnquiryStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      enquiryService.updateEnquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      queryClient.invalidateQueries({ queryKey: ['enquiry-details'] });
      toast.success('Enquiry status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update enquiry status');
    },
  });

  const { mutateAsync: deleteEnquiry } = useMutation({
    mutationFn: (id: string) => enquiryService.deleteEnquiry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      toast.success('Enquiry deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete enquiry');
    },
  });

  const { mutateAsync: sendReply } = useMutation({
    mutationFn: ({ id, replyMessage }: { id: string; replyMessage: string }) => 
      enquiryService.sendReply(id, replyMessage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      toast.success('Reply sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send reply');
    },
  });

  const handleViewEnquiry = (enquiryId: string) => {
    setSelectedEnquiryId(enquiryId);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate });
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      status: 'All Statuses',
      dateRange: 'All Time',
    });
    setSearchQuery('');
    setDateRange({ startDate: '', endDate: '' });
    setPage(1);
  };

  return {
    enquiries: enquiriesData?.enquiries || [],
    totalPages: enquiriesData?.totalPages || 0,
    total: enquiriesData?.total || 0,
    page,
    setPage,
    filters,
    searchQuery,
    dateRange,
    isLoading: isLoadingEnquiries,
    error: enquiriesError,
    enquiryDetails,
    isLoadingEnquiryDetails,
    createEnquiry,
    updateEnquiryStatus,
    deleteEnquiry,
    sendReply,
    handleViewEnquiry,
    handleSearch,
    handleFilterChange,
    handleDateRangeChange,
    resetFilters,
    setSelectedEnquiryId,
  };
}; 