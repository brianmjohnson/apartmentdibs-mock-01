'use client'

import { use, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Lock, User, Eye } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  getListingById,
  getApplicantsByListing,
  formatCurrency,
  formatDate,
  getApplicantStatusColor,
  getCreditBandColor,
  getCreditBandLabel,
  denialReasonOptions,
  LandlordApplicant
} from '@/lib/mock-data/landlord'

interface ApplicantsPageProps {
  params: Promise<{
    listingId: string
  }>
}

export default function ApplicantsPage({ params }: ApplicantsPageProps) {
  const { listingId } = use(params)
  const searchParams = useSearchParams()
  const listing = getListingById(listingId)
  const applicants = getApplicantsByListing(listingId)

  const [selectedApplicant, setSelectedApplicant] = useState<LandlordApplicant | null>(null)
  const [denialApplicant, setDenialApplicant] = useState<LandlordApplicant | null>(null)
  const [denialReason, setDenialReason] = useState('')
  const [denialNotes, setDenialNotes] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showDenialDialog, setShowDenialDialog] = useState(false)

  // Handle URL parameters for direct selection/denial
  const selectId = searchParams.get('select')
  const denyId = searchParams.get('deny')

  if (selectId && !selectedApplicant) {
    const applicant = applicants.find(a => a.id === selectId)
    if (applicant) {
      setSelectedApplicant(applicant)
      setShowConfirmDialog(true)
    }
  }

  if (denyId && !denialApplicant) {
    const applicant = applicants.find(a => a.id === denyId)
    if (applicant) {
      setDenialApplicant(applicant)
      setShowDenialDialog(true)
    }
  }

  if (!listing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/landlord/listings">
            <Button variant="ghost" size="icon" className="border-2 border-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Listing Not Found</h1>
          </div>
        </div>
      </div>
    )
  }

  const handleSelectApplicant = (applicant: LandlordApplicant) => {
    setSelectedApplicant(applicant)
    setShowConfirmDialog(true)
  }

  const handleDenyApplicant = (applicant: LandlordApplicant) => {
    setDenialApplicant(applicant)
    setShowDenialDialog(true)
  }

  const confirmSelection = () => {
    // In a real app, this would make an API call
    alert(`Selected ${selectedApplicant?.displayId} for the unit!`)
    setShowConfirmDialog(false)
    setSelectedApplicant(null)
  }

  const confirmDenial = () => {
    // In a real app, this would make an API call
    alert(`Denied ${denialApplicant?.displayId} - Reason: ${denialReason}`)
    setShowDenialDialog(false)
    setDenialApplicant(null)
    setDenialReason('')
    setDenialNotes('')
  }

  const shortlistedApplicants = applicants.filter(a => a.status === 'shortlisted')

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href={`/landlord/listings/${listingId}`}>
          <Button variant="ghost" size="icon" className="border-2 border-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applicant Review</h1>
          <p className="text-muted-foreground">
            {listing.propertyAddress}, Unit {listing.unitNumber}
          </p>
        </div>
      </div>

      {/* Instructions Card */}
      <Card className="border-2 border-blue-300 bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">Fair Housing Reminder</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Selection decisions must be based on objective criteria only: income, credit, rental history, and background check results. All applicants meeting criteria should be evaluated equally.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applicants List */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle>Shortlisted Applicants ({shortlistedApplicants.length})</CardTitle>
          <CardDescription>
            Select an applicant to approve for the lease
          </CardDescription>
        </CardHeader>
        <CardContent>
          {shortlistedApplicants.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No Shortlisted Applicants</h3>
              <p className="text-muted-foreground text-sm">
                Your agent will shortlist qualified applicants for your review.
                All applicants are shown anonymously to ensure fair evaluation.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {shortlistedApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="p-4 border-2 border-border"
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      {/* Anonymous Avatar */}
                      <div className="h-14 w-14 rounded-full bg-muted border-2 border-dashed border-muted-foreground flex items-center justify-center shrink-0">
                        <User className="h-7 w-7 text-muted-foreground" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-lg">{applicant.displayId}</p>
                              <Badge
                                variant="outline"
                                className="border-2 border-muted-foreground text-muted-foreground text-xs"
                              >
                                <Lock className="h-3 w-3 mr-1" />
                                Anonymized
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Applied {formatDate(applicant.appliedAt)}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={`${getApplicantStatusColor(applicant.status)} border-2`}
                          >
                            {applicant.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Applicant Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Income Ratio</p>
                        <p className={`font-bold ${applicant.incomeRatio >= 4 ? 'text-green-600' : ''}`}>
                          {applicant.incomeRatio}x
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Credit Band</p>
                        <div className="flex items-center gap-2">
                          <p className="font-bold">{applicant.creditBand}</p>
                          <Badge
                            variant="outline"
                            className={`${getCreditBandColor(applicant.creditBand)} border text-xs`}
                          >
                            {getCreditBandLabel(applicant.creditBand)}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Employment</p>
                        <p className="font-bold">{applicant.employmentTenure}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Move-in Date</p>
                        <p className="font-bold">{formatDate(applicant.moveInDate)}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-2">
                        {applicant.employmentType}
                      </Badge>
                      <Badge variant="outline" className="border-2">
                        {applicant.occupants} occupant{applicant.occupants !== 1 ? 's' : ''}
                      </Badge>
                      {applicant.pets ? (
                        <Badge variant="outline" className="border-2">
                          Pet: {applicant.petDetails || 'Yes'}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-2">
                          No Pets
                        </Badge>
                      )}
                    </div>

                    {/* Competitive Edge */}
                    <div className="p-3 bg-muted/50 border-2 border-border">
                      <p className="text-xs text-muted-foreground mb-1">Competitive Edge</p>
                      <p className="text-sm">{applicant.competitiveEdge}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Link href={`/landlord/applicant/${applicant.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full border-2"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </Link>
                      <Button
                        className="flex-1 border-2 border-foreground"
                        onClick={() => handleSelectApplicant(applicant)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Select
                      </Button>
                      <Button
                        variant="outline"
                        className="border-2"
                        onClick={() => handleDenyApplicant(applicant)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selection Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="border-2 border-foreground">
          <DialogHeader>
            <DialogTitle>Confirm Selection</DialogTitle>
            <DialogDescription>
              Are you sure you want to select {selectedApplicant?.displayId} for this unit?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-muted border-2 border-border space-y-2">
              <p className="font-medium">{listing.propertyAddress}, Unit {listing.unitNumber}</p>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(listing.price)}/mo - {listing.beds} bed, {listing.baths} bath
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              This will notify the applicant and your agent to proceed with lease preparation. Other applicants will be notified that the unit is no longer available.
            </p>
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
              Please provide a reason for denying {denialApplicant?.displayId}
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
