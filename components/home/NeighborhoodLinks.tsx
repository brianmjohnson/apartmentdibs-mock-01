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
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-4 flex items-center justify-center gap-2">
          <MapPin className="text-primary h-6 w-6" />
          <h2 className="text-3xl font-bold md:text-4xl">Popular Neighborhoods</h2>
        </div>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-center">
          Explore apartments in NYC&apos;s most sought-after neighborhoods
        </p>

        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
          {neighborhoods.map((neighborhood) => (
            <Link
              key={neighborhood.slug}
              href={`/neighborhoods/${neighborhood.slug}`}
              className="group"
            >
              <Badge
                variant="outline"
                className="border-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary cursor-pointer border-2 px-4 py-2 text-sm transition-colors"
              >
                {neighborhood.name}
                <span className="text-muted-foreground group-hover:text-primary-foreground/80 ml-2 text-xs">
                  ({neighborhood.count.toLocaleString()})
                </span>
              </Badge>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/neighborhoods" className="text-primary font-medium hover:underline">
            View all neighborhoods &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
