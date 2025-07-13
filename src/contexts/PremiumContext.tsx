import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Capacitor } from '@capacitor/core';

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

  const initializeRevenueCat = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        const { Purchases } = await import('@revenuecat/purchases-capacitor');
        
        // RevenueCat API key for iOS
        const apiKey = Capacitor.getPlatform() === 'ios' 
          ? 'appl_XbhizZctlfQheNRNAPCqzttrveY' 
          : 'your_android_api_key_here';
        
        await Purchases.configure({ apiKey });
        
        // Get current customer info
        const info = await Purchases.getCustomerInfo();
        setIsPremium(checkPremiumStatus(info));
      } else {
        // Web fallback - mock for development
        console.log('RevenueCat: Running in web mode');
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
    const activeEntitlements = info?.entitlements?.active || {};
    return Object.keys(activeEntitlements).length > 0;
  };

  const upgradeToPremium = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!Capacitor.isNativePlatform()) {
        // For web development, just toggle premium status
        setIsPremium(true);
        return;
      }

      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      
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
        console.log('Restore purchases only available on mobile');
        return;
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

  useEffect(() => {
    initializeRevenueCat();
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