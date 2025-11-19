'use client'

import { CreditCard } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getCreditBandColor, getCreditBandLabel } from '@/lib/mock-data/landlord'

interface CreditBandProps {
  creditBand: string
  showIcon?: boolean
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function CreditBand({
  creditBand,
  showIcon = true,
  showLabel = true,
  size = 'md',
  className = ''
}: CreditBandProps) {
  const colorClass = getCreditBandColor(creditBand)
  const label = getCreditBandLabel(creditBand)

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && (
        <CreditCard className={`${iconSizes[size]} text-muted-foreground`} />
      )}
      <div className="flex items-center gap-2">
        <span
          className={`font-bold ${sizeClasses[size]}`}
          aria-label={`Credit score band ${creditBand}, rated ${label}`}
        >
          {creditBand}
        </span>
        {showLabel && (
          <Badge
            variant="outline"
            className={`${colorClass} border ${sizeClasses[size]}`}
          >
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
  className = ''
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
