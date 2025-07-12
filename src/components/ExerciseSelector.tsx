import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Target, Activity } from "lucide-react";

const POPULAR_EXERCISES = [
  { name: "Bench Press", category: "Chest", muscle: "Chest" },
  { name: "Squat", category: "Legs", muscle: "Quadriceps" },
  { name: "Deadlift", category: "Back", muscle: "Back" },
  { name: "Pull-ups", category: "Back", muscle: "Lats" },
  { name: "Overhead Press", category: "Shoulders", muscle: "Shoulders" },
  { name: "Barbell Row", category: "Back", muscle: "Back" },
  { name: "Dips", category: "Chest", muscle: "Triceps" },
  { name: "Bicep Curls", category: "Arms", muscle: "Biceps" },
];

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

  const filteredExercises = POPULAR_EXERCISES.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="space-y-3">
            <h3 className="font-medium text-muted-foreground">Popular Exercises</h3>
            {filteredExercises.map((exercise, index) => (
              <Card 
                key={index}
                className="p-4 cursor-pointer hover:shadow-workout transition-all duration-200 border-workout-border"
                onClick={() => onSelectExercise(exercise)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{exercise.name}</h4>
                      <p className="text-sm text-muted-foreground">{exercise.muscle}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{exercise.category}</Badge>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t border-workout-border">
            <h3 className="font-medium text-muted-foreground">Add Custom Exercise</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter exercise name..."
                value={customExercise}
                onChange={(e) => setCustomExercise(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
              />
              <Button onClick={handleAddCustom} className="bg-gradient-accent">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};