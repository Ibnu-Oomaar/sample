import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckSquare, 
  Square, 
  Barcode, 
  MapPin, 
  Box, 
  Truck, 
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';

interface StaffTask {
  id: string;
  type: 'PICK' | 'PUTAWAY' | 'INSPECT' | 'LOAD';
  title: string;
  location: string;
  sku: string;
  quantity: number;
  completed: boolean;
}

export const StaffDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, currentWarehouse } = useAuth();

  const [tasks, setTasks] = useState<StaffTask[]>([
    { id: 'task-1', type: 'PICK', title: 'Pick Order SO-2026-1044 (Sugar 50KG)', location: 'Zone B · Shelf 02 · Bin B-02-04', sku: 'FMCG-SUG-50KG', quantity: 120, completed: false },
    { id: 'task-2', type: 'PUTAWAY', title: 'Putaway Inbound Turbine Oil Drums', location: 'Zone A · Shelf 04 · Bin A-04-02', sku: 'IND-LUB-5001', quantity: 50, completed: true },
    { id: 'task-3', type: 'LOAD', title: 'Stage Cement Pallets at Dispatch Bay 06', location: 'Zone E · Bay 06', sku: 'BLD-CEM-50KG', quantity: 800, completed: false },
    { id: 'task-4', type: 'INSPECT', title: 'Inspect Quarantined Canister Lots', location: 'Zone C · Cold Quarantine Q-01', sku: 'PHAR-SANI-5LTR', quantity: 18, completed: false },
  ]);

  const [barcodeInput, setBarcodeInput] = useState('');
  const [scanFeedback, setScanFeedback] = useState<string | null>(null);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleSimulateScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput) return;
    setScanFeedback(`Scanned SKU / Barcode "${barcodeInput}" verified at active bin!`);
    setBarcodeInput('');
    setTimeout(() => setScanFeedback(null), 4000);
  };

  const pendingCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-industrial-teal/10 text-industrial-teal border border-industrial-teal/30">
              WAREHOUSE FLOOR TERMINAL
            </span>
            <span className="text-xs text-slate-400 font-mono">{currentWarehouse.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.dashboards.staff}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Welcome, {currentUser.fullName}. Your picking, putaway, and dispatch work queue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-mono font-bold">
            {pendingCount} Tasks Remaining for Shift
          </span>
        </div>
      </div>

      {/* Barcode Scanner Quick Terminal */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-white">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
          <Barcode className="w-4 h-4" />
          <span>RF BARCODE SCANNER EMULATOR</span>
        </div>
        <form onSubmit={handleSimulateScan} className="flex gap-2">
          <input
            type="text"
            placeholder="Scan barcode or type SKU (e.g. 6191234560029 or FMCG-SUG-50KG)..."
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono transition"
          >
            Verify Barcode
          </button>
        </form>
        {scanFeedback && (
          <div className="mt-2 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{scanFeedback}</span>
          </div>
        )}
      </div>

      {/* Task Queue Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
          Assigned Warehouse Floor Operations
        </h3>

        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between gap-4 ${
              task.completed 
                ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-industrial-teal'
            }`}
          >
            <div className="flex items-center gap-3">
              <button className="text-industrial-teal">
                {task.completed ? <CheckSquare className="w-5 h-5 text-emerald-500" /> : <Square className="w-5 h-5 text-slate-400" />}
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                    task.type === 'PICK' ? 'bg-sky-500/10 text-sky-400' :
                    task.type === 'PUTAWAY' ? 'bg-emerald-500/10 text-emerald-400' :
                    task.type === 'LOAD' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {task.type}
                  </span>
                  <h4 className={`text-sm font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {task.title}
                  </h4>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-industrial-teal" />
                    <span>{task.location}</span>
                  </span>
                  <span>Qty: {task.quantity} Units</span>
                </div>
              </div>
            </div>

            <div className="text-end font-mono text-xs text-slate-400">
              {task.completed ? 'COMPLETED' : 'PENDING ACTION'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
