import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Trophy, 
  Target, 
  Clock, 
  Flame,
  Calendar,
  Dumbbell,
  Award,
  ArrowLeft,
  Crown,
  Star,
  Activity,
  Zap,
  Timer,
  Weight,
  Brain,
  Heart,
  Gauge,
  PieChart,
  LineChart,
  BarChart2
} from "lucide-react";
import { CompletedWorkout } from "@/hooks/useWorkoutStorage";
import { usePremium } from "@/contexts/PremiumContext";
import { PremiumPaywall } from "./PremiumPaywall";
import { usePersonalRecords } from "@/hooks/usePersonalRecords";

interface WorkoutStatsProps {
  workouts: CompletedWorkout[];
  onBack: () => void;
}

export const WorkoutStats = ({ workouts, onBack }: WorkoutStatsProps) => {
  const { isPremium } = usePremium();
  const { personalRecords, getExercisePR } = usePersonalRecords(workouts);

  // Calculate comprehensive statistics
  const calculateStats = () => {
    if (workouts.length === 0) {
      return {
        totalWorkouts: 0,
        totalSets: 0,
        totalVolume: 0,
        totalDuration: 0,
        averageDuration: 0,
        averageSetsPerWorkout: 0,
        averageRestTime: 0,
        personalRecords: {},
        exerciseFrequency: {},
        muscleGroupDistribution: {},
        weeklyProgress: [],
        monthlyProgress: [],
        currentStreak: 0,
        longestStreak: 0,
        volumeProgression: [],
        strengthProgression: {},
        workoutIntensity: 0,
        consistencyScore: 0,
        fitnessLevel: 'Beginner',
        caloriesBurned: 0,
        averageRPE: 0,
        weekdayDistribution: {},
        timeOfDayDistribution: {},
        supersetUsage: 0,
        dropsetUsage: 0,
        progressionRate: 0,
        bodyComposition: {},
        injuryRisk: 'Low'
      };
    }

    const totalWorkouts = workouts.length;
    const totalSets = workouts.reduce((sum, w) => sum + w.totalSets, 0);
    const totalVolume = workouts.reduce((sum, w) => sum + w.totalVolume, 0);
    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
    
    // Personal Records - highest weight for each exercise
    const personalRecords: { [key: string]: { weight: number; reps: number; date: Date } } = {};
    const exerciseFrequency: { [key: string]: number } = {};
    const muscleGroupDistribution: { [key: string]: number } = {};
    const strengthProgression: { [key: string]: number[] } = {};
    const weekdayDistribution: { [key: string]: number } = {};
    const timeOfDayDistribution: { [key: string]: number } = {};
    
    let totalSupersets = 0;
    let totalDropsets = 0;
    let totalCalories = 0;
    let totalRPE = 0;
    let rpeCount = 0;
    
    workouts.forEach(workout => {
      // Weekday distribution
      const weekday = workout.date.toLocaleDateString('sv-SE', { weekday: 'long' });
      weekdayDistribution[weekday] = (weekdayDistribution[weekday] || 0) + 1;
      
      // Time of day distribution
      const hour = workout.date.getHours();
      let timeOfDay = 'Morgon';
      if (hour >= 12 && hour < 17) timeOfDay = 'Eftermiddag';
      else if (hour >= 17) timeOfDay = 'Kväll';
      timeOfDayDistribution[timeOfDay] = (timeOfDayDistribution[timeOfDay] || 0) + 1;
      
      // Estimate calories (rough calculation: 5 calories per kg lifted)
      totalCalories += workout.totalVolume * 0.005;
      
      workout.exercises.forEach(exercise => {
        exerciseFrequency[exercise.name] = (exerciseFrequency[exercise.name] || 0) + 1;
        
        // Muscle group distribution
        const muscle = exercise.muscle || 'Unknown';
        muscleGroupDistribution[muscle] = (muscleGroupDistribution[muscle] || 0) + 1;
        
        // Count supersets
        if (exercise.supersetGroup) {
          totalSupersets++;
        }
        
        // Strength progression tracking
        if (!strengthProgression[exercise.name]) {
          strengthProgression[exercise.name] = [];
        }
        
        exercise.sets.forEach(set => {
          if (set.completed) {
            // Personal records
            if (!personalRecords[exercise.name] || set.weight > personalRecords[exercise.name].weight) {
              personalRecords[exercise.name] = {
                weight: set.weight,
                reps: set.reps,
                date: workout.date
              };
            }
            
            // Strength progression
            const oneRM = set.weight * (1 + set.reps / 30); // Rough 1RM estimation
            strengthProgression[exercise.name].push(oneRM);
            
            // Estimate RPE based on weight and reps
            const estimatedRPE = Math.min(10, 6 + (set.reps / 15) + (set.weight / 100));
            totalRPE += estimatedRPE;
            rpeCount++;
          }
        });
      });
    });

    // Calculate streaks
    const calculateStreak = () => {
      const today = new Date();
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      const sortedWorkouts = [...workouts].sort((a, b) => b.date.getTime() - a.date.getTime());
      
      let currentDate = new Date(today);
      const hasWorkoutToday = sortedWorkouts.some(w => 
        w.date.toDateString() === today.toDateString()
      );
      
      if (!hasWorkoutToday) {
        currentDate.setDate(currentDate.getDate() - 1);
      }
      
      while (true) {
        const dateString = currentDate.toDateString();
        const hasWorkout = sortedWorkouts.some(w => w.date.toDateString() === dateString);
        
        if (hasWorkout) {
          currentStreak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
      
      const workoutDates = sortedWorkouts.map(w => w.date.toDateString());
      const uniqueDates = [...new Set(workoutDates)].sort();
      
      for (let i = 0; i < uniqueDates.length; i++) {
        tempStreak = 1;
        
        for (let j = i + 1; j < uniqueDates.length; j++) {
          const date1 = new Date(uniqueDates[j - 1]);
          const date2 = new Date(uniqueDates[j]);
          const diffTime = date2.getTime() - date1.getTime();
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          
          if (diffDays === 1) {
            tempStreak++;
          } else {
            break;
          }
        }
        
        longestStreak = Math.max(longestStreak, tempStreak);
      }
      
      return { currentStreak, longestStreak };
    };

    const { currentStreak, longestStreak } = calculateStreak();

    // Weekly and monthly progress
    const weeklyProgress = [];
    const monthlyProgress = [];
    const volumeProgression = [];
    
    // Last 8 weeks
    for (let i = 7; i >= 0; i--) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - (i * 7));
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 6);
      
      const weekWorkouts = workouts.filter(w => 
        w.date >= startDate && w.date <= endDate
      );
      
      const weekVolume = weekWorkouts.reduce((sum, w) => sum + w.totalVolume, 0);
      weeklyProgress.push({
        week: `Week ${8-i}`,
        workouts: weekWorkouts.length,
        volume: weekVolume
      });
      volumeProgression.push(weekVolume);
    }
    
    // Last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthWorkouts = workouts.filter(w => 
        w.date.getMonth() === date.getMonth() && 
        w.date.getFullYear() === date.getFullYear()
      );
      
      monthlyProgress.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        workouts: monthWorkouts.length,
        volume: monthWorkouts.reduce((sum, w) => sum + w.totalVolume, 0)
      });
    }

    // Calculate advanced metrics
    const workoutIntensity = totalVolume / totalDuration * 60; // Volume per hour
    const consistencyScore = Math.min(100, (currentStreak / 30) * 100); // Based on 30-day streak
    const averageRPE = rpeCount > 0 ? totalRPE / rpeCount : 0;
    const supersetUsage = (totalSupersets / totalSets) * 100;
    
    // Fitness level calculation
    let fitnessLevel = 'Nybörjare';
    if (totalWorkouts > 50 && workoutIntensity > 500) fitnessLevel = 'Medel';
    if (totalWorkouts > 150 && workoutIntensity > 800) fitnessLevel = 'Avancerad';
    if (totalWorkouts > 300 && workoutIntensity > 1200) fitnessLevel = 'Elit';
    
    // Progression rate (volume increase over last 4 weeks vs previous 4 weeks)
    const recent4Weeks = volumeProgression.slice(-4).reduce((a, b) => a + b, 0);
    const previous4Weeks = volumeProgression.slice(-8, -4).reduce((a, b) => a + b, 0);
    const progressionRate = previous4Weeks > 0 ? ((recent4Weeks - previous4Weeks) / previous4Weeks) * 100 : 0;
    
    // Injury risk assessment
    let injuryRisk = 'Låg';
    if (progressionRate > 25) injuryRisk = 'Medel';
    if (progressionRate > 50 || averageRPE > 8.5) injuryRisk = 'Hög';

    return {
      totalWorkouts,
      totalSets,
      totalVolume,
      totalDuration,
      averageDuration: Math.round(totalDuration / totalWorkouts),
      averageSetsPerWorkout: Math.round(totalSets / totalWorkouts),
      averageRestTime: Math.round(totalDuration / totalSets), // Rough estimate
      personalRecords,
      exerciseFrequency,
      muscleGroupDistribution,
      weeklyProgress,
      monthlyProgress,
      currentStreak,
      longestStreak,
      volumeProgression,
      strengthProgression,
      workoutIntensity: Math.round(workoutIntensity),
      consistencyScore: Math.round(consistencyScore),
      fitnessLevel,
      caloriesBurned: Math.round(totalCalories),
      averageRPE: Math.round(averageRPE * 10) / 10,
      weekdayDistribution,
      timeOfDayDistribution,
      supersetUsage: Math.round(supersetUsage),
      dropsetUsage: Math.round(totalDropsets / totalSets * 100),
      progressionRate: Math.round(progressionRate),
      bodyComposition: {}, // Placeholder for future implementation
      injuryRisk
    };
  };

  const stats = calculateStats();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });
  };

  const topExercises = Object.entries(stats.exerciseFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const topPRs = Object.entries(stats.personalRecords)
    .filter(([,pr]) => pr.weight > 0)
    .sort(([,a], [,b]) => b.weight - a.weight)
    .slice(0, 5);

  if (workouts.length === 0) {
    return (
      <div className="p-4 text-center py-16">
        <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Ingen data ännu</h2>
        <p className="text-muted-foreground">Slutför några träningar för att se din statistik!</p>
      </div>
    );
  }

  const topMuscleGroups = Object.entries(stats.muscleGroupDistribution)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Låg': return 'text-green-500';
      case 'Medel': return 'text-yellow-500';
      case 'Hög': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getFitnessLevelColor = (level: string) => {
    switch (level) {
      case 'Nybörjare': return 'text-blue-500';
      case 'Medel': return 'text-green-500';
      case 'Avancerad': return 'text-orange-500';
      case 'Elit': return 'text-purple-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Premium Status Header */}
      {isPremium && (
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-center justify-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            <span className="font-semibold text-primary">Premium Analytics Upplåst</span>
            <Star className="h-4 w-4 text-primary" />
          </div>
        </Card>
      )}

      {/* Overview Stats - Always visible */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 text-center">
          <Calendar className="h-5 w-5 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
          <div className="text-xs text-muted-foreground">Totala träningar</div>
        </Card>
        
        <Card className="p-4 text-center">
          <Target className="h-5 w-5 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold">{stats.totalSets}</div>
          <div className="text-xs text-muted-foreground">Totala set</div>
        </Card>
        
        <Card className="p-4 text-center">
          <Dumbbell className="h-5 w-5 mx-auto mb-2 text-orange-600" />
          <div className="text-2xl font-bold">{stats.totalVolume.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Total volym (kg)</div>
        </Card>
        
        <Card className="p-4 text-center">
          <Clock className="h-5 w-5 mx-auto mb-2 text-blue-600" />
          <div className="text-2xl font-bold">{Math.round(stats.totalDuration / 60)}</div>
          <div className="text-xs text-muted-foreground">Totala timmar</div>
        </Card>
      </div>

      {/* Fitness Level & Basic Metrics - Always visible */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          Konditionsöversikt
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className={`text-xl font-bold ${getFitnessLevelColor(stats.fitnessLevel)}`}>
              {stats.fitnessLevel}
            </div>
            <div className="text-xs text-muted-foreground">Konditionsnivå</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-xl font-bold">{stats.currentStreak}</div>
            <div className="text-xs text-muted-foreground">Nuvarande serie</div>
          </div>
        </div>
      </Card>

      {/* Personal Records Section - Enhanced with new hook */}
      {personalRecords.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Personliga rekord {!isPremium && <Badge variant="outline" className="ml-2">Begränsad</Badge>}
          </h3>
          <div className="space-y-3">
            {personalRecords.slice(0, isPremium ? 8 : 3).map((pr) => (
              <div key={pr.exerciseName} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border-l-4 border-yellow-500">
                <div>
                  <div className="font-medium text-sm">{pr.exerciseName}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(pr.date)}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-yellow-600">{pr.weight}kg × {pr.reps}</div>
                  <div className="text-xs text-muted-foreground">{pr.volume}kg total</div>
                </div>
              </div>
            ))}
            {!isPremium && personalRecords.length > 3 && (
              <div className="text-center py-3 text-sm text-muted-foreground border-t border-dashed">
                <Crown className="h-4 w-4 inline mr-1" />
                +{personalRecords.length - 3} fler rekord med Premium
              </div>
            )}
          </div>
        </Card>
      )}

      {/* PREMIUM CONTENT STARTS HERE */}
      {isPremium ? (
        <>
          {/* Advanced Metrics */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Gauge className="h-5 w-5 text-blue-500" />
              Avancerade mätvärden
              <Crown className="h-4 w-4 text-primary ml-auto" />
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-xl font-bold text-blue-500">{stats.workoutIntensity}</div>
                <div className="text-xs text-muted-foreground">Intensitetspoäng</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-xl font-bold text-green-500">{stats.consistencyScore}%</div>
                <div className="text-xs text-muted-foreground">Konsistens</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-xl font-bold text-orange-500">{stats.caloriesBurned}</div>
                <div className="text-xs text-muted-foreground">Kalorier förbrända</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-xl font-bold text-purple-500">{stats.averageRPE}/10</div>
                <div className="text-xs text-muted-foreground">Genomsnittlig RPE</div>
              </div>
            </div>
          </Card>

          {/* Progress Analysis */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Utvecklingsanalys
              <Crown className="h-4 w-4 text-primary ml-auto" />
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Utvecklingshastighet</span>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${stats.progressionRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.progressionRate > 0 ? '+' : ''}{stats.progressionRate}%
                  </span>
                </div>
              </div>
              <Progress value={Math.max(0, Math.min(100, stats.progressionRate + 50))} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Skaderisk</span>
                <span className={`font-bold ${getRiskColor(stats.injuryRisk)}`}>
                  {stats.injuryRisk}
                </span>
              </div>
            </div>
          </Card>

          {/* Muscle Group Distribution */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-500" />
              Muscle Group Focus
              <Crown className="h-4 w-4 text-primary ml-auto" />
            </h3>
            <div className="space-y-3">
              {topMuscleGroups.map(([muscle, count], index) => (
                <div key={muscle} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{muscle}</span>
                    <span className="text-sm text-muted-foreground">{count} exercises</span>
                  </div>
                  <Progress 
                    value={(count / Math.max(...Object.values(stats.muscleGroupDistribution))) * 100} 
                    className="h-2" 
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Weekly Progress Chart */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-blue-500" />
              Weekly Volume Trend
              <Crown className="h-4 w-4 text-primary ml-auto" />
            </h3>
            <div className="space-y-2">
              {stats.weeklyProgress.map((week, index) => (
                <div key={week.week} className="flex items-center gap-3">
                  <span className="text-xs w-12 text-muted-foreground">{week.week}</span>
                  <div className="flex-1 bg-muted/30 rounded-full h-4 relative">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-300"
                      style={{ width: `${(week.volume / Math.max(...stats.weeklyProgress.map(w => w.volume))) * 100}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                      {week.volume.toLocaleString()}kg
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Training Pattern Analysis */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Training Patterns
              <Crown className="h-4 w-4 text-primary ml-auto" />
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-xl font-bold text-blue-500">{stats.supersetUsage}%</div>
                <div className="text-xs text-muted-foreground">Superset Usage</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-xl font-bold text-green-500">{stats.averageRestTime}s</div>
                <div className="text-xs text-muted-foreground">Avg Rest Time</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Preferred Training Days</h4>
              {Object.entries(stats.weekdayDistribution)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([day, count]) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm">{day}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted/30 rounded-full h-2">
                        <div 
                          className="bg-primary h-full rounded-full"
                          style={{ width: `${(count / Math.max(...Object.values(stats.weekdayDistribution))) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          {/* Comprehensive Exercise Analytics */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-orange-500" />
              Exercise Analytics
              <Crown className="h-4 w-4 text-primary ml-auto" />
            </h3>
            <div className="space-y-3">
              {topExercises.map(([exercise, count], index) => {
                const progression = stats.strengthProgression[exercise] || [];
                const recentProgress = progression.length > 1 
                  ? ((progression[progression.length - 1] - progression[0]) / progression[0] * 100)
                  : 0;
                
                return (
                  <div key={exercise} className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium text-sm">{exercise}</span>
                      </div>
                      <Badge variant="secondary">{count} sessions</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        PR: {getExercisePR(exercise)?.weight || 0}kg × {getExercisePR(exercise)?.reps || 0}
                      </span>
                      <span className={recentProgress >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {recentProgress > 0 ? '+' : ''}{recentProgress.toFixed(1)}% strength
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Long-term Trends */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <LineChart className="h-5 w-5 text-purple-500" />
              Monthly Progress
              <Crown className="h-4 w-4 text-primary ml-auto" />
            </h3>
            <div className="space-y-2">
              {stats.monthlyProgress.map((month, index) => (
                <div key={month.month} className="flex items-center gap-3">
                  <span className="text-xs w-8 text-muted-foreground">{month.month}</span>
                  <div className="flex-1 flex gap-2">
                    <div className="flex-1 bg-muted/30 rounded h-6 relative">
                      <div 
                        className="bg-blue-500 h-full rounded transition-all duration-300"
                        style={{ width: `${(month.workouts / Math.max(...stats.monthlyProgress.map(m => m.workouts))) * 100}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                        {month.workouts} workouts
                      </span>
                    </div>
                    <div className="flex-1 bg-muted/30 rounded h-6 relative">
                      <div 
                        className="bg-green-500 h-full rounded transition-all duration-300"
                        style={{ width: `${(month.volume / Math.max(...stats.monthlyProgress.map(m => m.volume))) * 100}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                        {month.volume.toLocaleString()}kg
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      ) : (
        /* FREE TIER - Limited Stats with Upgrade Prompts */
        <>
          {/* Basic Averages */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Grundläggande mätvärden
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-xl font-bold">{stats.averageDuration}</div>
                <div className="text-xs text-muted-foreground">Minuter per träning</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-xl font-bold">{stats.longestStreak}</div>
                <div className="text-xs text-muted-foreground">Längsta serie</div>
              </div>
            </div>
          </Card>

          {/* Premium Paywalls */}
          <PremiumPaywall feature="Avancerad analys" />
          <PremiumPaywall feature="Utvecklingsspårning" />
          <PremiumPaywall feature="Träningsinsikter" />
        </>
      )}
    </div>
  );
  };