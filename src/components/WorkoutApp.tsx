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
import { useWorkoutStorage, CompletedWorkout } from "@/hooks/useWorkoutStorage";
import { useToast } from "@/hooks/use-toast";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { Plus, Timer, Target } from "lucide-react";

type AppState = 'idle' | 'workout' | 'exercise-selector' | 'summary' | 'history' | 'stats' | 'edit-workout';

export const WorkoutApp = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [currentExercises, setCurrentExercises] = useState<Exercise[]>([]);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date>(new Date());
  const [editingWorkout, setEditingWorkout] = useState<CompletedWorkout | null>(null);
  const { workoutHistory, saveWorkout, updateWorkout } = useWorkoutStorage();
  const { toast } = useToast();

  // Navigation functions
  const goBack = () => {
    switch (appState) {
      case 'exercise-selector':
        setAppState(editingWorkout ? 'edit-workout' : 'workout');
        break;
      case 'summary':
        setAppState('workout');
        break;
      case 'history':
      case 'stats':
        setAppState('idle');
        break;
      case 'edit-workout':
        setAppState('history');
        setEditingWorkout(null);
        setCurrentExercises([]);
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
  };

  const addExercise = (exercise: { name: string; category: string; muscle: string }) => {
    const newExercise: Exercise = {
      ...exercise,
      sets: []
    };
    setCurrentExercises(prev => [...prev, newExercise]);
    setAppState(editingWorkout ? 'edit-workout' : 'workout');
  };

  const updateExercise = (index: number, updatedExercise: Exercise) => {
    setCurrentExercises(prev => 
      prev.map((ex, i) => i === index ? updatedExercise : ex)
    );
  };

  const deleteExercise = (index: number) => {
    setCurrentExercises(prev => prev.filter((_, i) => i !== index));
  };

  const finishWorkout = () => {
    const completedExercises = currentExercises.filter(ex => 
      ex.sets.some(set => set.completed)
    );
    
    if (completedExercises.length > 0) {
      saveWorkout(currentExercises, workoutStartTime);
    }
    
    setCurrentExercises([]);
    setAppState('idle');
  };

  const endWorkout = () => {
    const completedSets = currentExercises.reduce((sum, ex) => 
      sum + ex.sets.filter(set => set.completed).length, 0
    );
    
    if (completedSets > 0) {
      saveWorkout(currentExercises, workoutStartTime);
    }
    
    setCurrentExercises([]);
    setAppState('idle');
  };

  const cancelWorkout = () => {
    setCurrentExercises([]);
    setAppState('idle');
  };

  const saveAndExit = () => {
    // Keep the workout data but return to main screen
    setAppState('idle');
  };

  const showSummary = () => {
    if (currentExercises.some(ex => ex.sets.some(set => set.completed))) {
      setAppState('summary');
    }
  };

  const editWorkout = (workout: CompletedWorkout) => {
    setEditingWorkout(workout);
    setCurrentExercises([...workout.exercises]);
    setAppState('edit-workout');
  };

  const saveEditedWorkout = () => {
    if (editingWorkout) {
      updateWorkout(editingWorkout.id, currentExercises);
      toast({
        title: "Workout updated",
        description: "Your workout has been saved successfully.",
      });
      setEditingWorkout(null);
      setCurrentExercises([]);
      setAppState('history');
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
          onClose={() => setAppState(editingWorkout ? 'edit-workout' : 'workout')}
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
          onEditWorkout={editWorkout}
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

  if (appState === 'edit-workout') {
    return (
      <div ref={swipeRef} className="min-h-screen bg-background">
        <WorkoutHeader 
          onStartWorkout={startWorkout}
          isWorkoutActive={false}
          hasInProgressWorkout={false}
          onResumeWorkout={() => setAppState('workout')}
        />

        <div className="p-4 space-y-4">
          <BackButton onBack={goBack} />
          
          {/* Edit Workout Header */}
          <Card className="p-4 bg-card border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Edit Workout</span>
              </div>
              {editingWorkout && (
                <div className="text-sm text-muted-foreground">
                  {editingWorkout.date.toLocaleDateString()}
                </div>
              )}
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
              variant="outline"
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Exercise
            </Button>
            
            <Button
              onClick={saveEditedWorkout}
              className="flex-1 bg-primary"
            >
              Save Changes
            </Button>
          </div>
        </div>
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