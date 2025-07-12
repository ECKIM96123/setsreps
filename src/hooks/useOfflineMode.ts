import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export interface OfflineData {
  workouts: any[];
  exercises: any[];
  personalRecords: any[];
  lastSyncDate: string;
}

export const useOfflineMode = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState<OfflineData>(() => {
    const saved = localStorage.getItem('offlineData');
    return saved ? JSON.parse(saved) : {
      workouts: [],
      exercises: [],
      personalRecords: [],
      lastSyncDate: new Date().toISOString()
    };
  });
  const [pendingSyncs, setPendingSyncs] = useState<any[]>(() => {
    const saved = localStorage.getItem('pendingSyncs');
    return saved ? JSON.parse(saved) : [];
  });
  const { toast } = useToast();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back online! 🌐",
        description: "Your data will sync automatically.",
      });
      syncPendingData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're offline 📱",
        description: "Don't worry, your workouts will be saved locally.",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Save offline data to localStorage
  useEffect(() => {
    localStorage.setItem('offlineData', JSON.stringify(offlineData));
  }, [offlineData]);

  // Save pending syncs to localStorage
  useEffect(() => {
    localStorage.setItem('pendingSyncs', JSON.stringify(pendingSyncs));
  }, [pendingSyncs]);

  const saveWorkoutOffline = (workout: any) => {
    const workoutWithId = {
      ...workout,
      id: workout.id || `offline_${Date.now()}`,
      isOffline: true,
      timestamp: new Date().toISOString()
    };

    setOfflineData(prev => ({
      ...prev,
      workouts: [...prev.workouts, workoutWithId]
    }));

    if (!isOnline) {
      setPendingSyncs(prev => [...prev, {
        type: 'workout',
        data: workoutWithId,
        action: 'create',
        timestamp: new Date().toISOString()
      }]);

      toast({
        title: "Workout saved offline 💾",
        description: "Will sync when you're back online.",
      });
    }

    return workoutWithId;
  };

  const updateWorkoutOffline = (workoutId: string, updatedWorkout: any) => {
    setOfflineData(prev => ({
      ...prev,
      workouts: prev.workouts.map(w => 
        w.id === workoutId ? { ...updatedWorkout, id: workoutId } : w
      )
    }));

    if (!isOnline) {
      setPendingSyncs(prev => [...prev, {
        type: 'workout',
        data: { ...updatedWorkout, id: workoutId },
        action: 'update',
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const savePersonalRecordOffline = (pr: any) => {
    const prWithId = {
      ...pr,
      id: pr.id || `offline_pr_${Date.now()}`,
      isOffline: true,
      timestamp: new Date().toISOString()
    };

    setOfflineData(prev => ({
      ...prev,
      personalRecords: [...prev.personalRecords, prWithId]
    }));

    if (!isOnline) {
      setPendingSyncs(prev => [...prev, {
        type: 'personalRecord',
        data: prWithId,
        action: 'create',
        timestamp: new Date().toISOString()
      }]);
    }

    return prWithId;
  };

  const syncPendingData = async () => {
    if (!isOnline || pendingSyncs.length === 0) return;

    try {
      // In a real app, you'd sync with your backend here
      // For now, we'll simulate successful sync
      console.log('Syncing pending data:', pendingSyncs);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear pending syncs after successful sync
      setPendingSyncs([]);
      
      // Update last sync date
      setOfflineData(prev => ({
        ...prev,
        lastSyncDate: new Date().toISOString()
      }));

      toast({
        title: "Data synced! ✅",
        description: `Synced ${pendingSyncs.length} items successfully.`,
      });
    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: "Sync failed ❌",
        description: "Will retry when connection improves.",
        variant: "destructive"
      });
    }
  };

  const clearOfflineData = () => {
    setOfflineData({
      workouts: [],
      exercises: [],
      personalRecords: [],
      lastSyncDate: new Date().toISOString()
    });
    setPendingSyncs([]);
    localStorage.removeItem('offlineData');
    localStorage.removeItem('pendingSyncs');
    
    toast({
      title: "Offline data cleared 🗑️",
      description: "All local data has been removed.",
    });
  };

  const getOfflineWorkouts = () => offlineData.workouts;
  const getOfflinePersonalRecords = () => offlineData.personalRecords;
  const getPendingSyncCount = () => pendingSyncs.length;
  const getLastSyncDate = () => offlineData.lastSyncDate;

  return {
    isOnline,
    offlineData,
    pendingSyncs,
    saveWorkoutOffline,
    updateWorkoutOffline,
    savePersonalRecordOffline,
    syncPendingData,
    clearOfflineData,
    getOfflineWorkouts,
    getOfflinePersonalRecords,
    getPendingSyncCount,
    getLastSyncDate
  };
};