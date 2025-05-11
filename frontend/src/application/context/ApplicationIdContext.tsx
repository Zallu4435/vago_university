// application/contexts/ApplicationIdContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateUUID } from '../../infrastructure/utils/uuid';

interface ApplicationIdContextType {
  applicationId: string | null;
  setApplicationId: (id: string) => void;
  resetApplicationId: () => void;
}

const ApplicationIdContext = createContext<ApplicationIdContextType | undefined>(undefined);

export const useApplicationId = () => {
  const context = useContext(ApplicationIdContext);
  if (context === undefined) {
    throw new Error('useApplicationId must be used within an ApplicationIdProvider');
  }
  return context;
};

interface ApplicationIdProviderProps {
  children: React.ReactNode;
}

export const ApplicationIdProvider: React.FC<ApplicationIdProviderProps> = ({ children }) => {
  const [applicationId, setApplicationIdState] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's an applicationId in localStorage
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