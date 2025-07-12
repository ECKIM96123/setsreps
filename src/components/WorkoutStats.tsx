import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Trophy, 
  Target, 
  Clock, 
  Flame,
  Calendar,
  Dumbbell,
  Award,
  ArrowLeft
} from "lucide-react";
import { CompletedWorkout } from "@/hooks/useWorkoutStorage";

interface WorkoutStatsProps {
  workouts: CompletedWorkout[];
  onBack: () => void;
}

export const WorkoutStats = ({ workouts, onBack }: WorkoutStatsProps) => {
  // Calculate comprehensive statistics
  const calculateStats = () => {
    if (workouts.length === 0) {
      return {
        totalWorkouts: 0,
        totalSets: 0,
        totalVolume: 0,
        totalDuration: 0,
        averageDuration: 0,
        averageSetsPerWorkout: 0,
        personalRecords: {},
        exerciseFrequency: {},
        monthlyProgress: [],
        currentStreak: 0,
        longestStreak: 0
      };
    }

    const totalWorkouts = workouts.length;
    const totalSets = workouts.reduce((sum, w) => sum + w.totalSets, 0);
    const totalVolume = workouts.reduce((sum, w) => sum + w.totalVolume, 0);
    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
    
    // Personal Records - highest weight for each exercise
    const personalRecords: { [key: string]: { weight: number; reps: number; date: Date } } = {};
    const exerciseFrequency: { [key: string]: number } = {};
    
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exerciseFrequency[exercise.name] = (exerciseFrequency[exercise.name] || 0) + 1;
        
        exercise.sets.forEach(set => {
          if (!personalRecords[exercise.name] || set.weight > personalRecords[exercise.name].weight) {
            personalRecords[exercise.name] = {
              weight: set.weight,
              reps: set.reps,
              date: workout.date
            };
          }
        });
      });
    });

    // Calculate streaks
    const calculateStreak = () => {
      const today = new Date();
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      // Sort workouts by date
      const sortedWorkouts = [...workouts].sort((a, b) => b.date.getTime() - a.date.getTime());
      
      // Check current streak
      let currentDate = new Date(today);
      const hasWorkoutToday = sortedWorkouts.some(w => 
        w.date.toDateString() === today.toDateString()
      );
      
      if (!hasWorkoutToday) {
        currentDate.setDate(currentDate.getDate() - 1);
      }
      
      while (true) {
        const dateString = currentDate.toDateString();
        const hasWorkout = sortedWorkouts.some(w => w.date.toDateString() === dateString);
        
        if (hasWorkout) {
          currentStreak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
      
      // Calculate longest streak
      const workoutDates = sortedWorkouts.map(w => w.date.toDateString());
      const uniqueDates = [...new Set(workoutDates)].sort();
      
      for (let i = 0; i < uniqueDates.length; i++) {
        tempStreak = 1;
        
        for (let j = i + 1; j < uniqueDates.length; j++) {
          const date1 = new Date(uniqueDates[j - 1]);
          const date2 = new Date(uniqueDates[j]);
          const diffTime = date2.getTime() - date1.getTime();
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          
          if (diffDays === 1) {
            tempStreak++;
          } else {
            break;
          }
        }
        
        longestStreak = Math.max(longestStreak, tempStreak);
      }
      
      return { currentStreak, longestStreak };
    };

    const { currentStreak, longestStreak } = calculateStreak();

    // Monthly progress (last 6 months)
    const monthlyProgress = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthWorkouts = workouts.filter(w => 
        w.date.getMonth() === date.getMonth() && 
        w.date.getFullYear() === date.getFullYear()
      );
      
      monthlyProgress.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        workouts: monthWorkouts.length,
        volume: monthWorkouts.reduce((sum, w) => sum + w.totalVolume, 0)
      });
    }

    return {
      totalWorkouts,
      totalSets,
      totalVolume,
      totalDuration,
      averageDuration: Math.round(totalDuration / totalWorkouts),
      averageSetsPerWorkout: Math.round(totalSets / totalWorkouts),
      personalRecords,
      exerciseFrequency,
      monthlyProgress,
      currentStreak,
      longestStreak
    };
  };

  const stats = calculateStats();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const topExercises = Object.entries(stats.exerciseFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const topPRs = Object.entries(stats.personalRecords)
    .filter(([,pr]) => pr.weight > 0)
    .sort(([,a], [,b]) => b.weight - a.weight)
    .slice(0, 5);

  if (workouts.length === 0) {
    return (
      <div className="p-4 text-center py-16">
        <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Data Yet</h2>
        <p className="text-muted-foreground">Complete some workouts to see your statistics!</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-24">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center">
            <Calendar className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
            <div className="text-xs text-muted-foreground">Total Workouts</div>
          </Card>
          
          <Card className="p-4 text-center">
            <Target className="h-5 w-5 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{stats.totalSets}</div>
            <div className="text-xs text-muted-foreground">Total Sets</div>
          </Card>
          
          <Card className="p-4 text-center">
            <Dumbbell className="h-5 w-5 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold">{stats.totalVolume.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Volume (kg)</div>
          </Card>
          
          <Card className="p-4 text-center">
            <Clock className="h-5 w-5 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{Math.round(stats.totalDuration / 60)}</div>
            <div className="text-xs text-muted-foreground">Total Hours</div>
          </Card>
        </div>

        {/* Streaks */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Workout Streaks
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">{stats.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500">{stats.longestStreak}</div>
              <div className="text-sm text-muted-foreground">Longest Streak</div>
            </div>
          </div>
        </Card>

        {/* Personal Records */}
        {topPRs.length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Personal Records
            </h3>
            <div className="space-y-3">
              {topPRs.map(([exercise, pr]) => (
                <div key={exercise} className="flex items-center justify-between p-3 bg-muted/30">
                  <div>
                    <div className="font-medium text-sm">{exercise}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(pr.date)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-yellow-600">{pr.weight}kg</div>
                    <div className="text-xs text-muted-foreground">{pr.reps} reps</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Most Used Exercises */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-500" />
            Most Used Exercises
          </h3>
          <div className="space-y-2">
            {topExercises.map(([exercise, count], index) => (
              <div key={exercise} className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary/10 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium text-sm">{exercise}</span>
                </div>
                <Badge variant="secondary">{count} times</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Averages */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Averages
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/30">
              <div className="text-xl font-bold">{stats.averageDuration}</div>
              <div className="text-xs text-muted-foreground">Minutes per Workout</div>
            </div>
            <div className="text-center p-3 bg-muted/30">
              <div className="text-xl font-bold">{stats.averageSetsPerWorkout}</div>
              <div className="text-xs text-muted-foreground">Sets per Workout</div>
            </div>
          </div>
        </Card>
      </div>
    );
  };