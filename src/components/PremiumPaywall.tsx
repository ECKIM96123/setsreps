import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Zap, TrendingUp, BarChart3, Target } from "lucide-react";
import { usePremium } from "@/contexts/PremiumContext";

interface PremiumPaywallProps {
  feature?: string;
  children?: React.ReactNode;
}

export const PremiumPaywall = ({ feature, children }: PremiumPaywallProps) => {
  const { upgradeToPremium } = usePremium();

  return (
    <Card className="p-6 text-center border-2 border-dashed border-muted relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Crown className="h-8 w-8 text-white" />
        </div>
        
        <Badge variant="outline" className="mb-3 border-primary text-primary">
          <Star className="w-3 h-3 mr-1" />
          Premium Feature
        </Badge>
        
        <h3 className="text-xl font-bold mb-2">Unlock {feature || "Premium Stats"}</h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          Get access to advanced analytics, detailed insights, and premium features to take your fitness to the next level.
        </p>
        
        <div className="grid grid-cols-3 gap-3 mb-6 text-xs">
          <div className="flex flex-col items-center">
            <BarChart3 className="h-5 w-5 text-primary mb-1" />
            <span>Advanced Stats</span>
          </div>
          <div className="flex flex-col items-center">
            <TrendingUp className="h-5 w-5 text-primary mb-1" />
            <span>Progress Tracking</span>
          </div>
          <div className="flex flex-col items-center">
            <Target className="h-5 w-5 text-primary mb-1" />
            <span>Goal Setting</span>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="text-sm text-muted-foreground">Choose your plan:</div>
          <div className="grid gap-2 text-xs">
            <div className="flex justify-between items-center p-2 border rounded">
              <span>Monthly</span>
              <span className="font-semibold">$4.49/month</span>
            </div>
            <div className="flex justify-between items-center p-2 border rounded">
              <span>3 Months</span>
              <span className="font-semibold">$12.99</span>
            </div>
            <div className="flex justify-between items-center p-2 border rounded bg-primary/5 border-primary">
              <span>Yearly <Badge variant="secondary" className="ml-1 text-xs">Best Value</Badge></span>
              <span className="font-semibold">$29.99/year</span>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={upgradeToPremium} 
          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
        >
          <Zap className="w-4 h-4 mr-2" />
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