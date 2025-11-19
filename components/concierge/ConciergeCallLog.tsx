'use client'

import { Phone, PhoneIncoming, PhoneOutgoing, Clock, FileText } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CallDirection = 'inbound' | 'outbound'
type CallStatus = 'completed' | 'missed' | 'scheduled'

interface CallRecord {
  id: string
  direction: CallDirection
  status: CallStatus
  timestamp: Date
  duration?: number // in minutes
  topic: string
  notes?: string
  repName: string
  scheduledFor?: Date
}

interface ConciergeCallLogProps {
  calls: CallRecord[]
  onViewNotes?: (callId: string) => void
  onReschedule?: (callId: string) => void
  className?: string
}

export function ConciergeCallLog({
  calls,
  onViewNotes,
  onReschedule,
  className,
}: ConciergeCallLogProps) {
  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const callDate = new Date(date)
    const diffDays = Math.floor(
      (now.getTime() - callDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays === 0) {
      return callDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })
    }
    if (diffDays === 1) {
      return 'Yesterday'
    }
    if (diffDays < 7) {
      return callDate.toLocaleDateString('en-US', { weekday: 'long' })
    }
    return callDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const getStatusBadge = (status: CallStatus) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Completed
          </Badge>
        )
      case 'missed':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Missed
          </Badge>
        )
      case 'scheduled':
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            Scheduled
          </Badge>
        )
    }
  }

  const getDirectionIcon = (direction: CallDirection) => {
    if (direction === 'inbound') {
      return <PhoneIncoming className="h-4 w-4 text-green-500" />
    }
    return <PhoneOutgoing className="h-4 w-4 text-blue-500" />
  }

  // Separate scheduled and past calls
  const scheduledCalls = calls.filter((c) => c.status === 'scheduled')
  const pastCalls = calls.filter((c) => c.status !== 'scheduled')

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Call History
        </CardTitle>
        <CardDescription>
          Your support call history with your account manager
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scheduled Calls */}
        {scheduledCalls.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Upcoming Calls
            </h3>
            <div className="space-y-2">
              {scheduledCalls.map((call) => (
                <div
                  key={call.id}
                  className="rounded-lg border border-blue-200 bg-blue-50 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{call.topic}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {call.scheduledFor
                          ? new Date(call.scheduledFor).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })
                          : 'Time TBD'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        with {call.repName}
                      </p>
                    </div>
                    {onReschedule && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onReschedule(call.id)}
                      >
                        Reschedule
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Calls */}
        {pastCalls.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Past Calls</h3>
            <div className="space-y-2">
              {pastCalls.map((call) => (
                <div
                  key={call.id}
                  className={cn(
                    'rounded-lg border p-4',
                    call.status === 'missed' && 'bg-red-50/50'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getDirectionIcon(call.direction)}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{call.topic}</p>
                          {getStatusBadge(call.status)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimestamp(call.timestamp)}
                          {call.duration && ` - ${formatDuration(call.duration)}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          with {call.repName}
                        </p>
                      </div>
                    </div>
                    {call.notes && onViewNotes && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewNotes(call.id)}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Notes
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {calls.length === 0 && (
          <div className="text-center py-8">
            <Phone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No calls yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your call history will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
