'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface HeroSearchProps {
  className?: string
}

export function HeroSearch({ className }: HeroSearchProps) {
  const [location, setLocation] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [budget, setBudget] = useState('')

  const handleSearch = () => {
    // Build search params
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (bedrooms) params.set('beds', bedrooms)
    if (budget) params.set('budget', budget)

    // Track analytics event
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('search_initiated', {
        location,
        budget,
        beds: bedrooms,
      })
    }
  }

  return (
    <section className={`bg-background border-foreground relative border-b-4 ${className || ''}`}>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.02)_25%,rgba(0,0,0,0.02)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.02)_75%)] bg-[length:4px_4px]" />
      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Find Your Next Apartment
          </h1>
          <p className="text-muted-foreground mx-auto mb-4 max-w-2xl text-xl md:text-2xl">
            10,000+ verified listings. Apply once, reuse everywhere.
          </p>

          {/* Trust Badges */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="border-foreground border-2 px-3 py-1">
              <CheckCircle className="mr-1 h-3 w-3" />
              Verified listings only
            </Badge>
            <Badge variant="outline" className="border-foreground border-2 px-3 py-1">
              <CheckCircle className="mr-1 h-3 w-3" />
              No broker fees
            </Badge>
            <Badge variant="outline" className="border-foreground border-2 px-3 py-1">
              <CheckCircle className="mr-1 h-3 w-3" />
              Fair Housing compliant
            </Badge>
          </div>

          {/* Search Bar */}
          <div className="mx-auto flex max-w-3xl flex-col gap-3">
            <div className="flex flex-col gap-3 md:flex-row">
              {/* Location Input */}
              <div className="flex-1">
                <Input
                  placeholder="Enter city, neighborhood, or ZIP"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="border-foreground h-12 border-2 text-base"
                  aria-label="Search location"
                />
              </div>

              {/* Budget Filter */}
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger className="border-foreground h-12 w-full border-2 md:w-44">
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent className="border-foreground border-2">
                  <SelectItem value="0-2000">$0 - $2,000</SelectItem>
                  <SelectItem value="2000-3000">$2,000 - $3,000</SelectItem>
                  <SelectItem value="3000-4000">$3,000 - $4,000</SelectItem>
                  <SelectItem value="4000+">$4,000+</SelectItem>
                </SelectContent>
              </Select>

              {/* Bedrooms Filter */}
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger className="border-foreground h-12 w-full border-2 md:w-40">
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent className="border-foreground border-2">
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="1">1 BR</SelectItem>
                  <SelectItem value="2">2 BR</SelectItem>
                  <SelectItem value="3">3+ BR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <Button
              size="lg"
              className="border-foreground h-12 w-full border-2 px-8 md:mx-auto md:w-auto"
              asChild
              onClick={handleSearch}
            >
              <Link
                href={`/search?location=${encodeURIComponent(location)}&beds=${bedrooms}&budget=${budget}`}
              >
                <Search className="mr-2 h-5 w-5" />
                Search Rentals
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

// Add PostHog type declaration
declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void
    }
  }
}
