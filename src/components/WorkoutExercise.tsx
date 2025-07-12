import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RestTimer } from "./RestTimer";
import { Trash2, Plus, Check, Timer } from "lucide-react";

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
}

interface WorkoutExerciseProps {
  exercise: Exercise;
  onUpdateExercise: (exercise: Exercise) => void;
  onDeleteExercise: () => void;
}

export const WorkoutExercise = ({ exercise, onUpdateExercise, onDeleteExercise }: WorkoutExerciseProps) => {
  const [newWeight, setNewWeight] = useState("");
  const [newReps, setNewReps] = useState("");
  const [showRestTimer, setShowRestTimer] = useState(false);

  const addSet = () => {
    const weight = parseFloat(newWeight) || 0;
    const reps = parseInt(newReps) || 0;
    
    if (reps > 0) {
      const newSet: WorkoutSet = {
        reps,
        weight,
        completed: false
      };
      
      onUpdateExercise({
        ...exercise,
        sets: [...exercise.sets, newSet]
      });
      
      setNewReps("");
      // Keep weight for next set
    }
  };

  const toggleSetComplete = (index: number) => {
    const updatedSets = exercise.sets.map((set, i) => 
      i === index ? { ...set, completed: !set.completed } : set
    );
    
    onUpdateExercise({
      ...exercise,
      sets: updatedSets
    });

    // Show rest timer when completing a set (not uncompleting)
    if (!exercise.sets[index].completed) {
      setShowRestTimer(true);
    }
  };

  const deleteSet = (index: number) => {
    const updatedSets = exercise.sets.filter((_, i) => i !== index);
    onUpdateExercise({
      ...exercise,
      sets: updatedSets
    });
  };

  const completedSets = exercise.sets.filter(set => set.completed).length;

  return (
    <>
      <RestTimer 
        isVisible={showRestTimer}
        onClose={() => setShowRestTimer(false)}
        defaultTime={90}
      />
      
      <Card className="p-4 space-y-4 shadow-workout border-workout-border">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">{exercise.name}</h3>
            <Badge variant="outline" className="text-xs">
              {exercise.category}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{exercise.muscle}</p>
          {exercise.sets.length > 0 && (
            <p className="text-xs text-primary font-medium mt-1">
              {completedSets}/{exercise.sets.length} sets completed
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDeleteExercise}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {exercise.sets.length > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-2">
            <div className="col-span-2">Set</div>
            <div className="col-span-3">Weight</div>
            <div className="col-span-3">Reps</div>
            <div className="col-span-2">Done</div>
            <div className="col-span-2"></div>
          </div>
          
          {exercise.sets.map((set, index) => (
            <div key={index} className={`grid grid-cols-12 gap-2 items-center p-2 rounded-lg transition-colors ${
              set.completed ? 'bg-success/10' : 'bg-muted/30'
            }`}>
              <div className="col-span-2 text-sm font-medium">
                {index + 1}
              </div>
              <div className="col-span-3 text-sm">
                {set.weight > 0 ? `${set.weight} kg` : '—'}
              </div>
              <div className="col-span-3 text-sm font-medium">
                {set.reps} reps
              </div>
              <div className="col-span-2">
                <Button
                  variant={set.completed ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSetComplete(index)}
                  className={set.completed ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                >
                  <Check className={`h-3 w-3 ${set.completed ? 'text-white' : ''}`} />
                </Button>
              </div>
              <div className="col-span-2 flex justify-end gap-1">
                {set.completed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRestTimer(true)}
                    className="text-primary hover:text-primary"
                  >
                    <Timer className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteSet(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
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
        <div className="col-span-3">
          <Input
            type="number"
            placeholder="kg"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
        <div className="col-span-3">
          <Input
            type="number"
            placeholder="reps"
            value={newReps}
            onChange={(e) => setNewReps(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSet()}
            className="h-8 text-sm"
          />
        </div>
        <div className="col-span-4 flex gap-1">
          <Button
            onClick={addSet}
            size="sm"
            className="flex-1 h-8 bg-gradient-primary"
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
