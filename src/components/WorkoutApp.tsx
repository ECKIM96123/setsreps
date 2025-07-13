import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WorkoutHeader } from "./WorkoutHeader";
import { BackButton } from "./BackButton";
import { ExerciseSelector } from "./ExerciseSelector";
import { WorkoutExercise, Exercise } from "./WorkoutExercise";
import { WorkoutPrograms, WorkoutProgram } from "./WorkoutPrograms";
import { AIWorkoutGenerator } from "./AIWorkoutGenerator";
import { WorkoutSummary } from "./WorkoutSummary";

import { WorkoutLog } from "./WorkoutLog";
import { WorkoutStats } from "./WorkoutStats";
import { useWorkoutStorage, CompletedWorkout } from "@/hooks/useWorkoutStorage";
import { useToast } from "@/hooks/use-toast";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { usePersonalRecords } from "@/hooks/usePersonalRecords";
import { Plus, Timer, Target } from "lucide-react";

type AppState = 'idle' | 'workout' | 'exercise-selector' | 'summary' | 'stats' | 'edit-workout' | 'programs' | 'ai-generator';

export const WorkoutApp = () => {
  const { t } = useTranslation();
  const [appState, setAppState] = useState<AppState>('idle');
  const [currentExercises, setCurrentExercises] = useState<Exercise[]>([]);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date>(new Date());
  const [editingWorkout, setEditingWorkout] = useState<CompletedWorkout | null>(null);
  const { workoutHistory, saveWorkout, updateWorkout, deleteWorkout } = useWorkoutStorage();
  const { personalRecords, getExercisePR } = usePersonalRecords(workoutHistory);
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
      case 'stats':
      case 'programs':
        setAppState('idle');
        break;
      case 'edit-workout':
        setAppState('idle');
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

  const toggleSuperset = (index: number) => {
    setCurrentExercises(prev => {
      const updated = [...prev];
      const exercise = updated[index];
      
      if (exercise.supersetGroup !== undefined) {
        // Remove from superset
        const groupToRemove = exercise.supersetGroup;
        updated.forEach((ex, i) => {
          if (ex.supersetGroup === groupToRemove) {
            delete ex.supersetGroup;
            delete ex.supersetWith;
          }
        });
      } else {
        // Add to superset
        const nextExercise = updated[index + 1];
        if (nextExercise) {
          // Create new superset group with next exercise
          const groupId = Date.now();
          exercise.supersetGroup = groupId;
          exercise.supersetWith = `${index + 1}`;
          nextExercise.supersetGroup = groupId;
        }
      }
      
      return updated;
    });
  };

  const getSupersetPosition = (index: number): 'first' | 'middle' | 'last' | 'single' => {
    const exercise = currentExercises[index];
    if (!exercise.supersetGroup) return 'single';
    
    const supersetExercises = currentExercises.filter(ex => ex.supersetGroup === exercise.supersetGroup);
    if (supersetExercises.length === 1) return 'single';
    
    const supersetIndices = supersetExercises.map(ex => 
      currentExercises.findIndex(e => e === ex)
    ).sort((a, b) => a - b);
    
    const positionInSuperset = supersetIndices.indexOf(index);
    
    if (positionInSuperset === 0) return 'first';
    if (positionInSuperset === supersetIndices.length - 1) return 'last';
    return 'middle';
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
      setAppState('idle');
    }
  };

  const selectProgram = (program: WorkoutProgram) => {
    const programExercises: Exercise[] = program.exercises.map(ex => {
      // Parse reps to get number or handle ranges/special cases
      const parseReps = (repsString: string): number => {
        // Handle ranges like "8-10", take the minimum value
        if (repsString.includes('-')) {
          const [min] = repsString.split('-').map(num => parseInt(num.trim()));
          return min; // Use minimum value from range
        }
        // Handle "each leg/arm" cases - extract the number
        if (repsString.includes('each')) {
          const match = repsString.match(/(\d+)/);
          return match ? parseInt(match[1]) : 10;
        }
        // Handle time-based or special cases
        if (repsString.includes('sec') || repsString.includes('failure')) {
          return 1; // For time-based or failure sets, use 1 as placeholder
        }
        // Extract first number from string
        const match = repsString.match(/(\d+)/);
        return match ? parseInt(match[1]) : 10;
      };

      // Create pre-filled sets with reps but no weight
      const preFilleSets = Array.from({ length: ex.sets }, () => ({
        reps: parseReps(ex.reps),
        weight: 0,
        completed: false
      }));

      return {
        name: ex.name,
        category: ex.category,
        muscle: ex.muscle,
        sets: preFilleSets
      };
    });
    
    setCurrentExercises(programExercises);
    setWorkoutStartTime(new Date());
    setAppState('workout');
    
    toast({
      title: `${program.name} started`,
      description: `Ready to begin your ${program.exercises.length} exercise workout.`,
    });
  };

  const handleNewPR = (exerciseName: string, weight: number, reps: number) => {
    toast({
      title: "🎉 New Personal Record!",
      description: `${exerciseName}: ${weight}kg × ${reps} reps`,
    });
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

  if (appState === 'programs') {
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
        <WorkoutPrograms 
          onSelectProgram={selectProgram} 
          onOpenAIGenerator={() => setAppState('ai-generator')}
        />
      </div>
    );
  }

  if (appState === 'ai-generator') {
    return (
      <div ref={swipeRef} className="min-h-screen bg-background">
        <WorkoutHeader 
          onStartWorkout={startWorkout}
          isWorkoutActive={false}
          hasInProgressWorkout={currentExercises.length > 0}
          onResumeWorkout={() => setAppState('workout')}
        />
        <AIWorkoutGenerator 
          onGeneratedProgram={selectProgram}
          onBack={() => setAppState('programs')}
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
                <span className="text-sm font-medium">{t('workout.editWorkout')}</span>
              </div>
              {editingWorkout && (
                <div className="text-sm text-muted-foreground">
                  {editingWorkout.date.toLocaleDateString()}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">
                {currentExercises.length} {t('workout.exercises')}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-primary font-medium">
                {totalCompletedSets} {t('workout.setsCompleted')}
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
                  onToggleSuperset={() => toggleSuperset(index)}
                  isInSuperset={exercise.supersetGroup !== undefined}
                  supersetPosition={getSupersetPosition(index)}
                  currentPR={getExercisePR(exercise.name)}
                  onNewPR={handleNewPR}
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
              {t('workout.addExercise')}
            </Button>
            
            <Button
              onClick={saveEditedWorkout}
              className="flex-1 bg-primary"
            >
              {t('workout.saveChanges')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'idle') {
    return (
      <div className="min-h-screen bg-background" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <WorkoutHeader 
          onStartWorkout={startWorkout}
          isWorkoutActive={false}
          hasInProgressWorkout={currentExercises.length > 0}
          onResumeWorkout={() => setAppState('workout')}
        />
        <WorkoutLog 
          workouts={workoutHistory}
          onStartWorkout={startWorkout}
          onViewStats={() => setAppState('stats')}
          onViewPrograms={() => setAppState('programs')}
          onEditWorkout={editWorkout}
          onDeleteWorkout={deleteWorkout}
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
                  <span className="text-sm font-medium">{t('workout.activeWorkout')}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {workoutDuration} min
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  {currentExercises.length} {t('workout.exercises')}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-primary font-medium">
                  {totalCompletedSets} {t('workout.setsCompleted')}
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
                  onToggleSuperset={() => toggleSuperset(index)}
                  isInSuperset={exercise.supersetGroup !== undefined}
                  supersetPosition={getSupersetPosition(index)}
                  currentPR={getExercisePR(exercise.name)}
                  onNewPR={handleNewPR}
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
                {t('workout.addExercise')}
              </Button>
              
              <Button
                onClick={totalCompletedSets > 0 ? showSummary : cancelWorkout}
                variant={totalCompletedSets > 0 ? "workout" : "outline"}
                className="flex-1"
              >
                {totalCompletedSets > 0 ? t('workout.finishWorkout') : t('workout.cancelWorkout')}
              </Button>
            </div>

            {currentExercises.length === 0 && (
              <Card className="p-8 text-center border">
                <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">{t('workout.noExercisesAdded')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('workout.addFirstExercise')}
                </p>
                <Button
                  onClick={() => setAppState('exercise-selector')}
                  className="bg-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('workout.addExercise')}
                </Button>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};