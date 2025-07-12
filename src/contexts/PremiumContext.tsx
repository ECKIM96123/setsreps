import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Capacitor } from '@capacitor/core';

interface PremiumContextType {
  isPremium: boolean;
  isLoading: boolean;
  initializeRevenueCat: () => Promise<void>;
  purchasePremium: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  upgradeToPremium: () => void; // Keep for backward compatibility
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

  const initializeRevenueCat = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        // Import RevenueCat dynamically for mobile only
        const { Purchases } = await import('@revenuecat/purchases-capacitor');
        
        // Replace with your actual RevenueCat API keys
        const apiKey = Capacitor.getPlatform() === 'ios' 
          ? 'your_ios_api_key_here' 
          : 'your_android_api_key_here';
        
        await Purchases.configure({ apiKey });
        
        // Get current customer info
        const info = await Purchases.getCustomerInfo();
        setIsPremium(checkPremiumStatus(info));
      } else {
        // Web fallback - mock premium status for development
        console.log('RevenueCat: Running in web mode, using mock data');
        setIsPremium(false);
      }
    } catch (err) {
      console.error('RevenueCat initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize RevenueCat');
    } finally {
      setIsLoading(false);
    }
  };

  const checkPremiumStatus = (info: any): boolean => {
    // Check if user has any active entitlements
    const activeEntitlements = info?.entitlements?.active || {};
    return Object.keys(activeEntitlements).length > 0;
  };

  const purchasePremium = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!Capacitor.isNativePlatform()) {
        throw new Error('Purchases are only available on mobile devices');
      }

      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      
      // Get available offerings
      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;
      
      if (currentOffering && currentOffering.availablePackages.length > 0) {
        const packageToPurchase = currentOffering.availablePackages[0];
        const purchaseResult = await Purchases.purchasePackage({ aPackage: packageToPurchase });
        setIsPremium(checkPremiumStatus(purchaseResult.customerInfo));
      } else {
        throw new Error('No packages available for purchase');
      }
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
      
      if (!Capacitor.isNativePlatform()) {
        throw new Error('Restore purchases is only available on mobile devices');
      }

      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      const info = await Purchases.restorePurchases();
      setIsPremium(checkPremiumStatus(info));
    } catch (err) {
      console.error('Restore purchases error:', err);
      setError(err instanceof Error ? err.message : 'Failed to restore purchases');
    } finally {
      setIsLoading(false);
    }
  };

  // Backward compatibility method
  const upgradeToPremium = () => {
    if (Capacitor.isNativePlatform()) {
      purchasePremium();
    } else {
      // For web development, just toggle premium status
      setIsPremium(true);
    }
  };

  useEffect(() => {
    initializeRevenueCat();
  }, []);

  return (
    <PremiumContext.Provider value={{ 
      isPremium, 
      isLoading, 
      initializeRevenueCat, 
      purchasePremium, 
      restorePurchases,
      upgradeToPremium,
      error 
    }}>
      {children}
    </PremiumContext.Provider>
  );
};