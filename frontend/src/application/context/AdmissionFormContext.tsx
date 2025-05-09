import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ApplicationFormData } from '../../domain/types/application';

interface AdmissionFormContextType {
  formData: ApplicationFormData;
  updateFormData: (data: Partial<ApplicationFormData>) => void;
}

const AdmissionFormContext = createContext<AdmissionFormContextType | undefined>(undefined);

export const AdmissionFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    education: '',
    otherInfo: '',
    health: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    program: '',
    testScores: '',
    recommendations: '',
    essays: '',
    financialInfo: '',
    documents: '',
    declaration: '',
    payment: '',
  });

  const updateFormData = (data: Partial<ApplicationFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <AdmissionFormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </AdmissionFormContext.Provider>
  );
};

export const useAdmissionForm = () => {
  const context = useContext(AdmissionFormContext);
  if (!context) {
    throw new Error('useAdmissionForm must be used within an AdmissionFormProvider');
  }
  return context;
};