'use client'

import { useState } from 'react'
import { UserPlus, Mail, Phone, Loader2, CheckCircle, Clock, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface Invitation {
  id: string
  email?: string
  phone?: string
  status: 'pending' | 'sent' | 'accepted' | 'declined'
  sentAt?: Date
}

interface GroupInviteProps {
  groupId: string
  maxMembers?: number
  existingInvitations?: Invitation[]
  onInvite: (method: 'email' | 'phone', value: string) => Promise<void>
  onResend?: (invitationId: string) => Promise<void>
  onCancel?: (invitationId: string) => Promise<void>
  className?: string
}

export function GroupInvite({
  groupId,
  maxMembers = 4,
  existingInvitations = [],
  onInvite,
  onResend,
  onCancel,
  className,
}: GroupInviteProps) {
  const [inviteMethod, setInviteMethod] = useState<'email' | 'phone'>('email')
  const [inviteValue, setInviteValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canAddMore = existingInvitations.length < maxMembers - 1

  const handleInvite = async () => {
    if (!inviteValue.trim()) {
      setError(inviteMethod === 'email' ? 'Email is required' : 'Phone number is required')
      return
    }

    // Basic validation
    if (inviteMethod === 'email' && !inviteValue.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Track analytics
      if (typeof window !== 'undefined' && window.posthog) {
        window.posthog.capture('group_member_invited', {
          groupId,
          method: inviteMethod,
        })
      }

      await onInvite(inviteMethod, inviteValue)
      setInviteValue('')
    } catch (err) {
      setError('Failed to send invitation. Please try again.')
      console.error('Invitation failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: Invitation['status']) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case 'sent':
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <Mail className="mr-1 h-3 w-3" />
            Sent
          </Badge>
        )
      case 'accepted':
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            Accepted
          </Badge>
        )
      case 'declined':
        return (
          <Badge variant="destructive">
            <X className="mr-1 h-3 w-3" />
            Declined
          </Badge>
        )
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Invite Roommates
        </CardTitle>
        <CardDescription>
          Add up to {maxMembers - 1} co-applicants to your group application.
          They&apos;ll receive an invitation to join and complete their profile.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Invitations */}
        {existingInvitations.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Invited Members</Label>
            <div className="space-y-2">
              {existingInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    {invitation.email ? (
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm">
                      {invitation.email || invitation.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(invitation.status)}
                    {invitation.status === 'sent' && onResend && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onResend(invitation.id)}
                      >
                        Resend
                      </Button>
                    )}
                    {(invitation.status === 'pending' || invitation.status === 'sent') &&
                      onCancel && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onCancel(invitation.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Invitation */}
        {canAddMore ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-method">Invite via</Label>
              <Select
                value={inviteMethod}
                onValueChange={(value) => setInviteMethod(value as 'email' | 'phone')}
              >
                <SelectTrigger id="invite-method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                  </SelectItem>
                  <SelectItem value="phone">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone (SMS)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invite-value">
                {inviteMethod === 'email' ? 'Email Address' : 'Phone Number'}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="invite-value"
                  type={inviteMethod === 'email' ? 'email' : 'tel'}
                  placeholder={
                    inviteMethod === 'email'
                      ? 'roommate@email.com'
                      : '(555) 123-4567'
                  }
                  value={inviteValue}
                  onChange={(e) => setInviteValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleInvite()
                    }
                  }}
                />
                <Button onClick={handleInvite} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Maximum number of co-applicants reached ({maxMembers - 1})
            </p>
          </div>
        )}

        {/* Pricing Info */}
        <div className="rounded-lg bg-primary/10 p-4">
          <p className="text-sm font-medium">Group Pricing: $99.99</p>
          <p className="text-xs text-muted-foreground mt-1">
            Includes screening for all {maxMembers} applicants.
            Save over 50% compared to individual applications.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
