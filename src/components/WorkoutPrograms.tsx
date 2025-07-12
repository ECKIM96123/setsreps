import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Target, Clock, Dumbbell, Play, Info, Brain, Sparkles, Crown } from "lucide-react";
import { exerciseInstructions } from "@/lib/exerciseInstructions";

interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  exercises: Array<{
    name: string;
    category: string;
    muscle: string;
    sets: number;
    reps: string;
  }>;
}

interface WorkoutProgramsProps {
  onSelectProgram: (program: WorkoutProgram) => void;
  onOpenAIGenerator?: () => void;
}

const workoutPrograms: WorkoutProgram[] = [
  {
    id: 'push-day',
    name: 'Push Day',
    description: 'Focus on chest, shoulders, and triceps',
    duration: '45-60 min',
    difficulty: 'Intermediate',
    exercises: [
      { name: 'Bench Press', category: 'Chest', muscle: 'Chest', sets: 4, reps: '8-10' },
      { name: 'Overhead Press', category: 'Shoulders', muscle: 'Shoulders', sets: 3, reps: '10-12' },
      { name: 'Incline Dumbbell Press', category: 'Chest', muscle: 'Chest', sets: 3, reps: '10-12' },
      { name: 'Lateral Raises', category: 'Shoulders', muscle: 'Shoulders', sets: 3, reps: '12-15' },
      { name: 'Tricep Dips', category: 'Arms', muscle: 'Triceps', sets: 3, reps: '10-12' },
      { name: 'Push-ups', category: 'Chest', muscle: 'Chest', sets: 3, reps: 'To failure' }
    ]
  },
  {
    id: 'pull-day',
    name: 'Pull Day',
    description: 'Target back, biceps, and rear delts',
    duration: '45-60 min',
    difficulty: 'Intermediate',
    exercises: [
      { name: 'Pull-ups', category: 'Back', muscle: 'Lats', sets: 4, reps: '6-10' },
      { name: 'Barbell Rows', category: 'Back', muscle: 'Back', sets: 4, reps: '8-10' },
      { name: 'Lat Pulldowns', category: 'Back', muscle: 'Lats', sets: 3, reps: '10-12' },
      { name: 'Bicep Curls', category: 'Arms', muscle: 'Biceps', sets: 3, reps: '12-15' },
      { name: 'Face Pulls', category: 'Shoulders', muscle: 'Rear Delts', sets: 3, reps: '15-20' },
      { name: 'Hammer Curls', category: 'Arms', muscle: 'Biceps', sets: 3, reps: '12-15' }
    ]
  },
  {
    id: 'leg-day',
    name: 'Leg Day',
    description: 'Complete lower body workout',
    duration: '60-75 min',
    difficulty: 'Advanced',
    exercises: [
      { name: 'Squats', category: 'Legs', muscle: 'Quads', sets: 4, reps: '8-10' },
      { name: 'Romanian Deadlifts', category: 'Legs', muscle: 'Hamstrings', sets: 4, reps: '8-10' },
      { name: 'Bulgarian Split Squats', category: 'Legs', muscle: 'Quads', sets: 3, reps: '10-12 each leg' },
      { name: 'Leg Curls', category: 'Legs', muscle: 'Hamstrings', sets: 3, reps: '12-15' },
      { name: 'Calf Raises', category: 'Legs', muscle: 'Calves', sets: 4, reps: '15-20' },
      { name: 'Walking Lunges', category: 'Legs', muscle: 'Quads', sets: 3, reps: '12 each leg' }
    ]
  },
  {
    id: 'upper-body',
    name: 'Upper Body Power',
    description: 'Full upper body strength training',
    duration: '50-65 min',
    difficulty: 'Advanced',
    exercises: [
      { name: 'Bench Press', category: 'Chest', muscle: 'Chest', sets: 4, reps: '6-8' },
      { name: 'Pull-ups', category: 'Back', muscle: 'Lats', sets: 4, reps: '8-10' },
      { name: 'Overhead Press', category: 'Shoulders', muscle: 'Shoulders', sets: 3, reps: '8-10' },
      { name: 'Barbell Rows', category: 'Back', muscle: 'Back', sets: 3, reps: '8-10' },
      { name: 'Close Grip Bench Press', category: 'Arms', muscle: 'Triceps', sets: 3, reps: '10-12' },
      { name: 'Barbell Curls', category: 'Arms', muscle: 'Biceps', sets: 3, reps: '10-12' }
    ]
  },
  {
    id: 'full-body-beginner',
    name: 'Full Body Starter',
    description: 'Perfect introduction to strength training',
    duration: '30-45 min',
    difficulty: 'Beginner',
    exercises: [
      { name: 'Bodyweight Squats', category: 'Legs', muscle: 'Quads', sets: 3, reps: '10-15' },
      { name: 'Push-ups', category: 'Chest', muscle: 'Chest', sets: 3, reps: '8-12' },
      { name: 'Assisted Pull-ups', category: 'Back', muscle: 'Lats', sets: 3, reps: '5-8' },
      { name: 'Plank', category: 'Core', muscle: 'Core', sets: 3, reps: '30-60 sec' },
      { name: 'Lunges', category: 'Legs', muscle: 'Quads', sets: 2, reps: '8-10 each leg' },
      { name: 'Shoulder Taps', category: 'Core', muscle: 'Core', sets: 2, reps: '10 each arm' }
    ]
  },
  {
    id: 'hiit-cardio',
    name: 'HIIT Cardio Blast',
    description: 'High intensity interval training',
    duration: '20-30 min',
    difficulty: 'Intermediate',
    exercises: [
      { name: 'Burpees', category: 'Cardio', muscle: 'Full Body', sets: 4, reps: '30 sec on, 30 sec rest' },
      { name: 'Mountain Climbers', category: 'Cardio', muscle: 'Core', sets: 4, reps: '30 sec on, 30 sec rest' },
      { name: 'Jump Squats', category: 'Cardio', muscle: 'Legs', sets: 4, reps: '30 sec on, 30 sec rest' },
      { name: 'High Knees', category: 'Cardio', muscle: 'Legs', sets: 4, reps: '30 sec on, 30 sec rest' },
      { name: 'Plank Jacks', category: 'Cardio', muscle: 'Core', sets: 4, reps: '30 sec on, 30 sec rest' },
      { name: 'Russian Twists', category: 'Core', muscle: 'Core', sets: 3, reps: '20 each side' }
    ]
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
    case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Advanced': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-muted text-muted-foreground';
  }
};

