'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircle2, MapPin, Home } from 'lucide-react'
import { useState } from 'react'

export interface BusinessData {
  id: string
  slug: string
  name: string
  title?: string
  company?: string
  image?: string
  initials?: string
  locationServed: string
  activeListings: number
  verified: boolean
}

interface BusinessCardProps {
  business: BusinessData
}

export function BusinessCard({ business }: BusinessCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  const displayInitials =
    business.initials ||
    business.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()

  return (
    <Link href={`/business/${business.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              {business.image ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                  {!imageLoaded && (
                    <Skeleton className="absolute inset-0 h-full w-full rounded-full" />
                  )}
                  <Image
                    src={business.image}
                    alt={business.name}
                    fill
                    className={`object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                    sizes="64px"
                  />
                </div>
              ) : (
                <div className="bg-primary text-primary-foreground flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold">
                  {displayInitials}
                </div>
              )}
              {business.verified && (
                <CheckCircle2 className="fill-primary text-background absolute -right-1 -bottom-1 h-5 w-5" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-semibold">{business.name}</h3>
              </div>
              {business.title && business.company && (
                <p className="text-muted-foreground truncate text-sm">
                  {business.title}, {business.company}
                </p>
              )}
              <div className="text-muted-foreground mt-2 flex items-center gap-1 text-sm">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{business.locationServed}</span>
              </div>
              <div className="mt-2 flex items-center gap-1 text-sm">
                <Home className="h-3 w-3" />
                <span>{business.activeListings} active listings</span>
              </div>
            </div>
          </div>

          {business.verified && (
            <Badge variant="secondary" className="mt-3">
              Verified Agent
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

export function BusinessCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 flex-shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
