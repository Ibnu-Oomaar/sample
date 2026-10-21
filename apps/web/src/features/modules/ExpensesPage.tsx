import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { mockExpenses, mockWarehouses } from '../../services/mockData';
import { Expense, PaymentMethod } from '@ekaydi/shared-types';
import { 
  Receipt, 
  Plus, 
  DollarSign, 
  Calendar, 
  Warehouse, 
  CreditCard
} from 'lucide-react';

export const ExpensesPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentTenant } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [showModal, setShowModal] = useState(false);

  // New expense form
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Expense['category']>('TRANSPORT');
  const [amount, setAmount] = useState(0);
  const [warehouseId, setWarehouseId] = useState(mockWarehouses[0].id);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const wh = mockWarehouses.find(w => w.id === warehouseId);

    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      tenantId: currentTenant.id,
      expenseNo: `EXP-2026-0${Date.now().toString().slice(-3)}`,
      category,
      warehouseId: wh?.id,
      warehouseName: wh?.name,
      amount,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      expenseDate: new Date().toISOString().split('T')[0],
      description,
      createdAt: new Date().toISOString(),
    };

    setExpenses(prev => [newExp, ...prev]);
    setShowModal(false);
    setDescription('');
    setAmount(0);
  };

  const totalExpense = expenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-industrial-teal/10 text-industrial-teal border border-industrial-teal/30">
              FACILITY OPERATIONAL COSTS
            </span>
            <span className="text-xs text-slate-400 font-mono">OPEX ALLOCATION BY LOCATION</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.nav.expenses}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Log facility rent, electricity utilities, freight haulage, and maintenance costs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-industrial-teal hover:bg-industrial-teal/90 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Record Operational Expense</span>
          </button>
        </div>
      </div>

      {/* Expense Ledger Table */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Facility Expenses Ledger</h3>
          <span className="text-xs font-mono font-bold text-red-500">
            Total OPEX: ${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-2.5 text-start font-semibold">Expense Ref</th>
                <th className="py-2.5 text-start font-semibold">Description</th>
                <th className="py-2.5 text-start font-semibold">Category</th>
                <th className="py-2.5 text-start font-semibold">Allocated Facility</th>
                <th className="py-2.5 text-start font-semibold">Date</th>
                <th className="py-2.5 text-end font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-industrial-teal">
                    {exp.expenseNo}
                  </td>
                  <td className="py-3 font-sans font-semibold text-slate-900 dark:text-slate-100">
                    {exp.description}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 font-sans text-slate-600 dark:text-slate-300">
                    {exp.warehouseName}
                  </td>
                  <td className="py-3 text-slate-500 text-[11px]">
                    {exp.expenseDate}
                  </td>
                  <td className="py-3 text-end font-bold text-red-500">
                    -${exp.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Record Operational Facility Expense
            </h3>

            <form onSubmit={handleCreateExpense} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Forklift battery maintenance and hydraulic repairs"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-industrial-teal focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Expense['category'])}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-industrial-teal focus:outline-none"
                  >
                    <option value="TRANSPORT">TRANSPORT & FREIGHT</option>
                    <option value="UTILITIES">UTILITIES & POWER</option>
                    <option value="RENT">FACILITY RENT</option>
                    <option value="MAINTENANCE">EQUIPMENT MAINTENANCE</option>
                    <option value="SALARIES">SHIFT LABOR</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:ring-1 focus:ring-industrial-teal focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Allocated Warehouse
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
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
