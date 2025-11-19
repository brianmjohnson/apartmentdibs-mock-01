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
        <Button
          disabled
          className="w-full border-2 border-foreground opacity-50"
          size="lg"
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          {profile.isExpired
            ? 'Profile Expired'
            : !profile.isVerified
            ? 'Profile Not Verified'
            : 'Complete Your Profile'}
        </Button>
        {onUpdateProfile && (
          <Button
            variant="link"
            className="w-full mt-2 text-sm"
            onClick={onUpdateProfile}
          >
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
          className="w-full border-2 border-foreground bg-primary hover:bg-primary/90"
          size="lg"
          onClick={() => setShowConfirmDialog(true)}
        >
          <Zap className="h-4 w-4 mr-2" />
          One-Tap Apply
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-2">
          Your verified profile will be sent automatically
        </p>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="border-2 border-foreground">
          <DialogHeader>
            <DialogTitle>Apply to {listing.address}</DialogTitle>
            <DialogDescription>
              ${listing.rent.toLocaleString()}/mo - {listing.bedrooms} BR
            </DialogDescription>
          </DialogHeader>

          {applicationComplete ? (
            <div className="py-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-lg font-medium">Application Submitted!</p>
              <p className="text-sm text-muted-foreground mt-2">
                The landlord will receive your verified profile
              </p>
            </div>
          ) : (
            <>
              <div className="py-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your application will include:
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={profile.creditScore ? 'default' : 'outline'} className="text-xs">
                      {profile.creditScore ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
                      Credit Report
                    </Badge>
                    <Badge variant={profile.backgroundCheckComplete ? 'default' : 'outline'} className="text-xs">
                      {profile.backgroundCheckComplete ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
                      Background Check
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={profile.incomeVerified ? 'default' : 'outline'} className="text-xs">
                      {profile.incomeVerified ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
                      Income Verification
                    </Badge>
                    <Badge variant={profile.referencesComplete ? 'default' : 'outline'} className="text-xs">
                      {profile.referencesComplete ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
                      References
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={profile.rentalHistoryComplete ? 'default' : 'outline'} className="text-xs">
                      {profile.rentalHistoryComplete ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
                      Rental History
                    </Badge>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  No additional uploads or authorizations required. Your application will be submitted in under 10 seconds.
                </p>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  className="border-2 border-foreground"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApply}
                  className="border-2 border-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
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
