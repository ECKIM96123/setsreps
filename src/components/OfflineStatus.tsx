import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOfflineMode } from "@/hooks/useOfflineMode";
import { Wifi, WifiOff, RefreshCw, Database, Trash2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const OfflineStatus = () => {
  const {
    isOnline,
    syncPendingData,
    clearOfflineData,
    getPendingSyncCount,
    getLastSyncDate,
    getOfflineWorkouts
  } = useOfflineMode();

  const pendingCount = getPendingSyncCount();
  const lastSync = getLastSyncDate();
  const offlineWorkouts = getOfflineWorkouts();

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-orange-500" />
          )}
          <span className="font-medium">
            {isOnline ? 'Online' : 'Offline Mode'}
          </span>
          {pendingCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {pendingCount} pending
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {isOnline && pendingCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={syncPendingData}
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Sync Now
            </Button>
          )}
        </div>
      </div>

      {/* Status Info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Database className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground">Local workouts:</span>
          <span className="font-medium">{offlineWorkouts.length}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground">Last sync:</span>
          <span className="font-medium text-xs">
            {formatDistanceToNow(new Date(lastSync), { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* Offline Features */}
      {!isOnline && (
        <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-1">
            Offline Mode Active
          </div>
          <div className="text-xs text-orange-600 dark:text-orange-300">
            • All workouts saved locally<br/>
            • Data will sync when back online<br/>
            • Full app functionality available
          </div>
        </div>
      )}

      {/* Pending Syncs */}
      {pendingCount > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
            {pendingCount} items waiting to sync
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-300">
            Your data is safe and will be synced when you're back online
          </div>
        </div>
      )}

      {/* Clear Data Option (for development) */}
      {(offlineWorkouts.length > 0 || pendingCount > 0) && (
        <div className="pt-2 border-t border-border">
          <Button
            size="sm"
            variant="outline"
            onClick={clearOfflineData}
            className="text-xs text-destructive hover:text-destructive w-full"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear Local Data
          </Button>
        </div>
      )}
    </Card>
  );
};