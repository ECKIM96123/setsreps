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
        completed: true // Automatically mark as completed when added
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
              <div className="col-span-4">Weight</div>
              <div className="col-span-4">Reps</div>
              <div className="col-span-2"></div>
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
                    placeholder="kg"
                  />
                </div>
                <div className="col-span-4">
                  <input
                    type="number"
                    value={set.reps}
                    onChange={(e) => editSet(index, 'reps', e.target.value)}
                    className="w-full h-8 px-2 text-sm border rounded bg-white"
                    placeholder="reps"
                  />
                </div>
                <div className="col-span-2 flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRestTimer(true)}
                    className="text-primary hover:text-primary p-1"
                  >
                    <Timer className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSet(index)}
                    className="text-muted-foreground hover:text-destructive p-1"
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
          <div className="col-span-4">
          <Input
            type="number"
            placeholder="kg"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            className="h-8 text-sm"
          />
          </div>
          <div className="col-span-4">
            <Input
              type="number"
              placeholder="reps"
              value={newReps}
              onChange={(e) => setNewReps(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSet()}
              className="h-8 text-sm"
            />
          </div>
          <div className="col-span-2 flex gap-1">
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
