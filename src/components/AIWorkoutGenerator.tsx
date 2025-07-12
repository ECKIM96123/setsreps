import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Brain, Loader2, Sparkles, Target, Clock, Dumbbell } from "lucide-react";
import { WorkoutProgram } from "./WorkoutPrograms";
import { usePremium } from "@/contexts/PremiumContext";
import { PremiumPaywall } from "./PremiumPaywall";


interface WorkoutPreferences {
  workoutDays: string;
  fitnessGoal: string;
  experienceLevel: string;
  workoutDuration: string;
  availableEquipment: string[];
  targetMuscles: string[];
  injuries: string;
  additionalNotes: string;
}

interface AIWorkoutGeneratorProps {
  onGeneratedProgram: (program: WorkoutProgram) => void;
  onBack: () => void;
}

export const AIWorkoutGenerator = ({ onGeneratedProgram, onBack }: AIWorkoutGeneratorProps) => {
  const { isPremium } = usePremium();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [preferences, setPreferences] = useState<WorkoutPreferences>({
    workoutDays: "",
    fitnessGoal: "",
    experienceLevel: "",
    workoutDuration: "",
    availableEquipment: [],
    targetMuscles: [],
    injuries: "",
    additionalNotes: ""
  });
  const { toast } = useToast();

  const equipmentOptions = [
    "Dumbbells", "Barbells", "Resistance Bands", "Pull-up Bar", 
    "Kettlebells", "Medicine Ball", "Cable Machine", "Bodyweight Only"
  ];

  const muscleGroups = [
    "Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Glutes", "Cardio"
  ];

  const handleEquipmentChange = (equipment: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      availableEquipment: checked 
        ? [...prev.availableEquipment, equipment]
        : prev.availableEquipment.filter(e => e !== equipment)
    }));
  };

  const handleMuscleChange = (muscle: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      targetMuscles: checked 
        ? [...prev.targetMuscles, muscle]
        : prev.targetMuscles.filter(m => m !== muscle)
    }));
  };

  const generateWorkout = async () => {
    setIsGenerating(true);
    try {
      // Show a message that AI generation requires Supabase setup
      toast({
        title: "Feature Coming Soon!",
        description: "AI workout generation requires Supabase setup. Please configure your environment variables.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error generating workout:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate workout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return preferences.workoutDays && preferences.fitnessGoal && preferences.experienceLevel;
      case 2:
        return preferences.workoutDuration && preferences.availableEquipment.length > 0;
      case 3:
        return preferences.targetMuscles.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  // Show paywall if user is not premium
  if (!isPremium) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <PremiumPaywall 
          feature="AI Workout Generator"
          children={
            <div className="text-center space-y-4 opacity-50">
              <div className="flex items-center justify-center gap-2">
                <Brain className="h-8 w-8" />
                <h2 className="text-2xl font-bold">AI Workout Generator</h2>
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="text-muted-foreground">
                Create personalized workout programs with AI
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 border rounded">
                  <Target className="h-5 w-5 mx-auto mb-2" />
                  Custom Goals
                </div>
                <div className="p-3 border rounded">
                  <Clock className="h-5 w-5 mx-auto mb-2" />
                  Your Schedule
                </div>
                <div className="p-3 border rounded">
                  <Dumbbell className="h-5 w-5 mx-auto mb-2" />
                  Available Equipment
                </div>
                <div className="p-3 border rounded">
                  <Brain className="h-5 w-5 mx-auto mb-2" />
                  AI Powered
                </div>
              </div>
            </div>
          }
        />
        <Button variant="ghost" onClick={onBack} className="w-full mt-4">
          Back to Programs
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AI Workout Generator</h1>
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <p className="text-muted-foreground">
          Answer a few questions to get your personalized workout program
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {step} of 4</span>
          <span>{Math.round((step / 4) * 100)}% Complete</span>
        </div>
        <Progress value={(step / 4) * 100} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {step === 1 && <Target className="h-5 w-5" />}
            {step === 2 && <Clock className="h-5 w-5" />}
            {step === 3 && <Dumbbell className="h-5 w-5" />}
            {step === 4 && <Brain className="h-5 w-5" />}
            {step === 1 && "Fitness Goals & Experience"}
            {step === 2 && "Schedule & Equipment"}
            {step === 3 && "Target Areas"}
            {step === 4 && "Additional Information"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="workoutDays">How many days per week do you want to workout?</Label>
                <Select value={preferences.workoutDays} onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, workoutDays: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workout frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-3">2-3 days per week</SelectItem>
                    <SelectItem value="3-4">3-4 days per week</SelectItem>
                    <SelectItem value="4-5">4-5 days per week</SelectItem>
                    <SelectItem value="5-6">5-6 days per week</SelectItem>
                    <SelectItem value="daily">Daily (7 days)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fitnessGoal">What's your primary fitness goal?</Label>
                <Select value={preferences.fitnessGoal} onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, fitnessGoal: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your main goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight-loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                    <SelectItem value="strength">Build Strength</SelectItem>
                    <SelectItem value="endurance">Improve Endurance</SelectItem>
                    <SelectItem value="general-fitness">General Fitness</SelectItem>
                    <SelectItem value="athletic-performance">Athletic Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="experienceLevel">What's your experience level?</Label>
                <Select value={preferences.experienceLevel} onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, experienceLevel: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (0-6 months)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (6 months - 2 years)</SelectItem>
                    <SelectItem value="advanced">Advanced (2+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="workoutDuration">How long do you want each workout to be?</Label>
                <Select value={preferences.workoutDuration} onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, workoutDuration: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workout duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15-30">15-30 minutes</SelectItem>
                    <SelectItem value="30-45">30-45 minutes</SelectItem>
                    <SelectItem value="45-60">45-60 minutes</SelectItem>
                    <SelectItem value="60-90">60-90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>What equipment do you have access to? (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {equipmentOptions.map((equipment) => (
                    <div key={equipment} className="flex items-center space-x-2">
                      <Checkbox
                        id={equipment}
                        checked={preferences.availableEquipment.includes(equipment)}
                        onCheckedChange={(checked) => 
                          handleEquipmentChange(equipment, checked as boolean)
                        }
                      />
                      <Label htmlFor={equipment} className="text-sm">{equipment}</Label>
                    </div>
                  ))}
                </div>
                {preferences.availableEquipment.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {preferences.availableEquipment.map((equipment) => (
                      <Badge key={equipment} variant="secondary" className="text-xs">
                        {equipment}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Which muscle groups would you like to focus on? (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {muscleGroups.map((muscle) => (
                    <div key={muscle} className="flex items-center space-x-2">
                      <Checkbox
                        id={muscle}
                        checked={preferences.targetMuscles.includes(muscle)}
                        onCheckedChange={(checked) => 
                          handleMuscleChange(muscle, checked as boolean)
                        }
                      />
                      <Label htmlFor={muscle} className="text-sm">{muscle}</Label>
                    </div>
                  ))}
                </div>
                {preferences.targetMuscles.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {preferences.targetMuscles.map((muscle) => (
                      <Badge key={muscle} variant="secondary" className="text-xs">
                        {muscle}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="injuries">Do you have any injuries or limitations?</Label>
                <Textarea
                  id="injuries"
                  placeholder="Describe any injuries, limitations, or areas to avoid..."
                  value={preferences.injuries}
                  onChange={(e) => setPreferences(prev => ({ ...prev, injuries: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="additionalNotes">Any additional preferences or notes?</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Favorite exercises, workout style preferences, time constraints..."
                  value={preferences.additionalNotes}
                  onChange={(e) => setPreferences(prev => ({ ...prev, additionalNotes: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Your Preferences Summary:</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• {preferences.workoutDays} days per week</li>
                  <li>• Goal: {preferences.fitnessGoal}</li>
                  <li>• Experience: {preferences.experienceLevel}</li>
                  <li>• Duration: {preferences.workoutDuration}</li>
                  <li>• Equipment: {preferences.availableEquipment.join(", ")}</li>
                  <li>• Focus: {preferences.targetMuscles.join(", ")}</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        {step > 1 && (
          <Button variant="outline" onClick={prevStep} className="flex-1">
            Previous
          </Button>
        )}
        
        {step < 4 ? (
          <Button 
            onClick={nextStep} 
            disabled={!canProceed()}
            className="flex-1"
          >
            Next Step
          </Button>
        ) : (
          <Button 
            onClick={generateWorkout}
            disabled={isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate My Workout
              </>
            )}
          </Button>
        )}
      </div>

      <Button variant="ghost" onClick={onBack} className="w-full">
        Back to Programs
      </Button>
    </div>
  );
};