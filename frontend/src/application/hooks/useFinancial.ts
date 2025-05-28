import { useState, useCallback } from 'react';
import { 
  StudentFinancialInfo, 
  Charge, 
  Payment, 
  FinancialAidApplication, 
  Scholarship, 
  ScholarshipApplication,
  PaymentForm 
} from '../../domain/types/financial';
import { financialService } from '../services/financialService';

export const useFinancial = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStudentFinancialInfo = useCallback(async (): Promise<StudentFinancialInfo | null> => {
    try {
      setLoading(true);
      setError(null);
      const data = await financialService.getStudentFinancialInfo();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentCharges = useCallback(async (): Promise<Charge[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await financialService.getCurrentCharges();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getPaymentHistory = useCallback(async (): Promise<Payment[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await financialService.getPaymentHistory();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
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
      const data = await financialService.getFinancialAidApplications();
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
      const data = await financialService.getScholarshipApplications();
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

  return {
    loading,
    error,
    getStudentFinancialInfo,
    getCurrentCharges,
    getPaymentHistory,
    makePayment,
    getFinancialAidApplications,
    applyForFinancialAid,
    getAvailableScholarships,
    getScholarshipApplications,
    applyForScholarship,
    uploadDocument,
  };
}; 