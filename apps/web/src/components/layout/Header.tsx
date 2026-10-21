import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../theme/ThemeContext';
import { useSync } from '../../offline/SyncContext';
import { UserRole, LanguageCode } from '@ekaydi/shared-types';
import { 
  Warehouse as WarehouseIcon, 
  Globe, 
  Sun, 
  Moon, 
  Laptop, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  ShieldCheck, 
  ChevronDown, 
  Layers,
  Menu,
  Building
} from 'lucide-react';
import { mockWarehouses, mockTenants } from '../../services/mockData';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { currentUser, currentTenant, currentWarehouse, setCurrentWarehouse, switchRole, switchTenant } = useAuth();
  const { language, setLanguage, t, isRtl } = useTranslation();
  const { theme, setTheme, isDark } = useTheme();
  const { isOnline, isSyncing, pendingCount, triggerSync } = useSync();

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showWhDropdown, setShowWhDropdown] = useState(false);
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-6 bg-white dark:bg-industrial-navy border-b border-slate-200 dark:border-industrial-border-dark transition-colors duration-200">
      {/* Left: Mobile Toggle & Tenant / Facility Selector */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Tenant selector */}
        <div className="relative">
          <button
            onClick={() => setShowTenantDropdown(!showTenantDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
          >
            <Building className="w-3.5 h-3.5 text-industrial-teal" />
            <span className="font-semibold max-w-[140px] truncate">{currentTenant.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showTenantDropdown && (
            <div className={`absolute top-full mt-1.5 ${isRtl ? 'right-0' : 'left-0'} w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50`}>
              <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Switch Tenant Enterprise</div>
              {mockTenants.map((tenant) => (
                <button
                  key={tenant.id}
                  onClick={() => {
                    switchTenant(tenant.id);
                    setShowTenantDropdown(false);
                  }}
                  className={`w-full text-start px-2.5 py-2 rounded-lg text-xs flex flex-col gap-0.5 transition ${
                    tenant.id === currentTenant.id
                      ? 'bg-industrial-teal/10 text-industrial-teal font-semibold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="font-medium">{tenant.name}</span>
                  <span className="text-[10px] text-slate-400">{tenant.businessType} · Plan: {tenant.plan}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active Warehouse Facility selector */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setShowWhDropdown(!showWhDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-industrial-teal/10 hover:bg-industrial-teal/20 text-xs font-medium text-industrial-teal border border-industrial-teal/30 transition"
          >
            <WarehouseIcon className="w-3.5 h-3.5 text-industrial-teal" />
            <span className="max-w-[150px] truncate">{currentWarehouse.name}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showWhDropdown && (
            <div className={`absolute top-full mt-1.5 ${isRtl ? 'right-0' : 'left-0'} w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50`}>
              <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Select Active Facility</div>
              {mockWarehouses.map((wh) => (
                <button
                  key={wh.id}
                  onClick={() => {
                    setCurrentWarehouse(wh);
                    setShowWhDropdown(false);
                  }}
                  className={`w-full text-start px-2.5 py-2 rounded-lg text-xs flex flex-col gap-0.5 transition ${
                    wh.id === currentWarehouse.id
                      ? 'bg-industrial-teal/10 text-industrial-teal font-semibold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="font-medium">{wh.name}</span>
                  <span className="text-[10px] text-slate-400">{wh.code} · {wh.city} ({wh.currentOccupancyPallets}/{wh.totalCapacityPallets} Pallets)</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Online Status, Role Switcher, Language, Theme, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Offline / Online Sync Pill */}
        <button
          onClick={triggerSync}
          disabled={isSyncing}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-mono font-medium border transition ${
            !isOnline 
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
              : isSyncing
              ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30'
              : pendingCount > 0
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
          }`}
          title="Click to trigger manual synchronization"
        >
          {!isOnline ? (
            <WifiOff className="w-3.5 h-3.5" />
          ) : isSyncing ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Wifi className="w-3.5 h-3.5" />
          )}

          <span className="hidden md:inline">
            {!isOnline ? t.common.offline : isSyncing ? t.common.syncing : t.common.online}
          </span>

          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold">
              {pendingCount}
            </span>
          )}
        </button>

        {/* 8-Role Simulator Quick Switcher Button */}
        <div className="relative">
          <button
            onClick={() => setShowRoleModal(!showRoleModal)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 text-xs font-semibold transition"
            title="Switch between the 8 Dashboard personas"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{currentUser.role.replace('_', ' ')}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showRoleModal && (
            <div className={`absolute top-full mt-1.5 ${isRtl ? 'left-0' : 'right-0'} w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50`}>
              <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                Simulate 8 Role Dashboards
              </div>
              {Object.values(UserRole).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    switchRole(role);
                    setShowRoleModal(false);
                  }}
                  className={`w-full text-start px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition ${
                    currentUser.role === role
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{role.replace('_', ' ')}</span>
                  {currentUser.role === role && <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Language Selector (EN, SO, AR) */}
        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 text-xs font-semibold rounded ${
              language === 'en'
                ? 'bg-white dark:bg-industrial-teal text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('so')}
            className={`px-2 py-1 text-xs font-semibold rounded ${
              language === 'so'
                ? 'bg-white dark:bg-industrial-teal text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            SO
          </button>
          <button
            onClick={() => setLanguage('ar')}
            className={`px-2 py-1 text-xs font-semibold rounded ${
              language === 'ar'
                ? 'bg-white dark:bg-industrial-teal text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            عربي
          </button>
        </div>

        {/* Theme Mode Toggle (Light / Dark / System) */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light')}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={`Theme: ${theme} (Click to toggle)`}
        >
          {theme === 'light' ? (
            <Sun className="w-4 h-4 text-amber-500" />
          ) : theme === 'dark' ? (
            <Moon className="w-4 h-4 text-sky-400" />
          ) : (
            <Laptop className="w-4 h-4 text-emerald-400" />
          )}
        </button>

        {/* User Info Avatar */}
        <div className="flex items-center gap-2 ps-2 border-s border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-industrial-teal/20 text-industrial-teal flex items-center justify-center font-bold text-xs border border-industrial-teal/40">
            {currentUser.fullName.charAt(0)}
          </div>
          <div className="hidden xl:flex flex-col text-xs text-start">
            <span className="font-semibold text-slate-900 dark:text-slate-100 leading-tight truncate max-w-[120px]">
              {currentUser.fullName}
            </span>
            <span className="text-[10px] text-slate-400 leading-tight">
              {currentUser.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
