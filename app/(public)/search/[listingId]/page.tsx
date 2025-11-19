"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ListingGallery,
  AmenityGrid,
  CriteriaCard,
  ListingCard,
} from "@/components/listings";
import {
  getListingById,
  mockListings,
  formatDate,
} from "@/lib/mock-data/listings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
} from "lucide-react";

export default function ListingDetailPage() {
  const params = useParams();
  const listingId = params.listingId as string;

  const listing = getListingById(listingId);

  if (!listing) {
    notFound();
  }

  const fullAddress = listing.unit
    ? `${listing.address}, ${listing.unit}, ${listing.city}, ${listing.state} ${listing.zip}`
    : `${listing.address}, ${listing.city}, ${listing.state} ${listing.zip}`;

  const bedsLabel = listing.beds === 0 ? "Studio" : `${listing.beds} Beds`;

  // Get similar listings (same neighborhood or similar price range)
  const similarListings = mockListings
    .filter(
      (l) =>
        l.id !== listing.id &&
        (l.neighborhood === listing.neighborhood ||
          Math.abs(l.price - listing.price) < 500)
    )
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/search">
              <ChevronLeft className="h-4 w-4 mr-1" />
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    ${listing.price.toLocaleString()}
                    <span className="text-lg font-normal text-muted-foreground">
                      /month
                    </span>
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{fullAddress}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-muted-foreground" />
                  <span>{bedsLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-4 w-4 text-muted-foreground" />
                  <span>{listing.baths} Bath{listing.baths !== 1 ? "s" : ""}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="h-4 w-4 text-muted-foreground" />
                  <span>{listing.sqft.toLocaleString()} sq ft</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Available {formatDate(listing.available)}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {listing.petFriendly && (
                  <Badge>Pet Friendly</Badge>
                )}
                {listing.neighborhood && (
                  <Badge variant="secondary">{listing.neighborhood}</Badge>
                )}
                {listing.buildingType && (
                  <Badge variant="outline">{listing.buildingType}</Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-4">About This Apartment</h2>
              <p className="text-muted-foreground leading-relaxed">
                {listing.description}
              </p>
            </div>

            <Separator />

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <AmenityGrid
                amenities={listing.amenities}
                petFriendly={listing.petFriendly}
              />
            </div>

            <Separator />

            {/* Building Details */}
            {(listing.buildingType || listing.yearBuilt) && (
              <>
                <div>
                  <h2 className="text-xl font-semibold mb-4">Building Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {listing.buildingType && (
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Building Type
                          </p>
                          <p className="font-medium">{listing.buildingType}</p>
                        </div>
                      </div>
                    )}
                    {listing.yearBuilt && (
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Year Built
                          </p>
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
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <Card>
                <CardContent className="p-0">
                  <AspectRatio ratio={16 / 9}>
                    <div className="w-full h-full bg-muted flex items-center justify-center rounded-lg">
                      <div className="text-center text-muted-foreground">
                        <MapPin className="h-8 w-8 mx-auto mb-2" />
                        <p className="font-medium">
                          {listing.neighborhood || listing.city}, {listing.state}
                        </p>
                        <p className="text-sm">
                          Map will be available after application
                        </p>
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
              <h2 className="text-2xl font-semibold mb-6">Similar Apartments</h2>
              <Carousel
                opts={{
                  align: "start",
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
                <CarouselPrevious className="hidden md:flex -left-4" />
                <CarouselNext className="hidden md:flex -right-4" />
              </Carousel>
            </div>
          </>
        )}

        {/* Fair Housing Notice */}
        <Separator className="my-12" />

        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Fair Housing Notice</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  ApartmentDibs is committed to compliance with all federal, state, and local fair housing laws.
                  We do not discriminate against any person because of race, color, religion, national origin,
                  sex, familial status, disability, or any other protected characteristic. All qualification
                  criteria are applied uniformly to all applicants. For more information about fair housing
                  rights, visit{" "}
                  <a
                    href="https://www.hud.gov/fairhousing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground"
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
  );
}
