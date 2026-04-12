// src/app/ref/[code]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ReferralRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    const handleReferral = async () => {
      const code = params.code;
      
      if (!code) {
        setError(true);
        return;
      }

      try {
        // Track the referral click
        await fetch('/api/referral/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ referralCode: code, action: 'click' })
        });

        // Store referral code in localStorage
        localStorage.setItem('referralCode', code as string);
        
        // Redirect to home page
        router.push('/');
      } catch (error) {
        console.error('Error tracking referral:', error);
        router.push('/');
      }
    };

    handleReferral();
  }, [params.code, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Invalid Referral Link</h1>
          <p className="text-gray-600">The referral link you used is invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting you to Fittrust Medicals...</p>
      </div>
    </div>
  );
}