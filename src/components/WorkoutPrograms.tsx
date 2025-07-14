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
    name: 'Push-dag',
    description: 'Fokus på bröst, axlar och triceps',
    duration: '45-60 min',
    difficulty: 'Intermediate',
    exercises: [
      { name: 'Bänkpress', category: 'Bröst', muscle: 'Bröst', sets: 4, reps: '8-10' },
      { name: 'Militärpress', category: 'Axlar', muscle: 'Axlar', sets: 3, reps: '10-12' },
      { name: 'Snedpress med hantlar', category: 'Bröst', muscle: 'Bröst', sets: 3, reps: '10-12' },
      { name: 'Sidolyft', category: 'Axlar', muscle: 'Axlar', sets: 3, reps: '12-15' },
      { name: 'Tricepsdips', category: 'Armar', muscle: 'Triceps', sets: 3, reps: '10-12' },
      { name: 'Armhävningar', category: 'Bröst', muscle: 'Bröst', sets: 3, reps: 'Till utmattning' }
    ]
  },
  {
    id: 'pull-day',
    name: 'Pull-dag',
    description: 'Tränar rygg, biceps och bakre deltoider',
    duration: '45-60 min',
    difficulty: 'Intermediate',
    exercises: [
      { name: 'Chins', category: 'Rygg', muscle: 'Lats', sets: 4, reps: '6-10' },
      { name: 'Hantelrodd', category: 'Rygg', muscle: 'Rygg', sets: 4, reps: '8-10' },
      { name: 'Latsdrag', category: 'Rygg', muscle: 'Lats', sets: 3, reps: '10-12' },
      { name: 'Bicepscurls', category: 'Armar', muscle: 'Biceps', sets: 3, reps: '12-15' },
      { name: 'Face Pulls', category: 'Axlar', muscle: 'Bakre deltoider', sets: 3, reps: '15-20' },
      { name: 'Hammarcurls', category: 'Armar', muscle: 'Biceps', sets: 3, reps: '12-15' }
    ]
  },
  {
    id: 'leg-day',
    name: 'Ben-dag',
    description: 'Komplett träning för underkroppen',
    duration: '60-75 min',
    difficulty: 'Advanced',
    exercises: [
      { name: 'Knäböj', category: 'Ben', muscle: 'Quadriceps', sets: 4, reps: '8-10' },
      { name: 'Rumänsk marklyft', category: 'Ben', muscle: 'Hamstrings', sets: 4, reps: '8-10' },
      { name: 'Bulgarisk knäböj', category: 'Ben', muscle: 'Quadriceps', sets: 3, reps: '10-12 varje ben' },
      { name: 'Bencurls', category: 'Ben', muscle: 'Hamstrings', sets: 3, reps: '12-15' },
      { name: 'Vadresningar', category: 'Ben', muscle: 'Vader', sets: 4, reps: '15-20' },
      { name: 'Vandrande utfall', category: 'Ben', muscle: 'Quadriceps', sets: 3, reps: '12 varje ben' }
    ]
  },
  {
    id: 'upper-body',
    name: 'Överkroppsstyrka',
    description: 'Fullständig styrketräning för överkroppen',
    duration: '50-65 min',
    difficulty: 'Advanced',
    exercises: [
      { name: 'Bänkpress', category: 'Bröst', muscle: 'Bröst', sets: 4, reps: '6-8' },
      { name: 'Chins', category: 'Rygg', muscle: 'Lats', sets: 4, reps: '8-10' },
      { name: 'Militärpress', category: 'Axlar', muscle: 'Axlar', sets: 3, reps: '8-10' },
      { name: 'Hantelrodd', category: 'Rygg', muscle: 'Rygg', sets: 3, reps: '8-10' },
      { name: 'Smalt grepp bänkpress', category: 'Armar', muscle: 'Triceps', sets: 3, reps: '10-12' },
      { name: 'Hantelcurls', category: 'Armar', muscle: 'Biceps', sets: 3, reps: '10-12' }
    ]
  },
  {
    id: 'full-body-beginner',
    name: 'Helkroppsstart',
    description: 'Perfekt introduktion till styrketräning',
    duration: '30-45 min',
    difficulty: 'Beginner',
    exercises: [
      { name: 'Kroppsknäböj', category: 'Ben', muscle: 'Quadriceps', sets: 3, reps: '10-15' },
      { name: 'Armhävningar', category: 'Bröst', muscle: 'Bröst', sets: 3, reps: '8-12' },
      { name: 'Assisterade chins', category: 'Rygg', muscle: 'Lats', sets: 3, reps: '5-8' },
      { name: 'Planka', category: 'Core', muscle: 'Core', sets: 3, reps: '30-60 sek' },
      { name: 'Utfall', category: 'Ben', muscle: 'Quadriceps', sets: 2, reps: '8-10 varje ben' },
      { name: 'Axeltipp', category: 'Core', muscle: 'Core', sets: 2, reps: '10 varje arm' }
    ]
  },
  {
    id: 'hiit-cardio',
    name: 'HIIT Konditionsträning',
    description: 'Högintensiv intervallträning',
    duration: '20-30 min',
    difficulty: 'Intermediate',
    exercises: [
      { name: 'Burpees', category: 'Kondition', muscle: 'Helkropp', sets: 4, reps: '30 sek på, 30 sek vila' },
      { name: 'Bergsklätrare', category: 'Kondition', muscle: 'Core', sets: 4, reps: '30 sek på, 30 sek vila' },
      { name: 'Hoppknäböj', category: 'Kondition', muscle: 'Ben', sets: 4, reps: '30 sek på, 30 sek vila' },
      { name: 'Höga knän', category: 'Kondition', muscle: 'Ben', sets: 4, reps: '30 sek på, 30 sek vila' },
      { name: 'Plankhopp', category: 'Kondition', muscle: 'Core', sets: 4, reps: '30 sek på, 30 sek vila' },
      { name: 'Ryska vridningar', category: 'Core', muscle: 'Core', sets: 3, reps: '20 varje sida' }
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

const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return 'Nybörjare';
    case 'Intermediate': return 'Medel';
    case 'Advanced': return 'Avancerad';
    default: return difficulty;
  }
};

