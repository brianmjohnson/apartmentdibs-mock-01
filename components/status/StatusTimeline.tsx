'use client'

import {
  FileText,
  CheckCircle,
  Eye,
  Star,
  Clock,
  PartyPopper,
  XCircle,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface TimelineEvent {
  id: string
  type:
    | 'applied'
    | 'documents_complete'
    | 'viewed'
    | 'shortlisted'
    | 'decision_pending'
    | 'selected'
    | 'denied'
  title: string
  description?: string
  timestamp: Date
  isComplete: boolean
}

interface StatusTimelineProps {
  applicationId: string
  address: string
  events: TimelineEvent[]
  expectedDecisionDate?: Date
  className?: string
}

const eventConfig = {
  applied: {
    icon: FileText,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  documents_complete: {
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
  },
  viewed: {
    icon: Eye,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
  },
  shortlisted: {
    icon: Star,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
  },
  decision_pending: {
    icon: Clock,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
  },
  selected: {
    icon: PartyPopper,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  denied: {
    icon: XCircle,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
  },
}

export function StatusTimeline({
  applicationId: _applicationId,
  address,
  events,
  expectedDecisionDate,
  className,
}: StatusTimelineProps) {
  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  // Sort events by timestamp descending (most recent first)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Application Timeline</CardTitle>
        <CardDescription>{address}</CardDescription>
      </CardHeader>
      <CardContent>
        {expectedDecisionDate && (
          <div className="mb-6 rounded-lg bg-muted p-3">
            <p className="text-sm">
              <span className="font-medium">Expected Decision:</span>{' '}
              {formatDate(expectedDecisionDate)}
            </p>
          </div>
        )}

        <div className="relative space-y-0">
          {sortedEvents.map((event, index) => {
            const config = eventConfig[event.type]
            const Icon = config.icon
            const isLast = index === sortedEvents.length - 1

            return (
              <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
                {/* Connector Line */}
                {!isLast && (
                  <div
                    className={cn(
                      'absolute left-[15px] top-8 w-0.5 h-full',
                      event.isComplete ? 'bg-primary/30' : 'bg-gray-200'
                    )}
                  />
                )}

                {/* Icon */}
                <div
                  className={cn(
                    'relative z-10 flex h-8 w-8 items-center justify-center rounded-full',
                    event.isComplete ? config.bgColor : 'bg-gray-100'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4',
                      event.isComplete ? config.color : 'text-gray-400'
                    )}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p
                        className={cn(
                          'font-medium',
                          !event.isComplete && 'text-muted-foreground'
                        )}
                      >
                        {event.title}
                      </p>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
