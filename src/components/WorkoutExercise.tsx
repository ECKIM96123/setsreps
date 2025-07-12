import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RestTimer } from "./RestTimer";
import { Trash2, Plus, Check, Timer, Copy, Info, Link, Unlink, Crown, Trophy, Settings } from "lucide-react";
import { exerciseInstructions } from "@/lib/exerciseInstructions";
import { usePremium } from "@/contexts/PremiumContext";
import { PersonalRecord } from "@/hooks/usePersonalRecords";
import { useToast } from "@/hooks/use-toast";

export interface WorkoutSet {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface Exercise {
  name: string;
  category: string;
  muscle: string;
  sets: WorkoutSet[];
  supersetWith?: string; // ID of the next exercise in the superset
  supersetGroup?: number; // Group number for visual grouping
}

interface WorkoutExerciseProps {
  exercise: Exercise;
  onUpdateExercise: (exercise: Exercise) => void;
  onDeleteExercise: () => void;
  onToggleSuperset?: () => void;
  isInSuperset?: boolean;
  supersetPosition?: 'first' | 'middle' | 'last' | 'single';
  currentPR?: PersonalRecord;
  onNewPR?: (exerciseName: string, weight: number, reps: number) => void;
}

export const WorkoutExercise = ({ exercise, onUpdateExercise, onDeleteExercise, onToggleSuperset, isInSuperset = false, supersetPosition = 'single', currentPR, onNewPR }: WorkoutExerciseProps) => {
  const { t } = useTranslation();
  const { isPremium, upgradeToPremium } = usePremium();
  const { toast } = useToast();
  const [newWeight, setNewWeight] = useState("");
  const [newReps, setNewReps] = useState("");
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [autoStartTimer, setAutoStartTimer] = useState(() => {
    const saved = localStorage.getItem('autoStartTimer');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('autoStartTimer', JSON.stringify(autoStartTimer));
  }, [autoStartTimer]);

  const addSet = () => {
    const weight = parseFloat(newWeight) || 0;
    const reps = parseInt(newReps) || 0;
    
    // Validation with notifications
    if (!newReps || reps <= 0) {
      toast({
        title: t('validation.repsRequired'),
        description: t('validation.repsRequiredDesc'),
        variant: "destructive",
      });
      return;
    }

    if (!newWeight || weight <= 0) {
      toast({
        title: t('validation.weightRequired'),
        description: t('validation.weightRequiredDesc'),
        variant: "destructive",
      });
      return;
    }
    
    // Check for new PR - compare single set volume (weight × reps)
    const setVolume = weight * reps;
    const isNewPR = !currentPR || setVolume > currentPR.volume;
    
    if (isNewPR && weight > 0 && onNewPR) {
      onNewPR(exercise.name, weight, reps);
    }

    const newSet: WorkoutSet = {
      reps,
      weight,
      completed: true // Automatically mark as completed when added
    };
    
    onUpdateExercise({
      ...exercise,
      sets: [...exercise.sets, newSet]
    });
    
    setNewReps("");
    
    // Auto-start timer if setting is enabled
    if (autoStartTimer) {
      setShowRestTimer(true);
    }
    // Keep weight for next set
  };

  const toggleSetComplete = (index: number) => {
    const updatedSets = exercise.sets.map((set, i) => 
      i === index ? { ...set, completed: !set.completed } : set
    );
    
    onUpdateExercise({
      ...exercise,
      sets: updatedSets
    });
  };

  const editSet = (index: number, field: 'reps' | 'weight', value: string) => {
    const numValue = field === 'reps' ? parseInt(value) || 0 : parseFloat(value) || 0;
    const updatedSets = exercise.sets.map((set, i) => 
      i === index ? { ...set, [field]: numValue } : set
    );
    
    onUpdateExercise({
      ...exercise,
      sets: updatedSets
    });
  };

  const deleteSet = (index: number) => {
    const updatedSets = exercise.sets.filter((_, i) => i !== index);
    onUpdateExercise({
      ...exercise,
      sets: updatedSets
    });
  };

  const duplicateSet = (index: number) => {
    const setToDuplicate = exercise.sets[index];
    const newSet: WorkoutSet = {
      ...setToDuplicate,
      completed: true
    };
    
    const updatedSets = [...exercise.sets];
    updatedSets.splice(index + 1, 0, newSet);
    
    onUpdateExercise({
      ...exercise,
      sets: updatedSets
    });
  };

  const completedSets = exercise.sets.filter(set => set.completed).length;

  // Superset visual styling
  const getCardClassName = () => {
    let baseClass = "p-4 space-y-4 shadow-workout border-workout-border";
    
    if (isInSuperset) {
      switch (supersetPosition) {
        case 'first':
          return `${baseClass} border-l-4 border-l-orange-500 bg-orange-50/50`;
        case 'middle':
          return `${baseClass} border-l-4 border-l-orange-500 bg-orange-50/50 border-t-0 rounded-t-none`;
        case 'last':
          return `${baseClass} border-l-4 border-l-orange-500 bg-orange-50/50 border-t-0 rounded-t-none`;
        default:
          return `${baseClass} border-l-4 border-l-orange-500 bg-orange-50/50`;
      }
    }
    
    return baseClass;
  };

  return (
    <>
      <RestTimer 
        isVisible={showRestTimer}
        onClose={() => setShowRestTimer(false)}
        defaultTime={90}
      />
      
      <Card className={getCardClassName()}>
        {isInSuperset && supersetPosition === 'first' && (
          <div className="flex items-center gap-2 -mt-2 mb-2">
            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
              <Link className="h-3 w-3 mr-1" />
              {t('exercises.superset')}
            </Badge>
          </div>
        )}
        
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">{exercise.name}</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-muted">
                  <Info className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{exercise.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <strong>{t('exercises.target')}:</strong> {exercise.muscle} ({exercise.category})
                  </div>
                  <div className="text-sm">
                    <strong>{t('exercises.howToPerform')}:</strong>
                    <p className="mt-1 text-muted-foreground">
                      {exerciseInstructions[exercise.name] || t('exercises.instructionsNotAvailable')}
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Badge variant="outline" className="text-xs">
              {exercise.category}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{exercise.muscle}</p>
          {exercise.sets.length > 0 && (
            <p className="text-xs text-primary font-medium mt-1">
              {completedSets}/{exercise.sets.length} {t('workout.setsCompleted')}
            </p>
          )}
          {currentPR && (
            <div className="flex items-center gap-1 mt-1">
              <Trophy className="h-3 w-3 text-yellow-500" />
              <span className="text-xs text-muted-foreground">
                {t('exercises.pr')}: {currentPR.weight}kg × {currentPR.reps} {t('exercises.reps')}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Timer Settings */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                title={t('exercises.timerSettings')}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>{t('exercises.timerSettings')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">{t('exercises.autoStartTimer')}</div>
                    <div className="text-xs text-muted-foreground">
                      {t('exercises.autoStartTimerDescription')}
                    </div>
                  </div>
                  <Switch
                    checked={autoStartTimer}
                    onCheckedChange={setAutoStartTimer}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {onToggleSuperset && (
            <Button
              variant="ghost"
              size="sm"
              onClick={isPremium ? onToggleSuperset : upgradeToPremium}
              className={`h-8 w-8 p-0 transition-colors relative ${
                isInSuperset 
                  ? 'text-orange-600 hover:text-orange-700 bg-orange-100' 
                  : isPremium
                    ? 'text-muted-foreground hover:text-orange-600'
                    : 'text-muted-foreground hover:text-primary'
              }`}
              title={
                !isPremium 
                  ? t('exercises.upgradeForSupersets')
                  : isInSuperset 
                    ? t('exercises.removeFromSuperset')
                    : t('exercises.addToSuperset')
              }
            >
              {!isPremium && <Crown className="h-3 w-3 absolute -top-1 -right-1 text-primary" />}
              {isInSuperset ? <Unlink className="h-4 w-4" /> : <Link className="h-4 w-4" />}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onDeleteExercise}
            className="text-destructive hover:text-destructive h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

        {exercise.sets.length > 0 && (
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-2">
              <div className="col-span-2">{t('exercises.set')}</div>
              <div className="col-span-4">{t('exercises.weight')}</div>
              <div className="col-span-3">{t('exercises.reps')}</div>
              <div className="col-span-3 text-right">{t('exercises.actions')}</div>
            </div>
          
            {exercise.sets.map((set, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg bg-green-50 border border-green-200">
                <div className="col-span-2 text-sm font-medium">
                  {index + 1}
                </div>
                <div className="col-span-4">
                  <input
                    type="number"
                    value={set.weight}
                    onChange={(e) => editSet(index, 'weight', e.target.value)}
                    className="w-full h-8 px-2 text-sm border rounded bg-white"
              placeholder={t('workout.kg')}
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    value={set.reps}
                    onChange={(e) => editSet(index, 'reps', e.target.value)}
                    className="w-full h-8 px-2 text-sm border rounded bg-white"
              placeholder={t('exercises.reps')}
                  />
                </div>
                <div className="col-span-3 flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => duplicateSet(index)}
                    className="text-muted-foreground hover:text-primary h-8 w-8 p-0 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRestTimer(true)}
                    className="text-primary hover:text-primary h-8 w-8 p-0 transition-colors"
                  >
                    <Timer className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSet(index)}
                    className="text-muted-foreground hover:text-destructive h-8 w-8 p-0 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      )}

        <div className="grid grid-cols-12 gap-2 pt-2 border-t border-workout-border">
          <div className="col-span-2 flex items-center">
            <span className="text-sm font-medium text-muted-foreground">
              {exercise.sets.length + 1}
            </span>
          </div>
          <div className="col-span-4">
          <Input
            type="number"
            placeholder={t('workout.kg')}
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            className="h-8 text-sm"
          />
          </div>
          <div className="col-span-3">
            <Input
              type="number"
              placeholder={t('exercises.reps')}
              value={newReps}
              onChange={(e) => setNewReps(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSet()}
              className="h-8 text-sm"
            />
          </div>
          <div className="col-span-3 flex gap-1">
          <Button
            onClick={addSet}
            size="sm"
            variant="workout"
            className="flex-1 h-8"
            disabled={!newReps}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        </div>
      </Card>
    </>
  );
};
