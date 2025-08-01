import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, BarChart3, History, Target, Edit, Trash2, MoreVertical } from "lucide-react";
import { CompletedWorkout } from "@/hooks/useWorkoutStorage";
import { OfflineStatus } from "./OfflineStatus";
import { useTranslation } from 'react-i18next';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface WorkoutLogProps {
  workouts: CompletedWorkout[];
  onStartWorkout: () => void;
  onViewStats: () => void;
  onViewPrograms: () => void;
  onEditWorkout: (workout: CompletedWorkout) => void;
  onDeleteWorkout: (workoutId: string) => void;
}

export const WorkoutLog = ({ workouts, onStartWorkout, onViewStats, onViewPrograms, onEditWorkout, onDeleteWorkout }: WorkoutLogProps) => {
  const { t } = useTranslation();
  const [deletingWorkout, setDeletingWorkout] = useState<string | null>(null);
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateStr = date.toDateString();
    const todayStr = today.toDateString();
    const yesterdayStr = yesterday.toDateString();
    
    if (dateStr === todayStr) return t('common.today');
    if (dateStr === yesterdayStr) return t('common.yesterday');
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric',
      month: 'short'
    }).toUpperCase();
  };

  const getWorkoutType = (exercises: any[]) => {
    const muscleGroups = exercises.map(ex => ex.category.toLowerCase());
    
    if (muscleGroups.includes('chest') || muscleGroups.includes('shoulders') || muscleGroups.includes('arms')) {
      return 'Push';
    } else if (muscleGroups.includes('back')) {
      return 'Pull';
    } else if (muscleGroups.includes('legs')) {
      return 'Legs';
    } else {
      return 'Workout';
    }
  };

  const formatExerciseSummary = (exercise: any) => {
    const completedSets = exercise.sets.filter((set: any) => set.completed);
    if (completedSets.length === 0) return null;
    
    // Group sets by reps to show like "4x 12, 2x 10" format
    const repGroups: { [key: number]: number } = {};
    completedSets.forEach((set: any) => {
      repGroups[set.reps] = (repGroups[set.reps] || 0) + 1;
    });
    
    const repSummary = Object.entries(repGroups)
      .map(([reps, count]) => `${count}x ${reps}`)
      .join(', ');
    
    return `${repSummary} ${exercise.name}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Workout Timeline */}
      <div className="p-4 space-y-4 pb-24">
        {/* Offline Status */}
        <OfflineStatus />
        
        {workouts.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <Target className="h-16 w-16 mx-auto text-muted-foreground" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{t('workout.noWorkoutsYet')}</h2>
              <p className="text-muted-foreground">{t('workout.startLoggingFirst')}</p>
            </div>
            <Button onClick={onStartWorkout} className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              {t('workout.startFirstWorkout')}
            </Button>
          </div>
        ) : (
          <>
            {/* Quick Start New Workout Card */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{t('workout.startNewWorkout')}</h3>
                  <p className="text-sm text-muted-foreground">{t('workout.beginFreshSession')}</p>
                </div>
                <Button 
                  onClick={onStartWorkout}
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('common.start')}
                </Button>
              </div>
            </Card>
            
            {workouts.map((workout) => (
            <div key={workout.id} className="flex gap-4">
              {/* Date Column */}
              <div className="w-16 flex-shrink-0 text-center">
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  {formatDate(workout.date).split(' ')[0]}
                </div>
                <div className="text-2xl font-bold">
                  {workout.date.getDate()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {workout.date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                </div>
              </div>

              {/* Workout Card */}
              <Card className="flex-1 p-4 shadow-sm border-l-4 border-l-primary">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{getWorkoutType(workout.exercises)}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {workout.exercises.length} {t('workout.exercises').toLowerCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-muted-foreground hover:text-primary p-1"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditWorkout(workout)}>
                          <Edit className="h-4 w-4 mr-2" />
                          {t('workout.editWorkout')}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setDeletingWorkout(workout.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t('workout.deleteWorkout')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="text-sm text-muted-foreground">
                      {workout.duration} {t('workout.minutes')}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  {workout.exercises.map((exercise, index) => {
                    const summary = formatExerciseSummary(exercise);
                    if (!summary) return null;
                    
                    return (
                      <div key={index} className="text-sm text-muted-foreground">
                        {summary}
                      </div>
                    );
                  })}
                </div>

                {/* Quick Stats */}
                <div className="flex gap-4 mt-3 pt-3 border-t text-xs text-muted-foreground">
                  <span>{workout.totalSets} {t('workout.sets').toLowerCase()}</span>
                </div>
              </Card>
            </div>
            ))}
          </>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={onStartWorkout}
          size="lg"
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="flex items-center justify-around py-3">
          <Button variant="ghost" className="flex-1 flex-col h-auto py-2">
            <History className="h-5 w-5 mb-1" />
            <span className="text-xs">{t('navigation.log')}</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex-col h-auto py-2" onClick={onViewPrograms}>
            <Target className="h-5 w-5 mb-1" />
            <span className="text-xs">{t('navigation.program')}</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex-col h-auto py-2" onClick={onViewStats}>
            <BarChart3 className="h-5 w-5 mb-1" />
            <span className="text-xs">{t('navigation.stats')}</span>
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingWorkout} onOpenChange={() => setDeletingWorkout(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('workout.deleteWorkout')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('workout.deleteWorkoutConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (deletingWorkout) {
                  onDeleteWorkout(deletingWorkout);
                  setDeletingWorkout(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};