import { useState, useEffect } from 'react';
import { Exercise } from '@/components/WorkoutExercise';

export interface CompletedWorkout {
  id: string;
  date: Date;
  exercises: Exercise[];
  duration: number; // in minutes
  totalSets: number;
  totalVolume: number;
}

export const useWorkoutStorage = () => {
  const [workoutHistory, setWorkoutHistory] = useState<CompletedWorkout[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('setsreps-workouts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const workouts = parsed.map((w: any) => ({
          ...w,
          date: new Date(w.date)
        }));
        setWorkoutHistory(workouts);
      } catch (error) {
        console.error('Error loading workout history:', error);
      }
    }
  }, []);

  const saveWorkout = (exercises: Exercise[], startTime: Date) => {
    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60);
    const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.filter(set => set.completed).length, 0);
    const totalVolume = exercises.reduce((sum, ex) => 
      sum + ex.sets.filter(set => set.completed).reduce((vol, set) => vol + (set.weight * set.reps), 0), 0
    );

    const workout: CompletedWorkout = {
      id: Date.now().toString(),
      date: endTime,
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

    return workout;
  };

  const clearHistory = () => {
    setWorkoutHistory([]);
    localStorage.removeItem('setsreps-workouts');
  };

  return {
    workoutHistory,
    saveWorkout,
    clearHistory
  };
};