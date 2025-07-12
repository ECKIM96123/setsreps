import { Button } from "@/components/ui/button";
import { Dumbbell, Plus } from "lucide-react";

interface WorkoutHeaderProps {
  onStartWorkout: () => void;
  isWorkoutActive: boolean;
}

export const WorkoutHeader = ({ onStartWorkout, isWorkoutActive }: WorkoutHeaderProps) => {
  return (
    <div className="bg-gradient-primary text-primary-foreground p-6 rounded-b-3xl shadow-workout">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl">
            <Dumbbell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">FitTracker</h1>
            <p className="text-primary-foreground/80">Workout Journal</p>
          </div>
        </div>
        {!isWorkoutActive && (
          <Button
            onClick={onStartWorkout}
            variant="secondary"
            className="bg-white/10 hover:bg-white/20 border-white/20 text-white shadow-accent"
          >
            <Plus className="h-4 w-4 mr-2" />
            Start Workout
          </Button>
        )}
      </div>
    </div>
  );
};