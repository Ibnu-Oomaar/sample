import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { mockWarehouses } from '../../services/mockData';
import { WarehouseFloor3D } from '../../three/WarehouseFloor3D';
import { Warehouse as WarehouseModel } from '@ekaydi/shared-types';
import { 
  Warehouse, 
  MapPin, 
  Plus, 
  Layers, 
  Users, 
  Boxes, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { db } from '../../offline/db';

export const WarehousesPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentTenant, setCurrentWarehouse } = useAuth();
  const [warehouses, setWarehouses] = useState<WarehouseModel[]>(mockWarehouses);
  const [selectedWh, setSelectedWh] = useState<WarehouseModel>(mockWarehouses[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New warehouse form
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newCity, setNewCity] = useState('Mogadishu');
  const [newAddress, setNewAddress] = useState('');
  const [newCapacity, setNewCapacity] = useState(3000);

  const handleCreateWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCode) return;

    const newWh: WarehouseModel = {
      id: `wh-${Date.now()}`,
      tenantId: currentTenant.id,
      code: newCode,
      name: newName,
      address: newAddress || `${newCity} Industrial Zone`,
      city: newCity,
      capacitySqm: 6000,
      totalCapacityPallets: newCapacity,
      currentOccupancyPallets: 0,
      isActive: true,
      zones: [
        { id: `z-${Date.now()}-1`, code: 'ZONE-A', name: 'Standard Pallet Racks', type: 'STORAGE', capacityPallets: Math.round(newCapacity * 0.7), currentPallets: 0 },
        { id: `z-${Date.now()}-2`, code: 'ZONE-B', name: 'Inbound Dock', type: 'RECEIVING', capacityPallets: Math.round(newCapacity * 0.15), currentPallets: 0 },
        { id: `z-${Date.now()}-3`, code: 'ZONE-C', name: 'Outbound Dispatch', type: 'DISPATCH', capacityPallets: Math.round(newCapacity * 0.15), currentPallets: 0 },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await db.warehouses.add(newWh);
    } catch (err) {
      console.warn('Saved in memory:', err);
    }

    setWarehouses(prev => [...prev, newWh]);
    setSelectedWh(newWh);
    setShowCreateModal(false);
    setNewName('');
    setNewCode('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-industrial-teal/10 text-industrial-teal border border-industrial-teal/30">
              PHYSICAL ASSETS & LOGISTICS
            </span>
            <span className="text-xs text-slate-400 font-mono">{warehouses.length} OPERATIONAL FACILITIES</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.warehouses.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Multi-facility network, temperature-controlled zones, high-bay pallet racking, and dock doors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-industrial-teal hover:bg-industrial-teal/90 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t.warehouses.createWarehouse}</span>
          </button>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {warehouses.map((wh) => {
          const isSelected = selectedWh.id === wh.id;
          const pct = Math.round((wh.currentOccupancyPallets / wh.totalCapacityPallets) * 100);
          return (
            <div
              key={wh.id}
              onClick={() => {
                setSelectedWh(wh);
                setCurrentWarehouse(wh);
              }}
              className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-industrial-teal bg-industrial-teal/5 dark:bg-industrial-teal/10 shadow-md ring-1 ring-industrial-teal'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-industrial-teal">{wh.code}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    pct > 85 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {pct}% Full
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                  {wh.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-industrial-teal" />
                  <span>{wh.city}</span>
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>{wh.currentOccupancyPallets} Pallets</span>
                  <span>{wh.totalCapacityPallets} Capacity</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
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

      {/* Selected Facility Inspector & 3D Visualizer */}
      <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Inspecting Facility</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {selectedWh.name} ({selectedWh.code})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Address: {selectedWh.address} · Floor Space: {selectedWh.capacitySqm} m²
            </p>
          </div>
        </div>

        {/* 3D Warehouse Floor Inspection Component */}
        <WarehouseFloor3D />
      </div>

      {/* Register Warehouse Facility Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Register New Warehouse Facility
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Configures facility codes, storage zones, and capacity allotments.
            </p>

            <form onSubmit={handleCreateWarehouse} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Facility Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bosaso Freezone Logistics Terminal"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-industrial-teal focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Warehouse Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WH-BOS-05"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:ring-1 focus:ring-industrial-teal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    City Location
                  </label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-industrial-teal focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Total Pallet Capacity
                  </label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(parseInt(e.target.value) || 100)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:ring-1 focus:ring-industrial-teal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Physical Address
                  </label>
                  <input
                    type="text"
                    placeholder="Port customs road, Plot 9"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-industrial-teal focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-industrial-teal hover:bg-industrial-teal/90 text-white text-xs font-semibold shadow-sm"
                >
                  Create Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
