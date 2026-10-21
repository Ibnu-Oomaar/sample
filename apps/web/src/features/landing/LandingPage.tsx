import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../theme/ThemeContext';
import { IndustrialWarehouseHero } from '../../three/IndustrialWarehouseHero';
import { 
  Warehouse, 
  Boxes, 
  WifiOff, 
  Globe, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Sun, 
  Moon, 
  Laptop, 
  Cpu, 
  Truck,
  Sparkles
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { language, setLanguage, t, isRtl } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-industrial-teal selection:text-white">
      {/* Top Marketing Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-industrial-teal to-industrial-cyan p-0.5 flex items-center justify-center shadow-lg shadow-industrial-teal/30">
              <Warehouse className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-wider text-white">E-KAYDI</span>
              <span className="text-xs uppercase tracking-widest text-industrial-teal block font-mono">WHMS SaaS</span>
            </div>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-industrial-teal transition">Platform Features</a>
            <a href="#solutions" className="hover:text-industrial-teal transition">Enterprise Solutions</a>
            <a href="#pricing" className="hover:text-industrial-teal transition">Pricing Plans</a>
            <a href="#offline" className="hover:text-industrial-teal transition">Offline Architecture</a>
          </div>

          {/* Controls & CTA */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center border border-slate-800 rounded-lg p-0.5 bg-slate-900 text-xs font-semibold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded transition ${language === 'en' ? 'bg-industrial-teal text-white' : 'text-slate-400 hover:text-white'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('so')}
                className={`px-2 py-1 rounded transition ${language === 'so' ? 'bg-industrial-teal text-white' : 'text-slate-400 hover:text-white'}`}
              >
                SO
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-2 py-1 rounded transition ${language === 'ar' ? 'bg-industrial-teal text-white' : 'text-slate-400 hover:text-white'}`}
              >
                عربي
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light')}
              className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-sky-400" />}
            </button>

            {/* Launch App CTA */}
            <Link
              to="/app/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-industrial-teal hover:bg-industrial-teal/90 text-white text-xs font-bold shadow-lg shadow-industrial-teal/25 transition"
            >
              <span>Launch Control Center</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D Industrial Warehouse */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-industrial-teal/10 border border-industrial-teal/30 text-industrial-teal text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D INDUSTRIAL WAREHOUSE MANAGEMENT SYSTEM</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Enterprise Warehouse & Inventory Operations. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-industrial-teal via-industrial-cyan to-sky-400">
                Online & Offline First.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-sans">
              Centralized multi-tenant software built for wholesale importers, retail supermarket chains, and logistics operators across East Africa and the Gulf.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/app/dashboard"
                className="px-6 py-3 rounded-xl bg-industrial-teal hover:bg-industrial-teal/90 text-white text-sm font-bold shadow-xl shadow-industrial-teal/25 flex items-center gap-2 transition"
              >
                <span>Enter 8 Role Dashboards</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </Link>
              <a
                href="#features"
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition"
              >
                Explore Architecture
              </a>
            </div>
          </div>

          {/* 3D Warehouse Hero Canvas */}
          <div className="mt-8">
            <IndustrialWarehouseHero />
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section id="features" className="py-20 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-industrial-teal">System Capabilities</span>
            <h2 className="text-3xl font-bold text-white mt-2">Engineered for Complex Logistics</h2>
            <p className="text-xs text-slate-400 mt-2">
              Combining high-fidelity 3D visualization with transactional database integrity and offline resilience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/90 shadow-xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <WifiOff className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Offline-First PWA Architecture</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Continue recording sales orders, stock movements, and receiving goods even when the internet disconnects. Automatically synchronizes with idempotency keys upon reconnection.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/90 shadow-xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Somali, English & Arabic (RTL)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full Right-to-Left (RTL) mirroring and culturally accurate business vocabulary for East African and Middle Eastern commerce. Switch languages instantly with zero page reloads.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/90 shadow-xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Eight Role-Specific Dashboards</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated interfaces for Super Admin, CEO, Warehouse Manager (2D/3D maps), Inventory Controller, Purchasing, Sales, Accountant, and Floor Staff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-industrial-teal">Commercial Plans</span>
            <h2 className="text-3xl font-bold text-white mt-2">Transparent Enterprise Licensing</h2>
            <p className="text-xs text-slate-400 mt-2">
              Scalable multi-tenant packages designed for wholesale distributors and growing supermarket chains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white">Starter Logistics</h3>
              <div className="text-3xl font-bold font-mono text-white">$199 <span className="text-xs font-normal text-slate-400">/month</span></div>
              <p className="text-xs text-slate-400">For single-facility wholesale operators.</p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-industrial-teal" /> 1 Warehouse Facility</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-industrial-teal" /> Up to 500 SKUs</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-industrial-teal" /> Offline PWA Support</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-industrial-teal" /> Trilingual Interface</li>
              </ul>
            </div>

            {/* Business */}
            <div className="p-6 rounded-2xl bg-slate-900 border-2 border-industrial-teal relative shadow-xl shadow-industrial-teal/10 space-y-4">
              <span className="absolute -top-3 end-6 px-3 py-0.5 rounded-full text-[10px] font-bold font-mono bg-industrial-teal text-white">
                MOST POPULAR
              </span>
              <h3 className="text-lg font-bold text-white">Business Enterprise</h3>
              <div className="text-3xl font-bold font-mono text-white">$499 <span className="text-xs font-normal text-slate-400">/month</span></div>
              <p className="text-xs text-slate-400">For growing multi-branch distribution businesses.</p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-industrial-teal" /> Up to 5 Warehouses</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-industrial-teal" /> Unlimited Catalog SKUs</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-industrial-teal" /> 3D Warehouse Floor Visualizer</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-industrial-teal" /> Inter-Warehouse 5-Stage Transfers</li>
              </ul>
            </div>

            {/* Enterprise */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white">Custom Platform</h3>
              <div className="text-3xl font-bold font-mono text-white">$999 <span className="text-xs font-normal text-slate-400">/month</span></div>
              <p className="text-xs text-slate-400">For large supermarket chains & port operators.</p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-industrial-teal" /> Unlimited Facilities</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-industrial-teal" /> Custom ERP Integrations</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-industrial-teal" /> Dedicated Cloud Database Pod</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-industrial-teal" /> 24/7 SLA Engineering Support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-mono">
            <span>© 2026 E-KAYDI WHMS. Built with Bun Runtime.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/app/dashboard" className="hover:text-white transition">Control Center</Link>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
