import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Capacitor } from '@capacitor/core';

interface PremiumContextType {
  isPremium: boolean;
  isLoading: boolean;
  initializeRevenueCat: () => Promise<void>;
  purchasePremium: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  showPaywall: () => Promise<void>; // RevenueCat's native paywall
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
        
        // RevenueCat API keys
        const apiKey = Capacitor.getPlatform() === 'ios' 
          ? 'appl_XbhizZctlfQheNRNAPCqzttrveY' 
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
        // For web development, show a message about mobile requirement
        setError('Premium subscriptions require the mobile app. Download from App Store.');
        return;
      }

      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      
      // Get available offerings
      const offerings = await Purchases.getOfferings();
      // Try to get specific offering first, fallback to current
      const specificOffering = offerings.all['ofrng47f13c884d'];
      const currentOffering = specificOffering || offerings.current;
      
      if (!currentOffering || currentOffering.availablePackages.length === 0) {
        throw new Error('No subscription packages available. Please try again later.');
      }

      // Find the monthly package or use the first available
      const monthlyPackage = currentOffering.availablePackages.find(
        pkg => pkg.identifier.includes('monthly') || pkg.identifier.includes('month')
      ) || currentOffering.availablePackages[0];
      
      console.log('Attempting to purchase package:', monthlyPackage.identifier);
      const purchaseResult = await Purchases.purchasePackage({ aPackage: monthlyPackage });
      
      console.log('Purchase successful:', purchaseResult);
      setIsPremium(checkPremiumStatus(purchaseResult.customerInfo));
      
    } catch (err) {
      console.error('Purchase error:', err);
      if (err instanceof Error && err.message.includes('user cancelled')) {
        setError('Purchase was cancelled');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to complete purchase');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showPaywall = async () => {
    try {
      setError(null);
      
      if (!Capacitor.isNativePlatform()) {
        setError('Premium subscriptions require the mobile app. Download from App Store.');
        return;
      }

      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      
      // Get specific offering
      const offerings = await Purchases.getOfferings();
      // Try to get specific offering first, fallback to current
      const specificOffering = offerings.all['ofrng47f13c884d'];
      const currentOffering = specificOffering || offerings.current;
      
      if (!currentOffering || currentOffering.availablePackages.length === 0) {
        throw new Error('No subscription offerings available. Please try again later.');
      }

      // For now, use the first available package (you can modify this logic)
      // RevenueCat Capacitor doesn't have native paywall UI yet, so we trigger purchase directly
      const packageToPurchase = currentOffering.availablePackages[0];
      
      console.log('Showing offering with packages:', currentOffering.availablePackages.map(p => p.identifier));
      
      // This will trigger the native purchase flow
      const purchaseResult = await Purchases.purchasePackage({ aPackage: packageToPurchase });
      setIsPremium(checkPremiumStatus(purchaseResult.customerInfo));
      
    } catch (err) {
      console.error('Paywall error:', err);
      if (err instanceof Error && !err.message.includes('user cancelled')) {
        setError(err.message);
      }
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

  // Backward compatibility method - now calls showPaywall for native RevenueCat experience
  const upgradeToPremium = () => {
    showPaywall();
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
      showPaywall,
      upgradeToPremium,
      error 
    }}>
      {children}
    </PremiumContext.Provider>
  );
};