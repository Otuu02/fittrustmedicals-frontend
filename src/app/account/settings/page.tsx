// src/app/account/settings/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle, CheckCircle, Trash2, Download, Lock, Bell, Eye } from 'lucide-react';

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState({
    orders: true,
    promotions: false,
    newsletter: true,
    reviews: true,
  });

  const [smsNotifications, setSmsNotifications] = useState({
    orders: true,
    urgent: true,
  });

  const [privacy, setPrivacy] = useState({
    profilePublic: false,
    shareData: false,
    allowMarketing: true,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [success, setSuccess] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const showSuccessMessage = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleEmailChange = (key: string) => {
    setEmailNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    showSuccessMessage('Email preferences updated');
  };

  const handleSmsChange = (key: string) => {
    setSmsNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    showSuccessMessage('SMS preferences updated');
  };

  const handlePrivacyChange = (key: string) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    showSuccessMessage('Privacy settings updated');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdatePassword = () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      alert('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters');
      return;
    }

    // Here you would call the API to update password
    showSuccessMessage('Password updated successfully');
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleDownloadData = () => {
    // Simulate downloading user data
    const userData = {
      profile: {
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date().toISOString(),
      },
      orders: [],
      preferences: {
        emailNotifications,
        smsNotifications,
        privacy,
      },
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-data.json';
    link.click();
    showSuccessMessage('Data downloaded successfully');
  };

  const handleDeleteAccount = () => {
    // Here you would call the API to delete the account
    alert('Account deletion request submitted. Check your email for confirmation.');
    setShowDeleteModal(false);
  };

  return (
    <div>
      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {/* Email Notifications */}
      <div className="bg-white rounded-lg shadow p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell size={24} className="text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
        </div>

        {/* Email Notifications */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={emailNotifications.orders}
                onChange={() => handleEmailChange('orders')}
                className="w-5 h-5 text-blue-600 rounded cursor-pointer"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Order Updates</p>
                <p className="text-sm text-gray-600">
                  Receive email notifications for order status changes
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={emailNotifications.promotions}
                onChange={() => handleEmailChange('promotions')}
                className="w-5 h-5 text-blue-600 rounded cursor-pointer"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Promotional Offers</p>
                <p className="text-sm text-gray-600">
                  Get exclusive deals and promotional offers
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={emailNotifications.newsletter}
                onChange={() => handleEmailChange('newsletter')}
                className="w-5 h-5 text-blue-600 rounded cursor-pointer"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Weekly Newsletter</p>
                <p className="text-sm text-gray-600">
                  Health tips and product recommendations
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={emailNotifications.reviews}
                onChange={() => handleEmailChange('reviews')}
                className="w-5 h-5 text-blue-600 rounded cursor-pointer"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Review Requests</p>
                <p className="text-sm text-gray-600">
                  Request feedback on your recent purchases
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* SMS Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SMS Notifications</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={smsNotifications.orders}
                onChange={() => handleSmsChange('orders')}
                className="w-5 h-5 text-blue-600 rounded cursor-pointer"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Order Notifications</p>
                <p className="text-sm text-gray-600">
                  SMS updates for order shipments and deliveries
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={smsNotifications.urgent}
                onChange={() => handleSmsChange('urgent')}
                className="w-5 h-5 text-blue-600 rounded cursor-pointer"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Urgent Alerts</p>
                <p className="text-sm text-gray-600">
                  Important security and account alerts
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-lg shadow p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Eye size={24} className="text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Privacy Settings</h2>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={privacy.profilePublic}
              onChange={() => handlePrivacyChange('profilePublic')}
              className="w-5 h-5 text-blue-600 rounded cursor-pointer"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Public Profile</p>
              <p className="text-sm text-gray-600">
                Allow others to view your profile and reviews
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={privacy.shareData}
              onChange={() => handlePrivacyChange('shareData')}
              className="w-5 h-5 text-blue-600 rounded cursor-pointer"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Share Usage Data</p>
              <p className="text-sm text-gray-600">
                Help us improve by sharing anonymous usage data
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={privacy.allowMarketing}
              onChange={() => handlePrivacyChange('allowMarketing')}
              className="w-5 h-5 text-blue-600 rounded cursor-pointer"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Marketing Communications</p>
              <p className="text-sm text-gray-600">
                Receive personalized recommendations and offers
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock size={24} className="text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
        </div>

        <div className="space-y-4 mb-6">
          {/* Change Password */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Password</p>
              <p className="text-sm text-gray-600">Last changed 2 months ago</p>
            </div>
            <Button
              onClick={() => setShowPasswordModal(true)}
              variant="secondary"
              size="sm"
            >
              Change Password
            </Button>
          </div>

          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">
                <span className="text-red-600 font-medium">Not Enabled</span> - Add extra security
              </p>
            </div>
            <Button variant="secondary" size="sm">
              Enable 2FA
            </Button>
          </div>

          {/* Active Sessions */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Active Sessions</p>
              <p className="text-sm text-gray-600">You have 1 active session</p>
            </div>
            <Button variant="secondary" size="sm">
              Manage
            </Button>
          </div>

          {/* Login History */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Login History</p>
              <p className="text-sm text-gray-600">View your account access history</p>
            </div>
            <Button variant="secondary" size="sm">
              View
            </Button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-lg shadow p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Management</h2>

        <div className="space-y-4">
          {/* Download Data */}
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Download Your Data</p>
              <p className="text-sm text-gray-600">
                Download a copy of your personal data in JSON format
              </p>
            </div>
            <Button
              onClick={handleDownloadData}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Download
            </Button>
          </div>

          {/* Delete Account */}
          <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-600">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              onClick={() => setShowDeleteModal(true)}
              variant="danger"
              size="sm"
              className="flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Change Password</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-600 mt-1">
                  At least 6 characters required
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleUpdatePassword}
                className="flex-1"
              >
                Update Password
              </Button>
              <Button
                onClick={() => setShowPasswordModal(false)}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={24} className="text-red-600" />
              <h3 className="text-xl font-bold text-gray-900">Delete Account</h3>
            </div>

            <p className="text-gray-700 mb-4">
              Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted.
            </p>

            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
              <p className="text-sm text-red-700">
                <strong>Warning:</strong> This will delete all your orders, profile information, and settings.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleDeleteAccount}
                variant="danger"
                className="flex-1"
              >
                Delete Account
              </Button>
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}