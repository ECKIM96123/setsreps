import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WorkoutHeader } from "./WorkoutHeader";
import { BackButton } from "./BackButton";
import { ExerciseSelector } from "./ExerciseSelector";
import { WorkoutExercise, Exercise } from "./WorkoutExercise";
import { WorkoutSummary } from "./WorkoutSummary";
import { WorkoutHistory } from "./WorkoutHistory";
import { WorkoutLog } from "./WorkoutLog";
import { WorkoutStats } from "./WorkoutStats";
import { useWorkoutStorage } from "@/hooks/useWorkoutStorage";
import { useToast } from "@/hooks/use-toast";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { Plus, Timer, Target } from "lucide-react";

type AppState = 'idle' | 'workout' | 'exercise-selector' | 'summary' | 'history' | 'stats';

export const WorkoutApp = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [currentExercises, setCurrentExercises] = useState<Exercise[]>([]);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date>(new Date());
  const { workoutHistory, saveWorkout } = useWorkoutStorage();
  const { toast } = useToast();

  // Navigation functions
  const goBack = () => {
    switch (appState) {
      case 'exercise-selector':
        setAppState('workout');
        break;
      case 'summary':
        setAppState('workout');
        break;
      case 'history':
      case 'stats':
        setAppState('idle');
        break;
      case 'workout':
        if (currentExercises.length > 0) {
          saveAndExit();
        } else {
          setAppState('idle');
        }
        break;
      default:
        setAppState('idle');
    }
  };

  // Swipe navigation setup
  const swipeRef = useSwipeNavigation({
    onSwipeBack: appState !== 'idle' ? goBack : undefined
  });

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

  const endWorkout = () => {
    const completedSets = currentExercises.reduce((sum, ex) => 
      sum + ex.sets.filter(set => set.completed).length, 0
    );
    
    if (completedSets > 0) {
      const workout = saveWorkout(currentExercises, workoutStartTime);
      toast({
        title: "Workout Saved!",
        description: `Workout ended and saved with ${workout.totalSets} completed sets.`,
      });
    } else {
      toast({
        title: "Workout Ended",
        description: "No sets were completed, so workout was not saved.",
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

  const saveAndExit = () => {
    // Keep the workout data but return to main screen
    setAppState('idle');
    toast({
      title: "Workout Paused",
      description: "Your workout has been saved. Click 'Resume Workout' to continue.",
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
      <div ref={swipeRef} className="min-h-screen bg-background">
        <WorkoutHeader 
          onStartWorkout={startWorkout}
          isWorkoutActive={false}
          hasInProgressWorkout={currentExercises.length > 0}
          onResumeWorkout={() => setAppState('workout')}
        />
        <div className="p-4 pb-2">
          <BackButton onBack={goBack} />
        </div>
        <ExerciseSelector
          onSelectExercise={addExercise}
          onClose={() => setAppState('workout')}
        />
      </div>
    );
  }

  if (appState === 'summary') {
    return (
      <div ref={swipeRef} className="min-h-screen bg-background">
        <WorkoutHeader 
          onStartWorkout={startWorkout}
          isWorkoutActive={false}
          hasInProgressWorkout={currentExercises.length > 0}
          onResumeWorkout={() => setAppState('workout')}
        />
        <div className="p-4">
          <BackButton onBack={goBack} className="mb-4" />
          <WorkoutSummary
            exercises={currentExercises}
            onFinishWorkout={finishWorkout}
            onCancelWorkout={cancelWorkout}
            startTime={workoutStartTime}
          />
        </div>
      </div>
    );
  }

  if (appState === 'history') {
    return (
      <div ref={swipeRef} className="min-h-screen bg-background">
        <WorkoutHeader 
          onStartWorkout={startWorkout}
          isWorkoutActive={false}
          hasInProgressWorkout={currentExercises.length > 0}
          onResumeWorkout={() => setAppState('workout')}
        />
        <div className="p-4 pb-2">
          <BackButton onBack={goBack} />
        </div>
        <WorkoutHistory
          workouts={workoutHistory}
          onClose={() => setAppState('idle')}
        />
      </div>
    );
  }

  if (appState === 'stats') {
    return (
      <div ref={swipeRef} className="min-h-screen bg-background">
        <WorkoutHeader 
          onStartWorkout={startWorkout}
          isWorkoutActive={false}
          hasInProgressWorkout={currentExercises.length > 0}
          onResumeWorkout={() => setAppState('workout')}
        />
        <div className="p-4 pb-2">
          <BackButton onBack={goBack} />
        </div>
        <WorkoutStats
          workouts={workoutHistory}
          onBack={() => setAppState('idle')}
        />
      </div>
    );
  }

  if (appState === 'idle') {
    return (
      <div className="min-h-screen bg-background">
        <WorkoutHeader 
          onStartWorkout={startWorkout}
          isWorkoutActive={false}
          hasInProgressWorkout={currentExercises.length > 0}
          onResumeWorkout={() => setAppState('workout')}
        />
        <WorkoutLog 
          workouts={workoutHistory}
          onStartWorkout={startWorkout}
          onViewHistory={() => setAppState('history')}
          onViewStats={() => setAppState('stats')}
        />
      </div>
    );
  }

  return (
    <div ref={swipeRef} className="min-h-screen bg-background">
      <WorkoutHeader 
        onStartWorkout={startWorkout}
        isWorkoutActive={appState === 'workout'}
        hasInProgressWorkout={currentExercises.length > 0}
        onResumeWorkout={() => setAppState('workout')}
      />

      <div className="p-4 space-y-4">
        {appState === 'workout' && (
          <>
            <BackButton onBack={goBack} />
            {/* Workout Progress Bar */}
            <Card className="p-4 bg-card border">
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
                className="flex-1 bg-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
              
              {totalCompletedSets > 0 && (
                <Button
                  onClick={showSummary}
                  variant="workout"
                  className="flex-1"
                >
                  Finish Workout
                </Button>
              )}
              
              <Button
                onClick={saveAndExit}
                variant="outline"
                className="px-4"
              >
                Save & Exit
              </Button>
              
              <Button
                onClick={endWorkout}
                variant="secondary"
                className="px-4"
              >
                End
              </Button>
            </div>

            {currentExercises.length === 0 && (
              <Card className="p-8 text-center border">
                <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Exercises Added</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first exercise to start logging sets and reps
                </p>
                <Button
                  onClick={() => setAppState('exercise-selector')}
                  className="bg-primary"
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