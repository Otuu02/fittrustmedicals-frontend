'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { 
  Package, 
  AlertTriangle, 
  Search,
  Plus,
  Minus,
  RefreshCw
} from 'lucide-react';

export default function InventoryPage() {
  const { inventoryAlerts, getInventoryAlerts } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const alerts = getInventoryAlerts();
  const lowStock = alerts.filter(a => a.status === 'low');
  const outOfStock = alerts.filter(a => a.status === 'out');

  // Mock products inventory
  const [products, setProducts] = useState([
    { id: '1', name: 'Digital BP Monitor', stock: 15, threshold: 5, category: 'Diagnostic' },
    { id: '2', name: 'Stethoscope Pro', stock: 3, threshold: 5, category: 'Diagnostic' },
    { id: '3', name: 'First Aid Kit', stock: 0, threshold: 10, category: 'Emergency' },
    { id: '4', name: 'Thermometer', stock: 25, threshold: 10, category: 'Diagnostic' },
  ]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateStock = (productId: string, change: number) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, stock: Math.max(0, p.stock + change) } : p
    ));
  };

  const getStockStatus = (stock: number, threshold: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700' };
    if (stock <= threshold) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-700' };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-500 mt-1">Monitor stock levels and manage inventory alerts</p>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 font-medium">Out of Stock</p>
              <p className="text-3xl font-bold text-red-700">{outOfStock.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 font-medium">Low Stock</p>
              <p className="text-3xl font-bold text-yellow-700">{lowStock.length}</p>
            </div>
            <Package className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-medium">Total Products</p>
              <p className="text-3xl font-bold text-green-700">{products.length}</p>
            </div>
            <RefreshCw className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Current Stock</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Threshold</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredProducts.map((product) => {
              const status = getStockStatus(product.stock, product.threshold);
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-gray-600">{product.category}</td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-semibold">{product.stock}</span>
                    <span className="text-sm text-gray-500 ml-2">units</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{product.threshold}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateStock(product.id, -1)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateStock(product.id, 1)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}