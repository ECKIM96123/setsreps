import { useState, useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export interface NotificationSettings {
  workoutReminders: boolean;
  restTimerAlerts: boolean;
  dailyMotivation: boolean;
  reminderTime: string; // HH:MM format
}

export const useNotifications = () => {
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : {
      workoutReminders: true,
      restTimerAlerts: true,
      dailyMotivation: false,
      reminderTime: '18:00'
    };
  });

  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  const requestPermissions = async () => {
    if (!Capacitor.isNativePlatform()) {
      console.log('Notifikationer inte tillgängliga på webbplattform');
      return false;
    }

    try {
      const result = await LocalNotifications.requestPermissions();
      const granted = result.display === 'granted';
      setPermissionGranted(granted);
      return granted;
    } catch (error) {
      console.error('Fel vid begäran om notifikationsbehörigheter:', error);
      return false;
    }
  };

  const scheduleWorkoutReminder = async (title: string, body: string, scheduledTime?: Date) => {
    if (!permissionGranted || !settings.workoutReminders) return;

    try {
      const scheduleAt = scheduledTime || getNextReminderTime();
      
      await LocalNotifications.schedule({
        notifications: [{
          title,
          body,
          id: Date.now(),
          schedule: { at: scheduleAt },
          sound: undefined,
          attachments: undefined,
          actionTypeId: "",
          extra: { type: 'workout_reminder' }
        }]
      });
    } catch (error) {
      console.error('Fel vid schemaläggning av träningspåminnelse:', error);
    }
  };

  const scheduleRestTimerAlert = async (seconds: number) => {
    if (!permissionGranted || !settings.restTimerAlerts) return;

    try {
      const scheduleAt = new Date(Date.now() + seconds * 1000);
      
      await LocalNotifications.schedule({
        notifications: [{
          title: 'Vilopausen är över! ⏰',
          body: 'Dags att fortsätta din träning! Kör på! 💪',
          id: Date.now(),
          schedule: { at: scheduleAt },
          sound: undefined,
          attachments: undefined,
          actionTypeId: "",
          extra: { type: 'rest_timer' }
        }]
      });
    } catch (error) {
      console.error('Fel vid schemaläggning av vilotimer:', error);
    }
  };

  const scheduleDailyMotivation = async () => {
    if (!permissionGranted || !settings.dailyMotivation) return;

    const motivationalMessages = [
      "Dags att krossa dagens träning! 💪",
      "Dina muskler väntar på dig! 🔥", 
      "Konsistens slår perfektion. Kör på! 🎯",
      "Dagens träning är morgondagens styrka! 💪",
      "Inga ursäkter, bara resultat! 🚀",
      "Varje rep räknas. Låt oss börja! ⚡",
      "Styrka kommer från disciplin. Tid att träna! 🏋️"
    ];

    try {
      const tomorrow = getNextReminderTime();
      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      
      await LocalNotifications.schedule({
        notifications: [{
          title: 'Sets&Reps - Dags att träna! 💪',
          body: randomMessage,
          id: Date.now(),
          schedule: { at: tomorrow },
          sound: undefined,
          attachments: undefined,
          actionTypeId: "",
          extra: { type: 'daily_motivation' }
        }]
      });
    } catch (error) {
      console.error('Fel vid schemaläggning av daglig motivation:', error);
    }
  };

  const getNextReminderTime = (): Date => {
    const [hours, minutes] = settings.reminderTime.split(':').map(Number);
    const now = new Date();
    const reminderTime = new Date();
    
    reminderTime.setHours(hours, minutes, 0, 0);
    
    // Om tiden har passerat idag, schemalägg för imorgon
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }
    
    return reminderTime;
  };

  const cancelAllNotifications = async () => {
    try {
      await LocalNotifications.cancel({
        notifications: (await LocalNotifications.getPending()).notifications
      });
    } catch (error) {
      console.error('Fel vid avbokning av notifikationer:', error);
    }
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Initiera behörigheter vid start
  useEffect(() => {
    requestPermissions();
  }, []);

  // Schemalägg om daglig motivation när inställningar ändras
  useEffect(() => {
    if (settings.dailyMotivation && permissionGranted) {
      scheduleDailyMotivation();
    }
  }, [settings.dailyMotivation, settings.reminderTime, permissionGranted]);

  return {
    settings,
    updateSettings,
    permissionGranted,
    requestPermissions,
    scheduleWorkoutReminder,
    scheduleRestTimerAlert,
    scheduleDailyMotivation,
    cancelAllNotifications
  };
};