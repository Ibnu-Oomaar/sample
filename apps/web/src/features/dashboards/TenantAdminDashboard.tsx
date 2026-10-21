import React from 'react';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { mockWarehouses, mockProducts, mockTransfers, mockSalesOrders, mockPurchaseOrders, mockExpenses } from '../../services/mockData';
import { 
  Boxes, 
  Warehouse, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Activity, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const TenantAdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { currentTenant } = useAuth();

  // Calculate high-level financial & inventory metrics
  const totalValuation = mockProducts.reduce((acc, p) => acc + (p.costPrice * (p.totalQuantityOnHand || 0)), 0);
  const totalSalesRevenue = mockSalesOrders.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalPurchaseSpend = mockPurchaseOrders.reduce((acc, p) => acc + p.totalAmount, 0);
  const totalOperationalExpenses = mockExpenses.reduce((acc, e) => acc + e.amount, 0);
  const estimatedGrossProfit = totalSalesRevenue - (totalSalesRevenue * 0.72); // 28% margin estimate
  const estimatedNetProfit = estimatedGrossProfit - totalOperationalExpenses;

  const lowStockProducts = mockProducts.filter(p => (p.totalQuantityOnHand || 0) <= p.minStockLevel);

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-industrial-teal/10 text-industrial-teal border border-industrial-teal/30">
              TENANT EXECUTIVE OVERVIEW
            </span>
            <span className="text-xs text-slate-400 font-mono">{currentTenant.currency} · Tax: {currentTenant.taxRate}%</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.dashboards.tenantAdmin}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time financial position, warehouse facility performance, and corporate inventory valuation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/app/reports"
            className="px-3 py-1.5 rounded-lg bg-industrial-teal text-white hover:bg-industrial-teal/90 text-xs font-semibold shadow-sm transition"
          >
            Generate Executive Report
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inventory Value */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Net Inventory Valuation</span>
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono">
            ${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">Across {mockWarehouses.length} active warehouses</span>
        </div>

        {/* Total Sales Revenue */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total B2B Sales Revenue</span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono">
            ${totalSalesRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-emerald-500 font-medium">+14.2% month-over-month</span>
        </div>

        {/* Realized Operating Net Profit */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Net Operating Profit</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
            ${Math.max(0, estimatedNetProfit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">After all warehouse OPEX</span>
        </div>

        {/* Low Stock Discrepancies */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Safety Stock Breach</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-500 mt-2 font-mono">
            {lowStockProducts.length} Products
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Immediate PO reorder needed</span>
        </div>
      </div>

      {/* Multi-Warehouse Utilization Heatmap */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Facility Capacity & Pallet Load Matrix</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Live operational utilization across regional hub locations.</p>
          </div>
          <Link to="/app/warehouses" className="text-xs font-semibold text-industrial-teal hover:underline">
            View Floor Plans →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {mockWarehouses.map((wh) => {
            const pct = Math.round((wh.currentOccupancyPallets / wh.totalCapacityPallets) * 100);
            return (
              <div key={wh.id} className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-700 dark:text-slate-200">{wh.code}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      pct > 85 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {pct}% Full
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mt-1 truncate">{wh.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{wh.city} · {wh.capacitySqm} m²</p>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>{wh.currentOccupancyPallets} Pallets</span>
                    <span>{wh.totalCapacityPallets} Max</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${pct > 85 ? 'bg-red-500' : pct > 65 ? 'bg-industrial-teal' : 'bg-industrial-cyan'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column Activity & Low Stock Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Low Stock Alerts */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Critical Reorder Alert List</span>
            </h3>
            <span className="text-xs font-mono text-amber-500 font-bold">{lowStockProducts.length} Items Critical</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{p.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">SKU: {p.sku} · Category: {p.categoryName}</div>
                </div>
                <div className="text-end">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-red-500/10 text-red-500 border border-red-500/30">
                    {p.totalQuantityOnHand} {p.unitCode} (Min: {p.minStockLevel})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent In-Transit Logistics Transfers */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              <span>Inter-Warehouse Shipments</span>
            </h3>
            <Link to="/app/transfers" className="text-xs font-semibold text-industrial-teal hover:underline">
              All Transfers →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
            {mockTransfers.map((tr) => (
              <div key={tr.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold font-mono text-slate-900 dark:text-slate-100">{tr.transferNo}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                    {tr.sourceWarehouseName} ➔ {tr.destWarehouseName}
                  </div>
                </div>
                <div className="text-end">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    tr.status === 'IN_TRANSIT' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30' :
                    tr.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    'bg-slate-500/10 text-slate-400'
                  }`}>
                    {tr.status} ({tr.totalQuantity} Units)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
