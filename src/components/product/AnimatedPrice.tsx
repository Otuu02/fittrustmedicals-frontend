'use client'
import { useEffect, useState } from 'react'
import { formatPrice, formatters } from '@/lib/formatters'

interface AnimatedPriceProps {
  price: number
  originalPrice?: number
  className?: string
  showCurrency?: boolean
  animationDuration?: number
  currency?: 'USD' | 'NGN'
}

export const AnimatedPrice = ({ 
  price, 
  originalPrice, 
  className = '',
  showCurrency = true,
  animationDuration = 1000,
  currency = 'USD' // Will be converted to NGN
}: AnimatedPriceProps) => {
  const [animatedPrice, setAnimatedPrice] = useState(0)
  const [animatedOriginalPrice, setAnimatedOriginalPrice] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Convert to Naira if needed
  const finalPrice = currency === 'USD' ? formatters.usdToNaira(price) : price
  const finalOriginalPrice = originalPrice && currency === 'USD' 
    ? formatters.usdToNaira(originalPrice) 
    : originalPrice

  useEffect(() => {
    setIsAnimating(true)
    
    const steps = 60 // 60 frames for smooth animation
    const duration = animationDuration
    const priceIncrement = finalPrice / steps
    const originalPriceIncrement = finalOriginalPrice ? finalOriginalPrice / steps : 0
    
    let currentStep = 0
    
    const timer = setInterval(() => {
      currentStep++
      
      // Animate main price
      setAnimatedPrice(Math.min(priceIncrement * currentStep, finalPrice))
      
      // Animate original price if exists
      if (finalOriginalPrice) {
        setAnimatedOriginalPrice(Math.min(originalPriceIncrement * currentStep, finalOriginalPrice))
      }
      
      if (currentStep >= steps) {
        clearInterval(timer)
        setIsAnimating(false)
      }
    }, duration / steps)

    return () => {
      clearInterval(timer)
      setIsAnimating(false)
    }
  }, [price, originalPrice, finalPrice, finalOriginalPrice, animationDuration])

  // Calculate savings
  const savings = finalOriginalPrice ? finalOriginalPrice - finalPrice : 0
  const savingsPercentage = finalOriginalPrice ? Math.round((savings / finalOriginalPrice) * 100) : 0

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Main Price - Now in Naira */}
      <span className={`text-2xl font-bold text-green-600 transition-all duration-300 ${
        isAnimating ? 'animate-pulse' : ''
      }`}>
        {showCurrency 
          ? formatters.currency(Math.round(animatedPrice), 'NGN')
          : formatters.number(Math.round(animatedPrice))
        }
      </span>

      {/* Original Price (Crossed Out) */}
      {finalOriginalPrice && (
        <span className="text-lg text-gray-500 line-through transition-all duration-300">
          {showCurrency 
            ? formatters.currency(Math.round(animatedOriginalPrice), 'NGN')
            : formatters.number(Math.round(animatedOriginalPrice))
          }
        </span>
      )}

      {/* Savings Display */}
      {finalOriginalPrice && savings > 0 && (
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
            Save {formatters.currency(Math.round(savings), 'NGN')}
          </span>
          
          {savingsPercentage > 0 && (
            <span className="text-xs font-bold text-white bg-red-500 px-1.5 py-0.5 rounded">
              -{savingsPercentage}%
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default AnimatedPrice