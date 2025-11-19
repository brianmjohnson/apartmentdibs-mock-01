'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Heart, Trash2, MapPin, Bed, Bath, Square } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { mockSavedListings } from '@/lib/mock-data/tenant'
import { mockListings, formatPrice } from '@/lib/mock-data/listings'

export default function SavedListingsPage() {
  const [savedIds, setSavedIds] = useState<string[]>(mockSavedListings)
  const [listingToRemove, setListingToRemove] = useState<string | null>(null)

  const savedListings = mockListings.filter((listing) => savedIds.includes(listing.id))

  const handleRemove = (listingId: string) => {
    setSavedIds((prev) => prev.filter((id) => id !== listingId))
    setListingToRemove(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Saved Listings</h1>
          <span className="text-muted-foreground">({savedListings.length} saved)</span>
        </div>
        <p className="text-muted-foreground">Listings you&apos;ve saved for later</p>
      </div>

      {/* Listings Grid */}
      {savedListings.length === 0 ? (
        <Card className="border-foreground border-2">
          <CardContent className="py-12">
            <div className="text-center">
              <Heart className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-semibold">No saved listings</h3>
              <p className="text-muted-foreground mb-6">
                Save listings you like to compare them later
              </p>
              <Button asChild className="border-foreground border-2">
                <Link href="/search">
                  <Search className="mr-2 h-4 w-4" />
                  Start Searching
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savedListings.map((listing) => {
            const fullAddress = `${listing.address}, ${listing.city}, ${listing.state}`
            const bedsLabel = listing.beds === 0 ? 'Studio' : `${listing.beds} BD`

            return (
              <Card
                key={listing.id}
                className="group border-foreground overflow-hidden border-2 transition-all hover:shadow-lg"
              >
                <div className="relative">
                  <Link href={`/search/${listing.id}`}>
                    <AspectRatio ratio={4 / 3}>
                      <Image
                        src={listing.images[0]}
                        alt={`${listing.address} - ${listing.city}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </AspectRatio>
                  </Link>

                  {/* Remove Button */}
                  <Dialog
                    open={listingToRemove === listing.id}
                    onOpenChange={(open) => !open && setListingToRemove(null)}
                  >
                    <DialogTrigger asChild>
                      <button
                        onClick={() => setListingToRemove(listing.id)}
                        className="absolute top-3 right-3 rounded-full bg-white/90 p-2 shadow-md transition-colors hover:bg-red-50"
                        aria-label="Remove from saved"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="border-foreground border-2">
                      <DialogHeader>
                        <DialogTitle>Remove from Saved</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to remove {listing.address} from your saved
                          listings?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setListingToRemove(null)}
                          className="border-foreground border-2"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleRemove(listing.id)}
                          className="border-foreground border-2 bg-red-600 hover:bg-red-700"
                        >
                          Remove
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <CardContent className="p-4">
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="text-2xl font-bold">
                      {formatPrice(listing.price)}
                      <span className="text-muted-foreground text-sm font-normal">/mo</span>
                    </span>
                  </div>

                  <div className="text-muted-foreground mb-3 flex items-center gap-3 text-sm">
                    <span className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      {bedsLabel}
                    </span>
                    <span className="text-border">|</span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      {listing.baths} BA
                    </span>
                    <span className="text-border">|</span>
                    <span className="flex items-center gap-1">
                      <Square className="h-4 w-4" />
                      {listing.sqft.toLocaleString()} sf
                    </span>
                  </div>

                  <div className="text-muted-foreground mb-3 flex items-start gap-1 text-sm">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span className="line-clamp-1">{fullAddress}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {listing.petFriendly && (
                      <Badge variant="secondary" className="text-xs">
                        Pet Friendly
                      </Badge>
                    )}
                    {listing.amenities.slice(0, 2).map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {listing.amenities.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{listing.amenities.length - 2}
                      </Badge>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="gap-2 p-4 pt-0">
                  <Button asChild className="border-foreground flex-1 border-2">
                    <Link href={`/search/${listing.id}`}>Apply Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
