'use client'

import { Shield, AlertTriangle, XCircle, HelpCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type RiskLevel = 'low' | 'medium' | 'high' | 'unknown'

interface FraudRiskBadgeProps {
  riskLevel: RiskLevel
  score?: number
  showTooltip?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function FraudRiskBadge({
  riskLevel,
  score,
  showTooltip = true,
  size = 'md',
  className,
}: FraudRiskBadgeProps) {
  const getIcon = () => {
    const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'

    switch (riskLevel) {
      case 'low':
        return <Shield className={`${iconSize} text-green-600`} />
      case 'medium':
        return <AlertTriangle className={`${iconSize} text-yellow-600`} />
      case 'high':
        return <XCircle className={`${iconSize} text-red-600`} />
      case 'unknown':
        return <HelpCircle className={`${iconSize} text-gray-400`} />
    }
  }

  const getBadgeVariant = () => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'unknown':
        return ''
    }
  }

  const getLabel = () => {
    switch (riskLevel) {
      case 'low':
        return 'Low Risk'
      case 'medium':
        return 'Medium Risk'
      case 'high':
        return 'High Risk'
      case 'unknown':
        return 'Unknown'
    }
  }

  const getTooltipContent = () => {
    switch (riskLevel) {
      case 'low':
        return 'All documents verified with high confidence. No fraud indicators detected.'
      case 'medium':
        return 'Some documents could not be fully verified. Manual review recommended.'
      case 'high':
        return 'Multiple fraud indicators detected. Documents flagged for review.'
      case 'unknown':
        return 'Verification not yet complete or insufficient data.'
    }
  }

  const badge = (
    <Badge
      variant="secondary"
      className={`${getBadgeVariant()} ${className}`}
    >
      <span className="mr-1">{getIcon()}</span>
      {getLabel()}
      {score !== undefined && (
        <span className="ml-1 opacity-75">({score}%)</span>
      )}
    </Badge>
  )

  if (!showTooltip) {
    return badge
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">{getTooltipContent()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
