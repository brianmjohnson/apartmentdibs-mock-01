'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ListingCard, ListingCardSkeleton } from '@/components/listings/listing-card'
import { Listing } from '@/lib/mock-data/listings'

interface SimilarPropertiesProps {
  listings: Listing[]
  isLoading?: boolean
}

export function SimilarProperties({ listings, isLoading }: SimilarPropertiesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Similar Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (listings.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Similar Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.slice(0, 3).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
