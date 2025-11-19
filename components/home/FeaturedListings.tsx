'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ListingCard } from '@/components/listings/listing-card'
import { mockListings } from '@/lib/mock-data/listings'

interface FeaturedListingsProps {
  limit?: number
  className?: string
}

export function FeaturedListings({ limit = 6, className }: FeaturedListingsProps) {
  const featuredListings = mockListings.slice(0, limit)

  const handleListingClick = (listingId: string) => {
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('listing_clicked', {
        listingId,
        source: 'featured_listings',
      })
    }
  }

  return (
    <section
      className={`bg-muted/30 border-foreground border-y-4 py-16 md:py-24 ${className || ''}`}
    >
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">Featured Listings</h2>
            <p className="text-muted-foreground mt-2">Explore our latest verified apartments</p>
          </div>
          <Button variant="outline" className="border-foreground border-2" asChild>
            <Link href="/search">
              View All Listings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredListings.map((listing) => (
            <div
              key={listing.id}
              onClick={() => handleListingClick(listing.id)}
              onKeyDown={(e) => e.key === 'Enter' && handleListingClick(listing.id)}
              role="button"
              tabIndex={0}
            >
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
