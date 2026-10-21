import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { mockProducts, mockWarehouses, mockSalesOrders } from '../../services/mockData';
import { 
  BarChart3, 
  Calendar, 
  Download, 
  Printer, 
  Filter, 
  TrendingUp, 
  Boxes, 
  DollarSign
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const [reportType, setReportType] = useState<'INVENTORY_VALUATION' | 'SALES_BY_WAREHOUSE' | 'ABC_FAST_MOVING'>('INVENTORY_VALUATION');

  const totalValuation = mockProducts.reduce((acc, p) => acc + (p.costPrice * (p.totalQuantityOnHand || 0)), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-industrial-teal/10 text-industrial-teal border border-industrial-teal/30">
              EXECUTIVE BUSINESS INTELLIGENCE
            </span>
            <span className="text-xs text-slate-400 font-mono">PRINTABLE & AUDITED STATEMENTS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.nav.reports}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comprehensive inventory turnover analysis, multi-facility stock valuation, and sales velocity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-industrial-teal hover:bg-industrial-teal/90 text-white text-xs font-semibold shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report View</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setReportType('INVENTORY_VALUATION')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            reportType === 'INVENTORY_VALUATION'
              ? 'bg-industrial-teal text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Inventory Valuation by Facility
        </button>
        <button
          onClick={() => setReportType('SALES_BY_WAREHOUSE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            reportType === 'SALES_BY_WAREHOUSE'
              ? 'bg-industrial-teal text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Sales Velocity & Dispatch
        </button>
        <button
          onClick={() => setReportType('ABC_FAST_MOVING')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            reportType === 'ABC_FAST_MOVING'
              ? 'bg-industrial-teal text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          ABC Stock Classification
        </button>
      </div>

      {/* Main Report Document Sheet */}
      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold font-mono text-slate-900 dark:text-white uppercase">
              {reportType.replace(/_/g, ' ')} REPORT
            </h2>
            <div className="text-xs text-slate-400 mt-1">Generated: {new Date().toLocaleString()} · System: E-KAYDI WHMS</div>
          </div>
          <div className="text-end font-mono">
            <span className="text-xs text-slate-400">Total Portfolio Value</span>
            <div className="text-2xl font-bold text-industrial-teal">${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
        </div>

        {/* Report Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 text-start font-semibold">Product Description</th>
                <th className="py-2.5 text-start font-semibold">SKU Code</th>
                <th className="py-2.5 text-end font-semibold">Quantity on Hand</th>
                <th className="py-2.5 text-end font-semibold">Unit Cost</th>
                <th className="py-2.5 text-end font-semibold">Total Valuation</th>
                <th className="py-2.5 text-center font-semibold">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {mockProducts.map((p, idx) => {
                const val = (p.totalQuantityOnHand || 0) * p.costPrice;
                return (
                  <tr key={p.id}>
                    <td className="py-3 font-sans font-semibold text-slate-900 dark:text-slate-100">
                      {p.name}
                    </td>
                    <td className="py-3 text-industrial-teal font-bold">
                      {p.sku}
                    </td>
                    <td className="py-3 text-end font-bold text-slate-900 dark:text-white">
                      {p.totalQuantityOnHand || 0} {p.unitCode}
                    </td>
                    <td className="py-3 text-end text-slate-500">
                      ${p.costPrice.toFixed(2)}
                    </td>
                    <td className="py-3 text-end font-bold text-emerald-500">
                      ${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {idx < 2 ? 'CLASS A (80% Value)' : idx < 4 ? 'CLASS B (15% Value)' : 'CLASS C (5% Value)'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400 font-mono">
          <span>Official E-KAYDI WHMS Audit Statement</span>
          <span>Verified by Chief Financial Controller & Operations Chief</span>
        </div>
      </div>
    </div>
  );
};
