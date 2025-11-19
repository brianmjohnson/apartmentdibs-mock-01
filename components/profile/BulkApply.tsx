'use client'

import { useState } from 'react'
import { CheckSquare, Square, Zap, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

interface Listing {
  id: string
  address: string
  rent: number
  bedrooms: number
  imageUrl?: string
}

interface BulkApplyProps {
  listings: Listing[]
  maxSelections?: number
  onApply: (listingIds: string[]) => Promise<void>
  className?: string
}

export function BulkApply({ listings, maxSelections = 5, onApply, className }: BulkApplyProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleToggle = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else if (newSelected.size < maxSelections) {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedIds.size === Math.min(listings.length, maxSelections)) {
      setSelectedIds(new Set())
    } else {
      const newSelected = new Set(listings.slice(0, maxSelections).map((l) => l.id))
      setSelectedIds(newSelected)
    }
  }

  const handleApply = async () => {
    setIsLoading(true)
    try {
      await onApply(Array.from(selectedIds))
      setIsComplete(true)

      // Track analytics
      if (typeof window !== 'undefined' && window.posthog) {
        window.posthog.capture('bulk_apply', {
          listingCount: selectedIds.size,
          listingIds: Array.from(selectedIds),
        })
      }
    } catch (error) {
      console.error('Bulk apply failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isComplete) {
    return (
      <Card className={`border-foreground border-2 ${className || ''}`}>
        <CardContent className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
            <CheckSquare className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="mb-2 text-lg font-medium">Applications Submitted!</h3>
          <p className="text-muted-foreground text-sm">
            Successfully applied to {selectedIds.size} listing{selectedIds.size !== 1 ? 's' : ''}
          </p>
          <Button
            variant="outline"
            className="border-foreground mt-4 border-2"
            onClick={() => {
              setSelectedIds(new Set())
              setIsComplete(false)
            }}
          >
            Apply to More
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`border-foreground border-2 ${className || ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Bulk Apply</CardTitle>
            <CardDescription>
              Select up to {maxSelections} listings to apply at once
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-foreground">
            {selectedIds.size}/{maxSelections} selected
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Select All */}
        <div className="border-border flex items-center gap-2 border-b pb-2">
          <Checkbox
            id="select-all"
            checked={selectedIds.size === Math.min(listings.length, maxSelections)}
            onCheckedChange={handleSelectAll}
          />
          <label htmlFor="select-all" className="cursor-pointer text-sm font-medium">
            Select All (up to {maxSelections})
          </label>
        </div>

        {/* Listings */}
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors ${
                selectedIds.has(listing.id)
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-muted/50'
              }`}
              onClick={() => handleToggle(listing.id)}
              onKeyDown={(e) => e.key === 'Enter' && handleToggle(listing.id)}
              role="checkbox"
              aria-checked={selectedIds.has(listing.id)}
              tabIndex={0}
            >
              {selectedIds.has(listing.id) ? (
                <CheckSquare className="text-primary h-5 w-5 shrink-0" />
              ) : (
                <Square className="text-muted-foreground h-5 w-5 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{listing.address}</p>
                <p className="text-muted-foreground text-xs">
                  ${listing.rent.toLocaleString()}/mo - {listing.bedrooms} BR
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="border-foreground w-full border-2"
          disabled={selectedIds.size === 0 || isLoading}
          onClick={handleApply}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Applying to {selectedIds.size} Listing{selectedIds.size !== 1 ? 's' : ''}...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Apply to {selectedIds.size} Listing{selectedIds.size !== 1 ? 's' : ''}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
