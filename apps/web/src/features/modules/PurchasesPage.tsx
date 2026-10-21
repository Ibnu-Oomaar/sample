import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { mockPurchaseOrders, mockSuppliers, mockProducts, mockWarehouses } from '../../services/mockData';
import { PurchaseOrder, PurchaseOrderStatus, PurchaseOrderItem } from '@ekaydi/shared-types';
import { 
  ShoppingBag, 
  Plus, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  Building,
  FileText
} from 'lucide-react';
import { db } from '../../offline/db';

export const PurchasesPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentTenant } = useAuth();
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [showModal, setShowModal] = useState(false);

  // New PO state
  const [supplierId, setSupplierId] = useState(mockSuppliers[0].id);
  const [destWhId, setDestWhId] = useState(mockWarehouses[0].id);
  const [productId, setProductId] = useState(mockProducts[0].id);
  const [quantity, setQuantity] = useState(100);

  const handleCreatePO = async (e: React.FormEvent) => {
    e.preventDefault();
    const sup = mockSuppliers.find(s => s.id === supplierId);
    const wh = mockWarehouses.find(w => w.id === destWhId);
    const prod = mockProducts.find(p => p.id === productId);

    if (!sup || !wh || !prod) return;

    const total = quantity * prod.costPrice;
    const poItem: PurchaseOrderItem = {
      id: `poi-${Date.now()}`,
      productId: prod.id,
      productSku: prod.sku,
      productName: prod.name,
      quantity,
      unitCost: prod.costPrice,
      totalAmount: total,
      receivedQuantity: 0,
    };

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      tenantId: currentTenant.id,
      poNo: `PO-2026-0${Date.now().toString().slice(-3)}`,
      supplierId: sup.id,
      supplierName: sup.name,
      destWarehouseId: wh.id,
      destWarehouseName: wh.name,
      status: PurchaseOrderStatus.SUBMITTED,
      items: [poItem],
      subtotal: total,
      taxAmount: total * 0.05,
      totalAmount: total * 1.05,
      paidAmount: 0,
      orderDate: new Date().toISOString(),
      expectedDeliveryDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await db.purchaseOrders.add(newPO);
    } catch (err) {
      console.warn('Saved in memory:', err);
    }

    setOrders(prev => [newPO, ...prev]);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-industrial-teal/10 text-industrial-teal border border-industrial-teal/30">
              SUPPLY CHAIN PROCUREMENT
            </span>
            <span className="text-xs text-slate-400 font-mono">{orders.length} TOTAL PURCHASE ORDERS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.purchases.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Supplier requisitions, goods receiving verification slips, and accounts payable approvals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-industrial-teal hover:bg-industrial-teal/90 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t.purchases.newOrder}</span>
          </button>
        </div>
      </div>

      {/* PO List Grid */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-2.5 text-start font-semibold">PO Number</th>
                <th className="py-2.5 text-start font-semibold">Supplier Partner</th>
                <th className="py-2.5 text-start font-semibold">Receiving Facility</th>
                <th className="py-2.5 text-end font-semibold">Order Total</th>
                <th className="py-2.5 text-end font-semibold">Paid To Date</th>
                <th className="py-2.5 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {orders.map((po) => (
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
                    ${po.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 text-end text-emerald-500 font-semibold">
                    ${po.paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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

      {/* Draft PO Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Draft Purchase Requisition Order
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Generates a procurement order linked to the supplier and designated warehouse receiving dock.
            </p>

            <form onSubmit={handleCreatePO} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Supplier Partner
                </label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-industrial-teal focus:outline-none"
                >
                  {mockSuppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} (Terms: {s.paymentTermsDays}d)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Receiving Destination Warehouse
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Product Item
                  </label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-industrial-teal focus:outline-none"
                  >
                    {mockProducts.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} (${p.costPrice})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Order Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:ring-1 focus:ring-industrial-teal focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-industrial-teal hover:bg-industrial-teal/90 text-white text-xs font-semibold shadow-sm"
                >
                  Issue Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
