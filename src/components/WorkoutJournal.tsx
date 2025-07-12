import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, Trophy, Target, Clock, Flame, History, Plus } from "lucide-react";
import { CompletedWorkout } from "@/hooks/useWorkoutStorage";

interface WorkoutJournalProps {
  workouts: CompletedWorkout[];
  onStartWorkout: () => void;
  onViewHistory: () => void;
}

export const WorkoutJournal = ({ workouts, onStartWorkout, onViewHistory }: WorkoutJournalProps) => {
  const today = new Date();
  const todayString = today.toDateString();
  
  // Get today's workouts
  const todaysWorkouts = workouts.filter(w => w.date.toDateString() === todayString);
  
  // Get recent workouts (last 7 days)
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentWorkouts = workouts.filter(w => w.date >= weekAgo);
  
  // Calculate streak
  const calculateStreak = () => {
    if (workouts.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date(today);
    
    // If no workout today, start from yesterday
    if (todaysWorkouts.length === 0) {
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    while (true) {
      const dateString = currentDate.toDateString();
      const hasWorkout = workouts.some(w => w.date.toDateString() === dateString);
      
      if (hasWorkout) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const streak = calculateStreak();
  const totalWorkouts = workouts.length;
  const weeklyWorkouts = recentWorkouts.length;
  
  // Get last workout for motivation
  const lastWorkout = workouts[0];
  
  const formatDate = (date: Date) => {
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">My Workout Journal</h1>
        <p className="text-muted-foreground">
          {today.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame className={`h-4 w-4 ${streak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
            <span className={`text-xl font-bold ${streak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`}>
              {streak}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Day Streak</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-xl font-bold text-primary">{weeklyWorkouts}</span>
          </div>
          <p className="text-xs text-muted-foreground">This Week</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-xl font-bold text-yellow-500">{totalWorkouts}</span>
          </div>
          <p className="text-xs text-muted-foreground">Total</p>
        </Card>
      </div>

      {/* Today's Status */}
      <Card className="p-6">
        {todaysWorkouts.length > 0 ? (
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <Target className="h-5 w-5" />
              <span className="font-semibold">Workout Complete!</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Great job! You completed {todaysWorkouts[0].totalSets} sets in {todaysWorkouts[0].duration} minutes.
            </p>
            <Badge variant="secondary" className="bg-green-50 text-green-700">
              {todaysWorkouts[0].exercises.length} exercises
            </Badge>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Target className="h-6 w-6" />
              <span className="text-lg font-semibold">Ready for Today's Workout?</span>
            </div>
            <p className="text-muted-foreground">
              {streak > 0 
                ? `Keep your ${streak} day streak going! 💪` 
                : "Start your fitness journey today! 🚀"
              }
            </p>
            <Button 
              onClick={onStartWorkout}
              className="bg-gradient-primary shadow-workout"
              size="lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Start Today's Workout
            </Button>
          </div>
        )}
      </Card>

      {/* Recent Activity */}
      {workouts.length > 0 && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Recent Activity
            </h3>
            <Button variant="ghost" size="sm" onClick={onViewHistory}>
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {workouts.slice(0, 3).map((workout) => (
              <div key={workout.id} className="flex items-center justify-between p-3 bg-muted/30">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{formatDate(workout.date)}</span>
                    <Badge variant="outline" className="text-xs">
                      {workout.exercises.length} exercises
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {workout.duration}m
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {workout.totalSets} sets
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {workout.totalVolume}kg
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Motivational Message */}
      {workouts.length === 0 && (
        <Card className="p-6 text-center space-y-4 bg-gradient-subtle">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Welcome to Sets&Reps!</h3>
            <p className="text-muted-foreground">
              Your fitness journey starts here. Track every rep, celebrate every set, and watch your progress grow.
            </p>
          </div>
          <Button 
            onClick={onStartWorkout}
            className="bg-gradient-primary shadow-workout"
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Your First Workout
          </Button>
        </Card>
      )}

      {/* Weekly Progress Preview */}
      {recentWorkouts.length > 0 && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            This Week's Progress
          </h3>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date(today);
              date.setDate(today.getDate() - (6 - i));
              const hasWorkout = workouts.some(w => 
                w.date.toDateString() === date.toDateString()
              );
              
              return (
                <div key={i} className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    {date.toLocaleDateString('en-US', { weekday: 'narrow' })}
                  </div>
                  <div className={`h-8 w-8 mx-auto flex items-center justify-center text-xs ${
                    hasWorkout 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    {hasWorkout ? '✓' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};