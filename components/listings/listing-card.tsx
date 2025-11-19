"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { Listing, formatPrice } from "@/lib/mock-data/listings";
import { Bed, Bath, Square, MapPin, Heart } from "lucide-react";
import { useState } from "react";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const fullAddress = `${listing.address}, ${listing.city}, ${listing.state}`;
  const bedsLabel = listing.beds === 0 ? "Studio" : `${listing.beds} BD`;

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative">
        <Link href={`/search/${listing.id}`}>
          <AspectRatio ratio={4 / 3}>
            {!imageLoaded && (
              <Skeleton className="absolute inset-0 w-full h-full" />
            )}
            <Image
              src={listing.images[0]}
              alt={`${listing.address} - ${listing.city}`}
              fill
              className={`object-cover transition-transform group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </AspectRatio>
        </Link>
        <button
          onClick={() => setIsSaved(!isSaved)}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
          aria-label={isSaved ? "Remove from saved" : "Save listing"}
        >
          <Heart
            className={`h-4 w-4 ${
              isSaved ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>
      </div>

      <CardContent className="p-4">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-2xl font-bold">
            {formatPrice(listing.price)}
            <span className="text-sm font-normal text-muted-foreground">/mo</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
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
            {listing.sqft.toLocaleString()} sq ft
          </span>
        </div>

        <div className="flex items-start gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
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

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/search/${listing.id}`}>Apply with Dibs</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ListingCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <AspectRatio ratio={4 / 3}>
        <Skeleton className="w-full h-full" />
      </AspectRatio>
      <CardContent className="p-4">
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-48 mb-3" />
        <Skeleton className="h-4 w-40 mb-3" />
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
