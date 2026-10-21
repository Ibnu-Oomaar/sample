import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { mockSalesOrders, mockPurchaseOrders, mockExpenses } from '../../services/mockData';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  Receipt, 
  FileText, 
  Calendar,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const AccountantDashboard: React.FC = () => {
  const { t } = useTranslation();

  const totalInvoicedSales = mockSalesOrders.reduce((acc, so) => acc + so.totalAmount, 0);
  const totalCollectedSales = mockSalesOrders.reduce((acc, so) => acc + so.paidAmount, 0);
  const accountsReceivable = totalInvoicedSales - totalCollectedSales;

  const totalSupplierPO = mockPurchaseOrders.reduce((acc, po) => acc + po.totalAmount, 0);
  const totalSupplierPaid = mockPurchaseOrders.reduce((acc, po) => acc + po.paidAmount, 0);
  const accountsPayable = totalSupplierPO - totalSupplierPaid;

  const totalOperationalExpenses = mockExpenses.reduce((acc, e) => acc + e.amount, 0);
  const grossProfitEstimate = totalInvoicedSales * 0.28;
  const netRealizedProfit = grossProfitEstimate - totalOperationalExpenses;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-industrial-teal/10 text-industrial-teal border border-industrial-teal/30">
              FINANCIAL AUDIT & GENERAL LEDGER
            </span>
            <span className="text-xs text-slate-400 font-mono">DOUBLE-ENTRY RECONCILIATION</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.dashboards.accountant}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Realized cash positions, Accounts Receivable (A/R) aging, Accounts Payable (A/P), and OPEX statements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Calendar className="w-3.5 h-3.5 text-industrial-teal" />
            <span>Fiscal Year: 2026 (Q1)</span>
          </div>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Cash In Bank & Wire</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
            ${totalCollectedSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Reconciled bank balance</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Accounts Receivable (A/R)</span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-500">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-sky-500 mt-2 font-mono">
            ${accountsReceivable.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Customer invoices outstanding</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Accounts Payable (A/P)</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-500 mt-2 font-mono">
            ${accountsPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Supplier bills due</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Operating Expenses (OPEX)</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono">
            ${totalOperationalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Freight, utilities, and warehouse rent</span>
        </div>
      </div>

      {/* Financial Ledger & Expenses Breakout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operating Expenses Ledger */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-purple-500" />
              <span>Operational Expense Ledger</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Current Month</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-3 font-mono text-xs">
            {mockExpenses.map((exp) => (
              <div key={exp.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 font-sans">{exp.description}</div>
                  <div className="text-[10px] text-slate-400">
                    {exp.expenseNo} · {exp.category} · {exp.warehouseName}
                  </div>
                </div>
                <div className="text-end font-bold text-red-500">
                  -${exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* P&L Statement Snapshot */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-industrial-teal" />
              <span>Profit & Loss Statement Snapshot</span>
            </h3>
            <span className="text-xs font-mono text-emerald-500 font-bold">Q1 Audited</span>
          </div>

          <div className="mt-4 space-y-3 font-mono text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-sans">Gross Commercial Revenue:</span>
              <span className="font-bold text-slate-900 dark:text-white">${totalInvoicedSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-sans">Estimated Cost of Goods Sold (COGS 72%):</span>
              <span className="text-red-500 font-semibold">-${(totalInvoicedSales * 0.72).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-sans">Gross Operating Margin:</span>
              <span className="font-bold text-emerald-500">${grossProfitEstimate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-sans">Less Warehouse Facility OPEX:</span>
              <span className="text-red-500 font-semibold">-${totalOperationalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-2.5 pt-3 border-t-2 border-slate-200 dark:border-slate-700 text-sm">
              <span className="font-bold text-slate-900 dark:text-white font-sans">Net Operating Profit:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                ${Math.max(0, netRealizedProfit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
