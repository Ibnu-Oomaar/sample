import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { mockSalesOrders, mockPurchaseOrders, mockExpenses } from '../../services/mockData';
import { 
  DollarSign, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Receipt, 
  Download, 
  Printer, 
  FileSpreadsheet
} from 'lucide-react';

export const FinancePage: React.FC = () => {
  const { t } = useTranslation();

  const totalInvoicedSales = mockSalesOrders.reduce((acc, so) => acc + so.totalAmount, 0);
  const totalCollectedSales = mockSalesOrders.reduce((acc, so) => acc + so.paidAmount, 0);
  const receivables = totalInvoicedSales - totalCollectedSales;

  const totalSupplierPO = mockPurchaseOrders.reduce((acc, po) => acc + po.totalAmount, 0);
  const totalSupplierPaid = mockPurchaseOrders.reduce((acc, po) => acc + po.paidAmount, 0);
  const payables = totalSupplierPO - totalSupplierPaid;

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Type,Reference,Entity,Total Amount,Paid,Balance Due,Status\n" +
      mockSalesOrders.map(so => `Sale,${so.soNo},${so.customerName},${so.totalAmount},${so.paidAmount},${so.totalAmount - so.paidAmount},${so.paymentStatus}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EKAYDI_Financial_Ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-industrial-teal/10 text-industrial-teal border border-industrial-teal/30">
              COMMERCIAL GENERAL LEDGER
            </span>
            <span className="text-xs text-slate-400 font-mono">REVENUE RECOGNITION & CASH DISBURSEMENTS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.finance.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            A/R & A/P reconciliation, dual-entry monetary ledger, and exportable statements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Ledger</span>
          </button>
        </div>
      </div>

      {/* KPI Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Invoiced B2B Sales</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono">
            ${totalInvoicedSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-emerald-500 font-medium">Billed to wholesale accounts</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Realized Cash Collections</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
            ${totalCollectedSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Verified deposits</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Accounts Receivable (A/R)</div>
          <div className="text-2xl font-bold text-amber-500 mt-2 font-mono">
            ${receivables.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Pending collection</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Accounts Payable (A/P)</div>
          <div className="text-2xl font-bold text-purple-500 mt-2 font-mono">
            ${payables.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Due to supplier partners</span>
        </div>
      </div>

      {/* Transaction Statement Table */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
          Commercial Transaction Register
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-2.5 text-start font-semibold">Ledger Ref</th>
                <th className="py-2.5 text-start font-semibold">Party Entity</th>
                <th className="py-2.5 text-start font-semibold">Type</th>
                <th className="py-2.5 text-end font-semibold">Total Amount</th>
                <th className="py-2.5 text-end font-semibold">Paid</th>
                <th className="py-2.5 text-end font-semibold">Balance Due</th>
                <th className="py-2.5 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {mockSalesOrders.map((so) => (
                <tr key={so.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-industrial-teal">
                    {so.soNo}
                  </td>
                  <td className="py-3 font-sans font-semibold text-slate-900 dark:text-slate-100">
                    {so.customerName}
                  </td>
                  <td className="py-3 text-slate-500 font-sans">
                    Commercial Sale
                  </td>
                  <td className="py-3 text-end font-bold text-slate-900 dark:text-white">
                    ${so.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 text-end text-emerald-500 font-semibold">
                    ${so.paidAmount.toFixed(2)}
                  </td>
                  <td className="py-3 text-end text-amber-500 font-bold">
                    ${(so.totalAmount - so.paidAmount).toFixed(2)}
                  </td>
                  <td className="py-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                      {so.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {mockPurchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-sky-400">
                    {po.poNo}
                  </td>
                  <td className="py-3 font-sans font-semibold text-slate-900 dark:text-slate-100">
                    {po.supplierName}
                  </td>
                  <td className="py-3 text-slate-500 font-sans">
                    Supplier Procurement
                  </td>
                  <td className="py-3 text-end font-bold text-slate-900 dark:text-white">
                    ${po.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 text-end text-emerald-500 font-semibold">
                    ${po.paidAmount.toFixed(2)}
                  </td>
                  <td className="py-3 text-end text-purple-400 font-bold">
                    ${(po.totalAmount - po.paidAmount).toFixed(2)}
                  </td>
                  <td className="py-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400">
                      APPROVED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
