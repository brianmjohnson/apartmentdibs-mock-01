'use client'

import { CheckCircle, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface SyncEvent {
  id: string
  platformId: string
  platformName: string
  action: 'create' | 'update' | 'delete' | 'retry'
  status: 'success' | 'failed'
  timestamp: Date
  details?: string
  errorMessage?: string
}

interface SyncHistoryProps {
  events: SyncEvent[]
  maxHeight?: number
  className?: string
}

export function SyncHistory({ events, maxHeight = 400, className }: SyncHistoryProps) {
  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  const getActionLabel = (action: SyncEvent['action']) => {
    switch (action) {
      case 'create':
        return 'Published'
      case 'update':
        return 'Updated'
      case 'delete':
        return 'Removed'
      case 'retry':
        return 'Retried'
    }
  }

  const getActionIcon = (status: SyncEvent['status']) => {
    return status === 'success' ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500" />
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Sync History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea style={{ maxHeight }}>
          <div className="space-y-3">
            {events.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center text-sm">No sync events yet</p>
            ) : (
              events.map((event) => (
                <div key={event.id} className="flex items-start gap-3 rounded-lg border p-3">
                  {getActionIcon(event.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{event.platformName}</span>
                      <span className="text-muted-foreground text-xs">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">
                      {getActionLabel(event.action)}
                      {event.status === 'success' ? (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Success
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          Failed
                        </Badge>
                      )}
                    </p>
                    {event.details && (
                      <p className="text-muted-foreground mt-1 text-xs">{event.details}</p>
                    )}
                    {event.errorMessage && (
                      <p className="text-destructive mt-1 text-xs">{event.errorMessage}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Timeline view for a single listing's sync history
interface SyncTimelineProps {
  events: SyncEvent[]
  className?: string
}

export function SyncTimeline({ events, className }: SyncTimelineProps) {
  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {events.map((event, index) => (
        <div key={event.id} className="relative flex gap-4">
          {index < events.length - 1 && (
            <div className="bg-border absolute top-8 left-[11px] h-full w-[2px]" />
          )}
          <div
            className={`mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
              event.status === 'success' ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            {event.status === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{event.platformName}</span>
              <span className="text-muted-foreground text-xs">
                {formatTimestamp(event.timestamp)}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              {event.action === 'create' && 'Listing published'}
              {event.action === 'update' && 'Listing updated'}
              {event.action === 'delete' && 'Listing removed'}
              {event.action === 'retry' && 'Syndication retried'}
            </p>
            {event.errorMessage && (
              <p className="text-destructive mt-1 text-xs">{event.errorMessage}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
