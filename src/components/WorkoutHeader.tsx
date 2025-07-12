import { Button } from "@/components/ui/button";
import { Dumbbell, Plus, Timer } from "lucide-react";

interface WorkoutHeaderProps {
  onStartWorkout: () => void;
  isWorkoutActive: boolean;
  hasInProgressWorkout: boolean;
  onResumeWorkout: () => void;
}

export const WorkoutHeader = ({ onStartWorkout, isWorkoutActive, hasInProgressWorkout, onResumeWorkout }: WorkoutHeaderProps) => {
  return (
    <div className="bg-gradient-primary text-primary-foreground p-8 shadow-workout relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/5" />
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/5" />
      </div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/15 backdrop-blur-sm">
            <Dumbbell className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sets&Reps</h1>
            <p className="text-primary-foreground/90 text-lg font-medium">Workout Tracker</p>
          </div>
        </div>
        {!isWorkoutActive && hasInProgressWorkout && (
          <Button
            onClick={onResumeWorkout}
            variant="workout"
            size="lg"
            className="mr-2"
          >
            <Timer className="h-5 w-5 mr-2" />
            Resume Workout
          </Button>
        )}
        {!isWorkoutActive && (
          <Button
            onClick={onStartWorkout}
            variant="secondary"
            size="lg"
            className="bg-white/15 hover:bg-white/25 border-white/30 text-white shadow-accent backdrop-blur-sm font-semibold"
          >
            <Plus className="h-5 w-5 mr-2" />
            {hasInProgressWorkout ? 'New Workout' : 'Start Workout'}
          </Button>
        )}
      </div>
    </div>
  );
};