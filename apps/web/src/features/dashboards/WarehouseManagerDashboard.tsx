import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { WarehouseFloor3D } from '../../three/WarehouseFloor3D';
import { mockTransfers } from '../../services/mockData';
import { 
  Warehouse, 
  Layers, 
  Truck, 
  ArrowDownLeft, 
  ArrowUpRight, 
  AlertOctagon, 
  Box, 
  Grid3X3,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const WarehouseManagerDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { currentWarehouse } = useAuth();
  const [activeViewMode, setActiveViewMode] = useState<'3D' | '2D'>('3D');

  const occupancyPct = Math.round((currentWarehouse.currentOccupancyPallets / currentWarehouse.totalCapacityPallets) * 100);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-industrial-teal/10 text-industrial-teal border border-industrial-teal/30">
              FACILITY COMMAND CENTER
            </span>
            <span className="text-xs text-slate-400 font-mono">{currentWarehouse.code} · {currentWarehouse.city}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.dashboards.warehouseManager}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time dock bay operations, storage zone telemetry, and interactive rack-level space allocation.
          </p>
        </div>

        {/* View Mode Toggle: 3D vs 2D */}
        <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg p-1 bg-white dark:bg-slate-900 shadow-sm">
          <button
            onClick={() => setActiveViewMode('3D')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              activeViewMode === '3D'
                ? 'bg-industrial-teal text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {t.warehouses.floorPlan3D}
          </button>
          <button
            onClick={() => setActiveViewMode('2D')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              activeViewMode === '2D'
                ? 'bg-industrial-teal text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {t.warehouses.floorPlan2D}
          </button>
        </div>
      </div>

      {/* Facility KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.warehouses.occupancy}</span>
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500">
              <Warehouse className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono">
            {occupancyPct}% <span className="text-xs font-normal text-slate-400">Utilized</span>
          </div>
          <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
            {currentWarehouse.currentOccupancyPallets} / {currentWarehouse.totalCapacityPallets} Pallet Slots
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Inbound Receiving Docks</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono">
            3 Trucks Pending
          </div>
          <span className="text-[11px] text-emerald-500 font-medium">Bays 1, 2, 4 Assigned</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Outbound Freight Staged</span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-500">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono">
            2 Shipments Ready
          </div>
          <span className="text-[11px] text-sky-400 font-medium">TR-2026-0089 Dispatched</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Damaged / Quarantine</span>
            <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-red-500 mt-2 font-mono">
            8 Units Isolated
          </div>
          <span className="text-[11px] text-slate-400 font-medium">In Quarantine Zone Q-01</span>
        </div>
      </div>

      {/* Main Tactical Warehouse Visualizer: 3D vs 2D */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {activeViewMode === '3D' ? 'Interactive 3D High-Bay Facility Model' : 'Tactical 2D Zone Layout & Floor Plan'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeViewMode === '3D' 
                ? 'Rotate, zoom, and click individual storage racks to inspect capacity and bin assignments.'
                : 'Operational top-down schematic of bays, picking routes, and quarantine sections.'
              }
            </p>
          </div>
        </div>

        <div className="mt-4">
          {activeViewMode === '3D' ? (
            <WarehouseFloor3D />
          ) : (
            /* 2D Tactical Grid Floor Plan */
            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Zone D: Receiving Dock */}
                <div className="p-4 rounded-lg bg-slate-900 border-2 border-dashed border-emerald-500/50 flex flex-col justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      ZONE D: RECEIVING DOCK
                    </span>
                    <h5 className="font-bold text-white text-sm mt-2">Bays 01 - 04</h5>
                    <p className="text-[11px] text-slate-400 mt-1">Inbound container unloading & inspection.</p>
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-4">Capacity: 190 / 300 Pallets</div>
                </div>

                {/* Zone A: Heavy Pallet Storage */}
                <div className="p-4 rounded-lg bg-slate-900 border border-teal-500/40 col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-400">
                      ZONE A: INDUSTRIAL HIGH-BAY RACKS
                    </span>
                    <span className="text-[10px] text-teal-400 font-bold">1,520 / 1,800 Pallets</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {['A-01', 'A-02', 'A-03', 'A-04', 'A-05', 'A-06', 'A-07', 'A-08'].map((rack) => (
                      <div key={rack} className="p-2 rounded bg-slate-800 border border-slate-700 text-center">
                        <div className="font-bold text-slate-200">{rack}</div>
                        <div className="text-[10px] text-teal-400 mt-0.5">85% Full</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Zone E: Outbound Dispatch */}
                <div className="p-4 rounded-lg bg-slate-900 border-2 border-dashed border-sky-500/50 flex flex-col justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-400">
                      ZONE E: OUTBOUND DISPATCH
                    </span>
                    <h5 className="font-bold text-white text-sm mt-2">Shipping Bays 05 - 08</h5>
                    <p className="text-[11px] text-slate-400 mt-1">Staging for inter-warehouse and B2B orders.</p>
                  </div>
                  <div className="text-[11px] text-sky-400 mt-4">Capacity: 170 / 300 Pallets</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Facility Storage Zones Table */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Facility Storage Zones Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-2.5 text-start font-semibold">Zone Identifier</th>
                <th className="py-2.5 text-start font-semibold">Classification Type</th>
                <th className="py-2.5 text-start font-semibold">Current Pallets</th>
                <th className="py-2.5 text-start font-semibold">Max Capacity</th>
                <th className="py-2.5 text-end font-semibold">Occupancy %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {currentWarehouse.zones.map((zone) => {
                const zPct = Math.round((zone.currentPallets / zone.capacityPallets) * 100);
                return (
                  <tr key={zone.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 font-bold text-slate-900 dark:text-slate-100 font-sans">
                      <div>{zone.name}</div>
                      <div className="text-[10px] text-industrial-teal font-mono">{zone.code}</div>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {zone.type}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">
                      {zone.currentPallets} Pallets
                    </td>
                    <td className="py-3 text-slate-500">
                      {zone.capacityPallets} Pallets
                    </td>
                    <td className="py-3 text-end">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        zPct > 85 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {zPct}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
