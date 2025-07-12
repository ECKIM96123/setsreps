import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Clock, Dumbbell, Play } from "lucide-react";

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

export const WorkoutPrograms = ({ onSelectProgram }: WorkoutProgramsProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-4 pb-24">
        <div className="text-center py-6">
          <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold mb-2">Workout Programs</h1>
          <p className="text-muted-foreground">Choose a program to start your workout</p>
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
                  <div key={index} className="text-sm text-muted-foreground">
                    {exercise.sets}x {exercise.reps} {exercise.name}
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