import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw, X } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

interface RestTimerProps {
  isVisible: boolean;
  onClose: () => void;
  defaultTime?: number; // in seconds
}

export const RestTimer = ({ isVisible, onClose, defaultTime = 90 }: RestTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(defaultTime);
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(defaultTime);
  const { scheduleRestTimerAlert } = useNotifications();

  useEffect(() => {
    if (isVisible && !isRunning) {
      setTimeLeft(defaultTime);
      setInitialTime(defaultTime);
      setIsRunning(true);
      
      // Schedule notification for when timer completes
      scheduleRestTimerAlert(defaultTime);
    }
  }, [isVisible, defaultTime, scheduleRestTimerAlert]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Vibrate on completion if supported
            if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200]);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setTimeLeft(initialTime);
    setIsRunning(false);
  };

  const handleTimeChange = (newTime: number) => {
    setTimeLeft(newTime);
    setInitialTime(newTime);
    setIsRunning(false);
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-sm p-6 text-center space-y-6 shadow-workout animate-scale-in">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Rest Timer</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Circular Progress */}
        <div className="relative w-32 h-32 mx-auto">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className={`transition-all duration-1000 ${
                timeLeft === 0 ? 'text-green-500' : 'text-primary'
              }`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-2xl font-bold ${timeLeft === 0 ? 'text-green-500' : ''}`}>
                {formatTime(timeLeft)}
              </div>
              {timeLeft === 0 && (
                <div className="text-sm text-green-500 font-medium animate-pulse">
                  Ready!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Time Buttons */}
        <div className="flex gap-2 justify-center">
          {[60, 90, 120, 180].map((time) => (
            <Button
              key={time}
              variant="outline"
              size="sm"
              onClick={() => handleTimeChange(time)}
              className={initialTime === time ? 'bg-primary text-primary-foreground' : ''}
            >
              {time < 60 ? `${time}s` : `${time / 60}m`}
            </Button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            onClick={handlePlayPause}
            className="px-6"
            disabled={timeLeft === 0}
          >
            {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isRunning ? 'Pause' : 'Start'}
          </Button>
        </div>

        {timeLeft === 0 && (
          <Button 
            onClick={onClose}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            Continue Workout
          </Button>
        )}
      </Card>
    </div>
  );
};