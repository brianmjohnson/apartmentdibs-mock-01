'use client'

import { Info, ArrowRight } from 'lucide-react'

interface CriteriaAdjustmentBannerProps {
  originalCriteria: string
  adjustedCriteria: string
  lawName: string
  className?: string
}

export function CriteriaAdjustmentBanner({
  originalCriteria,
  adjustedCriteria,
  lawName,
  className,
}: CriteriaAdjustmentBannerProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/20 ${className || ''}`}
    >
      <Info className="h-5 w-5 shrink-0 text-blue-600" />
      <div className="flex-1 text-sm">
        <span className="text-muted-foreground">Your criteria</span>
        <span className="mx-2 text-blue-600 line-through">{originalCriteria}</span>
        <ArrowRight className="inline h-4 w-4 text-blue-600" />
        <span className="mx-2 font-medium text-blue-800 dark:text-blue-200">
          {adjustedCriteria}
        </span>
        <span className="text-muted-foreground">per {lawName}</span>
      </div>
    </div>
  )
}
