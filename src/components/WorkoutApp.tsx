import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WorkoutHeader } from "./WorkoutHeader";
import { ExerciseSelector } from "./ExerciseSelector";
import { WorkoutExercise, Exercise } from "./WorkoutExercise";
import { WorkoutSummary } from "./WorkoutSummary";
import { WorkoutHistory } from "./WorkoutHistory";
import { useWorkoutStorage } from "@/hooks/useWorkoutStorage";
import { useToast } from "@/hooks/use-toast";
import { Plus, History, Timer, Target } from "lucide-react";

type AppState = 'idle' | 'workout' | 'exercise-selector' | 'summary' | 'history';

export const WorkoutApp = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [currentExercises, setCurrentExercises] = useState<Exercise[]>([]);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date>(new Date());
  const { workoutHistory, saveWorkout } = useWorkoutStorage();
  const { toast } = useToast();

  const startWorkout = () => {
    setCurrentExercises([]);
    setWorkoutStartTime(new Date());
    setAppState('workout');
    toast({
      title: "Workout Started!",
      description: "Add exercises to begin logging your sets.",
    });
  };

  const addExercise = (exercise: { name: string; category: string; muscle: string }) => {
    const newExercise: Exercise = {
      ...exercise,
      sets: []
    };
    setCurrentExercises(prev => [...prev, newExercise]);
    setAppState('workout');
    toast({
      title: "Exercise Added",
      description: `${exercise.name} has been added to your workout.`,
    });
  };

  const updateExercise = (index: number, updatedExercise: Exercise) => {
    setCurrentExercises(prev => 
      prev.map((ex, i) => i === index ? updatedExercise : ex)
    );
  };

  const deleteExercise = (index: number) => {
    const exerciseName = currentExercises[index].name;
    setCurrentExercises(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Exercise Removed",
      description: `${exerciseName} has been removed from your workout.`,
    });
  };

  const finishWorkout = () => {
    const completedExercises = currentExercises.filter(ex => 
      ex.sets.some(set => set.completed)
    );
    
    if (completedExercises.length > 0) {
      const workout = saveWorkout(currentExercises, workoutStartTime);
      toast({
        title: "Workout Completed!",
        description: `Great job! You completed ${workout.totalSets} sets in ${workout.duration} minutes.`,
      });
    }
    
    setCurrentExercises([]);
    setAppState('idle');
  };

  const cancelWorkout = () => {
    setCurrentExercises([]);
    setAppState('idle');
    toast({
      title: "Workout Cancelled",
      description: "Your workout has been cancelled.",
    });
  };

  const showSummary = () => {
    if (currentExercises.some(ex => ex.sets.some(set => set.completed))) {
      setAppState('summary');
    } else {
      toast({
        title: "No Sets Completed",
        description: "Complete at least one set to view the summary.",
      });
    }
  };

  const totalCompletedSets = currentExercises.reduce((sum, ex) => 
    sum + ex.sets.filter(set => set.completed).length, 0
  );

  const workoutDuration = appState === 'workout' || appState === 'summary' ? 
    Math.floor((new Date().getTime() - workoutStartTime.getTime()) / 1000 / 60) : 0;

  if (appState === 'exercise-selector') {
    return (
      <ExerciseSelector
        onSelectExercise={addExercise}
        onClose={() => setAppState('workout')}
      />
    );
  }

  if (appState === 'summary') {
    return (
      <div className="min-h-screen bg-gradient-subtle p-4">
        <WorkoutSummary
          exercises={currentExercises}
          onFinishWorkout={finishWorkout}
          onCancelWorkout={cancelWorkout}
          startTime={workoutStartTime}
        />
      </div>
    );
  }

  if (appState === 'history') {
    return (
      <WorkoutHistory
        workouts={workoutHistory}
        onClose={() => setAppState('idle')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <WorkoutHeader 
        onStartWorkout={startWorkout}
        isWorkoutActive={appState === 'workout'}
      />

      <div className="p-4 space-y-4">
        {appState === 'idle' && (
          <>
            <div className="grid grid-cols-1 gap-4 mt-6">
              <Card className="p-6 text-center bg-gradient-primary text-primary-foreground shadow-workout">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <h2 className="text-xl font-semibold mb-2">Ready to Train?</h2>
                <p className="text-primary-foreground/80 mb-4">
                  Start a new workout and track your progress
                </p>
                <Button 
                  onClick={startWorkout}
                  variant="secondary"
                  className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Start New Workout
                </Button>
              </Card>
              
              {workoutHistory.length > 0 && (
                <Card className="p-6 text-center border-workout-border">
                  <History className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Workout History</h3>
                  <p className="text-muted-foreground mb-4">
                    You've completed {workoutHistory.length} workouts
                  </p>
                  <Button 
                    onClick={() => setAppState('history')}
                    variant="outline"
                  >
                    <History className="h-4 w-4 mr-2" />
                    View History
                  </Button>
                </Card>
              )}
            </div>
          </>
        )}

        {appState === 'workout' && (
          <>
            {/* Workout Progress Bar */}
            <Card className="p-4 bg-workout-card border-workout-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Active Workout</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {workoutDuration} min
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  {currentExercises.length} exercises
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-primary font-medium">
                  {totalCompletedSets} sets completed
                </span>
              </div>
            </Card>

            {/* Exercise List */}
            <div className="space-y-4">
              {currentExercises.map((exercise, index) => (
                <WorkoutExercise
                  key={index}
                  exercise={exercise}
                  onUpdateExercise={(updated) => updateExercise(index, updated)}
                  onDeleteExercise={() => deleteExercise(index)}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => setAppState('exercise-selector')}
                variant="workout"
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
              
              {totalCompletedSets > 0 && (
                <Button
                  onClick={showSummary}
                  variant="accent"
                  className="flex-1"
                >
                  Finish Workout
                </Button>
              )}
            </div>

            {currentExercises.length === 0 && (
              <Card className="p-8 text-center border-workout-border">
                <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Exercises Added</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first exercise to start logging sets and reps
                </p>
                <Button
                  onClick={() => setAppState('exercise-selector')}
                  variant="workout"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exercise
                </Button>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};