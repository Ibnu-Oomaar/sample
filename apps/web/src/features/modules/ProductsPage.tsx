import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { useSync } from '../../offline/SyncContext';
import { mockProducts } from '../../services/mockData';
import { Product } from '@ekaydi/shared-types';
import { 
  Package, 
  Search, 
  Plus, 
  Filter, 
  Barcode, 
  Tag, 
  Boxes, 
  DollarSign, 
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { db } from '../../offline/db';

export const ProductsPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentTenant } = useAuth();
  const { enqueueOperation } = useSync();

  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form state
  const [newName, setNewName] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newBarcode, setNewBarcode] = useState('');
  const [newCategory, setNewCategory] = useState('Commodities & Food Stuffs');
  const [newCost, setNewCost] = useState<number>(0);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newMinStock, setNewMinStock] = useState<number>(10);
  const [newUnit, setNewUnit] = useState('BAG');

  const categories = ['ALL', ...Array.from(new Set(products.map(p => p.categoryName || 'General')))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.barcode.includes(searchQuery);
    const matchesCat = selectedCategory === 'ALL' || p.categoryName === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newSku) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      tenantId: currentTenant.id,
      sku: newSku,
      barcode: newBarcode || `${Date.now()}`.substring(0, 13),
      name: newName,
      categoryName: newCategory,
      categoryId: `cat-${Date.now()}`,
      unitId: `unit-${newUnit.toLowerCase()}`,
      unitCode: newUnit,
      costPrice: Number(newCost),
      sellingPrice: Number(newPrice),
      minStockLevel: Number(newMinStock),
      maxStockLevel: Number(newMinStock) * 10,
      totalQuantityOnHand: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to Dexie IndexedDB
    try {
      await db.products.add(newProd);
    } catch (err) {
      console.warn('Saved in memory:', err);
    }

    // Enqueue offline operation with idempotency key
    await enqueueOperation('CREATE_CUSTOMER', '/api/v1/products', 'POST', newProd, currentTenant.id);

    setProducts(prev => [newProd, ...prev]);
    setShowAddModal(false);

    // Reset form
    setNewName('');
    setNewSku('');
    setNewBarcode('');
    setNewCost(0);
    setNewPrice(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-industrial-teal/10 text-industrial-teal border border-industrial-teal/30">
              CENTRAL PRODUCT CATALOG
            </span>
            <span className="text-xs text-slate-400 font-mono">{products.length} REGISTERED SKUs</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.nav.products}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enterprise SKU specifications, multi-unit conversions, barcode indexes, and inventory thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-industrial-teal hover:bg-industrial-teal/90 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Product SKU</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by product title, SKU code, or barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-9 pe-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-industrial-teal"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-industrial-teal text-white font-semibold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Data Grid */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-2.5 text-start font-semibold">Product Description</th>
                <th className="py-2.5 text-start font-semibold">SKU & Barcode</th>
                <th className="py-2.5 text-start font-semibold">Category</th>
                <th className="py-2.5 text-end font-semibold">Cost Price</th>
                <th className="py-2.5 text-end font-semibold">Selling Price</th>
                <th className="py-2.5 text-end font-semibold">Stock on Hand</th>
                <th className="py-2.5 text-center font-semibold">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {filteredProducts.map((p) => {
                const isLow = (p.totalQuantityOnHand || 0) <= p.minStockLevel;
                return (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 font-sans font-semibold text-slate-900 dark:text-slate-100 max-w-[280px]">
                      <div className="truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{p.brandName || 'Standard'}</div>
                    </td>
                    <td className="py-3">
                      <div className="font-bold text-industrial-teal">{p.sku}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Barcode className="w-3 h-3" />
                        <span>{p.barcode}</span>
                      </div>
                    </td>
                    <td className="py-3 font-sans text-slate-600 dark:text-slate-300">
                      {p.categoryName}
                    </td>
                    <td className="py-3 text-end text-slate-500 font-semibold">
                      ${p.costPrice.toFixed(2)}
                    </td>
                    <td className="py-3 text-end font-bold text-slate-900 dark:text-white">
                      ${p.sellingPrice.toFixed(2)}
                    </td>
                    <td className="py-3 text-end font-bold text-slate-900 dark:text-white">
                      {p.totalQuantityOnHand || 0} {p.unitCode}
                    </td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isLow ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {isLow ? 'LOW STOCK' : 'IN STOCK'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Create New Product SKU
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Adds item to local IndexedDB and queues for automatic synchronization.
            </p>

            <form onSubmit={handleCreateProduct} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Industrial Hydraulic Fluid 20L"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-industrial-teal focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IND-HYD-20L"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:ring-1 focus:ring-industrial-teal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Barcode
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 6191234567890"
                    value={newBarcode}
                    onChange={(e) => setNewBarcode(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:ring-1 focus:ring-industrial-teal focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Unit Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newCost}
                    onChange={(e) => setNewCost(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:ring-1 focus:ring-industrial-teal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Selling Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:ring-1 focus:ring-industrial-teal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Min Stock
                  </label>
                  <input
                    type="number"
                    value={newMinStock}
                    onChange={(e) => setNewMinStock(parseInt(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:ring-1 focus:ring-industrial-teal focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-industrial-teal hover:bg-industrial-teal/90 text-white text-xs font-semibold shadow-sm"
                >
                  Save & Index Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
