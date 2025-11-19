'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Skeleton } from '@/components/ui/skeleton'
import { Building2, Home } from 'lucide-react'
import { useState } from 'react'

export interface BuildingData {
  id: string
  slug: string
  name: string
  neighborhood: string
  image: string
  amenities: string[]
  availableUnits: number
}

interface BuildingCardProps {
  building: BuildingData
}

export function BuildingCard({ building }: BuildingCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <Link href={`/building/${building.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative">
          <AspectRatio ratio={16 / 9}>
            {!imageLoaded && <Skeleton className="absolute inset-0 h-full w-full" />}
            <Image
              src={building.image}
              alt={building.name}
              fill
              className={`object-cover transition-transform group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </AspectRatio>
          <div className="absolute bottom-2 right-2">
            <Badge variant="secondary" className="bg-background/90">
              <Home className="mr-1 h-3 w-3" />
              {building.availableUnits} available
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="mb-1 flex items-start justify-between">
            <h3 className="font-semibold">{building.name}</h3>
            <Building2 className="text-muted-foreground h-4 w-4 flex-shrink-0" />
          </div>
          <p className="text-muted-foreground mb-3 text-sm">{building.neighborhood}</p>

          <div className="flex flex-wrap gap-1">
            {building.amenities.slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {building.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{building.amenities.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function BuildingCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <AspectRatio ratio={16 / 9}>
        <Skeleton className="h-full w-full" />
      </AspectRatio>
      <CardContent className="p-4">
        <Skeleton className="mb-1 h-5 w-32" />
        <Skeleton className="mb-3 h-4 w-24" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-12" />
        </div>
      </CardContent>
    </Card>
  )
}
