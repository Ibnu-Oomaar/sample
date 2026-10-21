import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useSync } from '../../offline/SyncContext';
import { useTranslation } from '../../i18n';
import { WifiOff, RefreshCw } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isOnline, pendingCount, triggerSync, isSyncing } = useSync();
  const { t } = useTranslation();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-industrial-surface dark:bg-industrial-navy-darker text-slate-800 dark:text-slate-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-50 h-full">
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Offline Persistent Warning Banner */}
        {!isOnline && (
          <div className="bg-amber-600 text-white px-4 py-2 text-xs flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 animate-pulse" />
              <span className="font-medium">{t.offline.bannerOffline}</span>
            </div>
            <span className="font-mono text-[11px] bg-amber-700 px-2 py-0.5 rounded">
              {pendingCount} {t.common.pendingSyncCount}
            </span>
          </div>
        )}

        {isOnline && pendingCount > 0 && (
          <div className="bg-sky-600 text-white px-4 py-1.5 text-xs flex items-center justify-between shadow-sm">
            <span>{t.offline.bannerPending}</span>
            <button
              onClick={triggerSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 bg-sky-700 hover:bg-sky-800 px-2.5 py-0.5 rounded font-medium text-[11px] transition"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{t.offline.syncNow}</span>
            </button>
          </div>
        )}

        <Header onToggleSidebar={() => setMobileSidebarOpen(true)} />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50 dark:bg-[#0B131E]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
