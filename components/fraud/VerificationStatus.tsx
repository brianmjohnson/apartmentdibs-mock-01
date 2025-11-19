'use client'

import { CheckCircle, XCircle, AlertTriangle, Clock, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type VerificationItemStatus = 'verified' | 'unverified' | 'flagged' | 'pending'

interface VerificationItem {
  name: string
  status: VerificationItemStatus
  details?: string
}

interface VerificationStatusProps {
  items: VerificationItem[]
  overallScore?: number
  className?: string
}

export function VerificationStatus({
  items,
  overallScore,
  className,
}: VerificationStatusProps) {
  const getStatusIcon = (status: VerificationItemStatus) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'unverified':
        return <XCircle className="h-4 w-4 text-gray-400" />
      case 'flagged':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: VerificationItemStatus) => {
    switch (status) {
      case 'verified':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Verified
          </Badge>
        )
      case 'unverified':
        return (
          <Badge variant="secondary">
            Not Verified
          </Badge>
        )
      case 'flagged':
        return (
          <Badge variant="destructive">
            Flagged
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            Pending
          </Badge>
        )
    }
  }

  const getOverallStatus = () => {
    const hasFlagged = items.some((item) => item.status === 'flagged')
    const hasPending = items.some((item) => item.status === 'pending')
    const allVerified = items.every((item) => item.status === 'verified')

    if (hasFlagged) return 'flagged'
    if (hasPending) return 'pending'
    if (allVerified) return 'verified'
    return 'partial'
  }

  const status = getOverallStatus()

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Verification Status
          </CardTitle>
          {overallScore !== undefined && (
            <Badge
              variant={overallScore >= 80 ? 'secondary' : overallScore >= 60 ? 'outline' : 'destructive'}
              className={overallScore >= 80 ? 'bg-green-100 text-green-800' : ''}
            >
              Score: {overallScore}%
            </Badge>
          )}
        </div>
        <CardDescription>
          {status === 'verified' && 'All documents verified successfully'}
          {status === 'flagged' && 'Some items require manual review'}
          {status === 'pending' && 'Verification in progress'}
          {status === 'partial' && 'Some items not yet verified'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.name}
              className="flex items-start justify-between gap-4 rounded-lg border p-3"
            >
              <div className="flex items-start gap-3">
                {getStatusIcon(item.status)}
                <div>
                  <p className="font-medium">{item.name}</p>
                  {item.details && (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {item.details}
                    </p>
                  )}
                </div>
              </div>
              {getStatusBadge(item.status)}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