export const WorkoutPrograms = ({ onSelectProgram, onOpenAIGenerator }: WorkoutProgramsProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-4 pb-24">
        <div className="text-center py-6">
          <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold mb-2">Träningsprogram</h1>
          <p className="text-muted-foreground">Välj ett program för att starta din träning</p>
        </div>

        {onOpenAIGenerator && (
          <Card className="p-6 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Brain className="h-8 w-8 text-primary" />
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI Träningsgenerator</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Låt AI skapa ett personligt träningsprogram bara för dig baserat på dina mål, 
                  utrustning och preferenser.
                </p>
              </div>
              <Button 
                onClick={onOpenAIGenerator}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground relative"
                size="lg"
              >
                <Crown className="h-4 w-4 mr-2" />
                <Brain className="h-5 w-5 mr-2" />
                Skapa min träning
                <Sparkles className="h-4 w-4 ml-2" />
                <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-yellow-900 text-xs px-1.5 py-0.5">
                  PRO
                </Badge>
              </Button>
            </div>
          </Card>
        )}

        <div className="space-y-1 mb-4">
          <h2 className="text-lg font-semibold">Färdiga program</h2>
          <p className="text-sm text-muted-foreground">Redo att använda träningsrutiner</p>
        </div>

        <div className="space-y-4">
          {workoutPrograms.map((program) => (
            <Card key={program.id} className="p-4 shadow-sm border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{program.name}</h3>
                    <Badge className={getDifficultyColor(program.difficulty)} variant="outline">
                      {getDifficultyLabel(program.difficulty)}
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
                      <span>{program.exercises.length} övningar</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => onSelectProgram(program)}
                  className="ml-4 bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Starta
                </Button>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground mb-2">ÖVNINGAR:</div>
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
                            <strong>Målmuskel:</strong> {exercise.muscle} ({exercise.category})
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <strong>Set × Reps:</strong> {exercise.sets} × {exercise.reps}
                          </div>
                          <div className="text-sm">
                            <strong>Så här utför du övningen:</strong>
                            <p className="mt-1 text-muted-foreground">
                              {exerciseInstructions[exercise.name] || 'Övningsinstruktioner inte tillgängliga.'}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
                {program.exercises.length > 3 && (
                  <div className="text-sm text-muted-foreground">
                    +{program.exercises.length - 3} fler övningar
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