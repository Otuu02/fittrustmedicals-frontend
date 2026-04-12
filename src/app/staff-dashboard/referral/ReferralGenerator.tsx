'use client';

import { useState } from 'react';
import { Copy, Check, Link2, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

// API base URL - your backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ReferralGenerator() {
  const [link, setLink] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { customer, isAuthenticated, isStaff, token } = useAuthStore();

  const generate = async () => {
    if (!isAuthenticated) {
      setError('Please log in to generate referral links');
      return;
    }

    if (!isStaff) {
      setError('Staff access required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userId = customer?.id;

      if (!userId) {
        throw new Error('User ID not found');
      }

      // Call YOUR BACKEND API (port 3001), not local Prisma
      const response = await fetch(API_BASE_URL + '/api/referral/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (token || ''),
        },
        body: JSON.stringify({ 
          userId: userId,
          staffEmail: customer?.email 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to generate link');
      }

      if (data.success) {
        setLink(data.referralLink);
        setCode(data.referralCode);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate link. Please try again.');
    }

    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buttonText = loading 
    ? 'Generating...' 
    : !isAuthenticated 
      ? 'Please Log In' 
      : !isStaff 
        ? 'Staff Only' 
        : 'Generate My Link';

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-green-600 p-2 rounded-lg">
          <Link2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">Your Referral Link</h3>
          <p className="text-sm text-gray-500">Share with customers to track sales</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-600 text-sm">
          {error}
        </div>
      )}

      {!link ? (
        <button
          onClick={generate}
          disabled={loading || !isAuthenticated || !isStaff}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
          {buttonText}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border-2 border-green-200">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Referral Link</label>
            <div className="flex items-center gap-2 mt-1">
              <input 
                type="text" 
                value={link} 
                readOnly 
                className="flex-1 bg-transparent text-sm font-mono text-gray-700 outline-none"
              />
              <button
                onClick={copy}
                className={'flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ' + 
                  (copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Code: <span className="font-mono font-semibold text-gray-700">{code}</span>
            </span>
            <button 
              onClick={() => { setLink(''); setCode(''); setError(null); }}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Generate New
            </button>
          </div>
        </div>
      )}
    </div>
  );
}