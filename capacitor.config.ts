import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.setsreps',
  appName: 'Sets&Reps - Workout Tracker',
  webDir: 'dist',
  server: {
    url: 'https://5946d528-0507-43c4-bc51-93628c82efc1.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#3B82F6',
      showSpinner: false
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#3B82F6",
      sound: "beep.wav",
    },
  }
};

export default config;