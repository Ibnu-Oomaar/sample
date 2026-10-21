import React from 'react';
import { useTranslation } from '../../i18n';
import { mockPurchaseOrders, mockSuppliers } from '../../services/mockData';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  Truck, 
  Plus, 
  Building,
  TrendingDown,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PurchasingManagerDashboard: React.FC = () => {
  const { t } = useTranslation();

  const totalCommittedPO = mockPurchaseOrders.reduce((acc, po) => acc + po.totalAmount, 0);
  const totalPaidPO = mockPurchaseOrders.reduce((acc, po) => acc + po.paidAmount, 0);
  const totalOutstandingPayable = totalCommittedPO - totalPaidPO;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-industrial-teal/10 text-industrial-teal border border-industrial-teal/30">
              PROCUREMENT CONTROL
            </span>
            <span className="text-xs text-slate-400 font-mono">SUPPLIER ORDERS & RECEIVING PROGRESS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.dashboards.purchasingManager}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Purchase orders by status, supplier credit terms, goods receiving schedules, and procurement spend.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/app/purchases"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-industrial-teal hover:bg-industrial-teal/90 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Draft Purchase Order</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Open Purchase Orders</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono">
            {mockPurchaseOrders.length} Active Orders
          </div>
          <span className="text-[11px] text-blue-500 font-medium">1 Awaiting Berth Unloading</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Committed Spend</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono">
            ${totalCommittedPO.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-500 font-medium">Approved by Financial Controller</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Outstanding Supplier AP</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-500 mt-2 font-mono">
            ${totalOutstandingPayable.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Due within 30 days</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Supplier On-Time Delivery</span>
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-teal-500 mt-2 font-mono">
            96.4%
          </div>
          <span className="text-[11px] text-slate-400 font-medium">3 verified partners</span>
        </div>
      </div>

      {/* PO Workflow Table */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Procurement Orders & Receiving Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-2.5 text-start font-semibold">PO Reference</th>
                <th className="py-2.5 text-start font-semibold">Supplier Partner</th>
                <th className="py-2.5 text-start font-semibold">Dest Facility</th>
                <th className="py-2.5 text-end font-semibold">Total Amount</th>
                <th className="py-2.5 text-end font-semibold">Paid Amount</th>
                <th className="py-2.5 text-center font-semibold">Workflow Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {mockPurchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-industrial-teal">
                    {po.poNo}
                  </td>
                  <td className="py-3 font-sans font-semibold text-slate-900 dark:text-slate-100">
                    {po.supplierName}
                  </td>
                  <td className="py-3 font-sans text-slate-600 dark:text-slate-300">
                    {po.destWarehouseName}
                  </td>
                  <td className="py-3 text-end font-bold text-slate-900 dark:text-white">
                    ${po.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3 text-end text-emerald-500">
                    ${po.paidAmount.toLocaleString()}
                  </td>
                  <td className="py-3 text-center">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                      {po.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supplier Scorecards */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Key Supplier Relationships & Balances</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockSuppliers.map((sup) => (
            <div key={sup.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-industrial-teal" />
                <h4 className="font-semibold text-slate-900 dark:text-white text-xs truncate">{sup.name}</h4>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 space-y-1">
                <div>Contact: {sup.contactPerson}</div>
                <div>Phone: {sup.phone}</div>
                <div>Terms: {sup.paymentTermsDays} Days Net</div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                <span className="text-slate-400">Current Balance:</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">${sup.outstandingBalance.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
