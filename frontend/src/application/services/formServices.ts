import { applicationFormRepository } from "../../frameworks/repositories/applicationFormRepository";
import { FormData } from '../../domain/types/formTypes';

/**
 * Service layer for handling application form business logic
 */
export const formServices = {
  /**
   * Fetches the application form data from backend
   */
  getApplicationForm: async (): Promise<FormData> => {
    try {
      const response = await applicationFormRepository.getForm();
      return response;
    } catch (error) {
      console.error('Error fetching application form:', error);
      throw new Error('Failed to load application form data');
    }
  },

  /**
   * Saves a specific section of the form
   * @param params.sectionName - The section name to save (e.g., 'personalInfo')
   * @param params.data - The section data to save
   */
  saveFormSection: async (params: { sectionName: string; data: any }): Promise<any> => {
    try {
      const { sectionName, data } = params;
      const response = await applicationFormRepository.saveSection(sectionName, data);
      return response;
    } catch (error) {
      console.error(`Error saving form section ${params.sectionName}:`, error);
      throw new Error(`Failed to save ${params.sectionName}`);
    }
  },

  /**
   * Submits the complete application form
   * @param formData - The complete form data
   */
  submitApplicationForm: async (formData: FormData): Promise<any> => {
    try {
      const isComplete = validateCompleteForm(formData);

      if (!isComplete) {
        throw new Error('The application form is incomplete');
      }

      const response = await applicationFormRepository.submitForm(formData);
      return response;
    } catch (error) {
      console.error('Error submitting application form:', error);
      throw new Error('Failed to submit application');
    }
  }
};

/**
 * Validates that all required sections of the form are complete
 * @param formData - The complete form data
 * @returns boolean indicating if the form is complete
 */
function validateCompleteForm(formData: FormData): boolean {
  const requiredSections = [
    'personalInfo',
    'choiceOfStudy',
    'education',
    'declaration',
    'documents'
  ];

  for (const section of requiredSections) {
    const sectionData = formData[section as keyof FormData];
    if (!sectionData || (Array.isArray(sectionData) ? sectionData.length === 0 : Object.keys(sectionData).length === 0)) {
      return false;
    }
  }

  if (!formData.personalInfo?.firstName || !formData.personalInfo?.lastName) {
    return false;
  }

  if (!formData.choiceOfStudy || formData.choiceOfStudy.length === 0) {
    return false;
  }

  if (!formData.education?.studentType) {
    return false;
  }

  if (!formData.declaration?.privacyPolicy) {
    return false;
  }

  if (!formData.documents || formData.documents.length === 0) {
    return false;
  }

  return true;
}
