'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { 
  Receipt, 
  Send,
  CheckCircle,
  Clock,
  Mail,
  Download,
  Search
} from 'lucide-react';

export default function ReceiptsManagementPage() {
  const { orders, sendBulkReceipts } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkSend = async () => {
    setSending(true);
    await sendBulkReceipts(selectedOrders);
    setSending(false);
    setSelectedOrders([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Receipts & Invoices</h1>
          <p className="text-gray-500 mt-1">Manage and send automated receipts to customers</p>
        </div>
        {selectedOrders.length > 0 && (
          <button
            onClick={handleBulkSend}
            disabled={sending}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{sending ? 'Sending...' : `Send ${selectedOrders.length} Receipts`}</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Receipts</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <Receipt className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Sent</p>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.receiptSent).length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => !o.receiptSent).length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by order number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedOrders(filteredOrders.map(o => o.id));
                    } else {
                      setSelectedOrders([]);
                    }
                  }}
                />
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => toggleSelection(order.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{order.shippingAddress.label}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  ₦{order.total.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center space-x-1 text-sm ${
                    order.receiptSent ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {order.receiptSent ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Sent</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4" />
                        <span>Pending</span>
                      </>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/account/orders/${order.id}/receipt`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="View Receipt"
                    >
                      <Receipt className="w-4 h-4" />
                    </Link>
                    <button
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}