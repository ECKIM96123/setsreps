import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PremiumContextType {
  isPremium: boolean;
  isLoading: boolean;
  upgradeToPremium: () => void;
  error: string | null;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};

interface PremiumProviderProps {
  children: ReactNode;
}

export const PremiumProvider = ({ children }: PremiumProviderProps) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple toggle for premium status (local storage could be added later)
  const upgradeToPremium = () => {
    setIsPremium(true);
  };

  return (
    <PremiumContext.Provider value={{ 
      isPremium, 
      isLoading, 
      upgradeToPremium,
      error 
    }}>
      {children}
    </PremiumContext.Provider>
  );
};