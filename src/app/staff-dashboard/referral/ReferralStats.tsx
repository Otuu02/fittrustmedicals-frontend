'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Users, MousePointer, DollarSign } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Stats {
  summary: {
    totalClicks: number;
    totalConversions: number;
    totalRevenue: number;
    totalLinks: number;
  };
  links: Array<{
    code: string;
    clicks: number;
    conversions: number;
  }>;
}

const defaultStats: Stats = {
  summary: {
    totalClicks: 0,
    totalConversions: 0,
    totalRevenue: 0,
    totalLinks: 0,
  },
  links: [],
};

export default function ReferralStats() {
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { customer, isAuthenticated, isStaff, token } = useAuthStore();

  useEffect(() => {
    const userId = customer?.id;

    if (!isAuthenticated || !userId) {
      setError('Please log in to view referral stats');
      setLoading(false);
      return;
    }

    if (!isStaff) {
      setError('Staff access required');
      setLoading(false);
      return;
    }

    // Call backend API for stats
    fetch(API_BASE_URL + '/api/referral/stats?staffId=' + userId, {
      headers: {
        'Authorization': 'Bearer ' + (token || ''),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error && !data.summary) {
          throw new Error(data.error);
        }
        
        setStats({
          summary: {
            totalClicks: data.summary?.totalClicks || 0,
            totalConversions: data.summary?.totalConversions || 0,
            totalRevenue: data.summary?.totalRevenue || 0,
            totalLinks: data.summary?.totalLinks || 0,
          },
          links: data.links || [],
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [isAuthenticated, isStaff, customer, token]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded col-span-2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Your Referral Performance
        </h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const revenueString = '$' + stats.summary.totalRevenue.toFixed(2);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-green-600" />
        Your Referral Performance
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <MousePointer className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Total Clicks</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{stats.summary.totalClicks}</div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Conversions</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{stats.summary.totalConversions}</div>
        </div>

        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100 col-span-2">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Revenue Generated</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{revenueString}</div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Active Links</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{stats.summary.totalLinks}</div>
        </div>
      </div>

      {stats.links.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">Recent Links</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {stats.links.slice(0, 3).map((link) => (
              <div key={link.code} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                <span className="font-mono text-gray-600">{link.code}</span>
                <div className="flex gap-3 text-xs">
                  <span className="text-blue-600">{link.clicks} clicks</span>
                  <span className="text-green-600 font-semibold">{link.conversions} sales</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}