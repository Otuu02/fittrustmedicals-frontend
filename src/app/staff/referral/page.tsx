// src/app/staff/referral/page.tsx
'use client';

import { useState } from 'react';
import { Copy, Share2, TrendingUp, Gift, Users, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Referral {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'active' | 'inactive';
  joinDate: string;
  totalSales: number;
  commission: number;
}

export default function ReferralPage() {
  const [referralCode] = useState('FTM-STAFF-2024');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'earnings'>('overview');

  const referrals: Referral[] = [
    {
      id: '1',
      name: 'Sarah Anderson',
      email: 'sarah@example.com',
      status: 'active',
      joinDate: '2024-02-15',
      totalSales: 5420,
      commission: 542,
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@example.com',
      status: 'active',
      joinDate: '2024-01-20',
      totalSales: 8750,
      commission: 875,
    },
    {
      id: '3',
      name: 'Jessica Rodriguez',
      email: 'jessica@example.com',
      status: 'pending',
      joinDate: '2024-03-10',
      totalSales: 0,
      commission: 0,
    },
    {
      id: '4',
      name: 'David Thompson',
      email: 'david@example.com',
      status: 'inactive',
      joinDate: '2023-11-05',
      totalSales: 3200,
      commission: 320,
    },
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalCommissions = referrals.reduce((sum, ref) => sum + ref.commission, 0);
  const activeReferrals = referrals.filter((ref) => ref.status === 'active').length;
  const pendingReferrals = referrals.filter((ref) => ref.status === 'pending').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Referral Program</h1>
          <p className="text-gray-600">
            Earn commissions by referring new customers to Fittrustmedicals.
          </p>
        </div>

        {/* Referral Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Earnings */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Total Earnings</h3>
              <Gift size={24} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">\${totalCommissions}</p>
            <p className="text-sm text-green-600 mt-2">↑ 10% from last month</p>
          </div>

          {/* Active Referrals */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Active Referrals</h3>
              <Users size={24} className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{activeReferrals}</p>
            <p className="text-sm text-blue-600 mt-2">Generating income</p>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Pending</h3>
              <TrendingUp size={24} className="text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{pendingReferrals}</p>
            <p className="text-sm text-yellow-600 mt-2">Awaiting activation</p>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Conversion</h3>
              <Share2 size={24} className="text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">65%</p>
            <p className="text-sm text-purple-600 mt-2">Above average</p>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Referral Code</h2>
          <p className="text-gray-700 mb-6">
            Share this code with friends and family to earn 10% commission on their first purchase.
          </p>

          <div className="flex gap-3 items-stretch mb-6">
            <div className="flex-1 bg-white rounded-lg p-4 border border-gray-300">
              <p className="text-xs text-gray-600 mb-1">Referral Code</p>
              <p className="text-2xl font-bold text-blue-600 font-mono">{referralCode}</p>
            </div>
            <Button
              onClick={handleCopyCode}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Copy size={18} />
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
          </div>

          {/* Share Options */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Share via:</p>
            <div className="flex gap-3 flex-wrap">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors">
                📘 Facebook
              </button>
              <button className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 font-medium text-sm transition-colors">
                𝕏 Twitter
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm transition-colors">
                💬 WhatsApp
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm transition-colors flex items-center gap-2">
                <Mail size={16} /> Email
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b bg-white rounded-t-lg">
          {['overview', 'referrals', 'earnings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Commission Structure */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Commission Structure</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <p className="font-semibold text-gray-900">First Purchase</p>
                    <p className="text-sm text-gray-600">One-time bonus</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">10%</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <p className="font-semibold text-gray-900">Recurring Sales</p>
                    <p className="text-sm text-gray-600">On repeat purchases</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">5%</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div>
                    <p className="font-semibold text-gray-900">Team Bonus</p>
                    <p className="text-sm text-gray-600">When you refer 5+ members</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">2%</p>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">How It Works</h3>
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Share Your Code', desc: 'Share your referral code with friends' },
                  { step: 2, title: 'They Sign Up', desc: 'Friends create an account using your code' },
                  { step: 3, title: 'Make a Purchase', desc: 'They complete their first purchase' },
                  { step: 4, title: 'Earn Commission', desc: 'You earn 10% commission instantly' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'referrals' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Join Date</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Total Sales</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Commission</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((referral) => (
                    <tr key={referral.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-semibold text-gray-900">{referral.name}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-700">{referral.email}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                            referral.status
                          )}`}
                        >
                          {referral.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-700 text-sm">
                          {new Date(referral.joinDate).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-gray-900">
                          \${referral.totalSales.toLocaleString()}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-green-600">
                          \${referral.commission.toLocaleString()}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Earnings Breakdown */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Earnings Breakdown</h3>
                
                <div className="space-y-4">
                  {[
                    { month: 'March 2024', amount: 245, referrals: 5 },
                    { month: 'February 2024', amount: 189, referrals: 4 },
                    { month: 'January 2024', amount: 312, referrals: 6 },
                    { month: 'December 2023', amount: 156, referrals: 3 },
                  ].map((earning) => (
                    <div key={earning.month} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">{earning.month}</p>
                        <p className="text-sm text-gray-600">{earning.referrals} active referrals</p>
                      </div>
                      <p className="text-2xl font-bold text-green-600">\${earning.amount}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment History */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Payment History</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { date: '2024-03-15', amount: 245, status: 'Completed' },
                        { date: '2024-02-15', amount: 189, status: 'Completed' },
                        { date: '2024-01-15', amount: 312, status: 'Completed' },
                        { date: '2023-12-15', amount: 156, status: 'Completed' },
                      ].map((payment) => (
                        <tr key={payment.date} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{payment.date}</td>
                          <td className="py-3 px-4 font-semibold text-gray-900">
                            \${payment.amount}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Earnings Summary */}
            <div className="space-y-6">
              {/* Available Balance */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6 border border-green-200">
                <p className="text-gray-600 text-sm mb-2">Available for Withdrawal</p>
                <p className="text-4xl font-bold text-green-600 mb-4">\$892</p>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Withdraw Earnings
                </Button>
              </div>

              {/* Pending Balance */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow p-6 border border-yellow-200">
                <p className="text-gray-600 text-sm mb-2">Pending Commission</p>
                <p className="text-3xl font-bold text-yellow-600">\$450</p>
                <p className="text-xs text-yellow-700 mt-2">
                  Will be available on 2024-03-31
                </p>
              </div>

              {/* Total Lifetime */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 border border-blue-200">
                <p className="text-gray-600 text-sm mb-2">Lifetime Earnings</p>
                <p className="text-3xl font-bold text-blue-600">\$2,292</p>
                <p className="text-xs text-blue-700 mt-2">
                  Since joining the program
                </p>
              </div>

              {/* Banking Details */}
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Banking Details</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Account Type</p>
                    <p className="font-medium text-gray-900">Bank Transfer</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Minimum Withdrawal</p>
                    <p className="font-medium text-gray-900">\$50</p>
                  </div>
                  <Button variant="secondary" className="w-full text-sm">
                    Update Payment Method
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}