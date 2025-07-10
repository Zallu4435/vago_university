import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  StudentFinancialInfo,
  Charge,
  Payment,
  FinancialAidApplication,
  Scholarship,
  ScholarshipApplication,
  PaymentForm
} from '../../domain/types/management/financialmanagement';
import { financialService } from '../services/financialService';

export const useFinancial = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const role = useSelector((state: any) => state.auth.role);
  const isAdmin = role === 'admin';

  const getStudentFinancialInfo = useCallback(async (): Promise<StudentFinancialInfo | null> => {
    try {
      setLoading(true);
      setError(null);
      const data = await financialService.getStudentFinancialInfo();
      console.log(data, 'data')
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);


  const getAllPayments = useCallback(async (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<{ data: Payment[]; totalPayments: number; totalPages: number; currentPage: number }> => {
    try {
      setLoading(true);
      setError(null);
      const data = await financialService.getAllPayments(params);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return { data: [], totalPayments: 0, totalPages: 0, currentPage: 1 };
    } finally {
      setLoading(false);
    }
  }, []);

  const makePayment = useCallback(async (payment: PaymentForm): Promise<Payment | null> => {
    try {
      setLoading(true);
      setError(null);
      const data = await financialService.makePayment(payment);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFinancialAidApplications = useCallback(async (): Promise<FinancialAidApplication[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = isAdmin
        ? await financialService.getAllFinancialAidApplications()
        : await financialService.getFinancialAidApplications();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const getAllFinancialAidApplications = useCallback(async (): Promise<FinancialAidApplication[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await financialService.getAllFinancialAidApplications();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const applyForFinancialAid = useCallback(async (
    application: Omit<FinancialAidApplication, 'id' | 'status' | 'applicationDate'>
  ): Promise<FinancialAidApplication | null> => {
    try {
      setLoading(true);
      setError(null);
      const data = await financialService.applyForFinancialAid(application);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFinancialAidApplication = useCallback(async (
    id: string,
    data: { status: 'Approved' | 'Rejected'; amount?: number }
  ): Promise<FinancialAidApplication | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await financialService.updateFinancialAidApplication(id, data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAvailableScholarships = useCallback(async (): Promise<Scholarship[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await financialService.getAvailableScholarships();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getScholarshipApplications = useCallback(async (): Promise<ScholarshipApplication[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = isAdmin
        ? await financialService.getAllScholarshipApplications()
        : await financialService.getScholarshipApplications();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const getAllScholarshipApplications = useCallback(async (): Promise<ScholarshipApplication[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await financialService.getAllScholarshipApplications();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const applyForScholarship = useCallback(async (
    application: Omit<ScholarshipApplication, 'id' | 'status' | 'applicationDate'>
  ): Promise<ScholarshipApplication | null> => {
    try {
      setLoading(true);
      setError(null);
      const data = await financialService.applyForScholarship(application);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateScholarshipApplication = useCallback(async (
    id: string,
    data: { status: 'Approved' | 'Rejected' }
  ): Promise<ScholarshipApplication | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await financialService.updateScholarshipApplication(id, data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadDocument = useCallback(async (
    file: File,
    type: 'financial-aid' | 'scholarship'
  ): Promise<{ url: string } | null> => {
    try {
      setLoading(true);
      setError(null);
      const data = await financialService.uploadDocument(file, type);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCharge = useCallback(async (chargeData: {
    title: string;
    description: string;
    amount: number;
    term: string;
    dueDate: string;
    applicableFor: string;
  }): Promise<Charge | null> => {
    try {
      setLoading(true);
      setError(null);
      const data = await financialService.createCharge(chargeData);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCharges = useCallback(async (filters?: {
    term?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<Charge[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await financialService.getCharges(filters);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getPaymentDetails = useCallback(async (paymentId: string): Promise<Payment | null> => {
    try {
      setLoading(true);
      setError(null);
      const data = await financialService.getPaymentDetails(paymentId);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getStudentFinancialInfo,
    getAllPayments,
    makePayment,
    getFinancialAidApplications,
    getAllFinancialAidApplications,
    applyForFinancialAid,
    updateFinancialAidApplication,
    getAvailableScholarships,
    getScholarshipApplications,
    getAllScholarshipApplications,
    applyForScholarship,
    updateScholarshipApplication,
    uploadDocument,
    createCharge,
    getCharges,
    getPaymentDetails,
  };
};