'use client'

import { CheckCircle, AlertTriangle, XCircle, Info, ExternalLink } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

type SystemStatus = 'operational' | 'degraded' | 'outage' | 'maintenance'

interface StatusBannerProps {
  status: SystemStatus
  message?: string
  estimatedResolution?: Date
  statusPageUrl?: string
  onDismiss?: () => void
  className?: string
}

export function StatusBanner({
  status,
  message,
  estimatedResolution,
  statusPageUrl = 'https://status.apartmentdibs.com',
  onDismiss,
  className,
}: StatusBannerProps) {
  if (status === 'operational') {
    return null
  }

  const getIcon = () => {
    switch (status) {
      case 'degraded':
        return <AlertTriangle className="h-4 w-4" />
      case 'outage':
        return <XCircle className="h-4 w-4" />
      case 'maintenance':
        return <Info className="h-4 w-4" />
    }
  }

  const getVariant = () => {
    switch (status) {
      case 'degraded':
        return 'default'
      case 'outage':
        return 'destructive'
      case 'maintenance':
        return 'default'
    }
  }

  const getTitle = () => {
    switch (status) {
      case 'degraded':
        return 'Service Degradation'
      case 'outage':
        return 'Service Outage'
      case 'maintenance':
        return 'Scheduled Maintenance'
    }
  }

  const getDefaultMessage = () => {
    switch (status) {
      case 'degraded':
        return 'Some features may be slower than usual. We are working to resolve this.'
      case 'outage':
        return 'We are experiencing an outage and are working to restore service.'
      case 'maintenance':
        return 'We are performing scheduled maintenance. Some features may be unavailable.'
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(date)
  }

  return (
    <Alert
      variant={getVariant()}
      className={`${
        status === 'degraded'
          ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
          : status === 'maintenance'
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
            : ''
      } ${className}`}
    >
      {getIcon()}
      <AlertTitle
        className={
          status === 'degraded'
            ? 'text-yellow-800 dark:text-yellow-200'
            : status === 'maintenance'
              ? 'text-blue-800 dark:text-blue-200'
              : ''
        }
      >
        {getTitle()}
      </AlertTitle>
      <AlertDescription
        className={
          status === 'degraded'
            ? 'text-yellow-700 dark:text-yellow-300'
            : status === 'maintenance'
              ? 'text-blue-700 dark:text-blue-300'
              : ''
        }
      >
        <p>{message || getDefaultMessage()}</p>
        {estimatedResolution && (
          <p className="mt-1 text-sm">Estimated resolution: {formatTime(estimatedResolution)}</p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {statusPageUrl && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className={
                status === 'degraded'
                  ? 'border-yellow-600 text-yellow-800 hover:bg-yellow-100'
                  : status === 'maintenance'
                    ? 'border-blue-600 text-blue-800 hover:bg-blue-100'
                    : ''
              }
            >
              <a href={statusPageUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-3 w-3" />
                View Status Page
              </a>
            </Button>
          )}
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className={
                status === 'degraded'
                  ? 'text-yellow-800 hover:bg-yellow-100'
                  : status === 'maintenance'
                    ? 'text-blue-800 hover:bg-blue-100'
                    : ''
              }
            >
              Dismiss
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}
