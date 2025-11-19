'use client'

import { CheckCircle, Clock, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export type SyncStatus = 'published' | 'pending' | 'failed' | 'not_synced'

export interface PlatformSyncStatus {
  platformId: string
  platformName: string
  status: SyncStatus
  lastSyncAt?: Date
  errorMessage?: string
  externalUrl?: string
  nextRetryAt?: Date
}

interface SyndicationStatusProps {
  listingId: string
  listingAddress: string
  platforms: PlatformSyncStatus[]
  onRetry: (listingId: string, platformId: string) => void
  onRefreshAll: (listingId: string) => void
  className?: string
}

export function SyndicationStatus({
  listingId,
  listingAddress,
  platforms,
  onRetry,
  onRefreshAll,
  className,
}: SyndicationStatusProps) {
  const publishedCount = platforms.filter((p) => p.status === 'published').length
  const failedCount = platforms.filter((p) => p.status === 'failed').length

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const getStatusIcon = (status: SyncStatus) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="text-muted-foreground h-4 w-4" />
    }
  }

  const getStatusBadge = (status: SyncStatus) => {
    const config = {
      published: { label: 'Published', className: 'bg-green-500 text-white' },
      pending: { label: 'Pending', className: 'bg-yellow-500 text-white' },
      failed: { label: 'Failed', className: 'bg-red-500 text-white' },
      not_synced: { label: 'Not Synced', className: 'bg-gray-500 text-white' },
    }
    const { label, className } = config[status]
    return <Badge className={className}>{label}</Badge>
  }

  const handleRetry = (platformId: string) => {
    onRetry(listingId, platformId)

    // Track analytics
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('syndication_retry', {
        listingId,
        platformId,
      })
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Syndication Status</CardTitle>
            <p className="text-muted-foreground text-sm">{listingAddress}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">
              {publishedCount}/{platforms.length} published
            </span>
            {failedCount > 0 && <Badge variant="destructive">{failedCount} failed</Badge>}
            <Button variant="outline" size="sm" onClick={() => onRefreshAll(listingId)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {platforms.map((platform) => (
            <div
              key={platform.platformId}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(platform.status)}
                <div>
                  <p className="font-medium">{platform.platformName}</p>
                  {platform.lastSyncAt && (
                    <p className="text-muted-foreground text-xs">
                      {platform.status === 'published' ? 'Published' : 'Updated'}{' '}
                      {formatRelativeTime(platform.lastSyncAt)}
                    </p>
                  )}
                  {platform.errorMessage && (
                    <p className="text-destructive text-xs">{platform.errorMessage}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(platform.status)}
                {platform.status === 'failed' && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRetry(platform.platformId)}
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span className="sr-only">Retry</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Retry syndication</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {platform.status === 'published' && platform.externalUrl && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={platform.externalUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">View on {platform.platformName}</span>
                          </a>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View on {platform.platformName}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Compact status indicator for use in listing cards
interface SyndicationStatusBadgeProps {
  platforms: PlatformSyncStatus[]
  className?: string
}

export function SyndicationStatusBadge({ platforms, className }: SyndicationStatusBadgeProps) {
  const publishedCount = platforms.filter((p) => p.status === 'published').length
  const failedCount = platforms.filter((p) => p.status === 'failed').length
  const pendingCount = platforms.filter((p) => p.status === 'pending').length

  if (failedCount > 0) {
    return (
      <Badge variant="destructive" className={className}>
        {failedCount} Failed
      </Badge>
    )
  }

  if (pendingCount > 0) {
    return (
      <Badge variant="secondary" className={className}>
        Syncing...
      </Badge>
    )
  }

  return (
    <Badge variant="default" className={`bg-green-500 ${className}`}>
      {publishedCount}/{platforms.length} Synced
    </Badge>
  )
}
