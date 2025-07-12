import { Button } from "@/components/ui/button";
import { Dumbbell, Plus, Timer } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface WorkoutHeaderProps {
  onStartWorkout: () => void;
  isWorkoutActive: boolean;
  hasInProgressWorkout: boolean;
  onResumeWorkout: () => void;
}

export const WorkoutHeader = ({ onStartWorkout, isWorkoutActive, hasInProgressWorkout, onResumeWorkout }: WorkoutHeaderProps) => {
  return (
    <header className="bg-card border-b border-border backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-lg shadow-sm">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-foreground">Sets&Reps</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">Your workout companion</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-3">
            {!isWorkoutActive && hasInProgressWorkout && (
              <Button
                onClick={onResumeWorkout}
                variant="workout"
                size="sm"
                className="hidden sm:flex shadow-sm hover:shadow-workout"
              >
                <Timer className="h-4 w-4 mr-2" />
                Resume Workout
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
        
        {/* Mobile Resume Button */}
        {!isWorkoutActive && hasInProgressWorkout && (
          <div className="mt-3 sm:hidden">
            <Button
              onClick={onResumeWorkout}
              variant="workout"
              size="sm"
              className="w-full shadow-sm"
            >
              <Timer className="h-4 w-4 mr-2" />
              Resume Workout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};