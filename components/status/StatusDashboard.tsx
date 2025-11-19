'use client'

import { FileText, Clock, Eye, CheckCircle, XCircle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ApplicationStatus =
  | 'received'
  | 'documents_incomplete'
  | 'under_review'
  | 'shortlisted'
  | 'decision_pending'
  | 'selected'
  | 'denied'

interface Application {
  id: string
  listingId: string
  address: string
  rent: number
  status: ApplicationStatus
  submittedAt: Date
  lastUpdated: Date
  decisionExpectedBy?: Date
  landlordViewCount?: number
}

interface StatusDashboardProps {
  applications: Application[]
  onViewDetails?: (applicationId: string) => void
  onWithdraw?: (applicationId: string) => void
  className?: string
}

const statusConfig: Record<
  ApplicationStatus,
  { label: string; color: string; bgColor: string }
> = {
  received: {
    label: 'Received',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  documents_incomplete: {
    label: 'Documents Incomplete',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
  },
  under_review: {
    label: 'Under Review',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
  },
  shortlisted: {
    label: 'Shortlisted',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100',
  },
  decision_pending: {
    label: 'Decision Pending',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
  },
  selected: {
    label: 'Selected',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
  denied: {
    label: 'Denied',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
  },
}

export function StatusDashboard({
  applications,
  onViewDetails,
  onWithdraw,
  className,
}: StatusDashboardProps) {
  const activeApplications = applications.filter(
    (a) => a.status !== 'selected' && a.status !== 'denied'
  )
  const pastApplications = applications.filter(
    (a) => a.status === 'selected' || a.status === 'denied'
  )

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const renderApplicationCard = (application: Application) => {
    const config = statusConfig[application.status]

    return (
      <Card key={application.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={cn(config.bgColor, config.color, 'font-medium')}>
                  {config.label}
                </Badge>
                {application.landlordViewCount && application.landlordViewCount > 0 && (
                  <span className="flex items-center text-xs text-muted-foreground">
                    <Eye className="h-3 w-3 mr-1" />
                    {application.landlordViewCount}
                  </span>
                )}
              </div>
              <h3 className="font-semibold">{application.address}</h3>
              <p className="text-sm text-muted-foreground">
                ${application.rent.toLocaleString()}/mo
              </p>
            </div>
            <div className="text-right text-sm">
              <p className="text-muted-foreground">
                Applied {formatDate(application.submittedAt)}
              </p>
              {application.decisionExpectedBy && (
                <p className="text-xs text-muted-foreground mt-1">
                  Decision by {formatDate(application.decisionExpectedBy)}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(application.id)}
              >
                View Details
              </Button>
            )}
            {onWithdraw &&
              application.status !== 'selected' &&
              application.status !== 'denied' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onWithdraw(application.id)}
                >
                  Withdraw
                </Button>
              )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
            <p className="text-2xl font-bold">{applications.length}</p>
            <p className="text-xs text-muted-foreground">Total Applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 mx-auto text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{activeApplications.length}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-500 mb-2" />
            <p className="text-2xl font-bold">
              {applications.filter((a) => a.status === 'selected').length}
            </p>
            <p className="text-xs text-muted-foreground">Selected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <XCircle className="h-5 w-5 mx-auto text-gray-400 mb-2" />
            <p className="text-2xl font-bold">
              {applications.filter((a) => a.status === 'denied').length}
            </p>
            <p className="text-xs text-muted-foreground">Denied</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Applications */}
      {activeApplications.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Active Applications</h2>
          <div className="space-y-3">
            {activeApplications.map(renderApplicationCard)}
          </div>
        </div>
      )}

      {/* Past Applications */}
      {pastApplications.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-lg text-muted-foreground">
            Past Applications
          </h2>
          <div className="space-y-3 opacity-75">
            {pastApplications.map(renderApplicationCard)}
          </div>
        </div>
      )}

      {applications.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle className="text-lg">No Applications Yet</CardTitle>
            <CardDescription className="mt-2">
              Start applying to listings to track your applications here
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
