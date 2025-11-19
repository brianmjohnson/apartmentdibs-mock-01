'use client'

import { Briefcase, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface EmploymentTenureProps {
  tenure: string
  employmentType?: string
  showIcon?: boolean
  showStabilityBadge?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Determine if tenure indicates stable employment
function isStableEmployment(tenure: string): boolean {
  return tenure.includes('3+') || tenure.includes('4+') || tenure.includes('5+')
}

// Get stability label based on tenure
function getStabilityLabel(tenure: string): string | null {
  if (tenure.includes('5+')) return 'Very Stable'
  if (tenure.includes('4+') || tenure.includes('3+')) return 'Stable'
  return null
}

export function EmploymentTenure({
  tenure,
  employmentType,
  showIcon = true,
  showStabilityBadge = true,
  size = 'md',
  className = '',
}: EmploymentTenureProps) {
  const isStable = isStableEmployment(tenure)
  const stabilityLabel = getStabilityLabel(tenure)

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

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && <Briefcase className={`${iconSizes[size]} text-muted-foreground`} />}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className={`font-bold ${sizeClasses[size]}`}>{tenure}</span>
          {showStabilityBadge && stabilityLabel && (
            <Badge
              variant="outline"
              className="border-green-300 bg-green-100 text-xs text-green-800"
            >
              <TrendingUp className="mr-1 h-3 w-3" />
              {stabilityLabel}
            </Badge>
          )}
        </div>
        {employmentType && (
          <span className={`text-muted-foreground ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
            {employmentType}
          </span>
        )}
      </div>
    </div>
  )
}

// Compact version for use in tables or lists
export function EmploymentTenureCompact({
  tenure,
  className = '',
}: {
  tenure: string
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={`border-2 ${isStableEmployment(tenure) ? 'border-green-300 bg-green-100 text-green-800' : 'bg-muted text-foreground border-border'} ${className}`}
    >
      <Briefcase className="mr-1 h-3 w-3" />
      {tenure}
    </Badge>
  )
}
