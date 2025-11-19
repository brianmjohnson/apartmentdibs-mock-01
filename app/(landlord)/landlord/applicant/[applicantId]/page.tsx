'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Lock,
  User,
  DollarSign,
  CreditCard,
  Briefcase,
  Home,
  ShieldCheck,
  Calendar,
  Users,
  PawPrint,
  Sparkles,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  getApplicantById,
  getListingById,
  formatCurrency,
  formatDate,
  getApplicantStatusColor,
  denialReasonOptions
} from '@/lib/mock-data/landlord'
import { CreditBand } from '@/components/tenant-profile/CreditBand'
import { EmploymentTenure } from '@/components/tenant-profile/EmploymentTenure'
import { RevealedProfile } from '@/components/tenant-profile/RevealedProfile'
import { PiiRevealNotice } from '@/components/application/PiiRevealNotice'

interface ApplicantDetailPageProps {
  params: Promise<{
    applicantId: string
  }>
}

export default function ApplicantDetailPage({ params }: ApplicantDetailPageProps) {
  const { applicantId } = use(params)
  const router = useRouter()
  const applicant = getApplicantById(applicantId)
  const listing = applicant ? getListingById(applicant.listingId) : null

  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showDenialDialog, setShowDenialDialog] = useState(false)
  const [denialReason, setDenialReason] = useState('')
  const [denialNotes, setDenialNotes] = useState('')
  const [showRevealNotice, setShowRevealNotice] = useState(
    applicant?.status === 'selected' && applicant?.piiRevealed
  )

  // Not found state
  if (!applicant) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/landlord/listings">
            <Button variant="ghost" size="icon" className="border-2 border-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Applicant Not Found</h1>
            <p className="text-muted-foreground">
              The applicant you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const handleSelect = () => {
    setShowConfirmDialog(true)
  }

  const handleDeny = () => {
    setShowDenialDialog(true)
  }

  const confirmSelection = () => {
    // In a real app, this would make an API call to:
    // 1. Update applicant status to 'selected'
    // 2. Reveal PII
    // 3. Send email notification
    // 4. Log audit trail
    alert(`Selected ${applicant.displayId}! Their full profile is now visible.`)
    setShowConfirmDialog(false)
    // In real implementation, would refetch applicant data or update state
  }

  const confirmDenial = () => {
    // In a real app, this would make an API call
    alert(`Denied ${applicant.displayId} - Reason: ${denialReason}`)
    setShowDenialDialog(false)
    setDenialReason('')
    setDenialNotes('')
    router.push(`/landlord/listings/${applicant.listingId}/applicants`)
  }

  const handleContactApplicant = () => {
    if (applicant.revealedData?.phone) {
      window.location.href = `tel:${applicant.revealedData.phone}`
    }
  }

  const handleCreateLease = () => {
    router.push(`/landlord/leases/create?applicantId=${applicant.id}`)
  }

  // Check if this applicant has revealed PII
  const isRevealed = applicant.status === 'selected' && applicant.piiRevealed

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href={listing ? `/landlord/listings/${listing.id}/applicants` : '/landlord/listings'}>
          <Button variant="ghost" size="icon" className="border-2 border-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {isRevealed ? applicant.revealedData?.name : applicant.displayId}
            </h1>
            <Badge
              variant="outline"
              className={`${getApplicantStatusColor(applicant.status)} border-2`}
            >
              {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
            </Badge>
            {!isRevealed && (
              <Badge variant="outline" className="border-2 border-muted-foreground text-muted-foreground">
                <Lock className="h-3 w-3 mr-1" />
                Anonymized
              </Badge>
            )}
          </div>
          {listing && (
            <p className="text-muted-foreground">
              {listing.propertyAddress}, Unit {listing.unitNumber} - {formatCurrency(listing.price)}/mo
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {applicant.status === 'shortlisted' && !isRevealed && (
          <div className="flex gap-2">
            <Button
              className="border-2 border-foreground"
              onClick={handleSelect}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Select Applicant
            </Button>
            <Button
              variant="outline"
              className="border-2"
              onClick={handleDeny}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Deny
            </Button>
          </div>
        )}
      </div>

      {/* PII Reveal Notice */}
      {isRevealed && showRevealNotice && applicant.revealedData && applicant.piiRevealedAt && (
        <PiiRevealNotice
          applicantName={applicant.revealedData.name}
          applicantId={applicant.displayId}
          revealedAt={applicant.piiRevealedAt}
          onDismiss={() => setShowRevealNotice(false)}
          onContactApplicant={handleContactApplicant}
          onCreateLease={handleCreateLease}
        />
      )}

      {/* Profile Content */}
      {isRevealed ? (
        // Show revealed profile with full PII
        <RevealedProfile applicant={applicant} showAnimation={true} />
      ) : (
        // Show obfuscated profile
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Obfuscated Profile Card */}
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Anonymized Profile
                <Badge variant="outline" className="ml-auto border-2 border-muted-foreground text-muted-foreground">
                  <Lock className="h-3 w-3 mr-1" />
                  PII Hidden
                </Badge>
              </CardTitle>
              <CardDescription>
                Personal information will be revealed after selection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Anonymous Avatar */}
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-muted border-2 border-dashed border-muted-foreground flex items-center justify-center">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>

              {/* Income Ratio */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Income-to-Rent Ratio</p>
                    <p className={`font-bold ${applicant.incomeRatio >= 4 ? 'text-green-600' : ''}`}>
                      {applicant.incomeRatio}x monthly rent
                    </p>
                  </div>
                </div>
                {applicant.incomeRatio >= 4 && (
                  <Badge className="bg-green-100 text-green-800 border-green-300">Strong</Badge>
                )}
              </div>

              {/* Credit Score Band */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Credit Score Band</p>
                    <CreditBand creditBand={applicant.creditBand} showIcon={false} />
                  </div>
                </div>
              </div>

              {/* Employment */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Employment Tenure</p>
                    <EmploymentTenure
                      tenure={applicant.employmentTenure}
                      employmentType={applicant.employmentType}
                      showIcon={false}
                    />
                  </div>
                </div>
              </div>

              {/* Rental History */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Rental History</p>
                    <p className="font-bold">{applicant.rentalHistory || '5+ years, no evictions'}</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-300">Clean</Badge>
              </div>

              {/* Background Check */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Background Check</p>
                    <p className={`font-bold ${applicant.backgroundCheck === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>
                      {applicant.backgroundCheck || 'Pass'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details Card */}
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
              <CardDescription>Move-in preferences and additional information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    Desired Move-in
                  </div>
                  <p className="font-medium">{formatDate(applicant.moveInDate)}</p>
                </div>

                <div className="p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Users className="h-4 w-4" />
                    Occupants
                  </div>
                  <p className="font-medium">{applicant.occupants}</p>
                </div>

                <div className="p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <PawPrint className="h-4 w-4" />
                    Pets
                  </div>
                  <p className="font-medium">
                    {applicant.pets ? applicant.petDetails || 'Yes' : 'No'}
                  </p>
                </div>

                <div className="p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    Applied
                  </div>
                  <p className="font-medium">{formatDate(applicant.appliedAt)}</p>
                </div>
              </div>

              <Separator />

              {/* Competitive Edge */}
              {applicant.competitiveEdge && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-300 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-600">Competitive Edge</span>
                  </div>
                  <p className="text-sm">{applicant.competitiveEdge}</p>
                </div>
              )}

              {/* Fair Housing Reminder */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 rounded-md text-sm">
                <p className="text-blue-800 dark:text-blue-200">
                  <strong>Fair Housing Reminder:</strong> Selection must be based on objective criteria only.
                  PII remains hidden until you make a selection decision.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Selection Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="border-2 border-foreground">
          <DialogHeader>
            <DialogTitle>Confirm Selection</DialogTitle>
            <DialogDescription>
              Are you sure you want to select {applicant.displayId} for this unit?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {listing && (
              <div className="p-4 bg-muted border-2 border-border space-y-2">
                <p className="font-medium">{listing.propertyAddress}, Unit {listing.unitNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(listing.price)}/mo - {listing.beds} bed, {listing.baths} bath
                </p>
              </div>
            )}
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">What happens next:</p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>The applicant&apos;s full profile (name, contact, etc.) will be revealed</li>
                <li>Email notification sent to the applicant</li>
                <li>You can proceed with lease preparation</li>
                <li>Other applicants will be notified</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="border-2"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmSelection}
              className="border-2 border-foreground"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm Selection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Denial Dialog */}
      <Dialog open={showDenialDialog} onOpenChange={setShowDenialDialog}>
        <DialogContent className="border-2 border-foreground">
          <DialogHeader>
            <DialogTitle>Deny Applicant</DialogTitle>
            <DialogDescription>
              Please provide a reason for denying {applicant.displayId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="denial-reason">Denial Reason *</Label>
              <Select value={denialReason} onValueChange={setDenialReason}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {denialReasonOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="denial-notes">Additional Notes (Optional)</Label>
              <Textarea
                id="denial-notes"
                value={denialNotes}
                onChange={(e) => setDenialNotes(e.target.value)}
                placeholder="Any additional context for the denial..."
                className="border-2"
                rows={3}
              />
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 text-sm">
              <p className="text-yellow-800 dark:text-yellow-200">
                The applicant will receive a standardized adverse action notice. Your specific notes will be kept in internal records only.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDenialDialog(false)
                setDenialReason('')
                setDenialNotes('')
              }}
              className="border-2"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDenial}
              disabled={!denialReason}
              variant="destructive"
              className="border-2"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Confirm Denial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
