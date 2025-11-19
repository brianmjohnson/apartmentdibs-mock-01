'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, Mail, Phone, Calendar, DollarSign, RefreshCw, XCircle, Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  getLeaseById,
  getPaymentsByLease,
  formatCurrency,
  formatDate,
  getLeaseStatusColor,
  getRentPaymentStatusColor
} from '@/lib/mock-data/landlord'

export default function LeaseDetailPage({ params }: { params: Promise<{ leaseId: string }> }) {
  const { leaseId } = use(params)
  const lease = getLeaseById(leaseId)
  const payments = getPaymentsByLease(leaseId)

  if (!lease) {
    return (
      <div className="space-y-6">
        <Link href="/leases">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Leases
          </Button>
        </Link>
        <Card className="border-2 border-foreground">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Lease not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/leases">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Leases
        </Button>
      </Link>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Lease Details</h1>
            <Badge
              variant="outline"
              className={`border ${getLeaseStatusColor(lease.status)}`}
            >
              {lease.status === 'expiring_soon' ? 'Expiring Soon' :
               lease.status.charAt(0).toUpperCase() + lease.status.slice(1)}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {lease.propertyAddress}, Unit {lease.unitNumber}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/leases/${lease.id}/renew`}>
            <Button className="border-2 border-foreground">
              <RefreshCw className="h-4 w-4 mr-2" />
              Send Renewal
            </Button>
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-2 text-red-600 hover:text-red-700">
                <XCircle className="h-4 w-4 mr-2" />
                Terminate Lease
              </Button>
            </DialogTrigger>
            <DialogContent className="border-2 border-foreground">
              <DialogHeader>
                <DialogTitle>Terminate Lease</DialogTitle>
                <DialogDescription>
                  Are you sure you want to terminate this lease? This action will notify the tenant
                  and begin the termination process.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm">
                  <strong>Tenant:</strong> {lease.tenantName}
                </p>
                <p className="text-sm">
                  <strong>Property:</strong> {lease.propertyAddress}, Unit {lease.unitNumber}
                </p>
                <p className="text-sm">
                  <strong>Current Rent:</strong> {formatCurrency(lease.monthlyRent)}/mo
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" className="border-2">Cancel</Button>
                <Button variant="destructive" className="border-2 border-red-700">
                  Confirm Termination
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lease Information */}
        <Card className="border-2 border-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Lease Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">{formatDate(lease.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="font-medium">{formatDate(lease.endDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Rent</p>
                <p className="font-medium">{formatCurrency(lease.monthlyRent)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Security Deposit</p>
                <p className="font-medium">{formatCurrency(lease.securityDeposit)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tenant Information */}
        <Card className="border-2 border-foreground">
          <CardHeader>
            <CardTitle>Tenant Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium text-lg">{lease.tenantName}</p>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${lease.tenantEmail}`} className="hover:underline">
                  {lease.tenantEmail}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${lease.tenantPhone}`} className="hover:underline">
                  {lease.tenantPhone}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
          </CardTitle>
          <CardDescription>Lease agreement and related documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lease.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border-2 border-border"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)} - Uploaded {formatDate(doc.uploadedAt)}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-2">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment History
          </CardTitle>
          <CardDescription>Monthly rent payments for this lease</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No payments recorded yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Paid Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{formatDate(payment.dueDate)}</TableCell>
                    <TableCell>
                      {payment.date ? formatDate(payment.date) : '-'}
                    </TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`border ${getRentPaymentStatusColor(payment.status)}`}
                      >
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.paymentMethod || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
