'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, DollarSign, Send, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
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
  getLeaseById,
  formatCurrency,
  formatDate
} from '@/lib/mock-data/landlord'

export default function LeaseRenewalPage({ params }: { params: Promise<{ leaseId: string }> }) {
  const { leaseId } = use(params)
  const lease = getLeaseById(leaseId)

  const [newRent, setNewRent] = useState(lease ? lease.monthlyRent.toString() : '')
  const [leaseLength, setLeaseLength] = useState('12')
  const [startDate, setStartDate] = useState(lease ? lease.endDate : '')

  if (!lease) {
    return (
      <div className="space-y-6">
        <Link href="/landlord/leases">
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

  // Calculate new end date
  const calculateEndDate = () => {
    if (!startDate) return ''
    const start = new Date(startDate)
    start.setMonth(start.getMonth() + parseInt(leaseLength))
    return start.toISOString().split('T')[0]
  }

  const newEndDate = calculateEndDate()
  const rentChange = lease.monthlyRent - parseInt(newRent || '0')
  const rentChangePercent = ((parseInt(newRent || '0') - lease.monthlyRent) / lease.monthlyRent * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href={`/landlord/leases/${lease.id}`}>
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Lease Details
        </Button>
      </Link>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lease Renewal</h1>
        <p className="text-muted-foreground">
          {lease.propertyAddress}, Unit {lease.unitNumber} - {lease.tenantName}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Current Lease Summary */}
        <Card className="border-2 border-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Current Lease
            </CardTitle>
            <CardDescription>Summary of existing lease terms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Rent</p>
                <p className="text-2xl font-bold">{formatCurrency(lease.monthlyRent)}</p>
                <p className="text-xs text-muted-foreground">per month</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current End Date</p>
                <p className="text-2xl font-bold">{formatDate(lease.endDate)}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Lease Start</p>
                <p className="font-medium">{formatDate(lease.startDate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Security Deposit</p>
                <p className="font-medium">{formatCurrency(lease.securityDeposit)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Renewal Terms Form */}
        <Card className="border-2 border-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Renewal Terms
            </CardTitle>
            <CardDescription>Set the terms for the lease renewal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newRent">New Monthly Rent</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newRent"
                  type="number"
                  value={newRent}
                  onChange={(e) => setNewRent(e.target.value)}
                  className="pl-9 border-2"
                  placeholder="Enter new rent amount"
                />
              </div>
              {newRent && parseInt(newRent) !== lease.monthlyRent && (
                <p className={`text-xs ${parseInt(newRent) > lease.monthlyRent ? 'text-green-600' : 'text-red-600'}`}>
                  {parseInt(newRent) > lease.monthlyRent ? '+' : ''}{rentChangePercent}% from current rent
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="leaseLength">Lease Length</Label>
              <Select value={leaseLength} onValueChange={setLeaseLength}>
                <SelectTrigger className="border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                  <SelectItem value="18">18 months</SelectItem>
                  <SelectItem value="24">24 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">New Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Renewal Preview */}
      <Card className="border-2 border-foreground bg-muted/50">
        <CardHeader>
          <CardTitle>Renewal Summary</CardTitle>
          <CardDescription>Preview of the renewal terms to be sent to tenant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">New Monthly Rent</p>
              <p className="text-xl font-bold">
                {newRent ? formatCurrency(parseInt(newRent)) : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lease Length</p>
              <p className="text-xl font-bold">{leaseLength} months</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="text-xl font-bold">
                {startDate ? formatDate(startDate) : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="text-xl font-bold">
                {newEndDate ? formatDate(newEndDate) : '-'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Link href={`/landlord/leases/${lease.id}`}>
          <Button variant="outline" className="border-2">
            Cancel
          </Button>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="border-2 border-foreground">
              <Send className="h-4 w-4 mr-2" />
              Send to Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="border-2 border-foreground">
            <DialogHeader>
              <DialogTitle>Send Renewal Offer</DialogTitle>
              <DialogDescription>
                This will send the renewal offer to {lease.tenantName} via email.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2">
              <p className="text-sm">
                <strong>New Rent:</strong> {newRent ? formatCurrency(parseInt(newRent)) : '-'}/mo
              </p>
              <p className="text-sm">
                <strong>Lease Term:</strong> {startDate ? formatDate(startDate) : '-'} to {newEndDate ? formatDate(newEndDate) : '-'}
              </p>
              <p className="text-sm">
                <strong>Tenant Email:</strong> {lease.tenantEmail}
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" className="border-2">Cancel</Button>
              <Button className="border-2 border-foreground">
                <Send className="h-4 w-4 mr-2" />
                Confirm & Send
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
