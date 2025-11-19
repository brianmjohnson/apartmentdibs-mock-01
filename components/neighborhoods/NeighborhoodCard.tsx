'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Skeleton } from '@/components/ui/skeleton'
import { DollarSign } from 'lucide-react'
import { useState } from 'react'

export interface NeighborhoodData {
  id: string
  slug: string
  name: string
  image: string
  averageRent: number
  vibe: string
  tags?: string[]
}

interface NeighborhoodCardProps {
  neighborhood: NeighborhoodData
}

export function NeighborhoodCard({ neighborhood }: NeighborhoodCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <Link href={`/neighborhoods/${neighborhood.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative">
          <AspectRatio ratio={16 / 9}>
            {!imageLoaded && <Skeleton className="absolute inset-0 h-full w-full" />}
            <Image
              src={neighborhood.image}
              alt={neighborhood.name}
              fill
              className={`object-cover transition-transform group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </AspectRatio>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <h3 className="text-xl font-bold">{neighborhood.name}</h3>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <DollarSign className="text-primary h-4 w-4" />
              <span className="font-semibold">${neighborhood.averageRent.toLocaleString()}</span>
              <span className="text-muted-foreground text-sm">/mo avg</span>
            </div>
          </div>

          <p className="text-muted-foreground mb-3 text-sm">{neighborhood.vibe}</p>

          {neighborhood.tags && neighborhood.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {neighborhood.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

export function NeighborhoodCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <AspectRatio ratio={16 / 9}>
        <Skeleton className="h-full w-full" />
      </AspectRatio>
      <CardContent className="p-4">
        <Skeleton className="mb-3 h-5 w-32" />
        <Skeleton className="mb-3 h-4 w-full" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}
