'use client'

import { CheckCircle, Circle, Clock, Trophy } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface ChecklistStep {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'complete' | 'skipped'
  estimatedMinutes?: number
}

interface ChecklistProgressProps {
  steps: ChecklistStep[]
  currentStepId?: string
  className?: string
}

export function ChecklistProgress({
  steps,
  currentStepId,
  className,
}: ChecklistProgressProps) {
  const completedSteps = steps.filter(
    (s) => s.status === 'complete' || s.status === 'skipped'
  ).length
  const totalSteps = steps.length
  const progressPercentage = (completedSteps / totalSteps) * 100

  // Calculate remaining time
  const remainingMinutes = steps
    .filter((s) => s.status !== 'complete' && s.status !== 'skipped')
    .reduce((sum, s) => sum + (s.estimatedMinutes || 0), 0)

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const getStepIcon = (step: ChecklistStep) => {
    if (step.status === 'complete') {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }
    if (step.status === 'skipped') {
      return <CheckCircle className="h-5 w-5 text-gray-400" />
    }
    if (step.id === currentStepId || step.status === 'in_progress') {
      return (
        <div className="h-5 w-5 rounded-full border-2 border-primary bg-primary/20" />
      )
    }
    return <Circle className="h-5 w-5 text-gray-300" />
  }

  const isComplete = progressPercentage === 100

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isComplete ? (
            <Trophy className="h-5 w-5 text-yellow-500" />
          ) : (
            <Clock className="h-5 w-5" />
          )}
          Your Checklist
        </CardTitle>
        <CardDescription>
          {isComplete
            ? 'All steps completed!'
            : `${completedSteps} of ${totalSteps} steps complete`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Summary */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          {remainingMinutes > 0 && (
            <p className="text-sm text-muted-foreground">
              Estimated time remaining: {formatTime(remainingMinutes)}
            </p>
          )}
        </div>

        {/* Milestone Messages */}
        {progressPercentage >= 75 && progressPercentage < 100 && (
          <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
            Almost there! Just a few more steps to complete your profile.
          </div>
        )}
        {progressPercentage >= 50 && progressPercentage < 75 && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            Great progress! You&apos;re halfway done.
          </div>
        )}

        {/* Step List */}
        <div className="relative space-y-0">
          {steps.map((step, index) => (
            <div key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'absolute left-[9px] top-6 w-0.5 h-full',
                    step.status === 'complete' || step.status === 'skipped'
                      ? 'bg-green-200'
                      : 'bg-gray-200'
                  )}
                />
              )}

              {/* Icon */}
              <div className="relative z-10 flex-shrink-0">{getStepIcon(step)}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div
                  className={cn(
                    'font-medium text-sm',
                    step.status === 'complete' && 'text-green-600',
                    step.status === 'skipped' && 'text-gray-400 line-through',
                    (step.id === currentStepId || step.status === 'in_progress') &&
                      'text-primary'
                  )}
                >
                  {step.title}
                </div>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                )}
                {step.estimatedMinutes &&
                  step.status !== 'complete' &&
                  step.status !== 'skipped' && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ~{step.estimatedMinutes} min
                    </p>
                  )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
