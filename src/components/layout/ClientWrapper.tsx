// src/components/layout/ClientWrapper.tsx
'use client';

import dynamic from 'next/dynamic';

const AIChat = dynamic(() => import('@/components/chat/AIChat'), { ssr: false });

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AIChat />
    </>
  );
}