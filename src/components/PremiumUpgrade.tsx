import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crown, Sparkles } from "lucide-react";
import { usePremium } from "@/contexts/PremiumContext";

interface PremiumUpgradeProps {
  feature?: string;
  children?: React.ReactNode;
}

export const PremiumUpgrade = ({ feature, children }: PremiumUpgradeProps) => {
  const { upgradeToPremium, error } = usePremium();

  return (
    <Card className="p-6 text-center border-2 border-dashed border-muted relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Crown className="h-8 w-8 text-white" />
        </div>
        
        <h3 className="text-xl font-bold mb-2">Unlock {feature || "Premium Features"}</h3>
        <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
          Upgrade to premium to access this feature and unlock your full potential.
        </p>
        
        {error && (
          <p className="text-destructive text-sm mb-4">{error}</p>
        )}
        
        <Button 
          onClick={upgradeToPremium} 
          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 mb-4"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Upgrade to Premium
        </Button>
        
        {children && (
          <div className="mt-4 opacity-30 pointer-events-none">
            {children}
          </div>
        )}
      </div>
    </Card>
  );
};