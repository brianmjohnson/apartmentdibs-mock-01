'use client'

import { Clock, AlertTriangle, RefreshCw, CheckCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ValidityStatusProps {
  purchaseDate: Date
  expirationDate: Date
  tierName: string
  onRenew?: () => void
  renewalDiscount?: number
  className?: string
}

export function ValidityStatus({
  purchaseDate,
  expirationDate,
  tierName,
  onRenew,
  renewalDiscount = 15,
  className,
}: ValidityStatusProps) {
  const now = new Date()
  const totalDays = Math.ceil((expirationDate.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24))
  const daysRemaining = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const daysUsed = totalDays - daysRemaining
  const percentageUsed = (daysUsed / totalDays) * 100

  const isExpired = daysRemaining <= 0
  const isExpiringSoon = daysRemaining <= 3 && !isExpired
  const isApproaching = daysRemaining <= 14 && daysRemaining > 3

  const getStatusColor = () => {
    if (isExpired) return 'destructive'
    if (isExpiringSoon) return 'destructive'
    if (isApproaching) return 'default'
    return 'secondary'
  }

  const getStatusText = () => {
    if (isExpired) return 'Expired'
    if (isExpiringSoon) return 'Expiring Soon'
    if (isApproaching) return 'Renew Soon'
    return 'Active'
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" />
            Profile Validity
          </CardTitle>
          <Badge variant={getStatusColor()}>
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">{tierName} Profile</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {isExpired ? 'Expired on' : 'Valid until'} {formatDate(expirationDate)}
          </p>
        </div>

        {!isExpired && (
          <>
            <Progress value={percentageUsed} />
            <p className="text-sm text-muted-foreground">
              {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
            </p>
          </>
        )}

        {isExpired && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Profile Expired</AlertTitle>
            <AlertDescription>
              Your screening profile has expired. Renew now to continue applying to apartments.
            </AlertDescription>
          </Alert>
        )}

        {isExpiringSoon && !isExpired && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Expiring Soon</AlertTitle>
            <AlertDescription>
              Your profile expires in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}. Renew now to avoid interruption.
            </AlertDescription>
          </Alert>
        )}

        {isApproaching && (
          <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800 dark:text-yellow-200">
              Renewal Reminder
            </AlertTitle>
            <AlertDescription className="text-yellow-700 dark:text-yellow-300">
              Your profile expires in {daysRemaining} days. Renew early and save {renewalDiscount}%.
            </AlertDescription>
          </Alert>
        )}

        {(isExpired || isExpiringSoon || isApproaching) && onRenew && (
          <Button className="w-full" onClick={onRenew}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Renew Profile
            {!isExpired && (
              <Badge variant="secondary" className="ml-2">
                Save {renewalDiscount}%
              </Badge>
            )}
          </Button>
        )}

        {!isExpired && !isExpiringSoon && !isApproaching && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            Your profile is active and ready to use
          </div>
        )}
      </CardContent>
    </Card>
  )
}
