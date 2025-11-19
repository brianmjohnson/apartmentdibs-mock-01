'use client'

import { use } from 'react'
import { ArrowLeft, Edit, Building, Eye } from 'lucide-react'
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
  getPropertyUnits,
  formatCurrency,
  formatDate,
  getUnitStatusColor,
} from '@/lib/mock-data/landlord'

interface PropertyDetailPageProps {
  params: Promise<{
    propertyId: string
  }>
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { propertyId } = use(params)
  const property = getPropertyById(propertyId)
  const units = getPropertyUnits(propertyId)

  if (!property) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/landlord/properties">
            <Button variant="ghost" size="icon" className="border-foreground border-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Property Not Found</h1>
            <p className="text-muted-foreground">The requested property could not be found</p>
          </div>
        </div>
      </div>
    )
  }

  const occupancyRate = Math.round((property.occupied / property.units) * 100)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/landlord/properties">
            <Button variant="ghost" size="icon" className="border-foreground border-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{property.address}</h1>
            <p className="text-muted-foreground">
              {property.type} - {property.units} units
            </p>
          </div>
        </div>
        <Button variant="outline" className="border-2">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      {/* Property Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Image Gallery Placeholder */}
        <Card className="border-foreground border-2 md:col-span-2">
          <CardContent className="p-0">
            <div className="bg-muted flex h-64 items-center justify-center">
              <Building className="text-muted-foreground h-20 w-20" />
            </div>
          </CardContent>
        </Card>

        {/* Property Stats */}
        <Card className="border-foreground border-2">
          <CardHeader>
            <CardTitle>Property Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Units</span>
              <span className="font-bold">{property.units}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Occupancy Rate</span>
              <span className="font-bold">{occupancyRate}%</span>
            </div>
            <div className="space-y-1">
              <div className="bg-muted border-foreground h-2 border">
                <div className="h-full bg-green-500" style={{ width: `${occupancyRate}%` }} />
              </div>
              <p className="text-muted-foreground text-xs">
                <span className="text-green-600">{property.occupied} occupied</span>
                {' / '}
                <span className="text-red-600">{property.vacant} vacant</span>
              </p>
            </div>
            <div className="border-border border-t-2 pt-4">
              <p className="text-muted-foreground text-sm">Monthly Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(property.monthlyRevenue)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Year Built</p>
              <p className="font-bold">{property.yearBuilt}</p>
            </div>
            {property.manager === 'agent' && property.agentName && (
              <div>
                <p className="text-muted-foreground text-sm">Managed By</p>
                <p className="font-bold">{property.agentName}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Units List */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle>Units</CardTitle>
          <CardDescription>All rental units in this property</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-foreground overflow-hidden border-2">
            <Table>
              <TableHeader>
                <TableRow className="border-foreground bg-muted/50 border-b-2">
                  <TableHead className="font-bold">Unit</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Tenant</TableHead>
                  <TableHead className="font-bold">Rent</TableHead>
                  <TableHead className="font-bold">Lease Expires</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {units.map((unit) => (
                  <TableRow key={unit.id} className="border-border border-b">
                    <TableCell>
                      <div>
                        <p className="font-medium">Unit {unit.unitNumber}</p>
                        <p className="text-muted-foreground text-xs">
                          {unit.beds} bed, {unit.baths} bath, {unit.sqft} sqft
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getUnitStatusColor(unit.status)} border-2`}
                      >
                        {unit.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {unit.tenant ? (
                        <p className="font-medium">{unit.tenant.name}</p>
                      ) : unit.status === 'listed' ? (
                        <span className="text-muted-foreground italic">Listed</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(unit.rent)}</TableCell>
                    <TableCell>
                      {unit.tenant ? (
                        formatDate(unit.tenant.leaseEnd)
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/landlord/properties/${propertyId}/units/${unit.id}`}>
                        <Button variant="outline" size="sm" className="border-2">
                          <Eye className="mr-2 h-3 w-3" />
                          View Unit
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
