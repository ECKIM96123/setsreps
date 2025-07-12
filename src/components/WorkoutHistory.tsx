import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Target, TrendingUp, Edit } from "lucide-react";
import { CompletedWorkout } from "@/hooks/useWorkoutStorage";

interface WorkoutHistoryProps {
  workouts: CompletedWorkout[];
  onClose: () => void;
  onEditWorkout: (workout: CompletedWorkout) => void;
}

export const WorkoutHistory = ({ workouts, onClose, onEditWorkout }: WorkoutHistoryProps) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50 animate-slide-up">
      <Card className="w-full max-h-[85vh] rounded-t-3xl bg-card border-0 shadow-workout overflow-hidden">
        <div className="p-6 border-b border-workout-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Workout History
            </h2>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {workouts.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No workouts yet</h3>
              <p className="text-muted-foreground">Start your first workout to see it here!</p>
            </div>
          ) : (
            <>
              <div className="text-xs text-muted-foreground mb-4">
                {workouts.length} workout{workouts.length !== 1 ? 's' : ''} found
              </div>
              <div className="space-y-4">
                {workouts.map((workout) => (
                  <Card key={workout.id} className="p-4 border-workout-border hover:shadow-workout transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{formatDate(workout.date)}</div>
                        <div className="text-xs text-muted-foreground">at {formatTime(workout.date)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onEditWorkout(workout)}
                          className="text-muted-foreground hover:text-primary p-1"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Badge variant="outline">{workout.exercises.length} exercises</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="text-center p-2 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Clock className="h-3 w-3 text-accent" />
                          <span className="text-sm font-semibold">{workout.duration}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">min</p>
                      </div>
                      
                      <div className="text-center p-2 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Target className="h-3 w-3 text-primary" />
                          <span className="text-sm font-semibold">{workout.totalSets}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">sets</p>
                      </div>
                      
                      <div className="text-center p-2 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <TrendingUp className="h-3 w-3 text-success" />
                          <span className="text-sm font-semibold">{workout.totalVolume.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">kg</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {workout.exercises.slice(0, 3).map((exercise, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{exercise.name}</span>
                          <span className="font-medium">{exercise.sets.length} sets</span>
                        </div>
                      ))}
                      {workout.exercises.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center pt-1">
                          +{workout.exercises.length - 3} more exercises
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};