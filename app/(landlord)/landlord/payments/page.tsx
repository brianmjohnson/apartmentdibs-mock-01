'use client'

import { useState } from 'react'
import { DollarSign, TrendingUp, Clock, CalendarDays, Receipt, Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  mockRentPayments,
  mockProperties,
  formatCurrency,
  formatDate,
  getRentPaymentStatusColor,
} from '@/lib/mock-data/landlord'

type PaymentStatus = 'all' | 'paid' | 'pending' | 'late' | 'failed'

function KPICard({
  title,
  value,
  subtext,
  icon: Icon,
}: {
  title: string
  value: string | number
  subtext?: string
  icon: React.ElementType
}) {
  return (
    <Card className="border-foreground border-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground h-5 w-5" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {subtext && <p className="text-muted-foreground mt-1 text-sm">{subtext}</p>}
      </CardContent>
    </Card>
  )
}

export default function PaymentsPage() {
  const [statusFilter, setStatusFilter] = useState<PaymentStatus>('all')
  const [propertyFilter, setPropertyFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // Filter payments
  const filteredPayments = mockRentPayments.filter((payment) => {
    if (statusFilter !== 'all' && payment.status !== statusFilter) return false
    if (propertyFilter !== 'all' && payment.propertyId !== propertyFilter) return false
    if (dateFrom && payment.dueDate < dateFrom) return false
    if (dateTo && payment.dueDate > dateTo) return false
    return true
  })

  // Calculate summary stats
  const paidPayments = mockRentPayments.filter((p) => p.status === 'paid')
  const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0)

  // This month's revenue (November 2025)
  const thisMonthPayments = paidPayments.filter((p) => p.dueDate.startsWith('2025-11'))
  const thisMonthRevenue = thisMonthPayments.reduce((sum, p) => sum + p.amount, 0)

  // Outstanding balance
  const outstandingPayments = mockRentPayments.filter(
    (p) => p.status === 'pending' || p.status === 'late' || p.status === 'failed'
  )
  const outstandingBalance = outstandingPayments.reduce((sum, p) => sum + p.amount, 0)

  // Next expected (December payments)
  const pendingPayments = mockRentPayments.filter((p) => p.status === 'pending')
  const nextExpected = pendingPayments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          Track rent payments and revenue across your properties
        </p>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Revenue (YTD)"
          value={formatCurrency(totalRevenue)}
          subtext={`${paidPayments.length} payments received`}
          icon={DollarSign}
        />
        <KPICard
          title="This Month"
          value={formatCurrency(thisMonthRevenue)}
          subtext="November 2025"
          icon={TrendingUp}
        />
        <KPICard
          title="Outstanding Balance"
          value={formatCurrency(outstandingBalance)}
          subtext={`${outstandingPayments.length} pending payments`}
          icon={Clock}
        />
        <KPICard
          title="Next Expected"
          value={formatCurrency(nextExpected)}
          subtext="December 2025"
          icon={CalendarDays}
        />
      </div>

      {/* Filters */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as PaymentStatus)}
              >
                <SelectTrigger className="border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Property</Label>
              <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                <SelectTrigger className="border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  {mockProperties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.address.split(',')[0]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>From Date</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border-2"
              />
            </div>
            <div className="space-y-2">
              <Label>To Date</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History Table */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
            <Button variant="outline" className="border-2">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <div className="py-8 text-center">
              <DollarSign className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground">No payments found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Property/Unit</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{formatDate(payment.dueDate)}</p>
                        {payment.date && payment.date !== payment.dueDate && (
                          <p className="text-muted-foreground text-xs">
                            Paid: {formatDate(payment.date)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {payment.propertyAddress}, {payment.unitNumber}
                    </TableCell>
                    <TableCell>{payment.tenantName}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`border ${getRentPaymentStatusColor(payment.status)}`}
                      >
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {payment.transactionId ? (
                        <Button variant="ghost" size="sm">
                          <Receipt className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
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
