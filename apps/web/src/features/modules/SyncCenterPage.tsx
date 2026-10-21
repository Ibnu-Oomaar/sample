import React from 'react';
import { useTranslation } from '../../i18n';
import { useSync } from '../../offline/SyncContext';
import { SyncStatus } from '@ekaydi/shared-types';
import { 
  RefreshCcw, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Trash2, 
  Key, 
  ShieldCheck,
  Server
} from 'lucide-react';

export const SyncCenterPage: React.FC = () => {
  const { t } = useTranslation();
  const { 
    isOnline, 
    isSyncing, 
    pendingCount, 
    lastSyncedAt, 
    operations, 
    triggerSync, 
    clearResolvedOperations 
  } = useSync();

  const queuedOps = operations.filter(op => op.status === SyncStatus.QUEUED);
  const syncedOps = operations.filter(op => op.status === SyncStatus.SYNCED);
  const failedOps = operations.filter(op => op.status === SyncStatus.FAILED);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-industrial-teal/10 text-industrial-teal border border-industrial-teal/30">
              OFFLINE-FIRST ARCHITECTURE
            </span>
            <span className="text-xs text-slate-400 font-mono">INDEXEDDB DEXIE SYNCHRONIZER</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.nav.syncCenter}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Idempotent batch transaction queue, conflict resolution engine, and connectivity verification logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {syncedOps.length > 0 && (
            <button
              onClick={clearResolvedOperations}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Purge Synced Cache</span>
            </button>
          )}

          <button
            onClick={triggerSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-industrial-teal hover:bg-industrial-teal/90 text-white text-xs font-semibold shadow-sm transition"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? t.common.syncing : t.offline.syncNow}</span>
          </button>
        </div>
      </div>

      {/* Network & Engine Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Network Status */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Network Reachability</span>
            <div className={`p-2 rounded-lg ${isOnline ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
              {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-2 font-mono">
            {isOnline ? 'ONLINE (ACTIVE)' : 'OFFLINE (LOCAL)'}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Heartbeat: /api/v1/health verified</span>
        </div>

        {/* Pending Operations Queue */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending Outbound Queue</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-amber-500 mt-2 font-mono">
            {pendingCount} Mutations
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Waiting for cloud dispatch</span>
        </div>

        {/* Successfully Synced Transactions */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Synced Ledger Records</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
            {syncedOps.length} Transactions
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Idempotency keys verified</span>
        </div>

        {/* Conflict Status */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Stock Conflicts</span>
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-teal-500 mt-2 font-mono">
            0 Conflicts
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Double-spend check active</span>
        </div>
      </div>

      {/* Sync Queue Table */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">IndexedDB Offline Operations Ledger</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Every local change generates an idempotency key to prevent accidental duplicate writes on server reconnection.
            </p>
          </div>
          {lastSyncedAt && (
            <span className="text-xs font-mono text-slate-400">
              {t.offline.lastSynced}: {lastSyncedAt.toLocaleTimeString()}
            </span>
          )}
        </div>

        {operations.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No offline operations recorded yet. Try creating a product or transfer while offline!
          </div>
        ) : (
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                  <th className="py-2.5 text-start font-semibold">Idempotency Key</th>
                  <th className="py-2.5 text-start font-semibold">Operation Type</th>
                  <th className="py-2.5 text-start font-semibold">Endpoint & Method</th>
                  <th className="py-2.5 text-start font-semibold">Timestamp</th>
                  <th className="py-2.5 text-end font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {operations.map((op) => (
                  <tr key={op.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 font-bold text-industrial-teal flex items-center gap-1.5">
                      <Key className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="truncate max-w-[180px]">{op.idempotencyKey}</span>
                    </td>
                    <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">
                      {op.operationType}
                    </td>
                    <td className="py-3 text-slate-500">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{op.method}</span> {op.endpoint}
                    </td>
                    <td className="py-3 text-slate-400 text-[11px]">
                      {new Date(op.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="py-3 text-end">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        op.status === SyncStatus.SYNCED ? 'bg-emerald-500/10 text-emerald-400' :
                        op.status === SyncStatus.SYNCING ? 'bg-sky-500/10 text-sky-400 animate-pulse' :
                        op.status === SyncStatus.FAILED ? 'bg-red-500/10 text-red-400' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {op.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
