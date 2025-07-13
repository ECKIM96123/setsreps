import { useEffect, useState } from 'react';
import { Dumbbell } from 'lucide-react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for fade out animation to complete
      setTimeout(onLoadingComplete, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50 animate-fade-out">
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            <Dumbbell className="h-16 w-16 text-primary mx-auto" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Sets&Reps</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        <div className="animate-pulse">
          <Dumbbell className="h-16 w-16 text-primary mx-auto" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Sets&Reps</h1>
        </div>
        <div className="flex justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};