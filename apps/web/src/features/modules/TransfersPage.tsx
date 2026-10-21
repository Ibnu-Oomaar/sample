import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { useSync } from '../../offline/SyncContext';
import { mockTransfers, mockWarehouses, mockProducts } from '../../services/mockData';
import { StockTransfer, TransferStatus, StockTransferItem } from '@ekaydi/shared-types';
import { 
  ArrowLeftRight, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Plus, 
  ChevronRight, 
  AlertCircle,
  ShieldCheck,
  Send,
  PackageCheck
} from 'lucide-react';
import { db } from '../../offline/db';

export const TransfersPage: React.FC = () => {
  const { t, isRtl } = useTranslation();
  const { currentTenant, currentUser } = useAuth();
  const { enqueueOperation } = useSync();

  const [transfers, setTransfers] = useState<StockTransfer[]>(mockTransfers);
  const [selectedTransfer, setSelectedTransfer] = useState<StockTransfer>(mockTransfers[0]);
  const [showNewModal, setShowNewModal] = useState(false);

  // New transfer form state
  const [sourceWhId, setSourceWhId] = useState(mockWarehouses[0].id);
  const [destWhId, setDestWhId] = useState(mockWarehouses[1].id);
  const [selectedProductId, setSelectedProductId] = useState(mockProducts[0].id);
  const [transferQty, setTransferQty] = useState(50);
  const [transferNotes, setTransferNotes] = useState('');

  // 5-stage status workflow
  const stages: TransferStatus[] = [
    TransferStatus.REQUESTED,
    TransferStatus.APPROVED,
    TransferStatus.DISPATCHED,
    TransferStatus.IN_TRANSIT,
    TransferStatus.RECEIVED,
  ];

  const getStageIndex = (status: TransferStatus) => stages.indexOf(status);

  // Advance workflow state
  const advanceTransferState = async (transferId: string) => {
    const tr = transfers.find(t => t.id === transferId);
    if (!tr) return;

    const currentIndex = getStageIndex(tr.status);
    if (currentIndex >= stages.length - 1) return;

    const nextStatus = stages[currentIndex + 1];
    const updatedTransfer: StockTransfer = {
      ...tr,
      status: nextStatus,
      dispatchedAt: nextStatus === TransferStatus.DISPATCHED ? new Date().toISOString() : tr.dispatchedAt,
      receivedAt: nextStatus === TransferStatus.RECEIVED ? new Date().toISOString() : tr.receivedAt,
      updatedAt: new Date().toISOString(),
    };

    // Update in IndexedDB
    try {
      await db.transfers.put(updatedTransfer);
    } catch (err) {
      console.warn('Updated in memory:', err);
    }

    // Enqueue offline operation
    await enqueueOperation(
      'REQUEST_STOCK_TRANSFER',
      `/api/v1/transfers/${tr.id}/advance-status`,
      'PATCH',
      { status: nextStatus },
      currentTenant.id
    );

    setTransfers(prev => prev.map(t => t.id === transferId ? updatedTransfer : t));
    setSelectedTransfer(updatedTransfer);
  };

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceWhId === destWhId) {
      alert('Source and destination warehouses must be different!');
      return;
    }

    const sourceWh = mockWarehouses.find(w => w.id === sourceWhId);
    const destWh = mockWarehouses.find(w => w.id === destWhId);
    const prod = mockProducts.find(p => p.id === selectedProductId);

    if (!sourceWh || !destWh || !prod) return;

    const transferItem: StockTransferItem = {
      id: `ti-${Date.now()}`,
      productId: prod.id,
      productSku: prod.sku,
      productName: prod.name,
      quantity: transferQty,
      unitCost: prod.costPrice,
    };

    const newTransfer: StockTransfer = {
      id: `trans-${Date.now()}`,
      tenantId: currentTenant.id,
      transferNo: `TR-2026-0${Date.now().toString().slice(-3)}`,
      sourceWarehouseId: sourceWh.id,
      sourceWarehouseName: sourceWh.name,
      destWarehouseId: destWh.id,
      destWarehouseName: destWh.name,
      status: TransferStatus.REQUESTED,
      items: [transferItem],
      totalItems: 1,
      totalQuantity: transferQty,
      requestedByUserId: currentUser.id,
      requestedByUserName: currentUser.fullName,
      notes: transferNotes || 'Inter-facility inventory rebalancing.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await db.transfers.add(newTransfer);
    } catch (err) {
      console.warn('Saved in memory:', err);
    }

    await enqueueOperation('REQUEST_STOCK_TRANSFER', '/api/v1/transfers', 'POST', newTransfer, currentTenant.id);

    setTransfers(prev => [newTransfer, ...prev]);
    setSelectedTransfer(newTransfer);
    setShowNewModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-industrial-teal/10 text-industrial-teal border border-industrial-teal/30">
              LOGISTICS SHIPMENT TRACKER
            </span>
            <span className="text-xs text-slate-400 font-mono">5-STAGE AUDIT PROTOCOL</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.transfers.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            End-to-end chain of custody, dispatched cargo tracking, and receiving inspection reconciliations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-industrial-teal hover:bg-industrial-teal/90 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t.transfers.newTransfer}</span>
          </button>
        </div>
      </div>

      {/* Main Split Interface: Transfer List on Left + Selected Shipment Visualizer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Transfer List */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Active Warehouse Transfers ({transfers.length})
          </h3>

          <div className="space-y-2">
            {transfers.map((tr) => (
              <div
                key={tr.id}
                onClick={() => setSelectedTransfer(tr)}
                className={`p-3 rounded-lg border transition cursor-pointer text-xs ${
                  selectedTransfer.id === tr.id
                    ? 'border-industrial-teal bg-industrial-teal/5 dark:bg-industrial-teal/10 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-industrial-teal">{tr.transferNo}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    tr.status === TransferStatus.RECEIVED ? 'bg-emerald-500/10 text-emerald-400' :
                    tr.status === TransferStatus.IN_TRANSIT ? 'bg-sky-500/10 text-sky-400' :
                    'bg-amber-500/10 text-amber-500'
                  }`}>
                    {tr.status}
                  </span>
                </div>

                <div className="mt-2 text-slate-700 dark:text-slate-200 font-medium truncate">
                  {tr.sourceWarehouseName} ➔ {tr.destWarehouseName}
                </div>

                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{tr.totalQuantity} Units ({tr.totalItems} SKUs)</span>
                  <span>{new Date(tr.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected Shipment Visualizer & Workflow Stepper */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Shipment Dossier</div>
                <h3 className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {selectedTransfer.transferNo}
                </h3>
              </div>

              {/* Advance Workflow Action */}
              {selectedTransfer.status !== TransferStatus.RECEIVED && (
                <button
                  onClick={() => advanceTransferState(selectedTransfer.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-industrial-teal hover:bg-industrial-teal/90 text-white text-xs font-semibold shadow-md transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Advance to Next Stage (➔ {stages[getStageIndex(selectedTransfer.status) + 1]})</span>
                </button>
              )}
            </div>

            {/* 5-Stage Visual Timeline Stepper */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-4">
                Chain of Custody Progress
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {stages.map((stage, idx) => {
                  const currentIdx = getStageIndex(selectedTransfer.status);
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={stage} className="flex flex-col items-center text-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition ${
                        isDone 
                          ? 'bg-industrial-teal text-white shadow-md shadow-industrial-teal/30' 
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      } ${isCurrent ? 'ring-4 ring-industrial-teal/30' : ''}`}>
                        {idx + 1}
                      </div>
                      <span className={`text-[10px] font-mono mt-2 uppercase ${
                        isCurrent ? 'font-bold text-industrial-teal' : isDone ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'
                      }`}>
                        {stage.replace('_', ' ')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Route Map Card */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Origin Facility</span>
                  <div className="font-bold text-white font-sans">{selectedTransfer.sourceWarehouseName}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-industrial-cyan">
                <div className="w-12 h-0.5 bg-industrial-cyan/40" />
                <Truck className="w-5 h-5 animate-pulse" />
                <div className="w-12 h-0.5 bg-industrial-cyan/40" />
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Destination Facility</span>
                  <div className="font-bold text-white font-sans">{selectedTransfer.destWarehouseName}</div>
                </div>
              </div>
            </div>

            {/* Cargo Manifest Item Table */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                Dispatched Cargo Manifest
              </h4>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                <table className="w-full text-start text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 font-mono text-[10px] uppercase text-slate-400">
                    <tr>
                      <th className="py-2.5 px-3 text-start">SKU & Item Name</th>
                      <th className="py-2.5 px-3 text-end">Dispatched Qty</th>
                      <th className="py-2.5 px-3 text-end">Unit Value</th>
                      <th className="py-2.5 px-3 text-end">Total Insured Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    {selectedTransfer.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 dark:text-slate-100">
                          <div>{item.productName}</div>
                          <div className="text-[10px] text-industrial-teal font-mono">{item.productSku}</div>
                        </td>
                        <td className="py-2.5 px-3 text-end font-bold text-slate-900 dark:text-white">
                          {item.quantity} Units
                        </td>
                        <td className="py-2.5 px-3 text-end text-slate-500">
                          ${item.unitCost.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-end font-bold text-emerald-500">
                          ${(item.quantity * item.unitCost).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Logistics Notes & Handlers */}
            <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Operational Notes: </span>
              {selectedTransfer.notes}
            </div>
          </div>
        </div>
      </div>

      {/* New Transfer Request Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Initiate Stock Transfer Request
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Generates an immutable inter-warehouse shipment transfer reference.
            </p>

            <form onSubmit={handleCreateTransfer} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Origin Warehouse
                  </label>
                  <select
                    value={sourceWhId}
                    onChange={(e) => setSourceWhId(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-industrial-teal focus:outline-none"
                  >
                    {mockWarehouses.map((w) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Destination Warehouse
                  </label>
                  <select
                    value={destWhId}
                    onChange={(e) => setDestWhId(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-industrial-teal focus:outline-none"
                  >
                    {mockWarehouses.map((w) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Product Item
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-industrial-teal focus:outline-none"
                >
                  {mockProducts.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Transfer Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={transferQty}
                  onChange={(e) => setTransferQty(parseInt(e.target.value) || 1)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:ring-1 focus:ring-industrial-teal focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Logistics Instructions
                </label>
                <textarea
                  rows={2}
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  placeholder="Transport vehicle plate, driver name, urgency..."
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-industrial-teal focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-industrial-teal hover:bg-industrial-teal/90 text-white text-xs font-semibold shadow-sm"
                >
                  Submit Transfer Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
