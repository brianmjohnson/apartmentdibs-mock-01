'use client'

import { useState } from 'react'
import { Wrench, AlertTriangle, Mail, Phone, Calendar, CheckCircle, User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  mockMaintenanceRequests,
  MaintenanceRequest,
  formatRelativeTime,
  formatDate,
  getMaintenancePriorityColor,
  getMaintenanceStatusColor,
} from '@/lib/mock-data/landlord'

type MaintenanceFilter = 'all' | 'open' | 'in_progress' | 'completed'

function MaintenanceDetailDialog({ request }: { request: MaintenanceRequest }) {
  const [status, setStatus] = useState(request.status)
  const [notes, setNotes] = useState(request.notes || '')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-2">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="border-foreground max-w-2xl border-2">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle>{request.issue}</DialogTitle>
            <Badge
              variant="outline"
              className={`border ${getMaintenancePriorityColor(request.priority)}`}
            >
              {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
            </Badge>
          </div>
          <DialogDescription>
            {request.propertyAddress}, Unit {request.unitNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Issue Description */}
          <div>
            <h4 className="mb-2 text-sm font-medium">Description</h4>
            <p className="text-muted-foreground bg-muted rounded p-3 text-sm">
              {request.description}
            </p>
          </div>

          {/* Photos */}
          {request.photos && request.photos.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-medium">Photos</h4>
              <div className="flex gap-2">
                {request.photos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="bg-muted border-border flex h-20 w-20 items-center justify-center border-2"
                  >
                    <span className="text-muted-foreground text-xs">Photo {idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tenant Contact */}
          <div>
            <h4 className="mb-2 text-sm font-medium">Tenant Contact</h4>
            <div className="space-y-2">
              <p className="text-sm font-medium">{request.tenantName}</p>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${request.tenantEmail}`} className="hover:underline">
                  {request.tenantEmail}
                </a>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                <a href={`tel:${request.tenantPhone}`} className="hover:underline">
                  {request.tenantPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as MaintenanceRequest['status'])}
            >
              <SelectTrigger className="border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assigned To */}
          {request.assignedTo && (
            <div>
              <h4 className="mb-1 text-sm font-medium">Assigned To</h4>
              <p className="text-muted-foreground text-sm">{request.assignedTo}</p>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this request..."
              className="border-2"
              rows={3}
            />
          </div>

          {/* Timestamps */}
          <div className="text-muted-foreground flex gap-4 text-xs">
            <span>Submitted: {formatDate(request.submittedAt)}</span>
            {request.completedAt && <span>Completed: {formatDate(request.completedAt)}</span>}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" className="border-2">
            Cancel
          </Button>
          <Button className="border-foreground border-2">
            <CheckCircle className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function MaintenancePage() {
  const [filter, setFilter] = useState<MaintenanceFilter>('all')

  const filteredRequests = mockMaintenanceRequests.filter((request) => {
    if (filter === 'all') return true
    return request.status === filter
  })

  const openCount = mockMaintenanceRequests.filter((r) => r.status === 'open').length
  const inProgressCount = mockMaintenanceRequests.filter((r) => r.status === 'in_progress').length
  const completedCount = mockMaintenanceRequests.filter((r) => r.status === 'completed').length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Maintenance Requests</h1>
            {openCount > 0 && (
              <Badge variant="outline" className="border-2 border-yellow-400 text-yellow-700">
                {openCount} Open
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Manage maintenance requests across your properties
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as MaintenanceFilter)}>
        <TabsList className="border-foreground border-2">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-foreground data-[state=active]:text-background"
          >
            All ({mockMaintenanceRequests.length})
          </TabsTrigger>
          <TabsTrigger
            value="open"
            className="data-[state=active]:bg-foreground data-[state=active]:text-background"
          >
            Open ({openCount})
          </TabsTrigger>
          <TabsTrigger
            value="in_progress"
            className="data-[state=active]:bg-foreground data-[state=active]:text-background"
          >
            In Progress ({inProgressCount})
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-foreground data-[state=active]:text-background"
          >
            Completed ({completedCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {filteredRequests.length === 0 ? (
            <Card className="border-foreground border-2">
              <CardContent className="py-12 text-center">
                <Wrench className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground">No maintenance requests found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="border-foreground border-2">
                  <CardContent className="p-4">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium">{request.issue}</p>
                              <Badge
                                variant="outline"
                                className={`border ${getMaintenancePriorityColor(request.priority)}`}
                              >
                                {request.priority.charAt(0).toUpperCase() +
                                  request.priority.slice(1)}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`border ${getMaintenanceStatusColor(request.status)}`}
                              >
                                {request.status === 'in_progress'
                                  ? 'In Progress'
                                  : request.status.charAt(0).toUpperCase() +
                                    request.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mt-1 text-sm">
                              {request.propertyAddress}, Unit {request.unitNumber}
                            </p>
                          </div>
                        </div>
                        <div className="text-muted-foreground flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {request.tenantName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatRelativeTime(request.submittedAt)}
                          </span>
                        </div>
                        {request.assignedTo && (
                          <p className="text-muted-foreground text-xs">
                            Assigned to: {request.assignedTo}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <MaintenanceDetailDialog request={request} />
                        {request.status !== 'completed' && (
                          <Button size="sm" className="border-foreground border-2">
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
