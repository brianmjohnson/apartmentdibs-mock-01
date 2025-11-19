'use client'

import { useState } from 'react'
import { Zap, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface ListingInfo {
  id: string
  address: string
  rent: number
  bedrooms: number
}

interface ProfileData {
  isVerified: boolean
  isExpired: boolean
  completionPercentage: number
  creditScore?: number
  incomeVerified: boolean
  backgroundCheckComplete: boolean
  referencesComplete: boolean
  rentalHistoryComplete: boolean
}

interface OneClickApplyProps {
  listing: ListingInfo
  profile: ProfileData
  onApply: (listingId: string) => Promise<void>
  onUpdateProfile?: () => void
  className?: string
}

export function OneClickApply({
  listing,
  profile,
  onApply,
  onUpdateProfile,
  className,
}: OneClickApplyProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [applicationComplete, setApplicationComplete] = useState(false)

  const canApply = profile.isVerified && !profile.isExpired && profile.completionPercentage >= 100

  const handleApply = async () => {
    setIsLoading(true)

    try {
      // Track analytics
      if (typeof window !== 'undefined' && window.posthog) {
        window.posthog.capture('one_tap_apply', {
          listingId: listing.id,
          rent: listing.rent,
        })
      }

      await onApply(listing.id)
      setApplicationComplete(true)

      // Close dialog after a delay
      setTimeout(() => {
        setShowConfirmDialog(false)
        setApplicationComplete(false)
      }, 2000)
    } catch (error) {
      console.error('Application failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!canApply) {
    return (
      <div className={className}>
        <Button disabled className="border-foreground w-full border-2 opacity-50" size="lg">
          <AlertCircle className="mr-2 h-4 w-4" />
          {profile.isExpired
            ? 'Profile Expired'
            : !profile.isVerified
              ? 'Profile Not Verified'
              : 'Complete Your Profile'}
        </Button>
        {onUpdateProfile && (
          <Button variant="link" className="mt-2 w-full text-sm" onClick={onUpdateProfile}>
            Update your profile to apply
          </Button>
        )}
      </div>
    )
  }

  return (
    <>
      <div className={className}>
        <Button
          className="border-foreground bg-primary hover:bg-primary/90 w-full border-2"
          size="lg"
          onClick={() => setShowConfirmDialog(true)}
        >
          <Zap className="mr-2 h-4 w-4" />
          One-Tap Apply
        </Button>
        <p className="text-muted-foreground mt-2 text-center text-xs">
          Your verified profile will be sent automatically
        </p>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="border-foreground border-2">
          <DialogHeader>
            <DialogTitle>Apply to {listing.address}</DialogTitle>
            <DialogDescription>
              ${listing.rent.toLocaleString()}/mo - {listing.bedrooms} BR
            </DialogDescription>
          </DialogHeader>

          {applicationComplete ? (
            <div className="py-8 text-center">
              <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-600" />
              <p className="text-lg font-medium">Application Submitted!</p>
              <p className="text-muted-foreground mt-2 text-sm">
                The landlord will receive your verified profile
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <p className="text-muted-foreground text-sm">Your application will include:</p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={profile.creditScore ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {profile.creditScore ? <CheckCircle className="mr-1 h-3 w-3" /> : null}
                      Credit Report
                    </Badge>
                    <Badge
                      variant={profile.backgroundCheckComplete ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {profile.backgroundCheckComplete ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : null}
                      Background Check
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={profile.incomeVerified ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {profile.incomeVerified ? <CheckCircle className="mr-1 h-3 w-3" /> : null}
                      Income Verification
                    </Badge>
                    <Badge
                      variant={profile.referencesComplete ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {profile.referencesComplete ? <CheckCircle className="mr-1 h-3 w-3" /> : null}
                      References
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={profile.rentalHistoryComplete ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {profile.rentalHistoryComplete ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : null}
                      Rental History
                    </Badge>
                  </div>
                </div>

                <p className="text-muted-foreground text-xs">
                  No additional uploads or authorizations required. Your application will be
                  submitted in under 10 seconds.
                </p>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  className="border-foreground border-2"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApply}
                  className="border-foreground border-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Confirm Application
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
