'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Shield,
  AlertTriangle,
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  ExternalLink,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  mockComplianceAlerts,
  getComplianceSeverityColor,
  formatDate,
  formatDateTime,
} from '@/lib/mock-data/admin'

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState('all')
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null)

  const pendingCount = mockComplianceAlerts.filter((a) => a.status === 'pending_review').length
  const investigatingCount = mockComplianceAlerts.filter((a) => a.status === 'investigating').length

  const filteredAlerts = mockComplianceAlerts.filter((alert) => {
    if (activeTab === 'all') return true
    return alert.status === activeTab
  })

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'potential_bias':
        return 'Potential Bias'
      case 'fair_housing_violation':
        return 'Fair Housing Violation'
      case 'audit_request':
        return 'Audit Request'
      case 'data_breach':
        return 'Data Breach'
      case 'policy_violation':
        return 'Policy Violation'
      default:
        return type
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'investigating':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'dismissed':
        return 'bg-gray-100 text-gray-600 border-gray-300'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300'
    }
  }

  const handleReview = (alertId: string) => {
    setSelectedAlert(alertId)
    setReviewDialogOpen(true)
  }

  const selectedAlertData = selectedAlert
    ? mockComplianceAlerts.find((a) => a.id === selectedAlert)
    : null

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance Monitoring</h1>
          <p className="text-muted-foreground">
            Monitor and respond to compliance alerts
          </p>
        </div>
        <Link href="/compliance/rules">
          <Button variant="outline" className="border-2">
            <FileText className="mr-2 h-4 w-4" />
            View Rules
          </Button>
        </Link>
      </div>

      {/* Dashboard Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2 border-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Investigation</CardTitle>
            <Eye className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{investigatingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Being reviewed
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border-2 border-foreground">
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="pending_review">Pending</TabsTrigger>
          <TabsTrigger value="investigating">Investigating</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle>Compliance Alerts ({filteredAlerts.length})</CardTitle>
              <CardDescription>
                Review and respond to compliance issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border-2 border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium">
                          {getAlertTypeLabel(alert.type)}
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/users/${alert.userId}`}
                            className="hover:underline"
                          >
                            {alert.userName}
                          </Link>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate">{alert.description}</p>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`border ${getComplianceSeverityColor(alert.severity)}`}
                          >
                            {alert.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`border ${getStatusColor(alert.status)}`}
                          >
                            {alert.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(alert.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="border-2">
                              <DropdownMenuItem onClick={() => handleReview(alert.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Review
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View User
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-green-600">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Resolve
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="mr-2 h-4 w-4" />
                                Dismiss
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      {selectedAlertData && (
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent className="border-2 border-foreground max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Compliance Alert</DialogTitle>
              <DialogDescription>
                {getAlertTypeLabel(selectedAlertData.type)} - {selectedAlertData.userName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Severity</p>
                  <Badge
                    variant="outline"
                    className={`border mt-1 ${getComplianceSeverityColor(selectedAlertData.severity)}`}
                  >
                    {selectedAlertData.severity}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="mt-1">{formatDateTime(selectedAlertData.createdAt)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="mt-1">{selectedAlertData.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  placeholder="Add investigation notes..."
                  className="mt-2 border-2"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setReviewDialogOpen(false)}
                className="border-2"
              >
                Close
              </Button>
              <Button variant="destructive">Dismiss</Button>
              <Button className="border-2 border-foreground">
                Mark Resolved
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
