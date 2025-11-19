"use client";

import Image from "next/image";
import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight, Grid3X3, X } from "lucide-react";

interface ListingGalleryProps {
  images: string[];
  address: string;
}

export function ListingGallery({ images, address }: ListingGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  const handlePrevious = () => {
    setSelectedIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Desktop Grid View */}
      <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 gap-2 h-[400px]">
        <div className="col-span-2 row-span-2 relative rounded-l-lg overflow-hidden">
          {!loadedImages[0] && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
          <Image
            src={images[0]}
            alt={`${address} - Main photo`}
            fill
            className={`object-cover cursor-pointer hover:opacity-95 transition-opacity ${
              loadedImages[0] ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => {
              setSelectedIndex(0);
              setShowLightbox(true);
            }}
            onLoad={() => handleImageLoad(0)}
            priority
            sizes="50vw"
          />
        </div>
        {images.slice(1, 5).map((image, index) => (
          <div
            key={index + 1}
            className={`relative overflow-hidden ${
              index === 1 ? "rounded-tr-lg" : ""
            } ${index === 3 ? "rounded-br-lg" : ""}`}
          >
            {!loadedImages[index + 1] && (
              <Skeleton className="absolute inset-0 w-full h-full" />
            )}
            <Image
              src={image}
              alt={`${address} - Photo ${index + 2}`}
              fill
              className={`object-cover cursor-pointer hover:opacity-95 transition-opacity ${
                loadedImages[index + 1] ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => {
                setSelectedIndex(index + 1);
                setShowLightbox(true);
              }}
              onLoad={() => handleImageLoad(index + 1)}
              sizes="25vw"
            />
            {index === 3 && images.length > 5 && (
              <button
                onClick={() => {
                  setSelectedIndex(0);
                  setShowLightbox(true);
                }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium hover:bg-black/60 transition-colors"
              >
                <Grid3X3 className="h-5 w-5 mr-2" />
                Show all {images.length} photos
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Carousel View */}
      <div className="md:hidden">
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <AspectRatio ratio={4 / 3}>
                  <Image
                    src={image}
                    alt={`${address} - Photo ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                    onClick={() => {
                      setSelectedIndex(index);
                      setShowLightbox(true);
                    }}
                    sizes="100vw"
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
        <div className="text-center mt-2 text-sm text-muted-foreground">
          {images.length} photos
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close gallery"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={handlePrevious}
            className="absolute left-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <div className="relative w-full max-w-5xl h-[80vh] mx-16">
            <Image
              src={images[selectedIndex]}
              alt={`${address} - Photo ${selectedIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          <button
            onClick={handleNext}
            className="absolute right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
