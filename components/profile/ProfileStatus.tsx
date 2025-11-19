'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type ProfileTier = 'basic' | 'premium'

interface ProfileStatusProps {
  completionPercentage: number
  tier: ProfileTier
  validUntil: Date
  isVerified: boolean
  applicationCount: number
  onRenew?: () => void
  className?: string
}

export function ProfileStatus({
  completionPercentage,
  tier,
  validUntil,
  isVerified,
  applicationCount,
  onRenew,
  className,
}: ProfileStatusProps) {
  const [daysRemaining, setDaysRemaining] = useState(0)
  const [isExpired, setIsExpired] = useState(false)
  const [isExpiringSoon, setIsExpiringSoon] = useState(false)

  useEffect(() => {
    const now = new Date()
    const diff = validUntil.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

    setDaysRemaining(days)
    setIsExpired(days <= 0)
    setIsExpiringSoon(days > 0 && days <= 7)
  }, [validUntil])

  const validityDays = tier === 'premium' ? 90 : 60

  return (
    <Card className={`border-2 border-foreground ${className || ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Profile Status</CardTitle>
            <CardDescription>
              {tier === 'premium' ? 'Premium' : 'Basic'} Plan - {validityDays} day validity
            </CardDescription>
          </div>
          <Badge
            variant={isVerified ? 'default' : 'outline'}
            className={isVerified ? 'bg-green-600' : 'border-foreground'}
          >
            {isVerified ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </>
            ) : (
              <>
                <Clock className="h-3 w-3 mr-1" />
                Pending
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Completion Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Profile Completion</span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Validity Status */}
        <div className={`p-3 rounded-md ${
          isExpired
            ? 'bg-destructive/10 border border-destructive/20'
            : isExpiringSoon
            ? 'bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900'
            : 'bg-muted border border-border'
        }`}>
          <div className="flex items-center gap-2">
            {isExpired ? (
              <AlertCircle className="h-4 w-4 text-destructive" />
            ) : isExpiringSoon ? (
              <Clock className="h-4 w-4 text-yellow-600" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
            <span className={`text-sm font-medium ${
              isExpired
                ? 'text-destructive'
                : isExpiringSoon
                ? 'text-yellow-800 dark:text-yellow-200'
                : 'text-foreground'
            }`}>
              {isExpired
                ? 'Profile Expired'
                : isExpiringSoon
                ? `Expiring in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`
                : `Valid for ${daysRemaining} more days`}
            </span>
          </div>
          {(isExpired || isExpiringSoon) && onRenew && (
            <Button
              size="sm"
              variant="outline"
              className="mt-2 w-full border-2 border-foreground"
              onClick={onRenew}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Renew Profile
            </Button>
          )}
        </div>

        {/* Application Count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Applications Submitted</span>
          <span className="font-medium">{applicationCount}</span>
        </div>

        {/* Unlimited Applications Badge */}
        {isVerified && !isExpired && (
          <div className="text-center">
            <Badge variant="outline" className="border-primary text-primary">
              Unlimited applications during validity period
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
