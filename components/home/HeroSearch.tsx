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
    <section className={`relative bg-background border-b-4 border-foreground ${className || ''}`}>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.02)_25%,rgba(0,0,0,0.02)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.02)_75%)] bg-[length:4px_4px]" />
      <div className="container mx-auto px-4 py-20 md:py-32 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Find Your Next Apartment
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            10,000+ verified listings. Apply once, reuse everywhere.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="outline" className="border-2 border-foreground px-3 py-1">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified listings only
            </Badge>
            <Badge variant="outline" className="border-2 border-foreground px-3 py-1">
              <CheckCircle className="h-3 w-3 mr-1" />
              No broker fees
            </Badge>
            <Badge variant="outline" className="border-2 border-foreground px-3 py-1">
              <CheckCircle className="h-3 w-3 mr-1" />
              Fair Housing compliant
            </Badge>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col gap-3 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Location Input */}
              <div className="flex-1">
                <Input
                  placeholder="Enter city, neighborhood, or ZIP"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-12 border-2 border-foreground text-base"
                  aria-label="Search location"
                />
              </div>

              {/* Budget Filter */}
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger className="w-full md:w-44 h-12 border-2 border-foreground">
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent className="border-2 border-foreground">
                  <SelectItem value="0-2000">$0 - $2,000</SelectItem>
                  <SelectItem value="2000-3000">$2,000 - $3,000</SelectItem>
                  <SelectItem value="3000-4000">$3,000 - $4,000</SelectItem>
                  <SelectItem value="4000+">$4,000+</SelectItem>
                </SelectContent>
              </Select>

              {/* Bedrooms Filter */}
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger className="w-full md:w-40 h-12 border-2 border-foreground">
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent className="border-2 border-foreground">
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
              className="h-12 px-8 border-2 border-foreground w-full md:w-auto md:mx-auto"
              asChild
              onClick={handleSearch}
            >
              <Link href={`/search?location=${encodeURIComponent(location)}&beds=${bedrooms}&budget=${budget}`}>
                <Search className="h-5 w-5 mr-2" />
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
