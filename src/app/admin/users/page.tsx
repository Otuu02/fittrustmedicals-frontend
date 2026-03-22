// src/app/admin/users/page.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Search, UserPlus, MoreVertical, Mail, Ban } from 'lucide-react';

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'customer', orders: 12, joined: '2024-01-15', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'customer', orders: 8, joined: '2024-02-10', status: 'active' },
    { id: '3', name: 'Admin User', email: 'admin@fittrustmedicals.com', role: 'admin', orders: 0, joined: '2023-12-01', status: 'active' },
    { id: '4', name: 'Bob Johnson', email: 'bob@example.com', role: 'customer', orders: 3, joined: '2024-03-05', status: 'active' },
    { id: '5', name: 'Alice Williams', email: 'alice@example.com', role: 'customer', orders: 15, joined: '2023-11-20', status: 'inactive' },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage customer accounts</p>
        </div>
        <Button className="flex items-center gap-2">
          <UserPlus size={20} />
          Add User
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      variant={user.role === 'admin' ? 'primary' : 'secondary'}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.orders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.joined}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      label={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      variant={user.status === 'active' ? 'success' : 'warning'}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-blue-600 hover:text-blue-800 p-1" title="Send Email">
                        <Mail size={18} />
                      </button>
                      <button className="text-red-600 hover:text-red-800 p-1" title="Ban User">
                        <Ban size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}