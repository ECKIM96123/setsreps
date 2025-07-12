import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5946d528050743c4bc5193628c82efc1',
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
    }
  }
};

export default config;