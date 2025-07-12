import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  onBack: () => void;
  className?: string;
}

export const BackButton = ({ onBack, className = "" }: BackButtonProps) => {
  return (
    <Button
      onClick={onBack}
      variant="ghost"
      size="sm"
      className={`h-9 px-3 text-foreground hover:bg-muted transition-colors ${className}`}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back
    </Button>
  );
};