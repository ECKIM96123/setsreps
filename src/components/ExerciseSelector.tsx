import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Target, Activity, Info } from "lucide-react";
import { exerciseInstructions } from "@/lib/exerciseInstructions";
import { useTranslation } from 'react-i18next';
import { EXERCISE_KEYS, MUSCLE_KEYS } from "@/lib/exerciseTranslations";

// Use translation keys for exercises
const EXERCISES_BY_MUSCLE = {
  "Chest": [
    { name: "Bench Press", key: "benchPress", category: "Chest", muscle: "Chest", muscleKey: "chest" },
    { name: "Incline Bench Press", key: "inclineBenchPress", category: "Chest", muscle: "Upper Chest", muscleKey: "upperChest" },
    { name: "Dips", key: "dip", category: "Chest", muscle: "Lower Chest", muscleKey: "lowerChest" },
    { name: "Push-ups", key: "pushUps", category: "Chest", muscle: "Chest", muscleKey: "chest" },
    { name: "Chest Flyes", key: "chestFlyes", category: "Chest", muscle: "Chest", muscleKey: "chest" }
  ],
  "Back": [
    { name: "Deadlift", key: "deadlift", category: "Back", muscle: "Back", muscleKey: "back" },
    { name: "Pull-ups", key: "pullUp", category: "Back", muscle: "Lats", muscleKey: "lats" },
    { name: "Barbell Row", key: "barbellRow", category: "Back", muscle: "Back", muscleKey: "back" },
    { name: "Lat Pulldown", key: "latPulldown", category: "Back", muscle: "Lats", muscleKey: "lats" },
    { name: "T-Bar Row", key: "tBarRow", category: "Back", muscle: "Mid Back", muscleKey: "midBack" }
  ],
  "Legs": [
    { name: "Squat", key: "squat", category: "Legs", muscle: "Quadriceps", muscleKey: "quadriceps" },
    { name: "Romanian Deadlift", key: "romanianDeadlift", category: "Legs", muscle: "Hamstrings", muscleKey: "hamstrings" },
    { name: "Leg Press", key: "legPress", category: "Legs", muscle: "Quadriceps", muscleKey: "quadriceps" },
    { name: "Lunges", key: "lunges", category: "Legs", muscle: "Quadriceps", muscleKey: "quadriceps" },
    { name: "Calf Raises", key: "calfRaise", category: "Legs", muscle: "Calves", muscleKey: "calves" }
  ],
  "Shoulders": [
    { name: "Overhead Press", key: "overheadPress", category: "Shoulders", muscle: "Shoulders", muscleKey: "shoulders" },
    { name: "Lateral Raises", key: "lateralRaises", category: "Shoulders", muscle: "Side Delts", muscleKey: "sideDelts" },
    { name: "Rear Delt Flyes", key: "rearDeltFlyes", category: "Shoulders", muscle: "Rear Delts", muscleKey: "rearDelts" },
    { name: "Arnold Press", key: "arnoldPress", category: "Shoulders", muscle: "Shoulders", muscleKey: "shoulders" }
  ],
  "Arms": [
    { name: "Bicep Curls", key: "bicepCurl", category: "Arms", muscle: "Biceps", muscleKey: "biceps" },
    { name: "Tricep Dips", key: "tricepDips", category: "Arms", muscle: "Triceps", muscleKey: "triceps" },
    { name: "Hammer Curls", key: "hammerCurls", category: "Arms", muscle: "Biceps", muscleKey: "biceps" },
    { name: "Close-Grip Bench Press", key: "closeGripBenchPress", category: "Arms", muscle: "Triceps", muscleKey: "triceps" },
    { name: "Preacher Curls", key: "preacherCurls", category: "Arms", muscle: "Biceps", muscleKey: "biceps" }
  ]
};

interface Exercise {
  name: string;
  key?: string;
  category: string;
  muscle: string;
  muscleKey?: string;
}

interface ExerciseSelectorProps {
  onSelectExercise: (exercise: Exercise) => void;
  onClose: () => void;
}

export const ExerciseSelector = ({ onSelectExercise, onClose }: ExerciseSelectorProps) => {
  const { t } = useTranslation();
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
      const matchingExercises = exercises.filter(exercise => {
        const translatedName = exercise.key ? t(`exercises.${exercise.key}`) : exercise.name;
        const translatedMuscle = exercise.muscleKey ? t(`exercises.${exercise.muscleKey}`) : exercise.muscle;
        return translatedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               translatedMuscle.toLowerCase().includes(searchTerm.toLowerCase());
      });
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
              {t('workout.selectExercise', 'Select Exercise')}
            </h2>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('workout.searchExercises', 'Search exercises...')}
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
              {t('workout.addCustomExercise', 'Add Your Own Exercise')}
            </h3>
            <div className="flex gap-2">
              <Input
                placeholder={t('workout.enterExerciseName', 'Enter exercise name (e.g., Bulgarian Split Squats)...')}
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
                      <span className="font-medium">{t(`exercises.${muscleGroup.toLowerCase()}`)}</span>
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
                          onClick={() => {
                            const translatedExercise = {
                              name: exercise.key ? t(`exercises.${exercise.key}`) : exercise.name,
                              category: t(`exercises.${exercise.category.toLowerCase()}`),
                              muscle: exercise.muscleKey ? t(`exercises.${exercise.muscleKey}`) : exercise.muscle
                            };
                            onSelectExercise(translatedExercise);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">
                                {exercise.key ? t(`exercises.${exercise.key}`) : exercise.name}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {exercise.muscleKey ? t(`exercises.${exercise.muscleKey}`) : exercise.muscle}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0 hover:bg-muted"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Info className="h-3 w-3" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                   <DialogHeader>
                                     <DialogTitle>
                                       {exercise.key ? t(`exercises.${exercise.key}`) : exercise.name}
                                     </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-3">
                                     <div className="text-sm text-muted-foreground">
                                       <strong>Target:</strong> {exercise.muscleKey ? t(`exercises.${exercise.muscleKey}`) : exercise.muscle} ({t(`exercises.${exercise.category.toLowerCase()}`)})
                                    </div>
                                    <div className="text-sm">
                                      <strong>How to perform:</strong>
                                      <p className="mt-1 text-muted-foreground">
                                        {exerciseInstructions[exercise.name] || 'Exercise instructions not available.'}
                                      </p>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Plus className="h-4 w-4 text-primary" />
                            </div>
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