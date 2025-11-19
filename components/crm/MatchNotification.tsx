'use client'

import { Users, ArrowRight, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MatchScoreBadge } from './MatchScoreBadge'

export interface MatchNotificationData {
  id: string
  listingId: string
  listingAddress: string
  matchCount: number
  topMatches: Array<{
    applicantId: string
    score: number
  }>
  createdAt: Date
}

interface MatchNotificationProps {
  notification: MatchNotificationData
  onViewMatches: (notification: MatchNotificationData) => void
  onInviteAll: (notification: MatchNotificationData) => void
  onDismiss: (notificationId: string) => void
  className?: string
}

export function MatchNotification({
  notification,
  onViewMatches,
  onInviteAll,
  onDismiss,
  className,
}: MatchNotificationProps) {
  const handleInviteAll = () => {
    onInviteAll(notification)

    // Track analytics
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('crm_outreach_sent', {
        listingId: notification.listingId,
        leadCount: notification.matchCount,
        channel: 'bulk_invite',
      })
    }
  }

  return (
    <Card className={`border-primary/50 bg-primary/5 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <Users className="text-primary h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">
                {notification.matchCount} CRM Match{notification.matchCount !== 1 ? 'es' : ''} Found
              </h3>
              <p className="text-muted-foreground text-sm">For: {notification.listingAddress}</p>
              {notification.topMatches.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground text-xs">Top matches:</span>
                  {notification.topMatches.slice(0, 3).map((match) => (
                    <MatchScoreBadge
                      key={match.applicantId}
                      score={match.score}
                      showTooltip={false}
                      className="text-xs"
                    />
                  ))}
                  {notification.topMatches.length > 3 && (
                    <span className="text-muted-foreground text-xs">
                      +{notification.topMatches.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDismiss(notification.id)}
            className="h-8 w-8 flex-shrink-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>

        <div className="mt-4 flex gap-2">
          <Button size="sm" onClick={handleInviteAll}>
            Invite All Matched Leads
          </Button>
          <Button size="sm" variant="outline" onClick={() => onViewMatches(notification)}>
            View Matches
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// List component for multiple notifications
interface MatchNotificationListProps {
  notifications: MatchNotificationData[]
  onViewMatches: (notification: MatchNotificationData) => void
  onInviteAll: (notification: MatchNotificationData) => void
  onDismiss: (notificationId: string) => void
  className?: string
}

export function MatchNotificationList({
  notifications,
  onViewMatches,
  onInviteAll,
  onDismiss,
  className,
}: MatchNotificationListProps) {
  if (notifications.length === 0) {
    return null
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {notifications.map((notification) => (
        <MatchNotification
          key={notification.id}
          notification={notification}
          onViewMatches={onViewMatches}
          onInviteAll={onInviteAll}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  )
}
