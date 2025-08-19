import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AdmissionFormContextType, FormData } from '../../domain/types/application';

const AdmissionFormContext = createContext<AdmissionFormContextType | undefined>(undefined);

export const AdmissionFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>({});

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev: FormData) => ({ ...prev, ...data }));
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