// Component to show backend connection status
'use client'

import { useEffect, useState } from 'react'
import { apiMethods } from '@/lib/api'

export function BackendStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const [backendUrl, setBackendUrl] = useState('')

  useEffect(() => {
    checkBackendHealth()
    setBackendUrl(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
  }, [])

  const checkBackendHealth = async () => {
    try {
      await apiMethods.health.check()
      setStatus('connected')
      console.log('✅ Backend connected successfully')
    } catch (error) {
      setStatus('disconnected')
      console.error('❌ Backend connection failed:', error)
    }
  }

  if (process.env.NEXT_PUBLIC_DEBUG_MODE !== 'true') {
    return null  // Don't show in production
  }

  return (
    <div className={`fixed top-4 right-4 z-50 p-3 rounded-lg shadow-lg text-sm font-mono ${
      status === 'connected' ? 'bg-green-100 text-green-800 border border-green-200' :
      status === 'disconnected' ? 'bg-red-100 text-red-800 border border-red-200' :
      'bg-yellow-100 text-yellow-800 border border-yellow-200'
    }`}>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          status === 'connected' ? 'bg-green-500' :
          status === 'disconnected' ? 'bg-red-500' :
          'bg-yellow-500 animate-pulse'
        }`} />
        <span>
          {status === 'connected' && '✅ Backend Connected'}
          {status === 'disconnected' && '❌ Backend Offline'}
          {status === 'checking' && '🔄 Checking...'}
        </span>
      </div>
      <div className="text-xs text-gray-600 mt-1">
        {backendUrl}
      </div>
      {status === 'disconnected' && (
        <button 
          onClick={checkBackendHealth}
          className="text-xs underline mt-1 hover:no-underline"
        >
          Retry
        </button>
      )}
    </div>
  )
}