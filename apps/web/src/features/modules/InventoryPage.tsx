import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { mockInventoryBalances, mockProducts } from '../../services/mockData';
import { InventoryBalance } from '@ekaydi/shared-types';
import { 
  Boxes, 
  Search, 
  Filter, 
  MapPin, 
  AlertTriangle, 
  Layers, 
  Calendar, 
  Plus,
  ArrowUpDown
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentWarehouse } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [balances, setBalances] = useState<InventoryBalance[]>(mockInventoryBalances);

  const filtered = balances.filter(b => 
    b.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.productSku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.binLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-industrial-teal/10 text-industrial-teal border border-industrial-teal/30">
              LOCATION-BASED INVENTORY
            </span>
            <span className="text-xs text-slate-400 font-mono">BIN ALLOCATIONS & EXPIRY LOTS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.inventory.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Current stock quantities, lot batch numbers, rack coordinate bins, and safety buffers.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by SKU, item name, or rack coordinate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-9 pe-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-industrial-teal"
          />
        </div>
      </div>

      {/* Detailed Balance Table */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-2.5 text-start font-semibold">SKU & Item Name</th>
                <th className="py-2.5 text-start font-semibold">Warehouse Hub</th>
                <th className="py-2.5 text-start font-semibold">Rack Bin Coordinate</th>
                <th className="py-2.5 text-start font-semibold">Lot Batch #</th>
                <th className="py-2.5 text-start font-semibold">Expiry Date</th>
                <th className="py-2.5 text-end font-semibold">On Hand</th>
                <th className="py-2.5 text-end font-semibold">Reserved</th>
                <th className="py-2.5 text-end font-semibold">Damaged</th>
                <th className="py-2.5 text-end font-semibold">Net Available</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {filtered.map((bal) => {
                const available = Math.max(0, bal.quantityOnHand - bal.quantityReserved - bal.quantityDamaged);
                return (
                  <tr key={bal.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 font-sans font-semibold text-slate-900 dark:text-slate-100">
                      <div>{bal.productName}</div>
                      <div className="text-[10px] text-industrial-teal font-mono">{bal.productSku}</div>
                    </td>
                    <td className="py-3 font-sans text-slate-600 dark:text-slate-300">
                      {bal.warehouseName}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {bal.binLocation}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">
                      {bal.batchNumber || 'STANDARD'}
                    </td>
                    <td className="py-3 text-slate-500">
                      {bal.expiryDate || 'N/A'}
                    </td>
                    <td className="py-3 text-end font-bold text-slate-900 dark:text-white">
                      {bal.quantityOnHand}
                    </td>
                    <td className="py-3 text-end text-sky-500">
                      {bal.quantityReserved}
                    </td>
                    <td className="py-3 text-end text-red-500">
                      {bal.quantityDamaged}
                    </td>
                    <td className="py-3 text-end font-bold text-emerald-600 dark:text-emerald-400">
                      {available}
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
