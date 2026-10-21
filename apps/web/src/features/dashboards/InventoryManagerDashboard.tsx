import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { mockProducts, mockInventoryBalances } from '../../services/mockData';
import { Product, InventoryBalance } from '@ekaydi/shared-types';
import { 
  Boxes, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  ArrowUpDown, 
  Barcode, 
  Layers,
  Sparkles
} from 'lucide-react';

export const InventoryManagerDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [balances, setBalances] = useState<InventoryBalance[]>(mockInventoryBalances);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedBalance, setSelectedBalance] = useState<InventoryBalance | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState<string>('Cycle count correction');

  const filteredBalances = balances.filter(b => 
    b.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.productSku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.binLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdjustStock = () => {
    if (!selectedBalance) return;
    setBalances(prev => prev.map(b => {
      if (b.id === selectedBalance.id) {
        return {
          ...b,
          quantityOnHand: Math.max(0, b.quantityOnHand + adjustmentAmount),
          updatedAt: new Date().toISOString()
        };
      }
      return b;
    }));
    setShowAdjustModal(false);
    setSelectedBalance(null);
    setAdjustmentAmount(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-industrial-teal/10 text-industrial-teal border border-industrial-teal/30">
              INVENTORY CONTROLLER CONSOLE
            </span>
            <span className="text-xs text-slate-400 font-mono">ABC CLASSIFICATION & CYCLE COUNT</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.dashboards.inventoryManager}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time SKU balances, available vs. reserved quotas, batch tracking, and audit adjustments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedBalance(balances[0]);
              setShowAdjustModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-industrial-teal hover:bg-industrial-teal/90 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Perform Stock Adjustment</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Active SKUs</span>
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono">
            {mockProducts.length} Catalog SKUs
          </div>
          <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">100% Barcoded & Serialized</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Reserved for Outbound Orders</span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-500">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-sky-500 mt-2 font-mono">
            229 Units Reserved
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Locked for B2B dispatch</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Critical Low-Stock Warnings</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-500 mt-2 font-mono">
            1 Item Critical
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">PHAR-SANI-5LTR below 40 units</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Cycle Count Accuracy</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-500 mt-2 font-mono">
            99.82%
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Audited past 30 days</span>
        </div>
      </div>

      {/* High-Density Stock Balance Grid */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Live Facility Stock Balances & Bin Allocations</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Search by SKU, product description, or bin coordinate.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute start-3 top-2.5" />
              <input
                type="text"
                placeholder="Search SKU or location..."
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
                <th className="py-2.5 text-start font-semibold">SKU & Item Name</th>
                <th className="py-2.5 text-start font-semibold">Bin Location</th>
                <th className="py-2.5 text-start font-semibold">Batch / Lot</th>
                <th className="py-2.5 text-end font-semibold">On Hand</th>
                <th className="py-2.5 text-end font-semibold">Reserved</th>
                <th className="py-2.5 text-end font-semibold">Damaged</th>
                <th className="py-2.5 text-end font-semibold">Net Available</th>
                <th className="py-2.5 text-end font-semibold">Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {filteredBalances.map((bal) => {
                const available = Math.max(0, bal.quantityOnHand - bal.quantityReserved - bal.quantityDamaged);
                return (
                  <tr key={bal.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 font-sans font-semibold text-slate-900 dark:text-slate-100">
                      <div>{bal.productName}</div>
                      <div className="text-[10px] text-industrial-teal font-mono">{bal.productSku}</div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {bal.binLocation}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500 text-[11px]">
                      {bal.batchNumber || 'N/A'}
                    </td>
                    <td className="py-3 text-end font-bold text-slate-900 dark:text-white">
                      {bal.quantityOnHand}
                    </td>
                    <td className="py-3 text-end text-sky-500 font-medium">
                      {bal.quantityReserved}
                    </td>
                    <td className="py-3 text-end text-red-500 font-medium">
                      {bal.quantityDamaged}
                    </td>
                    <td className="py-3 text-end font-bold text-emerald-600 dark:text-emerald-400">
                      {available}
                    </td>
                    <td className="py-3 text-end">
                      <button
                        onClick={() => {
                          setSelectedBalance(bal);
                          setShowAdjustModal(true);
                        }}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-sans font-medium transition"
                      >
                        Adjust
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {showAdjustModal && selectedBalance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Perform Stock Adjustment
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Adjust balance for <span className="font-semibold text-industrial-teal">{selectedBalance.productName}</span> at bin {selectedBalance.binLocation}.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Adjustment Delta (Positive or Negative)
                </label>
                <input
                  type="number"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(parseInt(e.target.value) || 0)}
                  placeholder="+5 or -3"
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-industrial-teal"
                />
                <span className="text-[10px] text-slate-400">
                  New on-hand will be: {Math.max(0, selectedBalance.quantityOnHand + adjustmentAmount)}
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Audit Reason
                </label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-industrial-teal"
                >
                  <option value="Cycle count correction">Physical Cycle Count Correction</option>
                  <option value="Damaged in transit write-off">Damaged in Transit / Quarantine</option>
                  <option value="Supplier return reconciliation">Supplier Return Reconciliation</option>
                  <option value="Customer RMA returned to stock">Customer RMA Returned to Stock</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAdjustModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjustStock}
                className="px-4 py-2 rounded-lg bg-industrial-teal hover:bg-industrial-teal/90 text-white text-xs font-semibold shadow-sm"
              >
                Commit Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
