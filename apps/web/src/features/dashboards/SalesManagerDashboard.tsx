import React from 'react';
import { useTranslation } from '../../i18n';
import { mockSalesOrders, mockCustomers, mockProducts } from '../../services/mockData';
import { 
  Truck, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Users, 
  Plus, 
  ShoppingBag,
  CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SalesManagerDashboard: React.FC = () => {
  const { t } = useTranslation();

  const totalSalesVolume = mockSalesOrders.reduce((acc, so) => acc + so.totalAmount, 0);
  const totalCollected = mockSalesOrders.reduce((acc, so) => acc + so.paidAmount, 0);
  const totalReceivables = totalSalesVolume - totalCollected;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-industrial-teal/10 text-industrial-teal border border-industrial-teal/30">
              COMMERCIAL SALES DISPATCH
            </span>
            <span className="text-xs text-slate-400 font-mono">B2B FULFILLMENT & INVOICE TRACKING</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.dashboards.salesManager}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Order fulfillment pipelines, wholesale customer credit limits, and dispatch queues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/app/sales"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-industrial-teal hover:bg-industrial-teal/90 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Sales Order</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Booked Sales</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono">
            ${totalSalesVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-emerald-500 font-medium">+18.5% B2B target beat</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Collected Cash & Bank</span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-500">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-sky-500 mt-2 font-mono">
            ${totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Direct deposits & wire transfers</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Accounts Receivable (A/R)</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-500 mt-2 font-mono">
            ${totalReceivables.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Pending customer settlements</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active B2B Customers</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono">
            {mockCustomers.length} Verified Accounts
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Wholesale and Supermarkets</span>
        </div>
      </div>

      {/* Sales Orders Pipeline Table */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Live Sales Orders & Dispatch Queue</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-2.5 text-start font-semibold">SO Reference</th>
                <th className="py-2.5 text-start font-semibold">Client Commercial Entity</th>
                <th className="py-2.5 text-start font-semibold">Fulfillment Warehouse</th>
                <th className="py-2.5 text-end font-semibold">Gross Value</th>
                <th className="py-2.5 text-end font-semibold">Collected</th>
                <th className="py-2.5 text-center font-semibold">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {mockSalesOrders.map((so) => (
                <tr key={so.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-industrial-teal">
                    {so.soNo}
                  </td>
                  <td className="py-3 font-sans font-semibold text-slate-900 dark:text-slate-100">
                    {so.customerName}
                  </td>
                  <td className="py-3 font-sans text-slate-600 dark:text-slate-300">
                    {so.sourceWarehouseName}
                  </td>
                  <td className="py-3 text-end font-bold text-slate-900 dark:text-white">
                    ${so.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 text-end text-emerald-500 font-medium">
                    ${so.paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      so.status === 'DISPATCHED' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30' :
                      so.status === 'PROCESSING' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' :
                      'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {so.status}
                    </span>
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
