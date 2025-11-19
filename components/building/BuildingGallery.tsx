'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, X, Grid3X3 } from 'lucide-react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

interface BuildingGalleryProps {
  images: string[]
  buildingName: string
}

export function BuildingGallery({ images, buildingName }: BuildingGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handlePrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1)
    }
  }

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1)
    }
  }

  if (images.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        {/* Main large image */}
        <div className="col-span-4 md:col-span-2 md:row-span-2">
          <button
            onClick={() => setSelectedIndex(0)}
            className="w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <AspectRatio ratio={4 / 3}>
              <Image
                src={images[0]}
                alt={`${buildingName} - Main`}
                fill
                className="object-cover transition-transform hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </AspectRatio>
          </button>
        </div>

        {/* Secondary images */}
        {images.slice(1, 5).map((image, index) => (
          <div key={index} className="hidden md:block">
            <button
              onClick={() => setSelectedIndex(index + 1)}
              className="relative w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <AspectRatio ratio={4 / 3}>
                <Image
                  src={image}
                  alt={`${buildingName} - ${index + 2}`}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  sizes="25vw"
                />
              </AspectRatio>
              {index === 3 && images.length > 5 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="flex items-center gap-1 text-white">
                    <Grid3X3 className="h-4 w-4" />
                    <span className="text-sm font-medium">+{images.length - 5}</span>
                  </div>
                </div>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
        <DialogContent className="max-w-4xl p-0">
          <VisuallyHidden>
            <DialogTitle>
              {buildingName} - Image {selectedIndex !== null ? selectedIndex + 1 : 0} of{' '}
              {images.length}
            </DialogTitle>
          </VisuallyHidden>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="h-4 w-4" />
            </Button>

            {selectedIndex !== null && (
              <div className="relative aspect-video">
                <Image
                  src={images[selectedIndex]}
                  alt={`${buildingName} - ${selectedIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            )}

            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            <div className="bg-muted p-2 text-center text-sm">
              {selectedIndex !== null ? selectedIndex + 1 : 0} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
