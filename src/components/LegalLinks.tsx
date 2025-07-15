import { ExternalLink } from "lucide-react";

export const LegalLinks = () => {
  return (
    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
      <a 
        href="https://www.apple.com/legal/internet-services/terms/site.html" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        Terms of Use (EULA) <ExternalLink className="h-3 w-3" />
      </a>
      <a 
        href="https://www.iubenda.com/privacy-policy/placeholder" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        Privacy Policy <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
};