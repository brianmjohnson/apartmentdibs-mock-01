'use client'

import { useState } from 'react'
import {
  CheckCircle,
  ChevronRight,
  HelpCircle,
  Upload,
  Link as LinkIcon,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type StepAction = 'upload' | 'connect' | 'form' | 'verify'

interface AdaptiveStepProps {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'complete' | 'skipped'
  actionType: StepAction
  isRequired: boolean
  estimatedMinutes?: number
  helpText?: string
  onComplete: (stepId: string) => Promise<void>
  onSkip?: (stepId: string) => Promise<void>
  onHelp?: (stepId: string) => void
  className?: string
}

export function AdaptiveStep({
  id,
  title,
  description,
  status,
  actionType,
  isRequired,
  estimatedMinutes,
  helpText,
  onComplete,
  onSkip,
  onHelp,
  className,
}: AdaptiveStepProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async () => {
    setIsLoading(true)
    try {
      // Track analytics
      if (typeof window !== 'undefined' && window.posthog) {
        window.posthog.capture('step_started', {
          stepId: id,
          actionType,
        })
      }

      await onComplete(id)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = async () => {
    if (!onSkip) return
    setIsLoading(true)
    try {
      await onSkip(id)
    } finally {
      setIsLoading(false)
    }
  }

  const getActionIcon = () => {
    switch (actionType) {
      case 'upload':
        return <Upload className="h-4 w-4" />
      case 'connect':
        return <LinkIcon className="h-4 w-4" />
      case 'form':
        return <ChevronRight className="h-4 w-4" />
      case 'verify':
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getActionLabel = () => {
    switch (actionType) {
      case 'upload':
        return 'Upload Document'
      case 'connect':
        return 'Connect Account'
      case 'form':
        return 'Fill Out Form'
      case 'verify':
        return 'Verify'
    }
  }

  if (status === 'complete') {
    return (
      <Card className={cn('border-green-200 bg-green-50/50', className)}>
        <CardContent className="flex items-center gap-4 py-4">
          <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-500" />
          <div className="flex-1">
            <p className="font-medium text-green-700">{title}</p>
            <p className="text-sm text-green-600">Completed</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === 'skipped') {
    return (
      <Card className={cn('border-gray-200 bg-gray-50/50 opacity-60', className)}>
        <CardContent className="flex items-center gap-4 py-4">
          <CheckCircle className="h-6 w-6 flex-shrink-0 text-gray-400" />
          <div className="flex-1">
            <p className="font-medium text-gray-500 line-through">{title}</p>
            <p className="text-sm text-gray-400">Skipped - Not applicable</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(status === 'in_progress' && 'border-primary shadow-md', className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              {title}
              {isRequired ? (
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  Optional
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          {onHelp && (
            <Button variant="ghost" size="icon" onClick={() => onHelp(id)} aria-label="Get help">
              <HelpCircle className="h-5 w-5" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {helpText && (
          <div className="bg-muted text-muted-foreground rounded-lg p-3 text-sm">{helpText}</div>
        )}

        <div className="flex items-center justify-between">
          {estimatedMinutes && (
            <span className="text-muted-foreground text-sm">~{estimatedMinutes} min</span>
          )}

          <div className="ml-auto flex gap-2">
            {!isRequired && onSkip && (
              <Button variant="ghost" onClick={handleSkip} disabled={isLoading}>
                Skip
              </Button>
            )}
            <Button onClick={handleAction} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {getActionIcon()}
                  <span className="ml-2">{getActionLabel()}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
