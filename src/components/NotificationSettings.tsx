import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell, BellOff, Settings, Timer, Trophy, Heart } from "lucide-react";

export const NotificationSettings = () => {
  const { 
    settings, 
    updateSettings, 
    permissionGranted, 
    requestPermissions,
    scheduleWorkoutReminder,
    scheduleDailyMotivation,
    cancelAllNotifications 
  } = useNotifications();

  const [testNotification, setTestNotification] = useState(false);

  const handlePermissionRequest = async () => {
    const granted = await requestPermissions();
    if (granted) {
      // Schedule daily motivation if enabled
      if (settings.dailyMotivation) {
        scheduleDailyMotivation();
      }
    }
  };

  const handleTestNotification = async () => {
    if (permissionGranted) {
      setTestNotification(true);
      await scheduleWorkoutReminder(
        "Test Notification 🔔",
        "This is how your workout reminders will look!",
        new Date(Date.now() + 3000) // 3 seconds from now
      );
      setTimeout(() => setTestNotification(false), 3000);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {!permissionGranted && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-3 w-3 p-0 flex items-center justify-center">
              !
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Permission Status */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {permissionGranted ? (
                  <Bell className="h-4 w-4 text-green-500" />
                ) : (
                  <BellOff className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm font-medium">
                  {permissionGranted ? 'Notifications Enabled' : 'Enable Notifications'}
                </span>
              </div>
              {!permissionGranted && (
                <Button size="sm" onClick={handlePermissionRequest}>
                  Enable
                </Button>
              )}
            </div>
            {!permissionGranted && (
              <p className="text-xs text-muted-foreground mt-2">
                Allow notifications to get workout reminders and timer alerts
              </p>
            )}
          </Card>

          {/* Notification Types */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Timer className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-sm font-medium">Rest Timer Alerts</div>
                  <div className="text-xs text-muted-foreground">Get notified when rest time is over</div>
                </div>
              </div>
              <Switch
                checked={settings.restTimerAlerts}
                onCheckedChange={(checked) => updateSettings({ restTimerAlerts: checked })}
                disabled={!permissionGranted}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-sm font-medium">Workout Reminders</div>
                  <div className="text-xs text-muted-foreground">Daily workout reminders</div>
                </div>
              </div>
              <Switch
                checked={settings.workoutReminders}
                onCheckedChange={(checked) => updateSettings({ workoutReminders: checked })}
                disabled={!permissionGranted}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-sm font-medium">Daily Motivation</div>
                  <div className="text-xs text-muted-foreground">Motivational messages to keep you going</div>
                </div>
              </div>
              <Switch
                checked={settings.dailyMotivation}
                onCheckedChange={(checked) => updateSettings({ dailyMotivation: checked })}
                disabled={!permissionGranted}
              />
            </div>
          </div>

          {/* Reminder Time */}
          {(settings.workoutReminders || settings.dailyMotivation) && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Reminder Time</label>
              <Input
                type="time"
                value={settings.reminderTime}
                onChange={(e) => updateSettings({ reminderTime: e.target.value })}
                disabled={!permissionGranted}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Time for daily workout reminders and motivation
              </p>
            </div>
          )}

          {/* Test Notification */}
          {permissionGranted && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleTestNotification}
                disabled={testNotification}
                className="flex-1"
              >
                {testNotification ? 'Sending...' : 'Test Notification'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={cancelAllNotifications}
                className="flex-1"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};