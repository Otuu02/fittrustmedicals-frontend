'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Package,
  Store,
  LogOut,
  Bell,
  CheckCircle,
  Clock,
  Truck,
  Copy,
  Check,
  Share2,
  MousePointer,
  DollarSign,
  TrendingUp,
  Gift,
  Settings,
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Moon,
  Sun,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

interface ReferralStats {
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  totalLinks: number;
  referralCode: string;
  referralLink: string;
}

const sidebarItems = [
  { href: '/staff-dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'blue' },
  { href: '/staff-dashboard/orders', icon: ShoppingCart, label: 'Orders', color: 'orange' },
  { href: '/staff-dashboard/products', icon: Package, label: 'Products', color: 'indigo' },
  { href: '/staff-dashboard/customers', icon: Users, label: 'Customers', color: 'purple' },
  { href: '/staff-dashboard/settings', icon: Settings, label: 'Settings', color: 'gray' },
];

export default function StaffDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isStaff, customer, logout, _hasHydrated, updateProfile, changePassword } = useAuthStore();
  
  // Referral state
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<ReferralStats>({
    totalClicks: 0,
    totalConversions: 0,
    totalRevenue: 0,
    totalLinks: 0,
    referralCode: '',
    referralLink: ''
  });

  // Settings state
  const [activeSettingsTab, setActiveSettingsTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderAlerts: true,
    productAlerts: false,
    marketingEmails: false
  });

  useEffect(() => {
    if (_hasHydrated && (!isAuthenticated || !isStaff)) {
      router.push('/login?redirect=/staff-dashboard');
    }
  }, [isAuthenticated, isStaff, _hasHydrated, router]);

  // Fetch referral data on load
  useEffect(() => {
    if (isAuthenticated && customer?.id) {
      fetchReferralData();
      setProfileForm({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || ''
      });
    }
  }, [isAuthenticated, customer]);

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('staffDarkMode');
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === 'true');
      if (savedDarkMode === 'true') {
        document.documentElement.classList.add('dark');
      }
    }
    const savedNotifications = localStorage.getItem('staffNotifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  const fetchReferralData = async () => {
    try {
      const response = await fetch('/api/referral/stats', {
        headers: {
          'X-User-Id': customer?.id || '',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalClicks: data.summary?.totalClicks || 0,
          totalConversions: data.summary?.totalConversions || 0,
          totalRevenue: data.summary?.totalRevenue || 0,
          totalLinks: data.summary?.totalLinks || 0,
          referralCode: data.referralCode || '',
          referralLink: data.referralLink || ''
        });
        setReferralLink(data.referralLink || '');
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    }
  };

  const generateReferralLink = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/referral/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': customer?.id || '',
        },
        body: JSON.stringify({
          staffId: customer?.id,
          staffEmail: customer?.email,
          staffName: customer?.name
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newReferralLink = `${window.location.origin}/ref/${data.referralCode}`;
        setReferralLink(newReferralLink);
        setStats(prev => ({
          ...prev,
          referralCode: data.referralCode,
          referralLink: newReferralLink
        }));
        alert('Referral link generated successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to generate referral link');
      }
    } catch (error) {
      console.error('Error generating referral link:', error);
      alert('Failed to generate referral link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!referralLink) return;
    
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy link. Please copy manually.');
    }
  };

  const shareLink = async () => {
    if (!referralLink) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Fittrust Medicals',
          text: 'Get quality medical equipment and supplies!',
          url: referralLink,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      copyToClipboard();
    }
  };

  // Settings functions
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsMessage(null);
    
    try {
      await updateProfile(profileForm);
      setSettingsMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setSettingsMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setSettingsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsMessage(null);
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSettingsMessage({ type: 'error', text: 'New passwords do not match!' });
      setSettingsLoading(false);
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setSettingsMessage({ type: 'error', text: 'Password must be at least 6 characters!' });
      setSettingsLoading(false);
      return;
    }
    
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setSettingsMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setSettingsMessage({ type: 'error', text: 'Failed to change password. Please check your current password.' });
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    const newNotifications = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifications);
    localStorage.setItem('staffNotifications', JSON.stringify(newNotifications));
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('staffDarkMode', String(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const settingsTabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  if (!_hasHydrated || !isAuthenticated || !isStaff) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Check if we're on settings page
  const isSettingsPage = typeof window !== 'undefined' && window.location.pathname === '/staff-dashboard/settings';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl flex flex-col z-20">
        <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center space-x-3">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white/20 p-2 rounded-xl backdrop-blur-sm"
            >
              <LayoutDashboard className="w-7 h-7" />
            </motion.div>
            <div>
              <h2 className="font-bold text-xl">Fittrust Medicals</h2>
              <p className="text-xs text-blue-200 font-medium">Staff Console</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link 
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link 
            href="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Store className="w-5 h-5" />
            <span className="font-medium">View Store</span>
          </Link>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isSettingsPage ? 'Settings' : 'Staff Dashboard'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <Store className="w-4 h-4" />
              <span>View Public Store</span>
            </Link>
            
            <button className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>
            
            <div className="flex items-center space-x-3 pl-6 border-l">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {customer?.name?.charAt(0) || 'S'}
              </div>
              <div className="hidden md:block">
                <p className="font-medium text-gray-800">{customer?.name || 'Staff Member'}</p>
                <p className="text-xs text-gray-500">{customer?.email || 'staff@fittrust.com'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Settings Page Content */}
        {isSettingsPage ? (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="space-y-6">
              {/* Message Alert */}
              {settingsMessage && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${
                  settingsMessage.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {settingsMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  {settingsMessage.text}
                </div>
              )}

              {/* Settings Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex gap-1">
                  {settingsTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveSettingsTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
                          activeSettingsTab === tab.id
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Profile Settings Tab */}
              {activeSettingsTab === 'profile' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h3>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="tel"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          value={profileForm.address}
                          onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          value={profileForm.city}
                          onChange={(e) => setProfileForm({...profileForm, city: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          value={profileForm.state}
                          onChange={(e) => setProfileForm({...profileForm, state: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={settingsLoading}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                      >
                        {settingsLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Security Tab - Reset Password */}
              {activeSettingsTab === 'security' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-blue-600" />
                      Change Password
                    </h3>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                            className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                            className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                            minLength={6}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                            className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <button
                          type="submit"
                          disabled={settingsLoading}
                          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                          {settingsLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      Session Management
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">Manage your active sessions and devices</p>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                      Logout from all devices
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeSettingsTab === 'notifications' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-600" />
                    Notification Preferences
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive important updates via email</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('emailNotifications')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">Order Alerts</p>
                        <p className="text-sm text-gray-500">Get notified when new orders arrive</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('orderAlerts')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.orderAlerts ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.orderAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">Product Alerts</p>
                        <p className="text-sm text-gray-500">Get notified about low stock products</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('productAlerts')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.productAlerts ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.productAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeSettingsTab === 'preferences' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-blue-600" />
                      Appearance
                    </h3>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {darkMode ? <Moon className="w-5 h-5 text-gray-700" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                        <div>
                          <p className="font-medium text-gray-800">Dark Mode</p>
                          <p className="text-sm text-gray-500">Switch between light and dark theme</p>
                        </div>
                      </div>
                      <button
                        onClick={toggleDarkMode}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          darkMode ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          darkMode ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      Language & Region
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                        <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                          <option value="en">English</option>
                          <option value="fr">French</option>
                          <option value="ar">Arabic</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                        <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                          <option value="NGN">Nigerian Naira (₦)</option>
                          <option value="USD">US Dollar ($)</option>
                          <option value="GBP">British Pound (£)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Danger Zone */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Danger Zone
                </h3>
                <p className="text-sm text-red-700 mb-4">Once you delete your account, there is no going back.</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                  <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Dashboard Content */
          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">0</span>
                </div>
                <p className="text-gray-600 font-medium">New Orders</p>
                <p className="text-sm text-green-600 mt-1">+0 today</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">0</span>
                </div>
                <p className="text-gray-600 font-medium">Pending Orders</p>
                <p className="text-sm text-orange-600 mt-1">Requires attention</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Truck className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">0</span>
                </div>
                <p className="text-gray-600 font-medium">Shipped Today</p>
                <p className="text-sm text-green-600 mt-1">On schedule</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link 
                  href="/staff-dashboard/orders"
                  className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Process Orders</span>
                </Link>
                
                <Link 
                  href="/staff-dashboard/customers"
                  className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-900">View Customers</span>
                </Link>
                
                <Link 
                  href="/staff-dashboard/products"
                  className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <Package className="w-5 h-5 text-indigo-600" />
                  <span className="font-medium text-indigo-900">Manage Products</span>
                </Link>
              </div>
            </div>

            {/* Referral Program Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <div className="flex items-center gap-2">
                  <Gift className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-bold text-white">Referral Program</h2>
                </div>
                <p className="text-blue-100 text-sm mt-1">Share with customers to track sales and earn commissions</p>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Referral Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={referralLink || 'Not Found'}
                      readOnly
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 font-mono text-sm"
                      placeholder="Generate your referral link"
                    />
                    {referralLink ? (
                      <>
                        <button
                          onClick={copyToClipboard}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                        <button
                          onClick={shareLink}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                        >
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={generateReferralLink}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                      >
                        {loading ? 'Generating...' : 'Generate My Link'}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Share this link with customers. You'll earn commission on every sale made through your link.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                      <MousePointer className="w-4 h-4" />
                      <span className="text-sm font-medium">Total Clicks</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalClicks}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">Conversions</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalConversions}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-yellow-600 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm font-medium">Revenue</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">₦{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                      <Gift className="w-4 h-4" />
                      <span className="text-sm font-medium">Commission</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">₦{(stats.totalRevenue * 0.1).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">10% of revenue</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="text-center py-12 text-gray-500">
                <p>No recent activity to display.</p>
                <p className="text-sm mt-1">Activity will appear here as you process orders.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}