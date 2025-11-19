'use client'

import { useState, useMemo } from 'react'
import { ListingCard, ListingCardSkeleton } from '@/components/listings'
import { mockListings, filterListings } from '@/lib/mock-data/listings'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { SlidersHorizontal, X } from 'lucide-react'

type SortOption = 'newest' | 'price-low' | 'price-high'

const AMENITY_OPTIONS = ['In-Unit W/D', 'Dishwasher', 'Parking', 'Gym', 'Doorman']

const BED_OPTIONS = [
  { value: 0, label: 'Studio' },
  { value: 1, label: '1 BD' },
  { value: 2, label: '2 BD' },
  { value: 3, label: '3 BD' },
  { value: 4, label: '4+ BD' },
]

const BATH_OPTIONS = [
  { value: 1, label: '1 BA' },
  { value: 2, label: '2 BA' },
  { value: 3, label: '3+ BA' },
]

export default function SearchPage() {
  // Filter state
  const [priceRange, setPriceRange] = useState<[number, number]>([1500, 6000])
  const [selectedBeds, setSelectedBeds] = useState<number[]>([])
  const [selectedBaths, setSelectedBaths] = useState<number[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [petFriendly, setPetFriendly] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Filter and sort listings
  const filteredListings = useMemo(() => {
    let results = filterListings({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      beds: selectedBeds.length > 0 ? selectedBeds : undefined,
      baths: selectedBaths.length > 0 ? selectedBaths : undefined,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
      petFriendly: petFriendly || undefined,
    })

    // Sort results
    switch (sortBy) {
      case 'price-low':
        results = [...results].sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        results = [...results].sort((a, b) => b.price - a.price)
        break
      case 'newest':
      default:
        // Keep original order (newest first in mock data)
        break
    }

    return results
  }, [priceRange, selectedBeds, selectedBaths, selectedAmenities, petFriendly, sortBy])

  const toggleBed = (value: number) => {
    setSelectedBeds((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const toggleBath = (value: number) => {
    setSelectedBaths((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    )
  }

  const clearFilters = () => {
    setPriceRange([1500, 6000])
    setSelectedBeds([])
    setSelectedBaths([])
    setSelectedAmenities([])
    setPetFriendly(false)
  }

  const activeFilterCount = [
    selectedBeds.length > 0,
    selectedBaths.length > 0,
    selectedAmenities.length > 0,
    petFriendly,
    priceRange[0] !== 1500 || priceRange[1] !== 6000,
  ].filter(Boolean).length

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="mb-3 font-semibold">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            min={1000}
            max={8000}
            step={100}
            className="mb-2"
          />
          <div className="text-muted-foreground flex justify-between text-sm">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bedrooms */}
      <div>
        <h3 className="mb-3 font-semibold">Bedrooms</h3>
        <div className="flex flex-wrap gap-2">
          {BED_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={selectedBeds.includes(option.value) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleBed(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Bathrooms */}
      <div>
        <h3 className="mb-3 font-semibold">Bathrooms</h3>
        <div className="flex flex-wrap gap-2">
          {BATH_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={selectedBaths.includes(option.value) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleBath(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Amenities */}
      <div>
        <h3 className="mb-3 font-semibold">Amenities</h3>
        <div className="space-y-3">
          {AMENITY_OPTIONS.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
              />
              <Label htmlFor={amenity} className="cursor-pointer text-sm">
                {amenity}
              </Label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pet-friendly"
              checked={petFriendly}
              onCheckedChange={(checked) => setPetFriendly(checked === true)}
            />
            <Label htmlFor="pet-friendly" className="cursor-pointer text-sm">
              Pet Friendly
            </Label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Apply/Clear Buttons */}
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={clearFilters}
          disabled={activeFilterCount === 0}
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  )

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="mb-1 text-2xl font-bold">Apartments in Brooklyn, NY</h1>
          <p className="text-muted-foreground">
            {filteredListings.length} {filteredListings.length === 1 ? 'apartment' : 'apartments'}{' '}
            available
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden w-72 flex-shrink-0 lg:block">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-lg">
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                      {activeFilterCount}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterContent />
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="min-w-0 flex-1">
            {/* Sort and Filter Controls */}
            <div className="mb-6 flex items-center justify-between">
              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="bg-primary text-primary-foreground ml-2 rounded-full px-1.5 py-0.5 text-xs">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort Dropdown */}
              <div className="ml-auto flex items-center gap-2">
                <span className="text-muted-foreground hidden text-sm sm:inline">Sort by:</span>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price (Low-High)</SelectItem>
                    <SelectItem value="price-high">Price (High-Low)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {(priceRange[0] !== 1500 || priceRange[1] !== 6000) && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPriceRange([1500, 6000])}
                    className="h-7 text-xs"
                  >
                    ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                    <X className="ml-1 h-3 w-3" />
                  </Button>
                )}
                {selectedBeds.map((bed) => (
                  <Button
                    key={`bed-${bed}`}
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleBed(bed)}
                    className="h-7 text-xs"
                  >
                    {bed === 0 ? 'Studio' : `${bed} BD`}
                    <X className="ml-1 h-3 w-3" />
                  </Button>
                ))}
                {selectedBaths.map((bath) => (
                  <Button
                    key={`bath-${bath}`}
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleBath(bath)}
                    className="h-7 text-xs"
                  >
                    {bath} BA
                    <X className="ml-1 h-3 w-3" />
                  </Button>
                ))}
                {selectedAmenities.map((amenity) => (
                  <Button
                    key={amenity}
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleAmenity(amenity)}
                    className="h-7 text-xs"
                  >
                    {amenity}
                    <X className="ml-1 h-3 w-3" />
                  </Button>
                ))}
                {petFriendly && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPetFriendly(false)}
                    className="h-7 text-xs"
                  >
                    Pet Friendly
                    <X className="ml-1 h-3 w-3" />
                  </Button>
                )}
              </div>
            )}

            {/* Listing Grid */}
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="mb-2 text-lg font-medium">No apartments found</p>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters to see more results
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
