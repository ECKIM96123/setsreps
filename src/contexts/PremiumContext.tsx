import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PremiumContextType {
  isPremium: boolean;
  isLoading: boolean;
  upgradeToPremium: () => Promise<void>;
  restorePurchases: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const upgradeToPremium = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // For now, simulate premium purchase
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsPremium(true);
    } catch (err) {
      console.error('Purchase error:', err);
      setError(err instanceof Error ? err.message : 'Failed to complete purchase');
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // For now, simulate restore
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsPremium(true);
    } catch (err) {
      console.error('Restore purchases error:', err);
      setError(err instanceof Error ? err.message : 'Failed to restore purchases');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize state
  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <PremiumContext.Provider value={{ 
      isPremium, 
      isLoading, 
      upgradeToPremium,
      restorePurchases,
      error 
    }}>
      {children}
    </PremiumContext.Provider>
  );
};