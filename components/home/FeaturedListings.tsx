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
    <section className={`py-16 md:py-24 bg-muted/30 border-y-4 border-foreground ${className || ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Featured Listings</h2>
            <p className="text-muted-foreground mt-2">
              Explore our latest verified apartments
            </p>
          </div>
          <Button variant="outline" className="border-2 border-foreground" asChild>
            <Link href="/search">
              View All Listings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
