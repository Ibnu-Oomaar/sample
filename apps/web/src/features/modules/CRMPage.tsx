import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { mockSuppliers, mockCustomers } from '../../services/mockData';
import { Supplier, Customer } from '@ekaydi/shared-types';
import { 
  Users, 
  Building, 
  Phone, 
  Mail, 
  DollarSign, 
  CreditCard, 
  Plus, 
  Search,
  CheckCircle2
} from 'lucide-react';
import { db } from '../../offline/db';

export const CRMPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentTenant } = useAuth();
  const [activeTab, setActiveTab] = useState<'CUSTOMERS' | 'SUPPLIERS'>('CUSTOMERS');
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery)
  );

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-industrial-teal/10 text-industrial-teal border border-industrial-teal/30">
              COMMERCIAL RELATIONSHIPS (CRM)
            </span>
            <span className="text-xs text-slate-400 font-mono">SUPPLIERS & B2B CUSTOMER DIRECTORY</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Partners & Accounts Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Credit limits, payment terms, outstanding balances, and contact profiles.
          </p>
        </div>

        {/* Tab Toggle: Customers vs Suppliers */}
        <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg p-1 bg-white dark:bg-slate-900 shadow-sm">
          <button
            onClick={() => setActiveTab('CUSTOMERS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'CUSTOMERS'
                ? 'bg-industrial-teal text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            B2B Customers ({customers.length})
          </button>
          <button
            onClick={() => setActiveTab('SUPPLIERS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'SUPPLIERS'
                ? 'bg-industrial-teal text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Suppliers & Vendors ({suppliers.length})
          </button>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTab === 'CUSTOMERS' ? (
          filteredCustomers.map((c) => (
            <div key={c.id} className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-500/10 text-indigo-500 border border-indigo-500/30">
                    TIER: {c.tier}
                  </span>
                  <span className="text-xs text-emerald-500 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                  {c.name}
                </h3>
                <div className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400 font-sans">
                  <div>Contact: {c.contactPerson}</div>
                  <div className="flex items-center gap-1 font-mono text-[11px]">
                    <Phone className="w-3 h-3 text-industrial-teal" />
                    <span>{c.phone}</span>
                  </div>
                  <div>Address: {c.address}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Credit Limit:</span>
                  <span className="font-bold text-slate-900 dark:text-white">${c.creditLimit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Outstanding A/R:</span>
                  <span className="font-bold text-amber-500">${c.outstandingBalance.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          filteredSuppliers.map((s) => (
            <div key={s.id} className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-teal-500/10 text-teal-500 border border-teal-500/30">
                    NET {s.paymentTermsDays} DAYS
                  </span>
                  <span className="text-xs text-emerald-500 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                  {s.name}
                </h3>
                <div className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400 font-sans">
                  <div>Representative: {s.contactPerson}</div>
                  <div className="flex items-center gap-1 font-mono text-[11px]">
                    <Phone className="w-3 h-3 text-industrial-teal" />
                    <span>{s.phone}</span>
                  </div>
                  <div>Office: {s.address}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Payable (A/P):</span>
                  <span className="font-bold text-amber-500">${s.outstandingBalance.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
