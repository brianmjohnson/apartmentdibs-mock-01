'use client'

import { AlertTriangle, ExternalLink, Info } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface ComplianceWarningProps {
  jurisdiction: string
  lawName: string
  lawCitation?: string
  originalValue: string
  adjustedValue: string
  explanation: string
  sourceUrl?: string
  onLearnMore?: () => void
  className?: string
}

export function ComplianceWarning({
  jurisdiction,
  lawName,
  lawCitation,
  originalValue,
  adjustedValue,
  explanation,
  sourceUrl,
  onLearnMore,
  className,
}: ComplianceWarningProps) {
  const handleLearnMore = () => {
    // Track analytics
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('compliance_education_viewed', {
        jurisdiction,
        lawName,
      })
    }

    if (onLearnMore) {
      onLearnMore()
    }
  }

  return (
    <Alert
      variant="default"
      className={`border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 ${className || ''}`}
    >
      <AlertTriangle className="h-5 w-5 text-yellow-600" />
      <AlertTitle className="font-bold text-yellow-800 dark:text-yellow-200">
        Filter Adjusted for Compliance
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p className="text-yellow-900 dark:text-yellow-100">
          <strong>{lawName}</strong>
          {lawCitation && <span className="ml-1 text-sm">({lawCitation})</span>} restricts this
          screening criteria in {jurisdiction}.
        </p>

        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded border border-red-200 bg-red-100 p-2 dark:border-red-900 dark:bg-red-950/30">
            <p className="text-xs font-medium text-red-800 uppercase dark:text-red-200">
              Your Filter
            </p>
            <p className="text-sm text-red-900 line-through dark:text-red-100">{originalValue}</p>
          </div>
          <div className="rounded border border-green-200 bg-green-100 p-2 dark:border-green-900 dark:bg-green-950/30">
            <p className="text-xs font-medium text-green-800 uppercase dark:text-green-200">
              Adjusted To
            </p>
            <p className="text-sm text-green-900 dark:text-green-100">{adjustedValue}</p>
          </div>
        </div>

        <p className="text-sm text-yellow-800 dark:text-yellow-200">{explanation}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-yellow-600 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-400 dark:text-yellow-200 dark:hover:bg-yellow-950/50"
            onClick={handleLearnMore}
          >
            <Info className="mr-1 h-4 w-4" />
            Why was my filter blocked?
          </Button>
          {sourceUrl && (
            <Button
              variant="outline"
              size="sm"
              className="border-yellow-600 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-400 dark:text-yellow-200 dark:hover:bg-yellow-950/50"
              asChild
            >
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-4 w-4" />
                View Official Law
              </a>
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}
