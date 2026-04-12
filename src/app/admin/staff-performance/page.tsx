'use client';

import { useAuthStore } from '@/stores/authStore';
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  TrendingUp,
  Award,
  Calendar
} from 'lucide-react';

export default function StaffPerformancePage() {
  const { getTopPerformingStaff, getStaffPerformance, orders } = useAuthStore();
  
  const topStaff = getTopPerformingStaff();
  const allStaff = getStaffPerformance();
  
  // Calculate metrics
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Staff Performance</h1>
        <p className="text-gray-500 mt-1">Track sales performance and productivity metrics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{allStaff.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">₦{totalSales.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Orders Processed</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">₦{avgOrderValue.toFixed(0)}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-yellow-500" />
          Top Performing Staff
        </h2>

        {topStaff.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No staff performance data yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topStaff.map((staff, index) => (
              <div key={staff.staffId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{staff.staffName}</p>
                    <p className="text-sm text-gray-500">{staff.ordersProcessed} orders • {staff.customersServed} customers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">₦{staff.totalSales.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Total Sales</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Performance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">All Staff Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Staff Member</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Orders Processed</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Sales</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customers Served</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allStaff.map((staff) => (
                <tr key={staff.staffId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{staff.staffName}</td>
                  <td className="px-6 py-4 text-gray-600">{staff.ordersProcessed}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">₦{staff.totalSales.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-600">{staff.customersServed}</td>
                  <td className="px-6 py-4 text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(staff.lastActive).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}