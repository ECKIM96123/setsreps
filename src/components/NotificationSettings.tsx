import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell, BellOff, Timer, Trophy, Heart, CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';

export const NotificationSettings = () => {
  const { t } = useTranslation();
  const { 
    settings, 
    updateSettings, 
    permissionGranted, 
    requestPermissions,
    scheduleWorkoutReminder,
    scheduleDailyMotivation,
    cancelAllNotifications 
  } = useNotifications();

  const [isLoading, setIsLoading] = useState(false);

  const handlePermissionRequest = async () => {
    setIsLoading(true);
    const granted = await requestPermissions();
    if (granted && settings.dailyMotivation) {
      await scheduleDailyMotivation();
    }
    setIsLoading(false);
  };

  const handlePreviewNotification = async () => {
    if (permissionGranted) {
      await scheduleWorkoutReminder(
        "Sets&Reps 💪",
        "Dags för din träning! Låt oss bygga styrka tillsammans.",
        new Date(Date.now() + 2000)
      );
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
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5 text-primary" />
            Notifieringar
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Permission Status */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {permissionGranted ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              <div>
                <div className="text-sm font-medium">
                  {permissionGranted ? 'Notifieringar aktiverade' : 'Aktivera notifieringar'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {permissionGranted 
                    ? 'Du får påminnelser och träningsalarm' 
                    : 'Tillåt notifieringar för träningspåminnelser'
                  }
                </div>
              </div>
            </div>
            {!permissionGranted && (
              <Button 
                size="sm" 
                onClick={handlePermissionRequest}
                disabled={isLoading}
                className="ml-2"
              >
                {isLoading ? 'Aktiverar...' : 'Aktivera'}
              </Button>
            )}
          </div>

          <Separator />

          {/* Notification Types */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold mb-3 text-foreground">Träningsnotifieringar</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Timer className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Vilopauspåminnelser</div>
                      <div className="text-xs text-muted-foreground">Få notis när vilopausen är över</div>
                    </div>
                  </div>
                  <Switch
                    checked={settings.restTimerAlerts}
                    onCheckedChange={(checked) => updateSettings({ restTimerAlerts: checked })}
                    disabled={!permissionGranted}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Träningspåminnelser</div>
                      <div className="text-xs text-muted-foreground">Dagliga påminnelser om att träna</div>
                    </div>
                  </div>
                  <Switch
                    checked={settings.workoutReminders}
                    onCheckedChange={(checked) => updateSettings({ workoutReminders: checked })}
                    disabled={!permissionGranted}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Heart className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Motivationsmeddelanden</div>
                      <div className="text-xs text-muted-foreground">Inspiration för att hålla igång</div>
                    </div>
                  </div>
                  <Switch
                    checked={settings.dailyMotivation}
                    onCheckedChange={(checked) => updateSettings({ dailyMotivation: checked })}
                    disabled={!permissionGranted}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Reminder Time */}
          {(settings.workoutReminders || settings.dailyMotivation) && (
            <>
              <Separator />
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Påminnelsetid</label>
                <div className="space-y-2">
                  <Input
                    type="time"
                    value={settings.reminderTime}
                    onChange={(e) => updateSettings({ reminderTime: e.target.value })}
                    disabled={!permissionGranted}
                    className="w-full bg-background"
                  />
                  <p className="text-xs text-muted-foreground">
                    Välj när du vill få dina dagliga träningspåminnelser
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          {permissionGranted && (
            <>
              <Separator />
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePreviewNotification}
                  className="flex-1"
                >
                  Förhandsgranska
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={cancelAllNotifications}
                  className="flex-1"
                >
                  Rensa alla
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};