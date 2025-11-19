'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UtensilsCrossed, Coffee, Trees, ShoppingBag, Wine, Music } from 'lucide-react'

interface Place {
  name: string
  type: 'restaurant' | 'coffee' | 'park' | 'shop' | 'bar' | 'entertainment'
  description?: string
}

interface ThingsToDoProps {
  places: Place[]
  highlights?: string[]
}

const iconMap = {
  restaurant: UtensilsCrossed,
  coffee: Coffee,
  park: Trees,
  shop: ShoppingBag,
  bar: Wine,
  entertainment: Music,
}

const categoryLabels = {
  restaurant: 'Restaurants',
  coffee: 'Coffee & Cafes',
  park: 'Parks & Recreation',
  shop: 'Shopping',
  bar: 'Bars & Nightlife',
  entertainment: 'Entertainment',
}

export function ThingsToDo({ places, highlights }: ThingsToDoProps) {
  // Group places by type
  const grouped = places.reduce(
    (acc, place) => {
      if (!acc[place.type]) {
        acc[place.type] = []
      }
      acc[place.type].push(place)
      return acc
    },
    {} as Record<string, Place[]>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Things to Do</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Highlights */}
        {highlights && highlights.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium">Neighborhood Highlights</p>
            <div className="flex flex-wrap gap-2">
              {highlights.map((highlight) => (
                <Badge key={highlight} variant="secondary">
                  {highlight}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Places by category */}
        <div className="space-y-4">
          {Object.entries(grouped).map(([type, categoryPlaces]) => {
            const Icon = iconMap[type as keyof typeof iconMap]
            return (
              <div key={type}>
                <div className="mb-2 flex items-center gap-2">
                  <Icon className="text-primary h-4 w-4" />
                  <p className="text-sm font-medium">
                    {categoryLabels[type as keyof typeof categoryLabels]}
                  </p>
                </div>
                <ul className="space-y-1">
                  {categoryPlaces.slice(0, 3).map((place) => (
                    <li key={place.name} className="text-sm">
                      <span className="font-medium">{place.name}</span>
                      {place.description && (
                        <span className="text-muted-foreground"> - {place.description}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Featured listings CTA for neighborhood guides
interface FeaturedListingsCTAProps {
  neighborhoodName: string
  listingCount: number
  searchUrl: string
}

export function FeaturedListingsCTA({
  neighborhoodName,
  listingCount,
  searchUrl,
}: FeaturedListingsCTAProps) {
  return (
    <Card className="border-primary bg-primary/5">
      <CardContent className="py-6 text-center">
        <h3 className="mb-2 text-xl font-bold">Ready to find your apartment?</h3>
        <p className="text-muted-foreground mb-4">
          {listingCount} listings available in {neighborhoodName}
        </p>
        <a
          href={searchUrl}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-block rounded-md px-6 py-2 font-medium transition-colors"
        >
          Search Listings
        </a>
      </CardContent>
    </Card>
  )
}
