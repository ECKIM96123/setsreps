import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Target, Clock, Dumbbell, Play, Info, Brain, Sparkles, Crown } from "lucide-react";
import { exerciseInstructions } from "@/lib/exerciseInstructions";
import { useTranslation } from 'react-i18next';

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

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
    case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Advanced': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-muted text-muted-foreground';
  }
};

export const WorkoutPrograms = ({ onSelectProgram, onOpenAIGenerator }: WorkoutProgramsProps) => {
  const { t } = useTranslation();

  const workoutPrograms: WorkoutProgram[] = [
    {
      id: 'push-day',
      name: t('programs.pushDay'),
      description: t('programs.pushDayDesc'),
      duration: '45-60 min',
      difficulty: 'Intermediate',
      exercises: [
        { name: t('exercises.benchPress'), category: t('exercises.chest'), muscle: t('exercises.chest'), sets: 4, reps: '8-10' },
        { name: t('exercises.overheadPress'), category: t('exercises.shoulders'), muscle: t('exercises.shoulders'), sets: 3, reps: '10-12' },
        { name: t('exercises.inclineBenchPress'), category: t('exercises.chest'), muscle: t('exercises.chest'), sets: 3, reps: '10-12' },
        { name: t('exercises.lateralRaises'), category: t('exercises.shoulders'), muscle: t('exercises.shoulders'), sets: 3, reps: '12-15' },
        { name: t('exercises.tricepDips'), category: t('exercises.arms'), muscle: t('exercises.triceps'), sets: 3, reps: '10-12' },
        { name: t('exercises.pushUps'), category: t('exercises.chest'), muscle: t('exercises.chest'), sets: 3, reps: 'Till utmattning' }
      ]
    },
    {
      id: 'pull-day',
      name: t('programs.pullDay'),
      description: t('programs.pullDayDesc'),
      duration: '45-60 min',
      difficulty: 'Intermediate',
      exercises: [
        { name: t('exercises.pullUp'), category: t('exercises.back'), muscle: t('exercises.lats'), sets: 4, reps: '6-10' },
        { name: t('exercises.barbellRow'), category: t('exercises.back'), muscle: t('exercises.back'), sets: 4, reps: '8-10' },
        { name: t('exercises.latPulldown'), category: t('exercises.back'), muscle: t('exercises.lats'), sets: 3, reps: '10-12' },
        { name: t('exercises.bicepCurl'), category: t('exercises.arms'), muscle: t('exercises.biceps'), sets: 3, reps: '12-15' },
        { name: t('exercises.rearDeltFlyes'), category: t('exercises.shoulders'), muscle: t('exercises.rearDelts'), sets: 3, reps: '15-20' },
        { name: t('exercises.hammerCurls'), category: t('exercises.arms'), muscle: t('exercises.biceps'), sets: 3, reps: '12-15' }
      ]
    },
    {
      id: 'leg-day',
      name: t('programs.legDay'),
      description: t('programs.legDayDesc'),
      duration: '60-75 min',
      difficulty: 'Advanced',
      exercises: [
        { name: t('exercises.squat'), category: t('exercises.legs'), muscle: t('exercises.quadriceps'), sets: 4, reps: '8-10' },
        { name: t('exercises.romanianDeadlift'), category: t('exercises.legs'), muscle: t('exercises.hamstrings'), sets: 4, reps: '8-10' },
        { name: t('exercises.lunges'), category: t('exercises.legs'), muscle: t('exercises.quadriceps'), sets: 3, reps: '10-12 each leg' },
        { name: t('exercises.legCurl'), category: t('exercises.legs'), muscle: t('exercises.hamstrings'), sets: 3, reps: '12-15' },
        { name: t('exercises.calfRaise'), category: t('exercises.legs'), muscle: t('exercises.calves'), sets: 4, reps: '15-20' },
        { name: t('exercises.lunges'), category: t('exercises.legs'), muscle: t('exercises.quadriceps'), sets: 3, reps: '12 each leg' }
      ]
    },
    {
      id: 'upper-body',
      name: t('programs.upperBodyPower'),
      description: t('programs.upperBodyDesc'),
      duration: '50-65 min',
      difficulty: 'Advanced',
      exercises: [
        { name: t('exercises.benchPress'), category: t('exercises.chest'), muscle: t('exercises.chest'), sets: 4, reps: '6-8' },
        { name: t('exercises.pullUp'), category: t('exercises.back'), muscle: t('exercises.lats'), sets: 4, reps: '8-10' },
        { name: t('exercises.overheadPress'), category: t('exercises.shoulders'), muscle: t('exercises.shoulders'), sets: 3, reps: '8-10' },
        { name: t('exercises.barbellRow'), category: t('exercises.back'), muscle: t('exercises.back'), sets: 3, reps: '8-10' },
        { name: t('exercises.closeGripBenchPress'), category: t('exercises.arms'), muscle: t('exercises.triceps'), sets: 3, reps: '10-12' },
        { name: t('exercises.bicepCurl'), category: t('exercises.arms'), muscle: t('exercises.biceps'), sets: 3, reps: '10-12' }
      ]
    },
    {
      id: 'full-body-beginner',
      name: t('programs.fullBodyStarter'),
      description: t('programs.fullBodyDesc'),
      duration: '30-45 min',
      difficulty: 'Beginner',
      exercises: [
        { name: t('exercises.squat'), category: t('exercises.legs'), muscle: t('exercises.quadriceps'), sets: 3, reps: '10-15' },
        { name: t('exercises.pushUps'), category: t('exercises.chest'), muscle: t('exercises.chest'), sets: 3, reps: '8-12' },
        { name: t('exercises.pullUp'), category: t('exercises.back'), muscle: t('exercises.lats'), sets: 3, reps: '5-8' },
        { name: t('exercises.plank'), category: t('exercises.core'), muscle: t('exercises.core'), sets: 3, reps: '30-60 sec' },
        { name: t('exercises.lunges'), category: t('exercises.legs'), muscle: t('exercises.quadriceps'), sets: 2, reps: '8-10 each leg' },
        { name: t('exercises.plank'), category: t('exercises.core'), muscle: t('exercises.core'), sets: 2, reps: '10 each arm' }
      ]
    },
    {
      id: 'hiit-cardio',
      name: t('programs.hiitCardio'),
      description: t('programs.hiitDesc'),
      duration: '20-30 min',
      difficulty: 'Intermediate',
      exercises: [
        { name: 'Burpees', category: t('exercises.cardio'), muscle: 'Full Body', sets: 4, reps: '30 sec on, 30 sec rest' },
        { name: 'Mountain Climbers', category: t('exercises.cardio'), muscle: t('exercises.core'), sets: 4, reps: '30 sec on, 30 sec rest' },
        { name: 'Jump Squats', category: t('exercises.cardio'), muscle: t('exercises.legs'), sets: 4, reps: '30 sec on, 30 sec rest' },
        { name: 'High Knees', category: t('exercises.cardio'), muscle: t('exercises.legs'), sets: 4, reps: '30 sec on, 30 sec rest' },
        { name: 'Plank Jacks', category: t('exercises.cardio'), muscle: t('exercises.core'), sets: 4, reps: '30 sec on, 30 sec rest' },
        { name: 'Russian Twists', category: t('exercises.core'), muscle: t('exercises.core'), sets: 3, reps: '20 each side' }
      ]
    }
  ];

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return t('stats.beginner');
      case 'Intermediate': return t('stats.intermediate');
      case 'Advanced': return t('stats.advanced');
      default: return difficulty;
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-4 pb-24">
        <div className="text-center py-6">
          <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold mb-2">{t('programs.workoutPrograms')}</h1>
          <p className="text-muted-foreground">{t('programs.chooseProgram')}</p>
        </div>

        {onOpenAIGenerator && (
          <Card className="p-6 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Brain className="h-8 w-8 text-primary" />
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{t('programs.aiWorkoutGenerator')}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {t('programs.aiDescription')}
                </p>
              </div>
              <Button 
                onClick={onOpenAIGenerator}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground relative"
                size="lg"
              >
                <Crown className="h-4 w-4 mr-2" />
                <Brain className="h-5 w-5 mr-2" />
                {t('programs.createMyWorkout')}
                <Sparkles className="h-4 w-4 ml-2" />
                <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-yellow-900 text-xs px-1.5 py-0.5">
                  PRO
                </Badge>
              </Button>
            </div>
          </Card>
        )}

        <div className="space-y-1 mb-4">
          <h2 className="text-lg font-semibold">{t('programs.prebuiltPrograms')}</h2>
          <p className="text-sm text-muted-foreground">{t('programs.readyToUse')}</p>
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
                      <span>{program.exercises.length} {t('programs.exercises')}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => onSelectProgram(program)}
                  className="ml-4 bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {t('common.start')}
                </Button>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground mb-2">{t('workout.exercises').toUpperCase()}:</div>
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
                            <strong>{t('programs.targetMuscle')}:</strong> {exercise.muscle} ({exercise.category})
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <strong>{t('programs.setsReps')}:</strong> {exercise.sets} × {exercise.reps}
                          </div>
                          <div className="text-sm">
                            <strong>{t('programs.howToPerform')}:</strong>
                            <p className="mt-1 text-muted-foreground">
                              {exerciseInstructions[exercise.name] || t('programs.instructionsNotAvailable')}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
                {program.exercises.length > 3 && (
                  <div className="text-sm text-muted-foreground">
                    +{program.exercises.length - 3} {t('programs.moreExercises')}
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