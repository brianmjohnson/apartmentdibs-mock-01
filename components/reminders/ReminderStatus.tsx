'use client'

import { Clock, AlertTriangle, CheckCircle, Mail, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface ReminderInfo {
  applicantId: string
  listingAddress: string
  completionPercentage: number
  daysElapsed: number
  remindersSent: number
  lastReminderAt?: Date
  nextReminderAt?: Date
  status: 'on_track' | 'needs_attention' | 'at_risk' | 'expired'
  missingDocuments: string[]
}

interface ReminderStatusProps {
  reminder: ReminderInfo
  onSendReminder: (applicantId: string) => void
  onContact: (applicantId: string) => void
  className?: string
}

export function ReminderStatus({
  reminder,
  onSendReminder,
  onContact,
  className,
}: ReminderStatusProps) {
  const getStatusConfig = (status: ReminderInfo['status']) => {
    switch (status) {
      case 'on_track':
        return {
          label: 'On Track',
          icon: CheckCircle,
          className: 'bg-green-500',
          textColor: 'text-green-600',
        }
      case 'needs_attention':
        return {
          label: 'Needs Attention',
          icon: Clock,
          className: 'bg-yellow-500',
          textColor: 'text-yellow-600',
        }
      case 'at_risk':
        return {
          label: 'At Risk',
          icon: AlertTriangle,
          className: 'bg-orange-500',
          textColor: 'text-orange-600',
        }
      case 'expired':
        return {
          label: 'Expired',
          icon: AlertTriangle,
          className: 'bg-red-500',
          textColor: 'text-red-600',
        }
    }
  }

  const config = getStatusConfig(reminder.status)
  const StatusIcon = config.icon

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">Applicant #{reminder.applicantId}</CardTitle>
            <p className="text-muted-foreground text-sm">{reminder.listingAddress}</p>
          </div>
          <Badge className={`${config.className} text-white`}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Profile Completion</span>
            <span className="font-medium">{reminder.completionPercentage}%</span>
          </div>
          <Progress value={reminder.completionPercentage} className="h-2" />
        </div>

        {/* Missing Documents */}
        {reminder.missingDocuments.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Missing Documents:</p>
            <div className="flex flex-wrap gap-1">
              {reminder.missingDocuments.map((doc) => (
                <Badge key={doc} variant="outline" className="text-xs">
                  {doc}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Reminder Info */}
        <div className="text-muted-foreground grid grid-cols-2 gap-2 text-xs">
          <div>
            <span>Days elapsed:</span>
            <span className="ml-1 font-medium">{reminder.daysElapsed}</span>
          </div>
          <div>
            <span>Reminders sent:</span>
            <span className="ml-1 font-medium">{reminder.remindersSent}</span>
          </div>
          {reminder.lastReminderAt && (
            <div className="col-span-2">
              <span>Last reminder:</span>
              <span className="ml-1">{formatDate(reminder.lastReminderAt)}</span>
            </div>
          )}
          {reminder.nextReminderAt && reminder.status !== 'expired' && (
            <div className="col-span-2">
              <span>Next reminder:</span>
              <span className="ml-1">{formatDate(reminder.nextReminderAt)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onSendReminder(reminder.applicantId)}
            disabled={reminder.status === 'expired'}
          >
            <Mail className="mr-2 h-4 w-4" />
            Send Reminder
          </Button>
          <Button size="sm" variant="outline" onClick={() => onContact(reminder.applicantId)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Summary card for dashboard
interface ReminderSummaryProps {
  totalIncomplete: number
  needsAttention: number
  atRisk: number
  expired: number
  onViewAll: () => void
  className?: string
}

export function ReminderSummary({
  totalIncomplete,
  needsAttention,
  atRisk,
  expired,
  onViewAll,
  className,
}: ReminderSummaryProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Document Reminders</CardTitle>
          <Button variant="link" size="sm" onClick={onViewAll}>
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{totalIncomplete}</p>
            <p className="text-muted-foreground text-xs">Incomplete</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">{needsAttention}</p>
            <p className="text-muted-foreground text-xs">Needs Attn</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">{atRisk}</p>
            <p className="text-muted-foreground text-xs">At Risk</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{expired}</p>
            <p className="text-muted-foreground text-xs">Expired</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
