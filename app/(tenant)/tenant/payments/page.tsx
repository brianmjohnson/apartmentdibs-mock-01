'use client'

import { useState } from 'react'
import { DollarSign, CreditCard, Receipt, Plus, Trash2, ExternalLink, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  mockPayments,
  mockPaymentMethods,
  getPaymentStatusColor,
  formatDate,
  PaymentMethod,
} from '@/lib/mock-data/tenant'

export default function PaymentsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods)
  const [methodToRemove, setMethodToRemove] = useState<string | null>(null)

  // Calculate totals
  const totalPaid = mockPayments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)

  const pendingPayments = mockPayments.filter((p) => p.status === 'pending')
  const nextPayment = pendingPayments[0]

  const defaultMethod = paymentMethods.find((m) => m.isDefault)

  const handleRemoveMethod = (methodId: string) => {
    setPaymentMethods((prev) => prev.filter((m) => m.id !== methodId))
    setMethodToRemove(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
        <p className="text-muted-foreground">Manage your payments and payment methods</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Paid */}
        <Card className="border-foreground border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPaid)}</div>
            <p className="text-muted-foreground mt-1 text-xs">Lifetime payments</p>
          </CardContent>
        </Card>

        {/* Next Payment */}
        <Card className="border-foreground border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            {nextPayment ? (
              <>
                <div className="text-2xl font-bold">{formatCurrency(nextPayment.amount)}</div>
                <p className="text-muted-foreground mt-1 text-xs">{nextPayment.description}</p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">--</div>
                <p className="text-muted-foreground mt-1 text-xs">No pending payments</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="border-foreground border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Method</CardTitle>
            <CreditCard className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            {defaultMethod ? (
              <>
                <div className="text-2xl font-bold">
                  {defaultMethod.brand} ****{defaultMethod.last4}
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  Expires {defaultMethod.expiryMonth}/{defaultMethod.expiryYear}
                </p>
              </>
            ) : (
              <>
                <div className="text-muted-foreground text-lg font-medium">Not set</div>
                <p className="text-muted-foreground mt-1 text-xs">Add a payment method</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment History Table */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>View all your past and pending payments</CardDescription>
        </CardHeader>
        <CardContent>
          {mockPayments.length === 0 ? (
            <div className="py-8 text-center">
              <Receipt className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground">No payments yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-foreground border-b-2">
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPayments.map((payment) => (
                  <TableRow key={payment.id} className="border-border border-b">
                    <TableCell className="font-medium">{formatDate(payment.date)}</TableCell>
                    <TableCell>{payment.description}</TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>
                      <Badge className={`${getPaymentStatusColor(payment.status)} border`}>
                        {getStatusLabel(payment.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.status === 'paid' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">View receipt</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your saved payment methods</CardDescription>
            </div>
            <Button className="border-foreground border-2">
              <Plus className="mr-2 h-4 w-4" />
              Add Method
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="py-8 text-center">
              <CreditCard className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground mb-4">No payment methods saved</p>
              <Button className="border-foreground border-2">
                <Plus className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="border-border flex items-center justify-between rounded-lg border-2 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-muted rounded-lg p-2">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {method.brand} ending in {method.last4}
                        </span>
                        {method.isDefault && (
                          <Badge variant="outline" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </div>
                  </div>

                  <Dialog
                    open={methodToRemove === method.id}
                    onOpenChange={(open) => !open && setMethodToRemove(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMethodToRemove(method.id)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="border-foreground border-2">
                      <DialogHeader>
                        <DialogTitle>Remove Payment Method</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to remove the {method.brand} card ending in{' '}
                          {method.last4}?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setMethodToRemove(null)}
                          className="border-foreground border-2"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleRemoveMethod(method.id)}
                          className="border-foreground border-2 bg-red-600 hover:bg-red-700"
                        >
                          Remove
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
