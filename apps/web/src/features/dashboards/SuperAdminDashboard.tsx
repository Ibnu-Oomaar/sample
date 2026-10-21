import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { mockTenants } from '../../services/mockData';
import { Tenant, TenantStatus } from '@ekaydi/shared-types';
import { 
  Building2, 
  DollarSign, 
  Users, 
  Activity, 
  ShieldCheck, 
  AlertCircle, 
  Search, 
  Plus, 
  Server,
  Database
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleTenantStatus = (tenantId: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id === tenantId) {
        return {
          ...t,
          status: t.status === TenantStatus.ACTIVE ? TenantStatus.SUSPENDED : TenantStatus.ACTIVE
        };
      }
      return t;
    }));
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.subdomain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              PLATFORM CONTROL CENTER
            </span>
            <span className="text-xs text-slate-400">E-KAYDI CLOUD ENGINE</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.dashboards.superAdmin}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Global SaaS tenant infrastructure, subscription MRR velocity, and multi-tenant isolation monitor.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>PostgreSQL: HEALTHY (4ms)</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total SaaS Tenants</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono">
            {tenants.length} Enterprises
          </div>
          <span className="text-[11px] text-emerald-500 font-medium">+1 new tenant this month</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Monthly Recurring (MRR)</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono">
            $48,500 <span className="text-xs font-normal text-slate-400">/mo</span>
          </div>
          <span className="text-[11px] text-emerald-500 font-medium">ARR Projected: $582,000</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Tenant Users</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono">
            184 Seats
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Across 12 multi-warehouse facilities</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Data Isolation Status</span>
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-teal-500 mt-2 font-mono">
            100% Enforced
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Zero cross-tenant leakage</span>
        </div>
      </div>

      {/* Tenant Directory Table */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Tenant Enterprises & Subscriptions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage tenant accounts, isolation boundaries, and operational status.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute start-3 top-2.5" />
              <input
                type="text"
                placeholder="Search tenant name or domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 pe-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-industrial-teal w-60"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-2.5 text-start font-semibold">Tenant Organization</th>
                <th className="py-2.5 text-start font-semibold">Business Sector</th>
                <th className="py-2.5 text-start font-semibold">Subdomain</th>
                <th className="py-2.5 text-start font-semibold">Plan</th>
                <th className="py-2.5 text-start font-semibold">Status</th>
                <th className="py-2.5 text-end font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">
                    <div>{tenant.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{tenant.id}</div>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">
                    {tenant.businessType}
                  </td>
                  <td className="py-3 font-mono text-slate-500 dark:text-slate-400">
                    {tenant.subdomain}.ekaydi.cloud
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-500/10 text-indigo-500 border border-indigo-500/30">
                      {tenant.plan}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      tenant.status === TenantStatus.ACTIVE
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                        : 'bg-red-500/10 text-red-500 border border-red-500/30'
                    }`}>
                      {tenant.status}
                    </span>
                  </td>
                  <td className="py-3 text-end">
                    <button
                      onClick={() => toggleTenantStatus(tenant.id)}
                      className={`px-3 py-1 rounded text-xs font-semibold transition ${
                        tenant.status === TenantStatus.ACTIVE
                          ? 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                      }`}
                    >
                      {tenant.status === TenantStatus.ACTIVE ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold text-xs mb-3">
            <Server className="w-4 h-4 text-industrial-teal" />
            <span>Bun Runtime Core</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Bun v1.4.0 High-Performance Engine with Express Adapter.</p>
          <div className="mt-3 text-xs font-mono text-emerald-500">Uptime: 99.98% · Memory: 82 MB</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold text-xs mb-3">
            <Database className="w-4 h-4 text-sky-400" />
            <span>PostgreSQL Database Pool</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">TypeORM transactional safety with tenant row-level filtering.</p>
          <div className="mt-3 text-xs font-mono text-emerald-500">Pool: 20 Active · Latency: 3.8ms</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold text-xs mb-3">
            <Activity className="w-4 h-4 text-purple-400" />
            <span>Offline Synchronization Gateway</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Idempotent transactions processor with conflict rejection rules.</p>
          <div className="mt-3 text-xs font-mono text-emerald-500">0 Unresolved Conflicts</div>
        </div>
      </div>
    </div>
  );
};
