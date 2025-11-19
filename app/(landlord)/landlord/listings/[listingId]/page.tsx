'use client'

import { use, useState } from 'react'
import { ArrowLeft, Users, CheckCircle, XCircle, Scale } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  getListingById,
  getApplicantsByListing,
  formatCurrency,
  formatDate,
  getListingStatusColor,
  getApplicantStatusColor
} from '@/lib/mock-data/landlord'

interface ListingDetailPageProps {
  params: Promise<{
    listingId: string
  }>
}

export default function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { listingId } = use(params)
  const listing = getListingById(listingId)
  const applicants = getApplicantsByListing(listingId)
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([])

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
            <p className="text-muted-foreground">
              The requested listing could not be found
            </p>
          </div>
        </div>
      </div>
    )
  }

  const shortlistedApplicants = applicants.filter(a => a.status === 'shortlisted')

  const toggleApplicant = (applicantId: string) => {
    setSelectedApplicants(prev =>
      prev.includes(applicantId)
        ? prev.filter(id => id !== applicantId)
        : [...prev, applicantId]
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/landlord/listings">
            <Button variant="ghost" size="icon" className="border-2 border-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {listing.propertyAddress}
            </h1>
            <p className="text-muted-foreground">
              Unit {listing.unitNumber} - {formatCurrency(listing.price)}/mo
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`${getListingStatusColor(listing.status)} border-2`}
        >
          {listing.status === 'pending_review' ? 'Pending Review' : listing.status}
        </Badge>
      </div>

      {/* Listing Info */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle>Listing Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-muted-foreground text-sm">Unit Details</p>
              <p className="font-medium">
                {listing.beds} bed, {listing.baths} bath, {listing.sqft} sqft
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Days Listed</p>
              <p className="font-medium">{listing.daysListed} days</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Applicants</p>
              <p className="font-medium">{listing.applicantCount}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Shortlisted</p>
              <p className="font-medium">{listing.shortlistedCount}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t-2 border-border">
            <p className="text-muted-foreground text-sm mb-2">Screening Criteria</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-2">
                Min Credit: {listing.screeningCriteria.minCreditScore}
              </Badge>
              <Badge variant="outline" className="border-2">
                Income Ratio: {listing.screeningCriteria.incomeToRentRatio}x
              </Badge>
              <Badge variant="outline" className="border-2">
                Background Check Required
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shortlisted Applicants */}
      {shortlistedApplicants.length > 0 && (
        <Card className="border-2 border-foreground">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Shortlisted Applicants
                </CardTitle>
                <CardDescription>
                  Review and select your preferred applicant
                </CardDescription>
              </div>
              {selectedApplicants.length === 2 && (
                <Button variant="outline" className="border-2">
                  <Scale className="mr-2 h-4 w-4" />
                  Compare Selected
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shortlistedApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className={`p-4 border-2 ${
                    selectedApplicants.includes(applicant.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedApplicants.includes(applicant.id)}
                      onCheckedChange={() => toggleApplicant(applicant.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-lg">{applicant.displayId}</p>
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

                      {/* Applicant Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Income Ratio</p>
                          <p className="font-bold">{applicant.incomeRatio}x</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Credit Band</p>
                          <p className="font-bold">{applicant.creditBand}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Employment</p>
                          <p className="font-bold">{applicant.employmentTenure}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Occupants</p>
                          <p className="font-bold">{applicant.occupants}</p>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="border-2">
                          {applicant.employmentType}
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
                        <Badge variant="outline" className="border-2">
                          Move-in: {formatDate(applicant.moveInDate)}
                        </Badge>
                      </div>

                      {/* Competitive Edge */}
                      <div className="p-3 bg-muted/50 border-2 border-border">
                        <p className="text-xs text-muted-foreground mb-1">Competitive Edge</p>
                        <p className="text-sm">{applicant.competitiveEdge}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Link href={`/landlord/listings/${listingId}/applicants?select=${applicant.id}`} className="flex-1">
                          <Button className="w-full border-2 border-foreground" size="sm">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Select Applicant
                          </Button>
                        </Link>
                        <Link href={`/landlord/listings/${listingId}/applicants?deny=${applicant.id}`} className="flex-1">
                          <Button variant="outline" className="w-full border-2" size="sm">
                            <XCircle className="mr-2 h-4 w-4" />
                            Deny
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other Applicants */}
      {applicants.filter(a => a.status !== 'shortlisted').length > 0 && (
        <Card className="border-2 border-foreground">
          <CardHeader>
            <CardTitle>Other Applicants</CardTitle>
            <CardDescription>
              Applicants not yet shortlisted by your agent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {applicants.filter(a => a.status !== 'shortlisted').map((applicant) => (
                <div
                  key={applicant.id}
                  className="p-3 border-2 border-border flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{applicant.displayId}</p>
                    <p className="text-sm text-muted-foreground">
                      {applicant.incomeRatio}x income - {applicant.creditBand} credit
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${getApplicantStatusColor(applicant.status)} border-2`}
                  >
                    {applicant.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Applicants */}
      {applicants.length === 0 && (
        <Card className="border-2 border-dashed border-muted-foreground">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No applicants yet</h3>
            <p className="text-muted-foreground text-center">
              Applications will appear here once tenants apply
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
