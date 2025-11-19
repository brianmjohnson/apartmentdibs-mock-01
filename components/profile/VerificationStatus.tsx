'use client'

import { CheckCircle, Clock, XCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type VerificationState = 'pending' | 'in_progress' | 'verified' | 'failed' | 'expired'

interface VerificationItem {
  id: string
  name: string
  description: string
  status: VerificationState
  verifiedAt?: string
  expiresAt?: string
  errorMessage?: string
  onRetry?: () => void
}

interface VerificationStatusProps {
  items: VerificationItem[]
  className?: string
}

const statusConfig: Record<VerificationState, { icon: React.ReactNode; color: string; label: string }> = {
  pending: {
    icon: <Clock className="h-4 w-4" />,
    color: 'text-muted-foreground',
    label: 'Not Started',
  },
  in_progress: {
    icon: <RefreshCw className="h-4 w-4 animate-spin" />,
    color: 'text-blue-600',
    label: 'In Progress',
  },
  verified: {
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'text-green-600',
    label: 'Verified',
  },
  failed: {
    icon: <XCircle className="h-4 w-4" />,
    color: 'text-destructive',
    label: 'Failed',
  },
  expired: {
    icon: <AlertCircle className="h-4 w-4" />,
    color: 'text-yellow-600',
    label: 'Expired',
  },
}

export function VerificationStatus({ items, className }: VerificationStatusProps) {
  const completedCount = items.filter((item) => item.status === 'verified').length
  const totalCount = items.length

  return (
    <Card className={`border-2 border-foreground ${className || ''}`}>
      <CardHeader>
        <CardTitle className="text-lg">Verification Status</CardTitle>
        <CardDescription>
          {completedCount} of {totalCount} verifications complete
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {items.map((item) => {
            const config = statusConfig[item.status]

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-md border border-border"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{item.name}</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{item.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {item.verifiedAt && item.status === 'verified' && (
                    <p className="text-xs text-muted-foreground">
                      Verified: {item.verifiedAt}
                    </p>
                  )}
                  {item.expiresAt && item.status === 'verified' && (
                    <p className="text-xs text-muted-foreground">
                      Expires: {item.expiresAt}
                    </p>
                  )}
                  {item.errorMessage && (
                    <p className="text-xs text-destructive">{item.errorMessage}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {(item.status === 'failed' || item.status === 'expired') && item.onRetry && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border border-foreground"
                      onClick={item.onRetry}
                    >
                      Retry
                    </Button>
                  )}
                  <div className={`flex items-center gap-1 ${config.color}`}>
                    {config.icon}
                    <span className="text-sm font-medium">{config.label}</span>
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