export const WorkoutPrograms = ({ onSelectProgram, onOpenAIGenerator }: WorkoutProgramsProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-4 pb-24">
        <div className="text-center py-6">
          <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold mb-2">Workout Programs</h1>
          <p className="text-muted-foreground">Choose a program to start your workout</p>
        </div>

        {onOpenAIGenerator && (
          <Card className="p-6 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Brain className="h-8 w-8 text-primary" />
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI Workout Generator</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Let AI create a personalized workout program just for you based on your goals, 
                  equipment, and preferences.
                </p>
              </div>
              <Button 
                onClick={onOpenAIGenerator}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground relative"
                size="lg"
              >
                <Crown className="h-4 w-4 mr-2" />
                <Brain className="h-5 w-5 mr-2" />
                Create My Workout
                <Sparkles className="h-4 w-4 ml-2" />
                <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-yellow-900 text-xs px-1.5 py-0.5">
                  PRO
                </Badge>
              </Button>
            </div>
          </Card>
        )}

        <div className="space-y-1 mb-4">
          <h2 className="text-lg font-semibold">Pre-built Programs</h2>
          <p className="text-sm text-muted-foreground">Ready-to-use workout routines</p>
        </div>

        <div className="space-y-4">
          {workoutPrograms.map((program) => (
            <Card key={program.id} className="p-4 shadow-sm border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{program.name}</h3>
                    <Badge className={getDifficultyColor(program.difficulty)} variant="outline">
                      {program.difficulty}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{program.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Dumbbell className="h-4 w-4" />
                      <span>{program.exercises.length} exercises</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => onSelectProgram(program)}
                  className="ml-4 bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground mb-2">EXERCISES:</div>
                {program.exercises.slice(0, 3).map((exercise, index) => (
                  <div key={index} className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{exercise.sets}x {exercise.reps} {exercise.name}</span>
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
                            <strong>Target:</strong> {exercise.muscle} ({exercise.category})
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <strong>Sets × Reps:</strong> {exercise.sets} × {exercise.reps}
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
                  </div>
                ))}
                {program.exercises.length > 3 && (
                  <div className="text-sm text-muted-foreground">
                    +{program.exercises.length - 3} more exercises
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export type { WorkoutProgram };