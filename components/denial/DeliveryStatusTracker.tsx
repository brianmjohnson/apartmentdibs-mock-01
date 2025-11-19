'use client'

import {
  Mail,
  MessageSquare,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type DeliveryStatus = 'pending' | 'sent' | 'delivered' | 'opened' | 'failed' | 'bounced'

interface DeliveryChannel {
  type: 'email' | 'sms' | 'certified_mail'
  status: DeliveryStatus
  sentAt?: string
  deliveredAt?: string
  openedAt?: string
  trackingNumber?: string
  errorMessage?: string
}

interface DeliveryStatusTrackerProps {
  applicantId: string
  applicantName: string
  letterId: string
  sentDate: string
  channels: DeliveryChannel[]
  className?: string
}

const statusConfig: Record<
  DeliveryStatus,
  { label: string; icon: React.ReactNode; color: string }
> = {
  pending: {
    label: 'Pending',
    icon: <Clock className="h-4 w-4" />,
    color: 'text-muted-foreground',
  },
  sent: {
    label: 'Sent',
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'text-blue-600',
  },
  delivered: {
    label: 'Delivered',
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'text-green-600',
  },
  opened: {
    label: 'Opened',
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'text-green-600',
  },
  failed: {
    label: 'Failed',
    icon: <XCircle className="h-4 w-4" />,
    color: 'text-destructive',
  },
  bounced: {
    label: 'Bounced',
    icon: <XCircle className="h-4 w-4" />,
    color: 'text-destructive',
  },
}

const channelConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  email: {
    label: 'Email',
    icon: <Mail className="h-4 w-4" />,
  },
  sms: {
    label: 'SMS',
    icon: <MessageSquare className="h-4 w-4" />,
  },
  certified_mail: {
    label: 'Certified Mail',
    icon: <FileText className="h-4 w-4" />,
  },
}

export function DeliveryStatusTracker({
  applicantId: _applicantId,
  applicantName,
  letterId,
  sentDate,
  channels,
  className,
}: DeliveryStatusTrackerProps) {
  const hasDeliveryConfirmed = channels.some(
    (c) => c.status === 'delivered' || c.status === 'opened'
  )

  return (
    <Card className={`border-foreground border-2 ${className || ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Delivery Status</CardTitle>
          <Badge
            variant={hasDeliveryConfirmed ? 'default' : 'outline'}
            className={hasDeliveryConfirmed ? '' : 'border-foreground'}
          >
            {hasDeliveryConfirmed ? 'Confirmed' : 'In Progress'}
          </Badge>
        </div>
        <CardDescription>
          Adverse action letter sent to {applicantName} on {sentDate}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-muted-foreground text-xs">Letter ID: {letterId}</div>

        <div className="space-y-3">
          {channels.map((channel, index) => {
            const channelInfo = channelConfig[channel.type]
            const statusInfo = statusConfig[channel.status]

            return (
              <div
                key={index}
                className="bg-muted/50 border-border flex items-center justify-between rounded-md border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-background border-border rounded border p-2">
                    {channelInfo.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{channelInfo.label}</p>
                    {channel.sentAt && (
                      <p className="text-muted-foreground text-xs">Sent: {channel.sentAt}</p>
                    )}
                    {channel.deliveredAt && (
                      <p className="text-muted-foreground text-xs">
                        Delivered: {channel.deliveredAt}
                      </p>
                    )}
                    {channel.openedAt && (
                      <p className="text-xs text-green-600">Opened: {channel.openedAt}</p>
                    )}
                    {channel.errorMessage && (
                      <p className="text-destructive text-xs">{channel.errorMessage}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {channel.trackingNumber && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${channel.trackingNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Track: {channel.trackingNumber}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <div className={`flex items-center gap-1 ${statusInfo.color}`}>
                    {statusInfo.icon}
                    <span className="text-sm font-medium">{statusInfo.label}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-muted-foreground border-border border-t pt-2 text-xs">
          All delivery attempts are logged and archived for 3 years for compliance purposes.
        </div>
      </CardContent>
    </Card>
  )
}
