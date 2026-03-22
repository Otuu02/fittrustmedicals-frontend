// src/app/staff/performance/page.tsx
'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Award, Target, BarChart3, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PerformanceData {
  name: string;
  email: string;
  sales: number;
  target: number;
  achievement: number;
  orders: number;
  rating: number;
  joinDate: string;
}

export default function PerformancePage() {
  const [timeframe, setTimeframe] = useState('month');
  const [selectedStaff, setSelectedStaff] = useState<PerformanceData | null>(null);

  const performanceData: PerformanceData[] = [
    {
      name: 'Alice Johnson',
      email: 'alice@fittrustmedicals.com',
      sales: 12450,
      target: 10000,
      achievement: 124.5,
      orders: 78,
      rating: 4.9,
      joinDate: '2023-01-15',
    },
    {
      name: 'Bob Smith',
      email: 'bob@fittrustmedicals.com',
      sales: 10230,
      target: 10000,
      achievement: 102.3,
      orders: 62,
      rating: 4.7,
      joinDate: '2023-03-20',
    },
    {
      name: 'Carol Davis',
      email: 'carol@fittrustmedicals.com',
      sales: 9580,
      target: 10000,
      achievement: 95.8,
      orders: 58,
      rating: 4.6,
      joinDate: '2023-05-10',
    },
    {
      name: 'David Lee',
      email: 'david@fittrustmedicals.com',
      sales: 8920,
      target: 10000,
      achievement: 89.2,
      orders: 54,
      rating: 4.5,
      joinDate: '2023-07-05',
    },
    {
      name: 'Emma Wilson',
      email: 'emma@fittrustmedicals.com',
      sales: 8150,
      target: 10000,
      achievement: 81.5,
      orders: 48,
      rating: 4.4,
      joinDate: '2023-09-12',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Performance Tracking</h1>
          <p className="text-gray-600">
            Monitor staff performance, targets, and achievements.
          </p>
        </div>

        {/* Timeframe Filter */}
        <div className="mb-8 flex gap-3 flex-wrap">
          {['week', 'month', 'quarter', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                timeframe === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
              }`}
            >
              This {period}
            </button>
          ))}
        </div>

        {/* Performance Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Staff Member</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Sales</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Target</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Achievement</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Orders</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Rating</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Rank</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((performer, index) => {
                  const isAboveTarget = performer.achievement >= 100;
                  const targetDifference = performer.achievement - 100;

                  return (
                    <tr key={performer.email} className="border-b hover:bg-gray-50 transition-colors">
                      {/* Name */}
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-gray-900">{performer.name}</p>
                          <p className="text-xs text-gray-600">{performer.email}</p>
                        </div>
                      </td>

                      {/* Sales */}
                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-900">
                          \${performer.sales.toLocaleString()}
                        </p>
                      </td>

                      {/* Target */}
                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-900">
                          \${performer.target.toLocaleString()}
                        </p>
                      </td>

                      {/* Achievement */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                isAboveTarget ? 'bg-green-600' : 'bg-yellow-600'
                              }`}
                              style={{ width: `${Math.min(performer.achievement, 150)}%` }}
                            ></div>
                          </div>
                          <span
                            className={`font-bold whitespace-nowrap text-sm ${
                              isAboveTarget ? 'text-green-600' : 'text-yellow-600'
                            }`}
                          >
                            {performer.achievement}%
                          </span>
                        </div>
                      </td>

                      {/* Orders */}
                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-900">{performer.orders}</p>
                      </td>

                      {/* Rating */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-gray-900">{performer.rating}</span>
                          <span className="text-yellow-400">★</span>
                        </div>
                      </td>

                      {/* Rank Badge */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center">
                          {index === 0 && (
                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold">
                              🥇
                            </div>
                          )}
                          {index === 1 && (
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold">
                              🥈
                            </div>
                          )}
                          {index === 2 && (
                            <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-orange-700 font-bold">
                              🥉
                            </div>
                          )}
                          {index > 2 && (
                            <span className="text-gray-600 font-semibold"># {index + 1}</span>
                          )}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6">
                        <button
                          onClick={() => setSelectedStaff(performer)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Best Performer */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Best Performer</h3>
              <TrendingUp size={24} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">Alice Johnson</p>
            <p className="text-gray-600 mb-3">124.5% of target achieved</p>
            <div className="bg-green-50 p-3 rounded">
              <p className="text-sm font-semibold text-green-800">
                🎉 Keep up the excellent work!
              </p>
            </div>
          </div>

          {/* Most Improved */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Most Improved</h3>
              <Award size={24} className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">David Lee</p>
            <p className="text-gray-600 mb-3">+8% improvement this month</p>
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm font-semibold text-blue-800">
                📈 Great progress! Keep pushing.
              </p>
            </div>
          </div>

          {/* Needs Attention */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Needs Support</h3>
              <Target size={24} className="text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">Emma Wilson</p>
            <p className="text-gray-600 mb-3">81.5% of target (18.5% gap)</p>
            <div className="bg-red-50 p-3 rounded">
              <p className="text-sm font-semibold text-red-800">
                ⚠️ Offer additional support & training
              </p>
            </div>
          </div>
        </div>

        {/* Performance Goals */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Target size={24} className="text-blue-600" />
              Monthly Goals & Targets
            </h2>
            <Button size="sm">Edit Goals</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Team Target */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Team Sales Target</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-700">Target: \$50,000</p>
                    <p className="text-gray-700 font-bold">\$49,330</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full"
                      style={{ width: '98.66%' }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">98.66% of target</p>
                </div>
              </div>
            </div>

            {/* Individual Target */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Your Individual Target</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-700">Target: \$10,000</p>
                    <p className="text-gray-700 font-bold">\$8,450</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-yellow-600 h-3 rounded-full"
                      style={{ width: '84.5%' }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">84.5% of target - 15.5% remaining</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Staff Performance Modal */}
        {selectedStaff && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8 max-h-96 overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedStaff.name}</h2>
                  <p className="text-gray-600">{selectedStaff.email}</p>
                </div>
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="text-2xl text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              {/* Performance Details */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Total Sales</p>
                  <p className="text-3xl font-bold text-blue-600">
                    \${selectedStaff.sales.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Target Achievement</p>
                  <p className="text-3xl font-bold text-green-600">
                    {selectedStaff.achievement}%
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {selectedStaff.orders}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Average Rating</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {selectedStaff.rating} ★
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-700 text-sm">
                  <strong>Member Since:</strong> {new Date(selectedStaff.joinDate).toLocaleDateString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1 flex items-center justify-center gap-2">
                  <MessageSquare size={18} />
                  Send Message
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setSelectedStaff(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}