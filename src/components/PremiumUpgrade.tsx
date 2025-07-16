import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crown, Sparkles, ExternalLink } from "lucide-react";
import { usePremium } from "@/contexts/PremiumContext";
import { useTranslation } from "react-i18next";

interface PremiumUpgradeProps {
  feature?: string;
  children?: React.ReactNode;
}

export const PremiumUpgrade = ({ feature, children }: PremiumUpgradeProps) => {
  const { showPaywall, error } = usePremium();
  const { t } = useTranslation();

  return (
    <Card className="p-6 text-center border-2 border-dashed border-muted relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Crown className="h-8 w-8 text-white" />
        </div>
        
        <h3 className="text-xl font-bold mb-2">{t('premium.unlock')} {feature || t('premium.premiumFeatures')}</h3>
        <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
          {t('premium.upgradeDescription')}
        </p>
        
        {/* Pricing Plans */}
        <div className="mb-6 space-y-3">
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="font-medium">{t('premium.monthly')}</span>
            <span className="font-bold text-primary">39 kr/mån</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border-2 border-primary/20">
            <div>
              <span className="font-medium">{t('premium.yearly')}</span>
              <div className="text-xs text-muted-foreground">{t('premium.bestValue')}</div>
            </div>
            <span className="font-bold text-primary">299 kr/år</span>
          </div>
        </div>
        
        {error && (
          <p className="text-destructive text-sm mb-4">{error}</p>
        )}
        
        <Button 
          onClick={showPaywall} 
          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 mb-6"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {t('premium.upgradeToPremium')}
        </Button>
        
        {/* Subscription Terms */}
        <div className="text-xs text-muted-foreground space-y-2 mb-4">
          <p>{t('premium.autoRenewal')}</p>
          <p>{t('premium.cancelAnytime')}</p>
        </div>
        
        {/* Legal Links */}
        <div className="flex justify-center gap-4 text-xs">
          <a 
            href="/terms" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1"
          >
            {t('premium.termsOfService')}
            <ExternalLink className="h-3 w-3" />
          </a>
          <a 
            href="/privacy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1"
          >
            {t('premium.privacyPolicy')}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        
        {children && (
          <div className="mt-4 opacity-30 pointer-events-none">
            {children}
          </div>
        )}
      </div>
    </Card>
  );
};