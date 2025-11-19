'use client'

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, MapPin } from 'lucide-react'

interface ProfileHeaderProps {
  name: string
  title?: string
  company?: string
  image?: string
  initials?: string
  locationServed: string
  verified: boolean
  bio?: string
  yearsExperience?: number
  specialties?: string[]
}

export function ProfileHeader({
  name,
  title,
  company,
  image,
  initials,
  locationServed,
  verified,
  bio,
  yearsExperience,
  specialties,
}: ProfileHeaderProps) {
  const displayInitials =
    initials ||
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        {/* Photo */}
        <div className="relative flex-shrink-0">
          {image ? (
            <div className="relative h-32 w-32 overflow-hidden rounded-full">
              <Image src={image} alt={name} fill className="object-cover" sizes="128px" />
            </div>
          ) : (
            <div className="bg-primary text-primary-foreground flex h-32 w-32 items-center justify-center rounded-full text-3xl font-bold">
              {displayInitials}
            </div>
          )}
          {verified && (
            <CheckCircle2 className="absolute right-0 bottom-0 h-8 w-8 fill-primary text-background" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="mb-2 flex flex-col items-center gap-2 md:flex-row">
            <h1 className="text-2xl font-bold">{name}</h1>
            {verified && (
              <Badge variant="default" className="w-fit">
                Verified Agent
              </Badge>
            )}
          </div>

          {title && company && (
            <p className="text-muted-foreground mb-2">
              {title} at {company}
            </p>
          )}

          <div className="text-muted-foreground mb-4 flex items-center justify-center gap-1 md:justify-start">
            <MapPin className="h-4 w-4" />
            <span>{locationServed}</span>
          </div>

          {bio && <p className="text-muted-foreground mb-4">{bio}</p>}

          <div className="flex flex-wrap justify-center gap-4 text-sm md:justify-start">
            {yearsExperience && (
              <div>
                <span className="font-semibold">{yearsExperience}</span>
                <span className="text-muted-foreground ml-1">years experience</span>
              </div>
            )}
          </div>

          {specialties && specialties.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
              {specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary">
                  {specialty}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
