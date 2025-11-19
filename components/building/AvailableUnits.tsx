'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ListingCard, ListingCardSkeleton } from '@/components/listings/listing-card'
import { Listing } from '@/lib/mock-data/listings'
import { Home } from 'lucide-react'

interface AvailableUnitsProps {
  listings: Listing[]
  isLoading?: boolean
}

export function AvailableUnits({ listings, isLoading }: AvailableUnitsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Available Units
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (listings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Available Units
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-muted-foreground mb-2">No units currently available</p>
            <p className="text-sm text-muted-foreground">
              Save this building to get notified when units become available.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Available Units ({listings.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
