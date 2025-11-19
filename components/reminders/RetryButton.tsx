'use client'

import { useState } from 'react'
import { RefreshCw, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface RetryButtonProps {
  onRetry: () => Promise<void>
  label?: string
  tooltipText?: string
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  className?: string
}

export function RetryButton({
  onRetry,
  label = 'Retry',
  tooltipText = 'Retry sending reminder',
  variant = 'outline',
  size = 'sm',
  disabled = false,
  className,
}: RetryButtonProps) {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    if (isRetrying || disabled) return

    setIsRetrying(true)
    try {
      await onRetry()
    } finally {
      setIsRetrying(false)
    }
  }

  const button = (
    <Button
      variant={variant}
      size={size}
      onClick={handleRetry}
      disabled={disabled || isRetrying}
      className={className}
    >
      {isRetrying ? (
        <Loader2 className={`h-4 w-4 animate-spin ${size !== 'icon' ? 'mr-2' : ''}`} />
      ) : (
        <RefreshCw className={`h-4 w-4 ${size !== 'icon' ? 'mr-2' : ''}`} />
      )}
      {size !== 'icon' && (isRetrying ? 'Retrying...' : label)}
    </Button>
  )

  if (size === 'icon') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return button
}

// Specialized retry button for reminder failures
interface ReminderRetryButtonProps {
  applicantId: string
  reminderType: string
  onRetry: (applicantId: string, reminderType: string) => Promise<void>
  lastAttemptAt?: Date
  className?: string
}

export function ReminderRetryButton({
  applicantId,
  reminderType,
  onRetry,
  lastAttemptAt,
  className,
}: ReminderRetryButtonProps) {
  const handleRetry = async () => {
    await onRetry(applicantId, reminderType)

    // Track analytics
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('reminder_retry', {
        applicantId,
        reminderType,
      })
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <RetryButton
        onRetry={handleRetry}
        label="Retry Reminder"
        tooltipText={`Retry ${reminderType} reminder`}
        variant="secondary"
        size="sm"
      />
      {lastAttemptAt && (
        <span className="text-muted-foreground text-xs">
          Last attempt:{' '}
          {new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          }).format(lastAttemptAt)}
        </span>
      )}
    </div>
  )
}
