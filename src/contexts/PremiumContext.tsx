import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PremiumContextType {
  isPremium: boolean;
  upgradeToPremium: () => void;
  cancelPremium: () => void;
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

  const upgradeToPremium = () => {
    setIsPremium(true);
  };

  const cancelPremium = () => {
    setIsPremium(false);
  };

  return (
    <PremiumContext.Provider value={{ isPremium, upgradeToPremium, cancelPremium }}>
      {children}
    </PremiumContext.Provider>
  );
};