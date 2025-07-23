import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Payment } from '../../domain/types/management/financialmanagement';
import { financialService } from '../services/financialService';
import { toast } from 'react-hot-toast';

export const usePaymentsManagement = (
  page: number = 1,
  itemsPerPage: number = 10,
  filters: {
    status?: string;
    startDate?: string;
    endDate?: string;
    studentId?: string;
  } = {},
  searchQuery: string = '',
  activeTab: string = 'all'
) => {
  const queryClient = useQueryClient();
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  const { data: paymentsData, isLoading, error } = useQuery<{ data: Payment[]; totalPages: number }, Error>({
    queryKey: ['payments', page, filters, searchQuery, activeTab],
    queryFn: () => financialService.getAllPayments({
      ...filters,
      studentId: searchQuery || filters.studentId || undefined,
      // Only send status if it is a real payment status
      status: (filters.status && filters.status !== 'All Statuses' && filters.status !== 'payments' && filters.status !== 'financialAid' && filters.status !== 'scholarships') ? filters.status : undefined,
      page,
      limit: itemsPerPage,
    }),
  });

  const createPaymentMutation = useMutation({
    mutationFn: (data: import('../../domain/types/management/financialmanagement').PaymentForm) =>
      financialService.makePayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Payment created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create payment');
    },
  });

  const { data: paymentDetails, isLoading: isLoadingPaymentDetails } = useQuery<Payment, Error>({
    queryKey: ['paymentDetails', selectedPaymentId],
    queryFn: () => financialService.getPaymentDetails(selectedPaymentId || ''),
    enabled: !!selectedPaymentId,
  });

  const handleViewPayment = useCallback((id: string) => {
    setSelectedPaymentId(id);
  }, []);

  const handleEditPayment = useCallback((id: string) => {
    queryClient.prefetchQuery({
      queryKey: ['paymentDetails', id],
      queryFn: () => financialService.getPaymentDetails(id),
    });
  }, [queryClient]);

  return {
    payments: paymentsData?.data || [],
    totalPages: Number(paymentsData?.totalPages) || 1,
    isLoading,
    error,
    createPayment: createPaymentMutation.mutate,
    paymentDetails,
    isLoadingPaymentDetails,
    handleViewPayment,
    handleEditPayment,
    // Exposing the student financial info method
    getStudentFinancialInfo: financialService.getStudentFinancialInfo,
    loading: isLoading, // Re-aliasing for component compatibility
  };
};