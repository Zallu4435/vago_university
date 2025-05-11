// src/infrastructure/repositories/applicationFormRepository.ts
import { FormData } from '../../domain/types/formTypes';
import { apiClient } from '../api/apiClient';

/**
 * Repository for handling application form data persistence
 */
export const applicationFormRepository = {
  /**
   * Fetches the application form data from backend API
   * @returns FormData object with all saved sections
   */
  getForm: async (): Promise<FormData> => {
    try {
      const response = await apiClient.get('/application-form');
      return response.data;
    } catch (error) {
      console.error('API Error - getForm:', error);
      throw error;
    }
  },

  /**
   * Saves a specific section of the form
   * @param sectionName - The section name (e.g., 'personalInfo')
   * @param data - The section data to save
   * @returns The saved section data with any server-side updates
   */
  saveSection: async (sectionName: string, data: any): Promise<any> => {
    try {
      const response = await apiClient.put(`/application-form/sections/${sectionName}`, data);
      return response.data;
    } catch (error) {
      console.error(`API Error - saveSection (${sectionName}):`, error);
      throw error;
    }
  },

  /**
   * Submits the complete application form
   * @param formData - The complete form data
   * @returns Response with submission confirmation
   */
  submitForm: async (formData: FormData): Promise<any> => {
    try {
      const response = await apiClient.post('/application-form/submit', formData);
      return response.data;
    } catch (error) {
      console.error('API Error - submitForm:', error);
      throw error;
    }
  },

  /**
   * Gets application status
   * @returns Current application status
   */
  getApplicationStatus: async (): Promise<string> => {
    try {
      const response = await apiClient.get('/application-form/status');
      return response.data.status;
    } catch (error) {
      console.error('API Error - getApplicationStatus:', error);
      throw error;
    }
  }