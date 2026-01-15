'use client'

import { CheckCircle, Clock, AlertCircle, User, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface GroupMember {
  id: string
  name?: string
  email: string
  isPrimary: boolean
  profileStatus: 'pending' | 'in_progress' | 'complete' | 'expired'
  completionPercentage: number
  lastActivity?: Date
}

interface GroupStatusProps {
  groupId: string
  members: GroupMember[]
  onSendReminder?: (memberId: string) => Promise<void>
  onRemoveMember?: (memberId: string) => Promise<void>
  className?: string
}

export function GroupStatus({
  groupId,
  members,
  onSendReminder,
  onRemoveMember,
  className,
}: GroupStatusProps) {
  const completedCount = members.filter((m) => m.profileStatus === 'complete').length
  const totalCount = members.length
  const overallProgress = (completedCount / totalCount) * 100

  const canSubmit = members.every((m) => m.profileStatus === 'complete')

  const getStatusIcon = (status: GroupMember['profileStatus']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'expired':
        return <AlertCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusLabel = (status: GroupMember['profileStatus']) => {
    switch (status) {
      case 'complete':
        return 'Profile Complete'
      case 'in_progress':
        return 'In Progress'
      case 'pending':
        return 'Not Started'
      case 'expired':
        return 'Expired'
    }
  }

  const handleSendReminder = async (memberId: string) => {
    if (!onSendReminder) return

    // Track analytics
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('group_reminder_sent', {
        groupId,
        memberId,
      })
    }

    await onSendReminder(memberId)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Group Application Status
        </CardTitle>
        <CardDescription>
          {completedCount} of {totalCount} members have completed their profiles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        {/* Member List */}
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className={cn(
                'rounded-lg border p-4 transition-colors',
                member.profileStatus === 'complete' && 'border-green-200 bg-green-50',
                member.profileStatus === 'expired' && 'border-red-200 bg-red-50'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getStatusIcon(member.profileStatus)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{member.name || member.email}</span>
                      {member.isPrimary && (
                        <Badge variant="secondary" className="text-xs">
                          Primary
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {getStatusLabel(member.profileStatus)}
                    </p>
                    {member.lastActivity && (
                      <p className="text-muted-foreground mt-1 text-xs">
                        Last active: {new Date(member.lastActivity).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {member.profileStatus !== 'complete' && (
                    <div className="text-right">
                      <span className="text-sm font-medium">{member.completionPercentage}%</span>
                      <Progress value={member.completionPercentage} className="h-1 w-20" />
                    </div>
                  )}
                </div>
              </div>

              {/* Actions for incomplete members */}
              {member.profileStatus !== 'complete' && !member.isPrimary && (
                <div className="mt-3 flex gap-2 border-t pt-3">
                  {onSendReminder && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendReminder(member.id)}
                    >
                      <RefreshCw className="mr-2 h-3 w-3" />
                      Send Reminder
                    </Button>
                  )}
                  {onRemoveMember && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onRemoveMember(member.id)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit Status */}
        <div
          className={cn(
            'rounded-lg p-4',
            canSubmit ? 'border border-green-200 bg-green-50' : 'bg-muted'
          )}
        >
          {canSubmit ? (
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Ready to submit!</span>
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">
              <p className="font-medium">Waiting for all members to complete</p>
              <p className="mt-1">
                Send reminders to help your roommates finish their profiles faster.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
