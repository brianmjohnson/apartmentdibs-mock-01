'use client'

import { CheckCircle, AlertTriangle, XCircle, HelpCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type QualificationStatus = 'qualified' | 'partial' | 'unqualified' | 'unknown'

interface QualificationDetails {
  incomeRatio?: { actual: number; required: number }
  creditScore?: { actual: number; required: number }
  backgroundCheck?: boolean
  customMessage?: string
}

interface QualificationBadgeProps {
  status: QualificationStatus
  details?: QualificationDetails
  showTooltip?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function QualificationBadge({
  status,
  details,
  showTooltip = true,
  size = 'md',
  className,
}: QualificationBadgeProps) {
  const config = {
    qualified: {
      label: 'You Qualify',
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-300',
    },
    partial: {
      label: 'Partial Match',
      icon: AlertTriangle,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-300',
    },
    unqualified: {
      label: 'Does Not Meet Requirements',
      icon: XCircle,
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      borderColor: 'border-red-300',
    },
    unknown: {
      label: 'Complete Profile to Check',
      icon: HelpCircle,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-300',
    },
  }

  const currentConfig = config[status]
  const Icon = currentConfig.icon

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  const getTooltipContent = () => {
    const items: string[] = []

    if (details?.customMessage) {
      items.push(details.customMessage)
    }

    if (details?.incomeRatio) {
      const meetsIncome = details.incomeRatio.actual >= details.incomeRatio.required
      items.push(
        meetsIncome
          ? `Income: ${details.incomeRatio.actual.toFixed(1)}x (meets ${details.incomeRatio.required}x requirement)`
          : `Income: ${details.incomeRatio.actual.toFixed(1)}x (${details.incomeRatio.required}x required)`
      )
    }

    if (details?.creditScore) {
      const meetsCredit = details.creditScore.actual >= details.creditScore.required
      items.push(
        meetsCredit
          ? `Credit: ${details.creditScore.actual} (meets ${details.creditScore.required} minimum)`
          : `Credit: ${details.creditScore.actual} (${details.creditScore.required} required)`
      )
    }

    if (details?.backgroundCheck !== undefined) {
      items.push(
        details.backgroundCheck ? 'Background check: Passed' : 'Background check: Review required'
      )
    }

    return items
  }

  const badge = (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border font-medium',
        currentConfig.bgColor,
        currentConfig.textColor,
        currentConfig.borderColor,
        sizeClasses[size],
        className
      )}
    >
      <Icon className={iconSizes[size]} />
      <span>{currentConfig.label}</span>
    </div>
  )

  if (!showTooltip || !details) {
    return badge
  }

  const tooltipItems = getTooltipContent()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-1">
            {tooltipItems.map((item, index) => (
              <p key={index} className="text-sm">
                {item}
              </p>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Compact version for use in listing cards
export function QualificationIndicator({
  status,
  className,
}: {
  status: QualificationStatus
  className?: string
}) {
  const config = {
    qualified: {
      icon: CheckCircle,
      color: 'text-green-500',
      label: 'Qualified',
    },
    partial: {
      icon: AlertTriangle,
      color: 'text-yellow-500',
      label: 'Partial match',
    },
    unqualified: {
      icon: XCircle,
      color: 'text-red-500',
      label: 'Does not qualify',
    },
    unknown: {
      icon: HelpCircle,
      color: 'text-gray-400',
      label: 'Unknown',
    },
  }

  const currentConfig = config[status]
  const Icon = currentConfig.icon

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Icon
            className={cn('h-5 w-5', currentConfig.color, className)}
            aria-label={currentConfig.label}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>{currentConfig.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
