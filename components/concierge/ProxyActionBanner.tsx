'use client'

import { UserCog, Info, Clock } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ProxyAction {
  id: string
  actionType: string
  description: string
  performedBy: string
  performedAt: Date
}

interface ProxyActionBannerProps {
  action: ProxyAction
  variant?: 'inline' | 'prominent'
  className?: string
}

export function ProxyActionBanner({
  action,
  variant = 'inline',
  className,
}: ProxyActionBannerProps) {
  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  if (variant === 'prominent') {
    return (
      <Alert className={cn('border-blue-200 bg-blue-50', className)}>
        <UserCog className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-700">Action by Support</AlertTitle>
        <AlertDescription className="text-blue-600">
          <p>{action.description}</p>
          <div className="flex items-center gap-4 mt-2 text-xs">
            <span>Performed by: {action.performedBy}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTimestamp(action.performedAt)}
            </span>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm text-muted-foreground',
        className
      )}
    >
      <Badge variant="outline" className="text-xs font-normal">
        <UserCog className="h-3 w-3 mr-1" />
        Support Action
      </Badge>
      <span>by {action.performedBy}</span>
      <span>-</span>
      <span>{formatTimestamp(action.performedAt)}</span>
    </div>
  )
}

// Component to show at top of pages when in proxy mode
export function ProxyModeBanner({
  repName,
  landlordName,
  onExit,
}: {
  repName: string
  landlordName: string
  onExit?: () => void
}) {
  return (
    <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCog className="h-4 w-4 text-yellow-700" />
          <span className="text-sm font-medium text-yellow-700">
            Proxy Mode Active
          </span>
          <span className="text-sm text-yellow-600">
            {repName} acting on behalf of {landlordName}
          </span>
        </div>
        {onExit && (
          <button
            onClick={onExit}
            className="text-sm text-yellow-700 hover:text-yellow-800 font-medium"
          >
            Exit Proxy Mode
          </button>
        )}
      </div>
    </div>
  )
}

// List of proxy actions for audit display
export function ProxyActionList({
  actions,
  className,
}: {
  actions: ProxyAction[]
  className?: string
}) {
  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  if (actions.length === 0) return null

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="font-medium text-sm flex items-center gap-2">
        <Info className="h-4 w-4" />
        Actions Performed by Support
      </h3>
      <div className="space-y-2">
        {actions.map((action) => (
          <div
            key={action.id}
            className="rounded-lg border border-blue-200 bg-blue-50/50 p-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-sm">{action.actionType}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {action.description}
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {action.performedBy}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTimestamp(action.performedAt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
