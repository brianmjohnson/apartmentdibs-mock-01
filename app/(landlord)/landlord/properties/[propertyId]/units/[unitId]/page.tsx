'use client'

import { use } from 'react'
import { ArrowLeft, Edit, Home, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  getPropertyById,
  getUnitById,
  getLeaseHistoryByUnit,
  formatCurrency,
  formatDate,
  getUnitStatusColor,
  getPaymentStatusColor,
} from '@/lib/mock-data/landlord'

interface UnitDetailPageProps {
  params: Promise<{
    propertyId: string
    unitId: string
  }>
}

export default function UnitDetailPage({ params }: UnitDetailPageProps) {
  const { propertyId, unitId } = use(params)
  const property = getPropertyById(propertyId)
  const unit = getUnitById(unitId)
  const leaseHistory = getLeaseHistoryByUnit(unitId)

  if (!property || !unit) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/landlord/properties/${propertyId}`}>
            <Button variant="ghost" size="icon" className="border-foreground border-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Unit Not Found</h1>
            <p className="text-muted-foreground">The requested unit could not be found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/landlord/properties/${propertyId}`}>
            <Button variant="ghost" size="icon" className="border-foreground border-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Unit {unit.unitNumber}</h1>
            <p className="text-muted-foreground">{property.address}</p>
          </div>
        </div>
        <Button variant="outline" className="border-2">
          <Edit className="mr-2 h-4 w-4" />
          Edit Unit
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Unit Info */}
        <Card className="border-foreground border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Unit Information
              </CardTitle>
              <Badge variant="outline" className={`${getUnitStatusColor(unit.status)} border-2`}>
                {unit.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Bedrooms</p>
                <p className="text-lg font-bold">{unit.beds}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Bathrooms</p>
                <p className="text-lg font-bold">{unit.baths}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Square Feet</p>
                <p className="text-lg font-bold">{unit.sqft}</p>
              </div>
            </div>
            <div className="border-border border-t-2 pt-4">
              <p className="text-muted-foreground text-sm">Monthly Rent</p>
              <p className="text-2xl font-bold">{formatCurrency(unit.rent)}</p>
            </div>
            {unit.listingId && (
              <div className="border-border border-t-2 pt-4">
                <Link href={`/landlord/listings/${unit.listingId}`}>
                  <Button variant="outline" className="w-full border-2">
                    View Active Listing
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Tenant */}
        {unit.tenant ? (
          <Card className="border-foreground border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Current Tenant</CardTitle>
                <Badge
                  variant="outline"
                  className={`${getPaymentStatusColor(unit.tenant.paymentStatus)} border-2`}
                >
                  {unit.tenant.paymentStatus === 'current' ? 'Paid' : unit.tenant.paymentStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-lg font-bold">{unit.tenant.name}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="text-muted-foreground h-4 w-4" />
                  <a href={`mailto:${unit.tenant.email}`} className="hover:underline">
                    {unit.tenant.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="text-muted-foreground h-4 w-4" />
                  <a href={`tel:${unit.tenant.phone}`} className="hover:underline">
                    {unit.tenant.phone}
                  </a>
                </div>
              </div>
              <div className="border-border space-y-2 border-t-2 pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Lease Start</span>
                  <span className="font-medium">{formatDate(unit.tenant.leaseStart)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Lease End</span>
                  <span className="font-medium">{formatDate(unit.tenant.leaseEnd)}</span>
                </div>
                {unit.tenant.lastPaymentDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Last Payment</span>
                    <span className="font-medium">{formatDate(unit.tenant.lastPaymentDate)}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 border-2">
                  Message
                </Button>
                <Button variant="outline" size="sm" className="flex-1 border-2">
                  Renew Lease
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-foreground border-2">
            <CardHeader>
              <CardTitle>No Current Tenant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {unit.status === 'listed'
                  ? 'This unit is currently listed for rent.'
                  : 'This unit is vacant and not listed.'}
              </p>
              {unit.status !== 'listed' && (
                <Button className="border-foreground w-full border-2">Create Listing</Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Lease History */}
      {leaseHistory.length > 0 && (
        <Card className="border-foreground border-2">
          <CardHeader>
            <CardTitle>Lease History</CardTitle>
            <CardDescription>Previous tenants and lease terms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-foreground overflow-hidden border-2">
              <Table>
                <TableHeader>
                  <TableRow className="border-foreground bg-muted/50 border-b-2">
                    <TableHead className="font-bold">Tenant</TableHead>
                    <TableHead className="font-bold">Lease Period</TableHead>
                    <TableHead className="font-bold">Monthly Rent</TableHead>
                    <TableHead className="font-bold">End Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaseHistory.map((history) => (
                    <TableRow key={history.id} className="border-border border-b">
                      <TableCell className="font-medium">{history.tenantName}</TableCell>
                      <TableCell>
                        {formatDate(history.leaseStart)} - {formatDate(history.leaseEnd)}
                      </TableCell>
                      <TableCell>{formatCurrency(history.monthlyRent)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-2 capitalize">
                          {history.endReason}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
