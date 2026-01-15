'use client'

import { motion } from 'framer-motion'
import { CreditCard } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getCreditBandColor, getCreditBandLabel } from '@/lib/mock-data/landlord'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { scaleIn, bouncySpring } from '@/lib/animations/variants'

/**
 * @story US-001 - PII Anonymization Before Landlord Review
 */
interface CreditBandProps {
  creditBand: string
  showIcon?: boolean
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  animate?: boolean
}

export function CreditBand({
  creditBand,
  showIcon = true,
  showLabel = true,
  size = 'md',
  className = '',
  animate = true,
}: CreditBandProps) {
  const colorClass = getCreditBandColor(creditBand)
  const label = getCreditBandLabel(creditBand)
  const shouldReduceMotion = useReducedMotion()

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  // Get color for glow effect based on credit band
  const getGlowColor = (band: string) => {
    if (band.includes('800')) return 'rgba(34, 197, 94, 0.3)' // green-500
    if (band.includes('740') || band.includes('760')) return 'rgba(59, 130, 246, 0.3)' // blue-500
    if (band.includes('680') || band.includes('700')) return 'rgba(234, 179, 8, 0.3)' // yellow-500
    return 'rgba(156, 163, 175, 0.3)' // gray-400
  }

  const glowColor = getGlowColor(creditBand)

  if (animate && !shouldReduceMotion) {
    return (
      <motion.div
        className={`flex items-center gap-2 ${className}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          boxShadow: ['0 0 0 rgba(0,0,0,0)', `0 0 12px ${glowColor}`, '0 0 0 rgba(0,0,0,0)'],
        }}
        transition={{
          ...bouncySpring,
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          },
        }}
      >
        {showIcon && <CreditCard className={`${iconSizes[size]} text-muted-foreground`} />}
        <div className="flex items-center gap-2">
          <motion.span
            className={`font-bold ${sizeClasses[size]}`}
            aria-label={`Credit score band ${creditBand}, rated ${label}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {creditBand}
          </motion.span>
          {showLabel && (
            <Badge variant="outline" className={`${colorClass} border ${sizeClasses[size]}`}>
              {label}
            </Badge>
          )}
        </div>
      </motion.div>
    )
  }

  // Non-animated version
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && <CreditCard className={`${iconSizes[size]} text-muted-foreground`} />}
      <div className="flex items-center gap-2">
        <span
          className={`font-bold ${sizeClasses[size]}`}
          aria-label={`Credit score band ${creditBand}, rated ${label}`}
        >
          {creditBand}
        </span>
        {showLabel && (
          <Badge variant="outline" className={`${colorClass} border ${sizeClasses[size]}`}>
            {label}
          </Badge>
        )}
      </div>
    </div>
  )
}

// Compact version for use in tables or lists
export function CreditBandCompact({
  creditBand,
  className = '',
}: {
  creditBand: string
  className?: string
}) {
  const colorClass = getCreditBandColor(creditBand)

  return (
    <Badge
      variant="outline"
      className={`${colorClass} border-2 ${className}`}
      aria-label={`Credit score band ${creditBand}, rated ${getCreditBandLabel(creditBand)}`}
    >
      {creditBand}
    </Badge>
  )
}
