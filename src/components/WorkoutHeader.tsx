import { Button } from "@/components/ui/button";
import { Dumbbell, Plus, Timer } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationSettings } from "./NotificationSettings";
import { LanguageSelector } from "./LanguageSelector";
import { useTranslation } from 'react-i18next';

interface WorkoutHeaderProps {
  onStartWorkout: () => void;
  isWorkoutActive: boolean;
  hasInProgressWorkout: boolean;
  onResumeWorkout: () => void;
}

export const WorkoutHeader = ({ onStartWorkout, isWorkoutActive, hasInProgressWorkout, onResumeWorkout }: WorkoutHeaderProps) => {
  const { t } = useTranslation();
  return (
    <div className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="safe-area-top">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl shadow-workout">
                <Dumbbell className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
                  Sets&Reps
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Your fitness journey starts here</p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              {!isWorkoutActive && !hasInProgressWorkout && (
                <Button
                  onClick={onStartWorkout}
                  variant="workout"
                  size="sm"
                  className="hidden sm:flex shadow-workout"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('workout.startWorkout')}
                </Button>
              )}
              
              {!isWorkoutActive && hasInProgressWorkout && (
                <Button
                  onClick={onResumeWorkout}
                  variant="accent"
                  size="sm"
                  className="hidden sm:flex shadow-accent"
                >
                  <Timer className="h-4 w-4 mr-2" />
                  Resume Workout
                </Button>
              )}
              <NotificationSettings />
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>
          
          {/* Mobile Action Buttons */}
          <div className="mt-4 sm:hidden">
            {!isWorkoutActive && !hasInProgressWorkout && (
              <Button
                onClick={onStartWorkout}
                variant="workout"
                size="sm"
                className="w-full shadow-workout"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('workout.startWorkout')}
              </Button>
            )}
            
            {!isWorkoutActive && hasInProgressWorkout && (
              <Button
                onClick={onResumeWorkout}
                variant="accent"
                size="sm"
                className="w-full shadow-accent"
              >
                <Timer className="h-4 w-4 mr-2" />
                Resume Workout
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};