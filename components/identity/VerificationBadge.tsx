'use client'

import { CheckCircle, Clock, XCircle, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type VerificationStatus = 'verified' | 'pending' | 'unverified' | 'failed'

interface VerificationBadgeProps {
  status: VerificationStatus
  verifiedAt?: Date
  method?: string
  showTooltip?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function VerificationBadge({
  status,
  verifiedAt,
  method,
  showTooltip = true,
  size = 'md',
  className,
}: VerificationBadgeProps) {
  const getIcon = () => {
    const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'

    switch (status) {
      case 'verified':
        return <CheckCircle className={`${iconSize} text-green-600`} />
      case 'pending':
        return <Clock className={`${iconSize} text-yellow-600`} />
      case 'unverified':
        return <Shield className={`${iconSize} text-gray-400`} />
      case 'failed':
        return <XCircle className={`${iconSize} text-red-600`} />
    }
  }

  const getBadgeVariant = () => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'unverified':
        return ''
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    }
  }

  const getLabel = () => {
    switch (status) {
      case 'verified':
        return 'Identity Verified'
      case 'pending':
        return 'Verification Pending'
      case 'unverified':
        return 'Not Verified'
      case 'failed':
        return 'Verification Failed'
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  const getTooltipContent = () => {
    switch (status) {
      case 'verified':
        return (
          <div className="space-y-1">
            <p>Identity verified successfully</p>
            {verifiedAt && (
              <p className="text-muted-foreground text-xs">Verified on {formatDate(verifiedAt)}</p>
            )}
            {method && <p className="text-muted-foreground text-xs">Method: {method}</p>}
          </div>
        )
      case 'pending':
        return 'Identity verification is in progress'
      case 'unverified':
        return 'This user has not completed identity verification'
      case 'failed':
        return 'Identity verification was unsuccessful. Please try again.'
    }
  }

  const badge = (
    <Badge variant="secondary" className={`${getBadgeVariant()} ${className}`}>
      <span className="mr-1">{getIcon()}</span>
      {getLabel()}
    </Badge>
  )

  if (!showTooltip) {
    return badge
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>{getTooltipContent()}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
