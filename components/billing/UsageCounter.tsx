'use client'

import { AlertTriangle, ArrowUp } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface UsageCounterProps {
  used: number
  limit: number | null
  resourceName: string
  onUpgrade?: () => void
  showUpgradePrompt?: boolean
  className?: string
}

export function UsageCounter({
  used,
  limit,
  resourceName,
  onUpgrade,
  showUpgradePrompt = true,
  className,
}: UsageCounterProps) {
  if (limit === null) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">{resourceName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{used}</div>
          <p className="text-muted-foreground text-xs">Unlimited</p>
        </CardContent>
      </Card>
    )
  }

  const percentage = (used / limit) * 100
  const isAtLimit = used >= limit
  const isNearLimit = percentage >= 80 && !isAtLimit

  const getStatusColor = () => {
    if (isAtLimit) return 'text-red-600'
    if (isNearLimit) return 'text-yellow-600'
    return 'text-foreground'
  }

  const getProgressColor = () => {
    if (isAtLimit) return 'bg-red-600'
    if (isNearLimit) return 'bg-yellow-600'
    return ''
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{resourceName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className={`text-2xl font-bold ${getStatusColor()}`}>{used}</span>
          <span className="text-muted-foreground text-sm">of {limit}</span>
        </div>

        <Progress value={percentage} className={getProgressColor()} />

        {isAtLimit && showUpgradePrompt && (
          <Alert variant="destructive" className="mt-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Limit Reached</AlertTitle>
            <AlertDescription className="mt-2">
              You have reached your {resourceName.toLowerCase()} limit. Upgrade to continue.
              {onUpgrade && (
                <Button size="sm" className="mt-2 w-full" onClick={onUpgrade}>
                  <ArrowUp className="mr-2 h-4 w-4" />
                  Upgrade Plan
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {isNearLimit && showUpgradePrompt && (
          <Alert className="mt-3 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800 dark:text-yellow-200">
              Approaching Limit
            </AlertTitle>
            <AlertDescription className="mt-2 text-yellow-700 dark:text-yellow-300">
              You are using {percentage.toFixed(0)}% of your {resourceName.toLowerCase()}.
              {onUpgrade && (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 w-full border-yellow-600 text-yellow-800 hover:bg-yellow-100"
                  onClick={onUpgrade}
                >
                  <ArrowUp className="mr-2 h-4 w-4" />
                  Upgrade for Unlimited
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
