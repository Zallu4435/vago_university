import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateUUID } from '../../frameworks/utils/uuid';
import { ApplicationIdContextType, ApplicationIdProviderProps } from '../../domain/types/application';

const ApplicationIdContext = createContext<ApplicationIdContextType | undefined>(undefined);

export const useApplicationId = () => {
  const context = useContext(ApplicationIdContext);
  if (context === undefined) {
    throw new Error('useApplicationId must be used within an ApplicationIdProvider');
  }
  return context;
};

export const ApplicationIdProvider: React.FC<ApplicationIdProviderProps> = ({ children }) => {
  const [applicationId, setApplicationIdState] = useState<string | null>(null);

  useEffect(() => {
    const storedApplicationId = localStorage.getItem('applicationId');
    
    if (storedApplicationId) {
      setApplicationIdState(storedApplicationId);
    }
  }, []);

  const setApplicationId = (id: string) => {
    setApplicationIdState(id);
    localStorage.setItem('applicationId', id);
  };

  const resetApplicationId = () => {
    const newId = generateUUID();
    setApplicationIdState(newId);
    localStorage.setItem('applicationId', newId);
  };

  return (
    <ApplicationIdContext.Provider value={{ applicationId, setApplicationId, resetApplicationId }}>
      {children}
    </ApplicationIdContext.Provider>
  );
};