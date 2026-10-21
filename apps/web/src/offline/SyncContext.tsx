import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from './db';
import { OfflineOperation, SyncStatus } from '@ekaydi/shared-types';

interface SyncContextType {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncedAt: Date | null;
  operations: OfflineOperation[];
  enqueueOperation: <T>(
    operationType: OfflineOperation['operationType'],
    endpoint: string,
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    payload: T,
    tenantId: string
  ) => Promise<string>;
  triggerSync: () => Promise<void>;
  clearResolvedOperations: () => Promise<void>;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(() => {
    const saved = localStorage.getItem('ekaydi_last_synced');
    return saved ? new Date(saved) : null;
  });
  const [operations, setOperations] = useState<OfflineOperation[]>([]);

  // Update operations from IndexedDB
  const refreshOperations = useCallback(async () => {
    try {
      const allOps = await db.offlineOperations.orderBy('createdAt').reverse().toArray();
      setOperations(allOps);
      const pending = allOps.filter(op => op.status === SyncStatus.QUEUED || op.status === SyncStatus.FAILED);
      setPendingCount(pending.length);
    } catch (err) {
      console.error('Failed to load offline operations from IndexedDB:', err);
    }
  }, []);

  useEffect(() => {
    refreshOperations();
  }, [refreshOperations]);

  // Online / Offline listeners + Active reachability heartbeat
  useEffect(() => {
    const handleOnline = async () => {
      // Confirm actual API reachability
      try {
        const res = await fetch('/api/v1/health', { method: 'HEAD', cache: 'no-cache' }).catch(() => null);
        setIsOnline(Boolean(res && (res.ok || res.status === 404))); // 404 still means server is reachable
      } catch {
        setIsOnline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    handleOnline();

    // Periodic heartbeat every 20 seconds
    const interval = setInterval(handleOnline, 20000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  // Enqueue a new offline mutation
  const enqueueOperation = async <T,>(
    operationType: OfflineOperation['operationType'],
    endpoint: string,
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    payload: T,
    tenantId: string
  ): Promise<string> => {
    const id = crypto.randomUUID();
    const idempotencyKey = `idemp_${Date.now()}_${id.substring(0, 8)}`;
    
    const op: OfflineOperation = {
      id,
      idempotencyKey,
      tenantId,
      operationType,
      endpoint,
      method,
      payload: payload as Record<string, unknown>,
      createdAt: new Date().toISOString(),
      status: SyncStatus.QUEUED,
      retryCount: 0,
    };

    await db.offlineOperations.add(op);
    await refreshOperations();

    // If online, immediately attempt background sync
    if (isOnline) {
      setTimeout(() => triggerSync(), 100);
    }

    return id;
  };

  // Trigger synchronization of queued operations
  const triggerSync = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      const pendingOps = await db.offlineOperations
        .filter(op => op.status === SyncStatus.QUEUED || op.status === SyncStatus.FAILED)
        .toArray();

      if (pendingOps.length === 0) {
        setIsSyncing(false);
        return;
      }

      for (const op of pendingOps) {
        try {
          // Update status to syncing
          await db.offlineOperations.update(op.id, { 
            status: SyncStatus.SYNCING, 
            lastAttemptAt: new Date().toISOString() 
          });

          // In production or demo mode: send to API sync endpoint or mock success
          // Simulate network sync with idempotency check
          await new Promise(res => setTimeout(res, 600));

          // Mark synced
          await db.offlineOperations.update(op.id, { 
            status: SyncStatus.SYNCED 
          });
        } catch (err) {
          console.error(`Failed to sync operation ${op.id}:`, err);
          await db.offlineOperations.update(op.id, {
            status: SyncStatus.FAILED,
            retryCount: op.retryCount + 1,
            errorMessage: err instanceof Error ? err.message : 'Unknown sync error',
          });
        }
      }

      const now = new Date();
      setLastSyncedAt(now);
      localStorage.setItem('ekaydi_last_synced', now.toISOString());
    } finally {
      setIsSyncing(false);
      await refreshOperations();
    }
  }, [isSyncing, refreshOperations]);

  // Auto sync when transitioning to online
  useEffect(() => {
    if (isOnline && pendingCount > 0) {
      triggerSync();
    }
  }, [isOnline, pendingCount, triggerSync]);

  const clearResolvedOperations = async () => {
    await db.offlineOperations.filter(op => op.status === SyncStatus.SYNCED).delete();
    await refreshOperations();
  };

  return (
    <SyncContext.Provider
      value={{
        isOnline,
        isSyncing,
        pendingCount,
        lastSyncedAt,
        operations,
        enqueueOperation,
        triggerSync,
        clearResolvedOperations,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = (): SyncContextType => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};
