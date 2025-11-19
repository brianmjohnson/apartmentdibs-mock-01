'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ListingGallery, AmenityGrid, CriteriaCard, ListingCard } from '@/components/listings'
import { getListingById, mockListings, formatDate } from '@/lib/mock-data/listings'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  Bed,
  Bath,
  Square,
  Calendar,
  MapPin,
  ChevronLeft,
  Building2,
  Clock,
  Shield,
} from 'lucide-react'

export default function ListingDetailPage() {
  const params = useParams()
  const listingId = params.listingId as string

  const listing = getListingById(listingId)

  if (!listing) {
    notFound()
  }

  const fullAddress = listing.unit
    ? `${listing.address}, ${listing.unit}, ${listing.city}, ${listing.state} ${listing.zip}`
    : `${listing.address}, ${listing.city}, ${listing.state} ${listing.zip}`

  const bedsLabel = listing.beds === 0 ? 'Studio' : `${listing.beds} Beds`

  // Get similar listings (same neighborhood or similar price range)
  const similarListings = mockListings
    .filter(
      (l) =>
        l.id !== listing.id &&
        (l.neighborhood === listing.neighborhood || Math.abs(l.price - listing.price) < 500)
    )
    .slice(0, 4)

  return (
    <div className="bg-background min-h-screen">
      {/* Back Navigation */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/search">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Search
            </Link>
          </Button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="container mx-auto px-4 py-6">
        <ListingGallery images={listing.images} address={listing.address} />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Details */}
          <div className="space-y-8 lg:col-span-2">
            {/* Header */}
            <div>
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h1 className="mb-2 text-3xl font-bold">
                    ${listing.price.toLocaleString()}
                    <span className="text-muted-foreground text-lg font-normal">/month</span>
                  </h1>
                  <div className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{fullAddress}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Bed className="text-muted-foreground h-4 w-4" />
                  <span>{bedsLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="text-muted-foreground h-4 w-4" />
                  <span>
                    {listing.baths} Bath{listing.baths !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="text-muted-foreground h-4 w-4" />
                  <span>{listing.sqft.toLocaleString()} sq ft</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span>Available {formatDate(listing.available)}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {listing.petFriendly && <Badge>Pet Friendly</Badge>}
                {listing.neighborhood && <Badge variant="secondary">{listing.neighborhood}</Badge>}
                {listing.buildingType && <Badge variant="outline">{listing.buildingType}</Badge>}
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">About This Apartment</h2>
              <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
            </div>

            <Separator />

            {/* Amenities */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">Amenities</h2>
              <AmenityGrid amenities={listing.amenities} petFriendly={listing.petFriendly} />
            </div>

            <Separator />

            {/* Building Details */}
            {(listing.buildingType || listing.yearBuilt) && (
              <>
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Building Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {listing.buildingType && (
                      <div className="flex items-center gap-3">
                        <Building2 className="text-muted-foreground h-5 w-5" />
                        <div>
                          <p className="text-muted-foreground text-sm">Building Type</p>
                          <p className="font-medium">{listing.buildingType}</p>
                        </div>
                      </div>
                    )}
                    {listing.yearBuilt && (
                      <div className="flex items-center gap-3">
                        <Clock className="text-muted-foreground h-5 w-5" />
                        <div>
                          <p className="text-muted-foreground text-sm">Year Built</p>
                          <p className="font-medium">{listing.yearBuilt}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />
              </>
            )}

            {/* Map Placeholder */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">Location</h2>
              <Card>
                <CardContent className="p-0">
                  <AspectRatio ratio={16 / 9}>
                    <div className="bg-muted flex h-full w-full items-center justify-center rounded-lg">
                      <div className="text-muted-foreground text-center">
                        <MapPin className="mx-auto mb-2 h-8 w-8" />
                        <p className="font-medium">
                          {listing.neighborhood || listing.city}, {listing.state}
                        </p>
                        <p className="text-sm">Map will be available after application</p>
                      </div>
                    </div>
                  </AspectRatio>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - CTA Card */}
          <div className="lg:col-span-1">
            <CriteriaCard
              price={listing.price}
              criteria={listing.criteria}
              available={listing.available}
              listingId={listing.id}
            />
          </div>
        </div>

        {/* Similar Listings */}
        {similarListings.length > 0 && (
          <>
            <Separator className="my-12" />

            <div>
              <h2 className="mb-6 text-2xl font-semibold">Similar Apartments</h2>
              <Carousel
                opts={{
                  align: 'start',
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {similarListings.map((similarListing) => (
                    <CarouselItem
                      key={similarListing.id}
                      className="pl-4 md:basis-1/2 lg:basis-1/3"
                    >
                      <ListingCard listing={similarListing} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4 hidden md:flex" />
                <CarouselNext className="-right-4 hidden md:flex" />
              </Carousel>
            </div>
          </>
        )}

        {/* Fair Housing Notice */}
        <Separator className="my-12" />

        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="text-muted-foreground mt-1 h-6 w-6 flex-shrink-0" />
              <div>
                <h3 className="mb-2 font-semibold">Fair Housing Notice</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  ApartmentDibs is committed to compliance with all federal, state, and local fair
                  housing laws. We do not discriminate against any person because of race, color,
                  religion, national origin, sex, familial status, disability, or any other
                  protected characteristic. All qualification criteria are applied uniformly to all
                  applicants. For more information about fair housing rights, visit{' '}
                  <a
                    href="https://www.hud.gov/fairhousing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground underline"
                  >
                    hud.gov/fairhousing
                  </a>
                  .
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
