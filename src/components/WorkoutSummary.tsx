import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Target, TrendingUp } from "lucide-react";
import { Exercise } from "./WorkoutExercise";

interface WorkoutSummaryProps {
  exercises: Exercise[];
  onFinishWorkout: () => void;
  onCancelWorkout: () => void;
  startTime: Date;
}

export const WorkoutSummary = ({ exercises, onFinishWorkout, onCancelWorkout, startTime }: WorkoutSummaryProps) => {
  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = exercises.reduce((sum, ex) => sum + ex.sets.filter(set => set.completed).length, 0);
  const totalVolume = exercises.reduce((sum, ex) => 
    sum + ex.sets.filter(set => set.completed).reduce((vol, set) => vol + (set.weight * set.reps), 0), 0
  );

  const workoutDuration = Math.floor((new Date().getTime() - startTime.getTime()) / 1000 / 60);

  return (
    <Card className="p-6 space-y-6 shadow-workout border-workout-border bg-gradient-subtle">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle className="h-6 w-6 text-success" />
          <h2 className="text-xl font-semibold">Workout Summary</h2>
        </div>
        <p className="text-muted-foreground">Great job! Here's what you accomplished:</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-card rounded-xl border border-workout-border">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-2xl font-bold text-primary">{completedSets}</span>
          </div>
          <p className="text-xs text-muted-foreground">Sets Completed</p>
          <p className="text-xs text-muted-foreground">of {totalSets} total</p>
        </div>
        
        <div className="text-center p-4 bg-card rounded-xl border border-workout-border">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="h-4 w-4 text-accent" />
            <span className="text-2xl font-bold text-accent">{workoutDuration}</span>
          </div>
          <p className="text-xs text-muted-foreground">Minutes</p>
          <p className="text-xs text-muted-foreground">Duration</p>
        </div>
      </div>

      {totalVolume > 0 && (
        <div className="text-center p-4 bg-card rounded-xl border border-workout-border">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-2xl font-bold text-success">{totalVolume.toLocaleString()}</span>
          </div>
          <p className="text-xs text-muted-foreground">Total Volume (kg × reps)</p>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">Exercises Completed</h3>
        <div className="space-y-2">
          {exercises.map((exercise, index) => {
            const exerciseCompletedSets = exercise.sets.filter(set => set.completed).length;
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-card rounded-lg border border-workout-border">
                <div className="flex-1">
                  <p className="font-medium text-sm">{exercise.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {exerciseCompletedSets} sets • {exercise.muscle}
                  </p>
                </div>
                <Badge variant={exerciseCompletedSets > 0 ? "default" : "secondary"} className="text-xs">
                  {exerciseCompletedSets > 0 ? "Completed" : "Skipped"}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onCancelWorkout}
          className="flex-1"
        >
          Cancel Workout
        </Button>
        <Button
          onClick={onFinishWorkout}
          className="flex-1 bg-gradient-primary shadow-accent"
        >
          Finish Workout
        </Button>
      </div>
    </Card>
  );
};