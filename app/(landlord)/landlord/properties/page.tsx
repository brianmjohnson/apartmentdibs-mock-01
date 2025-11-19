'use client'

import { Plus, Building, Eye } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  mockProperties,
  formatCurrency,
  getPropertyUnits
} from '@/lib/mock-data/landlord'

export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Properties</h1>
          <p className="text-muted-foreground">
            Manage your rental properties and units
          </p>
        </div>
        <Link href="/landlord/properties/create">
          <Button className="border-2 border-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </Link>
      </div>

      {/* Properties Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockProperties.map((property) => {
          const units = getPropertyUnits(property.id)
          const occupancyRate = Math.round((property.occupied / property.units) * 100)

          return (
            <Card key={property.id} className="border-2 border-foreground overflow-hidden">
              {/* Property Image Placeholder */}
              <div className="h-48 bg-muted flex items-center justify-center border-b-2 border-foreground">
                <Building className="h-16 w-16 text-muted-foreground" />
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight">
                    {property.address}
                  </CardTitle>
                  <Badge variant="outline" className="shrink-0 border-2">
                    {property.type}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Property Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Units</p>
                    <p className="font-bold text-lg">{property.units}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Occupancy</p>
                    <p className="font-bold text-lg">
                      <span className="text-green-600">{property.occupied}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-red-600">{property.vacant}</span>
                    </p>
                  </div>
                </div>

                {/* Occupancy Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Occupancy Rate</span>
                    <span className="font-medium">{occupancyRate}%</span>
                  </div>
                  <div className="h-2 bg-muted border border-foreground">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                </div>

                {/* Monthly Revenue */}
                <div className="pt-2 border-t-2 border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                      <p className="font-bold text-lg">{formatCurrency(property.monthlyRevenue)}</p>
                    </div>
                    <Link href={`/landlord/properties/${property.id}`}>
                      <Button variant="outline" size="sm" className="border-2">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Manager Info */}
                {property.manager === 'agent' && property.agentName && (
                  <p className="text-xs text-muted-foreground">
                    Managed by: {property.agentName}
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State (shown when no properties) */}
      {mockProperties.length === 0 && (
        <Card className="border-2 border-dashed border-muted-foreground">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No properties yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add your first property to start managing your rentals
            </p>
            <Link href="/landlord/properties/create">
              <Button className="border-2 border-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Add Property
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
