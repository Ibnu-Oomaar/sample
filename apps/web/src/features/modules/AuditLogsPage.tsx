import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { mockAuditLogs } from '../../services/mockData';
import { 
  ShieldAlert, 
  Search, 
  Calendar, 
  User, 
  Terminal, 
  Lock,
  CheckCircle2
} from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = mockAuditLogs.filter(l => 
    l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.resource.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-industrial-teal/10 text-industrial-teal border border-industrial-teal/30">
              IMMUTABLE SECURITY AUDIT
            </span>
            <span className="text-xs text-slate-400 font-mono">SOC2 COMPLIANT AUDIT TRAIL</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.nav.auditLogs}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Immutable log of stock movements, purchase approvals, transfers, and security events.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-2.5" />
          <input
            type="text"
            placeholder="Search audit actions, operators, or target resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-9 pe-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-industrial-teal"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-2.5 text-start font-semibold">Timestamp (UTC)</th>
                <th className="py-2.5 text-start font-semibold">Operator / Employee</th>
                <th className="py-2.5 text-start font-semibold">Role Context</th>
                <th className="py-2.5 text-start font-semibold">Security Action</th>
                <th className="py-2.5 text-start font-semibold">Target Resource</th>
                <th className="py-2.5 text-end font-semibold">Client IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 text-slate-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 font-sans font-semibold text-slate-900 dark:text-slate-100">
                    {log.userName}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="py-3 text-industrial-teal font-bold">
                    {log.action}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">
                    {log.resource} ({log.resourceId || 'N/A'})
                  </td>
                  <td className="py-3 text-end text-slate-400">
                    {log.ipAddress || '197.234.12.88'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
