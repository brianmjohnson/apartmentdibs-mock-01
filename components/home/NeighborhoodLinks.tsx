'use client'

import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Neighborhood {
  name: string
  slug: string
  count: number
}

const neighborhoods: Neighborhood[] = [
  { name: 'Manhattan', slug: 'manhattan', count: 2345 },
  { name: 'Brooklyn', slug: 'brooklyn', count: 1876 },
  { name: 'Queens', slug: 'queens', count: 1234 },
  { name: 'Upper East Side', slug: 'upper-east-side', count: 567 },
  { name: 'Williamsburg', slug: 'williamsburg', count: 489 },
  { name: 'Astoria', slug: 'astoria', count: 423 },
  { name: 'Greenwich Village', slug: 'greenwich-village', count: 378 },
  { name: 'Park Slope', slug: 'park-slope', count: 345 },
  { name: 'Long Island City', slug: 'long-island-city', count: 298 },
  { name: 'Chelsea', slug: 'chelsea', count: 276 },
  { name: 'Harlem', slug: 'harlem', count: 234 },
  { name: 'East Village', slug: 'east-village', count: 212 },
]

export function NeighborhoodLinks() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <MapPin className="h-6 w-6 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold">Popular Neighborhoods</h2>
        </div>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explore apartments in NYC&apos;s most sought-after neighborhoods
        </p>

        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {neighborhoods.map((neighborhood) => (
            <Link
              key={neighborhood.slug}
              href={`/neighborhoods/${neighborhood.slug}`}
              className="group"
            >
              <Badge
                variant="outline"
                className="border-2 border-foreground px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors cursor-pointer"
              >
                {neighborhood.name}
                <span className="ml-2 text-xs text-muted-foreground group-hover:text-primary-foreground/80">
                  ({neighborhood.count.toLocaleString()})
                </span>
              </Badge>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/neighborhoods"
            className="text-primary hover:underline font-medium"
          >
            View all neighborhoods &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
