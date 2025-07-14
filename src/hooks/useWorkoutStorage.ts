import { useState, useEffect } from 'react';
import { Exercise } from '@/components/WorkoutExercise';
import { useOfflineMode } from './useOfflineMode';

export interface CompletedWorkout {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  exercises: Exercise[];
  duration: number; // in minutes
  totalSets: number;
  totalVolume: number;
}

export const useWorkoutStorage = () => {
  const { saveWorkoutOffline, updateWorkoutOffline, isOnline } = useOfflineMode();
  const [workoutHistory, setWorkoutHistory] = useState<CompletedWorkout[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('setsreps-workouts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const workouts = parsed.map((w: any) => ({
          ...w,
          date: new Date(w.date),
          startTime: w.startTime ? new Date(w.startTime) : new Date(w.date),
          endTime: w.endTime ? new Date(w.endTime) : new Date(w.date)
        }));
        setWorkoutHistory(workouts);
      } catch (error) {
        console.error('Error loading workout history:', error);
      }
    }
  }, []);

  const saveWorkout = (exercises: Exercise[], startTime: Date, endTime?: Date) => {
    const actualEndTime = endTime || new Date();
    const duration = Math.floor((actualEndTime.getTime() - startTime.getTime()) / 1000 / 60);
    const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.filter(set => set.completed).length, 0);
    const totalVolume = exercises.reduce((sum, ex) => 
      sum + ex.sets.filter(set => set.completed).reduce((vol, set) => vol + (set.weight * set.reps), 0), 0
    );

    const workout: CompletedWorkout = {
      id: Date.now().toString(),
      date: actualEndTime,
      startTime,
      endTime: actualEndTime,
      exercises: exercises.map(ex => ({
        ...ex,
        sets: ex.sets.filter(set => set.completed)
      })).filter(ex => ex.sets.length > 0),
      duration,
      totalSets,
      totalVolume
    };

    const updated = [workout, ...workoutHistory].slice(0, 50); // Keep last 50 workouts
    setWorkoutHistory(updated);
    
    try {
      localStorage.setItem('setsreps-workouts', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving workout:', error);
    }

    // Save to offline storage for sync
    saveWorkoutOffline(workout);

    return workout;
  };

  const updateWorkout = (workoutId: string, exercises: Exercise[]) => {
    const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.filter(set => set.completed).length, 0);
    const totalVolume = exercises.reduce((sum, ex) => 
      sum + ex.sets.filter(set => set.completed).reduce((vol, set) => vol + (set.weight * set.reps), 0), 0
    );

    const updated = workoutHistory.map(workout => 
      workout.id === workoutId 
        ? {
            ...workout,
            exercises: exercises.map(ex => ({
              ...ex,
              sets: ex.sets.filter(set => set.completed)
            })).filter(ex => ex.sets.length > 0),
            totalSets,
            totalVolume
          }
        : workout
    );
    
    setWorkoutHistory(updated);
    
    try {
      localStorage.setItem('setsreps-workouts', JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating workout:', error);
    }

    // Update offline storage for sync
    const updatedWorkout = updated.find(w => w.id === workoutId);
    if (updatedWorkout) {
      updateWorkoutOffline(workoutId, updatedWorkout);
    }
  };

  const deleteWorkout = (workoutId: string) => {
    const updated = workoutHistory.filter(workout => workout.id !== workoutId);
    setWorkoutHistory(updated);
    
    try {
      localStorage.setItem('setsreps-workouts', JSON.stringify(updated));
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  const updateWorkoutTimes = (workoutId: string, startTime: Date, endTime: Date) => {
    const updated = workoutHistory.map(workout => 
      workout.id === workoutId 
        ? {
            ...workout,
            startTime,
            endTime,
            duration: Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60),
            date: endTime // Update date to match end time
          }
        : workout
    );
    
    setWorkoutHistory(updated);
    
    try {
      localStorage.setItem('setsreps-workouts', JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating workout times:', error);
    }

    // Update offline storage for sync
    const updatedWorkout = updated.find(w => w.id === workoutId);
    if (updatedWorkout) {
      updateWorkoutOffline(workoutId, updatedWorkout);
    }
  };

  const clearHistory = () => {
    setWorkoutHistory([]);
    localStorage.removeItem('setsreps-workouts');
  };

  return {
    workoutHistory,
    saveWorkout,
    updateWorkout,
    updateWorkoutTimes,
    deleteWorkout,
    clearHistory
  };
};