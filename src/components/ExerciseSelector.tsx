import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Target, Activity } from "lucide-react";

const EXERCISES_BY_MUSCLE = {
  "Chest": [
    { name: "Bench Press", category: "Chest", muscle: "Chest" },
    { name: "Incline Bench Press", category: "Chest", muscle: "Upper Chest" },
    { name: "Dips", category: "Chest", muscle: "Lower Chest" },
    { name: "Push-ups", category: "Chest", muscle: "Chest" },
    { name: "Chest Flyes", category: "Chest", muscle: "Chest" }
  ],
  "Back": [
    { name: "Deadlift", category: "Back", muscle: "Back" },
    { name: "Pull-ups", category: "Back", muscle: "Lats" },
    { name: "Barbell Row", category: "Back", muscle: "Back" },
    { name: "Lat Pulldown", category: "Back", muscle: "Lats" },
    { name: "T-Bar Row", category: "Back", muscle: "Mid Back" }
  ],
  "Legs": [
    { name: "Squat", category: "Legs", muscle: "Quadriceps" },
    { name: "Romanian Deadlift", category: "Legs", muscle: "Hamstrings" },
    { name: "Leg Press", category: "Legs", muscle: "Quadriceps" },
    { name: "Lunges", category: "Legs", muscle: "Quadriceps" },
    { name: "Calf Raises", category: "Legs", muscle: "Calves" }
  ],
  "Shoulders": [
    { name: "Overhead Press", category: "Shoulders", muscle: "Shoulders" },
    { name: "Lateral Raises", category: "Shoulders", muscle: "Side Delts" },
    { name: "Rear Delt Flyes", category: "Shoulders", muscle: "Rear Delts" },
    { name: "Arnold Press", category: "Shoulders", muscle: "Shoulders" }
  ],
  "Arms": [
    { name: "Bicep Curls", category: "Arms", muscle: "Biceps" },
    { name: "Tricep Dips", category: "Arms", muscle: "Triceps" },
    { name: "Hammer Curls", category: "Arms", muscle: "Biceps" },
    { name: "Close-Grip Bench Press", category: "Arms", muscle: "Triceps" },
    { name: "Preacher Curls", category: "Arms", muscle: "Biceps" }
  ]
};

interface Exercise {
  name: string;
  category: string;
  muscle: string;
}

interface ExerciseSelectorProps {
  onSelectExercise: (exercise: Exercise) => void;
  onClose: () => void;
}

export const ExerciseSelector = ({ onSelectExercise, onClose }: ExerciseSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customExercise, setCustomExercise] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Chest"]);

  const handleAddCustom = () => {
    if (customExercise.trim()) {
      onSelectExercise({
        name: customExercise.trim(),
        category: "Custom",
        muscle: "Custom"
      });
      setCustomExercise("");
    }
  };

  const getFilteredExercises = () => {
    if (!searchTerm) return EXERCISES_BY_MUSCLE;
    
    const filtered: Record<string, Exercise[]> = {};
    Object.entries(EXERCISES_BY_MUSCLE).forEach(([muscleGroup, exercises]) => {
      const matchingExercises = exercises.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.muscle.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (matchingExercises.length > 0) {
        filtered[muscleGroup] = matchingExercises;
      }
    });
    return filtered;
  };

  const filteredExercises = getFilteredExercises();

  const toggleGroup = (muscleGroup: string) => {
    setExpandedGroups(prev => 
      prev.includes(muscleGroup) 
        ? prev.filter(g => g !== muscleGroup)
        : [...prev, muscleGroup]
    );
  };

  const hasResults = Object.keys(filteredExercises).length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50 animate-slide-up">
      <Card className="w-full max-h-[80vh] rounded-t-3xl bg-card border-0 shadow-workout overflow-hidden">
        <div className="p-6 border-b border-workout-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Select Exercise
            </h2>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Add Custom Exercise */}
          <div className="space-y-3">
            <h3 className="font-medium text-muted-foreground flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Your Own Exercise
            </h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter exercise name (e.g., Bulgarian Split Squats)..."
                value={customExercise}
                onChange={(e) => setCustomExercise(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                className="flex-1"
              />
              <Button 
                onClick={handleAddCustom} 
                className="bg-gradient-primary"
                disabled={!customExercise.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Create custom exercises for movements not in our library
            </p>
          </div>

          {/* Exercise Groups */}
          <div className="space-y-4">
            <h3 className="font-medium text-muted-foreground">Exercise Library</h3>
            
            {!hasResults && searchTerm ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No exercises found for "{searchTerm}"</p>
                <Button 
                  onClick={() => {
                    setCustomExercise(searchTerm);
                    handleAddCustom();
                  }}
                  className="bg-gradient-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add "{searchTerm}" as Custom Exercise
                </Button>
              </div>
            ) : (
              Object.entries(filteredExercises).map(([muscleGroup, exercises]) => (
                <div key={muscleGroup} className="space-y-2">
                  <Button
                    variant="ghost"
                    onClick={() => toggleGroup(muscleGroup)}
                    className="w-full justify-between p-3 h-auto hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-primary/10 rounded">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{muscleGroup}</span>
                      <Badge variant="secondary" className="text-xs">
                        {exercises.length}
                      </Badge>
                    </div>
                    <div className={`transition-transform ${expandedGroups.includes(muscleGroup) ? 'rotate-90' : ''}`}>
                      ▶
                    </div>
                  </Button>
                  
                  {expandedGroups.includes(muscleGroup) && (
                    <div className="space-y-2 ml-6 animate-fade-in">
                      {exercises.map((exercise, index) => (
                        <Card 
                          key={index}
                          className="p-3 cursor-pointer hover:shadow-workout transition-all duration-200 border-workout-border bg-muted/20"
                          onClick={() => onSelectExercise(exercise)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-sm">{exercise.name}</h4>
                              <p className="text-xs text-muted-foreground">{exercise.muscle}</p>
                            </div>
                            <Plus className="h-4 w-4 text-primary" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};