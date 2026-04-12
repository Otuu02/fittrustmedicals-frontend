'use client';

import { useState } from 'react';
import { useAuthStore, Address } from '@/stores/authStore';
import { MapPin, Plus, Edit2, Trash2, Check } from 'lucide-react';

export default function AddressesPage() {
  const { customer, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuthStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Address>>({
    label: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria',
    isDefault: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateAddress(editingId, formData);
      setEditingId(null);
    } else {
      addAddress(formData as Omit<Address, 'id'>);
      setIsAdding(false);
    }
    setFormData({
      label: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Nigeria',
      isDefault: false,
    });
  };

  const startEdit = (address: Address) => {
    setFormData(address);
    setEditingId(address.id);
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Addresses</h1>
          <p className="text-gray-500 mt-1">Manage your delivery addresses</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Address</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
              <input
                type="text"
                placeholder="e.g., Home, Office"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Set as default address</span>
              </label>
            </div>
          </div>
          <div className="flex space-x-3 mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingId ? 'Update Address' : 'Save Address'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setFormData({
                  label: '',
                  street: '',
                  city: '',
                  state: '',
                  zipCode: '',
                  country: 'Nigeria',
                  isDefault: false,
                });
              }}
              className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Addresses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customer?.addresses.map((address) => (
          <div
            key={address.id}
            className={`bg-white rounded-xl shadow-sm border p-6 relative ${
              address.isDefault ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-100'
            }`}
          >
            {address.isDefault && (
              <span className="absolute top-4 right-4 flex items-center text-xs font-medium text-blue-600">
                <Check className="w-3 h-3 mr-1" />
                Default
              </span>
            )}
            <div className="flex items-start space-x-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{address.label}</h3>
                <p className="text-sm text-gray-500 mt-1">{address.street}</p>
                <p className="text-sm text-gray-500">
                  {address.city}, {address.state} {address.zipCode}
                </p>
                <p className="text-sm text-gray-500">{address.country}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => startEdit(address)}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => deleteAddress(address.id)}
                className="flex items-center justify-center p-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              {!address.isDefault && (
                <button
                  onClick={() => setDefaultAddress(address.id)}
                  className="flex-1 px-3 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                >
                  Set Default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {customer?.addresses.length === 0 && !isAdding && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No addresses saved yet</p>
          <button
            onClick={() => setIsAdding(true)}
            className="text-blue-600 hover:underline mt-2"
          >
            Add your first address
          </button>
        </div>
      )}
    </div>
  );
}