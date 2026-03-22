// src/app/admin/settings/page.tsx
'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Save } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your store settings</p>
      </div>

      {/* General Settings */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">General Settings</h2>
        <div className="space-y-4">
          <Input label="Store Name" defaultValue="FitTrust Medicals" />
          <Input label="Store Email" type="email" defaultValue="support@fittrustmedicals.com" />
          <Input label="Store Phone" type="tel" defaultValue="+1 (555) 123-4567" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
            <textarea 
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px]"
              defaultValue="Premium medical supplies for healthcare professionals and individuals."
            />
          </div>
        </div>
      </Card>

      {/* Shipping Settings */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Settings</h2>
        <div className="space-y-4">
          <Input label="Standard Shipping Cost" type="number" defaultValue="10.00" />
          <Input label="Express Shipping Cost" type="number" defaultValue="20.00" />
          <Input label="Free Shipping Threshold" type="number" defaultValue="50.00" />
        </div>
      </Card>

      {/* Tax Settings */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Tax Settings</h2>
        <div className="space-y-4">
          <Input label="Tax Rate (%)" type="number" defaultValue="10" />
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="flex items-center gap-2">
          <Save size={20} />
          Save Changes
        </Button>
      </div>
    </div>
  );
}