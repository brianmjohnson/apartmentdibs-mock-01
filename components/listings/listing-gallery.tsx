'use client'

import Image from 'next/image'
import { useState } from 'react'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { ChevronLeft, ChevronRight, Grid3X3, X } from 'lucide-react'

interface ListingGalleryProps {
  images: string[]
  address: string
}

export function ListingGallery({ images, address }: ListingGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({})

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }))
  }

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      {/* Desktop Grid View */}
      <div className="hidden h-[400px] gap-2 md:grid md:grid-cols-4 md:grid-rows-2">
        <div className="relative col-span-2 row-span-2 overflow-hidden rounded-l-lg">
          {!loadedImages[0] && <Skeleton className="absolute inset-0 h-full w-full" />}
          <Image
            src={images[0]}
            alt={`${address} - Main photo`}
            fill
            className={`cursor-pointer object-cover transition-opacity hover:opacity-95 ${
              loadedImages[0] ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => {
              setSelectedIndex(0)
              setShowLightbox(true)
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
              index === 1 ? 'rounded-tr-lg' : ''
            } ${index === 3 ? 'rounded-br-lg' : ''}`}
          >
            {!loadedImages[index + 1] && <Skeleton className="absolute inset-0 h-full w-full" />}
            <Image
              src={image}
              alt={`${address} - Photo ${index + 2}`}
              fill
              className={`cursor-pointer object-cover transition-opacity hover:opacity-95 ${
                loadedImages[index + 1] ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={() => {
                setSelectedIndex(index + 1)
                setShowLightbox(true)
              }}
              onLoad={() => handleImageLoad(index + 1)}
              sizes="25vw"
            />
            {index === 3 && images.length > 5 && (
              <button
                onClick={() => {
                  setSelectedIndex(0)
                  setShowLightbox(true)
                }}
                className="absolute inset-0 flex items-center justify-center bg-black/50 font-medium text-white transition-colors hover:bg-black/60"
              >
                <Grid3X3 className="mr-2 h-5 w-5" />
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
                    className="rounded-lg object-cover"
                    onClick={() => {
                      setSelectedIndex(index)
                      setShowLightbox(true)
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
        <div className="text-muted-foreground mt-2 text-center text-sm">{images.length} photos</div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 rounded-full p-2 text-white transition-colors hover:bg-white/10"
            aria-label="Close gallery"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={handlePrevious}
            className="absolute left-4 rounded-full p-2 text-white transition-colors hover:bg-white/10"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <div className="relative mx-16 h-[80vh] w-full max-w-5xl">
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
            className="absolute right-4 rounded-full p-2 text-white transition-colors hover:bg-white/10"
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
  )
}
