'use client'

import { ShieldAlert, Lock } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface FilterBlockedNoticeProps {
  jurisdiction: string
  filterType: string
  reason: string
  className?: string
}

export function FilterBlockedNotice({
  jurisdiction,
  filterType,
  reason,
  className,
}: FilterBlockedNoticeProps) {
  // Track override attempt
  const trackOverrideAttempt = () => {
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('compliance_override_attempted', {
        jurisdiction,
        filterType,
        blocked: true,
      })
    }
  }

  return (
    <Alert
      variant="destructive"
      className={`border-2 ${className || ''}`}
      onClick={trackOverrideAttempt}
    >
      <ShieldAlert className="h-5 w-5" />
      <AlertTitle className="flex items-center gap-2">
        <Lock className="h-4 w-4" />
        Filter Blocked
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2">
          You cannot override this rule due to legal requirements in <strong>{jurisdiction}</strong>
          .
        </p>
        <p className="text-sm opacity-90">{reason}</p>
        <p className="mt-3 text-xs opacity-75">
          This override attempt has been logged for compliance records.
        </p>
      </AlertDescription>
    </Alert>
  )
}
