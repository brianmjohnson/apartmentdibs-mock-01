'use client'

import { useState } from 'react'
import { CheckCircle, Mail, ArrowRight, X, Clock, FileText, Phone } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/mock-data/landlord'

interface PiiRevealNoticeProps {
  applicantName: string
  applicantId: string
  revealedAt: string
  onDismiss?: () => void
  onContactApplicant?: () => void
  onCreateLease?: () => void
  className?: string
}

export function PiiRevealNotice({
  applicantName,
  applicantId,
  revealedAt,
  onDismiss,
  onContactApplicant,
  onCreateLease,
  className = '',
}: PiiRevealNoticeProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) return null

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  return (
    <Card
      className={`border-2 border-green-300 bg-green-50 dark:bg-green-900/20 ${className}`}
      role="alert"
      aria-label="PII Revealed notification"
    >
      <CardContent className="py-4">
        <div className="flex items-start gap-4">
          {/* Success Icon */}
          <div className="shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-green-800 dark:text-green-200">
              Applicant Selected - PII Unlocked
            </h3>
            <p className="mt-1 text-sm text-green-700 dark:text-green-300">
              You&apos;ve selected <strong>{applicantName}</strong> ({applicantId}). Their full
              profile information is now visible.
            </p>

            {/* Timestamp */}
            <div className="mt-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <Clock className="h-3 w-3" />
              <span>Revealed {formatDate(revealedAt)}</span>
            </div>

            {/* Email Notification Info */}
            <div className="mt-3 flex items-center gap-2 rounded bg-green-100 p-2 text-xs text-green-700 dark:bg-green-800/50 dark:text-green-300">
              <Mail className="h-4 w-4 shrink-0" />
              <span>Email notification sent to {applicantName} with next steps</span>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                size="sm"
                className="border-2 border-green-600 bg-green-600 text-white hover:bg-green-700"
                onClick={onContactApplicant}
              >
                <Phone className="mr-1 h-3 w-3" />
                Contact Applicant
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-2 border-green-600 text-green-700 hover:bg-green-100"
                onClick={onCreateLease}
              >
                <FileText className="mr-1 h-3 w-3" />
                Create Lease
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Dismiss Button */}
          {onDismiss && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 text-green-600 hover:bg-green-100 hover:text-green-800"
              onClick={handleDismiss}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Compact banner version
export function PiiRevealBanner({
  applicantName,
  applicantId,
  className = '',
}: {
  applicantName: string
  applicantId: string
  className?: string
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-md border border-green-300 bg-green-100 px-4 py-2 text-sm text-green-800 dark:bg-green-900/50 dark:text-green-200 ${className}`}
      role="status"
    >
      <CheckCircle className="h-4 w-4 shrink-0" />
      <span>
        <strong>{applicantName}</strong> ({applicantId}) - Full profile now visible
      </span>
    </div>
  )
}
