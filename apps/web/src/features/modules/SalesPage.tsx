import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { useSync } from '../../offline/SyncContext';
import { mockSalesOrders, mockCustomers, mockProducts, mockWarehouses } from '../../services/mockData';
import { SalesOrder, SalesOrderStatus, SalesOrderItem } from '@ekaydi/shared-types';
import { 
  Truck, 
  Plus, 
  CreditCard, 
  DollarSign, 
  Users, 
  FileText, 
  CheckCircle2, 
  Clock,
  Printer
} from 'lucide-react';
import { db } from '../../offline/db';

export const SalesPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentTenant } = useAuth();
  const { enqueueOperation } = useSync();

  const [orders, setOrders] = useState<SalesOrder[]>(mockSalesOrders);
  const [showModal, setShowModal] = useState(false);

  // New sales order form state
  const [customerId, setCustomerId] = useState(mockCustomers[0].id);
  const [warehouseId, setWarehouseId] = useState(mockWarehouses[0].id);
  const [productId, setProductId] = useState(mockProducts[1].id);
  const [quantity, setQuantity] = useState(50);
  const [discount, setDiscount] = useState(0);

  const handleCreateSalesOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const cust = mockCustomers.find(c => c.id === customerId);
    const wh = mockWarehouses.find(w => w.id === warehouseId);
    const prod = mockProducts.find(p => p.id === productId);

    if (!cust || !wh || !prod) return;

    const subtotal = quantity * prod.sellingPrice;
    const tax = subtotal * 0.05;
    const total = subtotal - discount + tax;

    const soItem: SalesOrderItem = {
      id: `soi-${Date.now()}`,
      productId: prod.id,
      productSku: prod.sku,
      productName: prod.name,
      quantity,
      unitPrice: prod.sellingPrice,
      totalAmount: subtotal,
    };

    const newSO: SalesOrder = {
      id: `so-${Date.now()}`,
      tenantId: currentTenant.id,
      soNo: `SO-2026-1${Date.now().toString().slice(-3)}`,
      customerId: cust.id,
      customerName: cust.name,
      sourceWarehouseId: wh.id,
      sourceWarehouseName: wh.name,
      status: SalesOrderStatus.CONFIRMED,
      items: [soItem],
      subtotal,
      discountAmount: discount,
      taxAmount: tax,
      totalAmount: total,
      paidAmount: total, // Instant paid in demo flow
      paymentStatus: 'PAID',
      orderDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to IndexedDB
    try {
      await db.salesOrders.add(newSO);
    } catch (err) {
      console.warn('Saved in memory:', err);
    }

    // Enqueue offline operation
    await enqueueOperation('CREATE_SALES_ORDER', '/api/v1/sales', 'POST', newSO, currentTenant.id);

    setOrders(prev => [newSO, ...prev]);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-industrial-teal/10 text-industrial-teal border border-industrial-teal/30">
              COMMERCIAL SALES DISPATCH
            </span>
            <span className="text-xs text-slate-400 font-mono">{orders.length} TOTAL INVOICED ORDERS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.sales.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Wholesale orders, stock reservation locks, payment statuses, and warehouse dispatch lists.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-industrial-teal hover:bg-industrial-teal/90 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t.sales.newOrder}</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-2.5 text-start font-semibold">SO Reference</th>
                <th className="py-2.5 text-start font-semibold">Customer Account</th>
                <th className="py-2.5 text-start font-semibold">Dispatch Hub</th>
                <th className="py-2.5 text-end font-semibold">Gross Total</th>
                <th className="py-2.5 text-end font-semibold">Payment Status</th>
                <th className="py-2.5 text-center font-semibold">Fulfillment</th>
                <th className="py-2.5 text-end font-semibold">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {orders.map((so) => (
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
                  <td className="py-3 text-end">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      so.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' :
                      so.paymentStatus === 'PARTIAL' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {so.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                      {so.status}
                    </span>
                  </td>
                  <td className="py-3 text-end">
                    <button
                      onClick={() => alert(`Print Tax Invoice for Order ${so.soNo}`)}
                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      title="Print Tax Invoice"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Sales Order Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Create Commercial Sales Order
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Reserves warehouse inventory and creates client invoice.
            </p>

            <form onSubmit={handleCreateSalesOrder} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Customer Account
                </label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-industrial-teal focus:outline-none"
                >
                  {mockCustomers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} (Credit: ${c.creditLimit})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Dispatch Origin Warehouse
                </label>
                <select
                  value={warehouseId}
                  onChange={(e) => setWarehouseId(e.target.value)}
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
                      <option key={p.id} value={p.id}>{p.name} (${p.sellingPrice})</option>
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
                  Confirm & Dispatch Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
