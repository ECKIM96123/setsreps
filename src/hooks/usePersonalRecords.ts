import { useState, useEffect } from 'react';
import { Exercise } from '@/components/WorkoutExercise';
import { CompletedWorkout } from './useWorkoutStorage';

export interface PersonalRecord {
  exerciseName: string;
  weight: number;
  reps: number;
  date: Date;
  volume: number; // weight * reps for single best set
}

export const usePersonalRecords = (workoutHistory: CompletedWorkout[]) => {
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);

  useEffect(() => {
    const calculatePRs = () => {
      const prMap = new Map<string, PersonalRecord>();

      workoutHistory.forEach(workout => {
        workout.exercises.forEach(exercise => {
          exercise.sets.forEach(set => {
            if (set.completed && set.weight > 0 && set.reps > 0) {
              const setVolume = set.weight * set.reps;
              const currentPR = prMap.get(exercise.name);
              
              // Update PR if this single set has higher volume (weight × reps)
              if (!currentPR || setVolume > currentPR.volume) {
                prMap.set(exercise.name, {
                  exerciseName: exercise.name,
                  weight: set.weight,
                  reps: set.reps,
                  date: workout.date,
                  volume: setVolume
                });
              }
            }
          });
        });
      });

      setPersonalRecords(Array.from(prMap.values()).sort((a, b) => b.weight - a.weight));
    };

    calculatePRs();
  }, [workoutHistory]);

  const checkForNewPR = (exerciseName: string, weight: number, reps: number): boolean => {
    const currentPR = personalRecords.find(pr => pr.exerciseName === exerciseName);
    if (!currentPR) return true; // First time doing this exercise
    
    const volume = weight * reps;
    return weight > currentPR.weight || 
           (weight === currentPR.weight && volume > currentPR.volume);
  };

  const getExercisePR = (exerciseName: string): PersonalRecord | undefined => {
    return personalRecords.find(pr => pr.exerciseName === exerciseName);
  };

  return {
    personalRecords,
    checkForNewPR,
    getExercisePR
  };
};