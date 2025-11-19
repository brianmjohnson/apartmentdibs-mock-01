'use client'

import { useState } from 'react'
import { CheckSquare, Square, Zap, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
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

export function BulkApply({
  listings,
  maxSelections = 5,
  onApply,
  className,
}: BulkApplyProps) {
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
      const newSelected = new Set(
        listings.slice(0, maxSelections).map((l) => l.id)
      )
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
      <Card className={`border-2 border-foreground ${className || ''}`}>
        <CardContent className="py-8 text-center">
          <div className="h-12 w-12 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">Applications Submitted!</h3>
          <p className="text-sm text-muted-foreground">
            Successfully applied to {selectedIds.size} listing{selectedIds.size !== 1 ? 's' : ''}
          </p>
          <Button
            variant="outline"
            className="mt-4 border-2 border-foreground"
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
    <Card className={`border-2 border-foreground ${className || ''}`}>
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
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Checkbox
            id="select-all"
            checked={selectedIds.size === Math.min(listings.length, maxSelections)}
            onCheckedChange={handleSelectAll}
          />
          <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
            Select All (up to {maxSelections})
          </label>
        </div>

        {/* Listings */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
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
                <CheckSquare className="h-5 w-5 text-primary shrink-0" />
              ) : (
                <Square className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{listing.address}</p>
                <p className="text-xs text-muted-foreground">
                  ${listing.rent.toLocaleString()}/mo - {listing.bedrooms} BR
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full border-2 border-foreground"
          disabled={selectedIds.size === 0 || isLoading}
          onClick={handleApply}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Applying to {selectedIds.size} Listing{selectedIds.size !== 1 ? 's' : ''}...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Apply to {selectedIds.size} Listing{selectedIds.size !== 1 ? 's' : ''}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
