import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { useSync } from '../../offline/SyncContext';
import { UserRole } from '@ekaydi/shared-types';
import { 
  LayoutDashboard, 
  Warehouse, 
  Boxes, 
  Package, 
  ArrowLeftRight, 
  ShoppingBag, 
  Truck, 
  DollarSign, 
  Users, 
  Receipt, 
  BarChart3, 
  ShieldAlert, 
  RefreshCcw, 
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { t, isRtl } = useTranslation();
  const { currentUser } = useAuth();
  const { pendingCount } = useSync();

  const navItems = [
    { to: '/app/dashboard', label: t.nav.dashboard, icon: LayoutDashboard, roles: Object.values(UserRole) },
    { to: '/app/warehouses', label: t.nav.warehouses, icon: Warehouse, roles: [UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.WAREHOUSE_MANAGER, UserRole.STAFF] },
    { to: '/app/inventory', label: t.nav.inventory, icon: Boxes, roles: [UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.WAREHOUSE_MANAGER, UserRole.INVENTORY_MANAGER, UserRole.STAFF] },
    { to: '/app/products', label: t.nav.products, icon: Package, roles: [UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.INVENTORY_MANAGER, UserRole.SALES_MANAGER, UserRole.PURCHASING_MANAGER] },
    { to: '/app/transfers', label: t.nav.transfers, icon: ArrowLeftRight, badge: '1 In-Transit', roles: [UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.WAREHOUSE_MANAGER, UserRole.INVENTORY_MANAGER, UserRole.STAFF] },
    { to: '/app/purchases', label: t.nav.purchases, icon: ShoppingBag, roles: [UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.PURCHASING_MANAGER, UserRole.ACCOUNTANT] },
    { to: '/app/sales', label: t.nav.sales, icon: Truck, roles: [UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.SALES_MANAGER, UserRole.ACCOUNTANT] },
    { to: '/app/finance', label: t.nav.finance, icon: DollarSign, roles: [UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.ACCOUNTANT] },
    { to: '/app/crm', label: 'Partners & CRM', icon: Users, roles: [UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.SALES_MANAGER, UserRole.PURCHASING_MANAGER] },
    { to: '/app/expenses', label: t.nav.expenses, icon: Receipt, roles: [UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.ACCOUNTANT, UserRole.WAREHOUSE_MANAGER] },
    { to: '/app/reports', label: t.nav.reports, icon: BarChart3, roles: [UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.ACCOUNTANT, UserRole.SALES_MANAGER, UserRole.INVENTORY_MANAGER] },
    { to: '/app/audit-logs', label: t.nav.auditLogs, icon: ShieldAlert, roles: [UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN] },
    { to: '/app/sync-center', label: t.nav.syncCenter, icon: RefreshCcw, badge: pendingCount > 0 ? `${pendingCount}` : undefined, roles: Object.values(UserRole) },
  ];

  // Filter items based on active user role
  const visibleNav = navItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-full bg-industrial-navy-sidebar text-slate-300 border-e border-industrial-border-dark select-none">
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-industrial-border-dark/80 bg-industrial-navy">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-industrial-teal to-industrial-cyan p-0.5 flex items-center justify-center shadow-lg shadow-industrial-teal/20">
            <Warehouse className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-wider text-white text-base leading-none">
              E-KAYDI
            </span>
            <span className="text-[9px] uppercase tracking-widest text-industrial-teal font-mono mt-0.5">
              3D WHMS SaaS
            </span>
          </div>
        </Link>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Role Indicator Banner */}
      <div className="px-4 py-2.5 bg-slate-900/60 border-b border-industrial-border-dark/60 text-[11px] font-mono flex items-center justify-between">
        <span className="text-slate-400 uppercase">ACTIVE ROLE</span>
        <span className="px-2 py-0.5 rounded bg-industrial-teal/15 text-industrial-teal border border-industrial-teal/30 font-bold">
          {currentUser.role.replace('_', ' ')}
        </span>
      </div>

      {/* Navigation Scroll Area */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {visibleNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) => `
                flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group
                ${isActive 
                  ? 'bg-industrial-teal text-white shadow-lg shadow-industrial-teal/25 font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer: Public Site Link */}
      <div className="p-3 border-t border-industrial-border-dark/80 bg-slate-950/40">
        <Link
          to="/"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-industrial-cyan" />
            <span>{t.nav.marketingSite}</span>
          </div>
          <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
        </Link>
      </div>
    </aside>
  );
};
