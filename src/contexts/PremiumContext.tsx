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
        
        console.log('RevenueCat: Configuring with API key for platform:', Capacitor.getPlatform());
        await Purchases.configure({ apiKey });
        
        // Get current customer info
        console.log('RevenueCat: Getting customer info...');
        const info = await Purchases.getCustomerInfo();
        console.log('RevenueCat: Customer info:', info);
        
        // Also check offerings at initialization
        console.log('RevenueCat: Checking offerings...');
        const offerings = await Purchases.getOfferings();
        console.log('RevenueCat: Available offerings:', Object.keys(offerings.all));
        console.log('RevenueCat: Current offering:', offerings.current?.identifier);
        console.log('RevenueCat: All offerings details:', offerings.all);
        
        setIsPremium(checkPremiumStatus(info));
      } else {
        // Web fallback - mock premium status for development
        console.log('RevenueCat: Running in web mode, using mock data');
        // For development: set to true to test premium features
        setIsPremium(true);
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
      console.log('Available offerings:', Object.keys(offerings.all));
      
      // Look for the specific offering ID: ofrng47f13c884d
      let currentOffering = null;
      const targetOfferingId = 'ofrng47f13c884d';
      
      console.log('All available offerings:', Object.keys(offerings.all));
      
      // First, try to find the specific offering by ID
      if (offerings.all[targetOfferingId]) {
        const targetOffering = offerings.all[targetOfferingId];
        if (targetOffering && targetOffering.availablePackages && targetOffering.availablePackages.length > 0) {
          currentOffering = targetOffering;
          console.log('Found target offering:', targetOfferingId);
          console.log('Available packages:', targetOffering.availablePackages.map(p => p.identifier));
        }
      }
      
      // If target offering not found, look for offerings with our expected products
      if (!currentOffering) {
        console.log('Target offering not found, searching for products: MONSUB, 3MONSUB, YEARLYSUB');
        for (const [key, offering] of Object.entries(offerings.all)) {
          if (offering && offering.availablePackages && offering.availablePackages.length > 0) {
            // Check if this offering contains any of our expected products
            const hasExpectedProducts = offering.availablePackages.some(pkg => 
              pkg.identifier === 'MONSUB' || 
              pkg.identifier === '3MONSUB' || 
              pkg.identifier === 'YEARLYSUB'
            );
            
            if (hasExpectedProducts) {
              currentOffering = offering;
              console.log('Found offering with expected products:', key);
              console.log('Available packages:', offering.availablePackages.map(p => p.identifier));
              break;
            }
          }
        }
      }
      
      // Final fallback: any non-Default offering
      if (!currentOffering) {
        for (const [key, offering] of Object.entries(offerings.all)) {
          if (offering && offering.availablePackages && offering.availablePackages.length > 0 && key !== 'Default') {
            currentOffering = offering;
            console.log('Using fallback offering:', key);
            console.log('Packages:', offering.availablePackages.map(p => p.identifier));
            break;
          }
        }
      }
      
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
      
      // Get all offerings
      const offerings = await Purchases.getOfferings();
      console.log('Available offerings:', Object.keys(offerings.all));
      console.log('Current offering:', offerings.current?.identifier);
      
      // Try multiple fallbacks for offering
      let targetOffering = offerings.current;
      
      // If no current offering, try to get any available offering
      if (!targetOffering || targetOffering.availablePackages.length === 0) {
        const availableOfferingKeys = Object.keys(offerings.all);
        console.log('No current offering, trying available offerings:', availableOfferingKeys);
        
        for (const key of availableOfferingKeys) {
          const offering = offerings.all[key];
          if (offering && offering.availablePackages.length > 0) {
            targetOffering = offering;
            console.log('Using offering:', key);
            break;
          }
        }
      }
      
      if (!targetOffering || targetOffering.availablePackages.length === 0) {
        console.error('No offerings found. Available offerings:', offerings);
        throw new Error('No subscription offerings available. Please check your RevenueCat configuration.');
      }

      // Use the first available package
      const packageToPurchase = targetOffering.availablePackages[0];
      console.log('Using package:', packageToPurchase.identifier);
      console.log('Package details:', packageToPurchase);
      
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