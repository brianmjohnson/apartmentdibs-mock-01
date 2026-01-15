'use client'

import { CheckCircle, AlertTriangle, XCircle, Clock, Wrench } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

type IncidentStatus = 'investigating' | 'identified' | 'monitoring' | 'resolved'
type IncidentSeverity = 'minor' | 'major' | 'critical'

interface IncidentUpdate {
  timestamp: Date
  status: IncidentStatus
  message: string
}

interface Incident {
  id: string
  title: string
  status: IncidentStatus
  severity: IncidentSeverity
  createdAt: Date
  resolvedAt?: Date
  updates: IncidentUpdate[]
  affectedComponents: string[]
}

interface IncidentListProps {
  incidents: Incident[]
  showResolved?: boolean
  maxItems?: number
  className?: string
}

export function IncidentList({
  incidents,
  showResolved = true,
  maxItems = 10,
  className,
}: IncidentListProps) {
  const filteredIncidents = showResolved
    ? incidents
    : incidents.filter((i) => i.status !== 'resolved')

  const displayIncidents = filteredIncidents.slice(0, maxItems)

  const getStatusIcon = (status: IncidentStatus) => {
    switch (status) {
      case 'investigating':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'identified':
        return <Wrench className="h-4 w-4 text-orange-600" />
      case 'monitoring':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
    }
  }

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'investigating':
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
          >
            Investigating
          </Badge>
        )
      case 'identified':
        return (
          <Badge
            variant="secondary"
            className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
          >
            Identified
          </Badge>
        )
      case 'monitoring':
        return (
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          >
            Monitoring
          </Badge>
        )
      case 'resolved':
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
          >
            Resolved
          </Badge>
        )
    }
  }

  const getSeverityBadge = (severity: IncidentSeverity) => {
    switch (severity) {
      case 'minor':
        return <Badge variant="secondary">Minor</Badge>
      case 'major':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Major
          </Badge>
        )
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(date)
  }

  const formatDuration = (start: Date, end?: Date) => {
    const endTime = end || new Date()
    const diff = endTime.getTime() - start.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Incident History</CardTitle>
        <CardDescription>Past and ongoing incidents affecting our services</CardDescription>
      </CardHeader>
      <CardContent>
        {displayIncidents.length === 0 ? (
          <div className="py-8 text-center">
            <CheckCircle className="mx-auto mb-3 h-8 w-8 text-green-600" />
            <p className="font-medium">No incidents to report</p>
            <p className="text-muted-foreground mt-1 text-sm">All systems are operating normally</p>
          </div>
        ) : (
          <div className="space-y-6">
            {displayIncidents.map((incident, index) => (
              <div key={incident.id}>
                {index > 0 && <Separator className="mb-6" />}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(incident.status)}
                        <h4 className="font-medium">{incident.title}</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {getStatusBadge(incident.status)}
                        {getSeverityBadge(incident.severity)}
                      </div>
                    </div>
                    <div className="text-muted-foreground text-right text-sm">
                      <p>{formatDate(incident.createdAt)}</p>
                      <p>Duration: {formatDuration(incident.createdAt, incident.resolvedAt)}</p>
                    </div>
                  </div>

                  {incident.affectedComponents.length > 0 && (
                    <div className="text-muted-foreground text-sm">
                      Affected: {incident.affectedComponents.join(', ')}
                    </div>
                  )}

                  <div className="border-muted space-y-3 border-l-2 pl-4">
                    {incident.updates.map((update, updateIndex) => (
                      <div key={updateIndex} className="text-sm">
                        <div className="text-muted-foreground flex items-center gap-2">
                          <span className="font-medium capitalize">{update.status}</span>
                          <span>-</span>
                          <span>{formatTime(update.timestamp)}</span>
                        </div>
                        <p className="mt-1">{update.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
