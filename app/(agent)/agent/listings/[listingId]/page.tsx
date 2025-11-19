'use client'

import { use } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  Pencil,
  Eye,
  Users,
  BarChart3,
  BedDouble,
  Bath,
  Square,
  Calendar,
  DollarSign,
  Check,
  X,
  Home,
  Globe
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  mockAgentListings,
  mockApplicants,
  mockListingAnalytics,
  getListingStatusColor,
  getApplicantStatusColor,
  formatCurrency,
  formatDate
} from '@/lib/mock-data/agent'

export default function ListingDetail({
  params
}: {
  params: Promise<{ listingId: string }>
}) {
  const { listingId } = use(params)
  const listing = mockAgentListings.find(l => l.id === listingId)
  const applicants = mockApplicants.filter(a => a.listingId === listingId)
  const analytics = mockListingAnalytics[listingId]

  if (!listing) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Listing not found</h2>
        <p className="text-muted-foreground mt-2">
          The listing you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/agent/listings">
          <Button variant="outline" className="mt-4 border-2">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/agent/listings"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Listings
      </Link>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">{listing.address}</h1>
            <Badge
              variant="outline"
              className={`border-2 ${getListingStatusColor(listing.status)}`}
            >
              {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
            </Badge>
          </div>
          {listing.unit && (
            <p className="text-muted-foreground">{listing.unit}</p>
          )}
        </div>
        <Link href={`/agent/listings/${listingId}/edit`}>
          <Button className="border-2 border-foreground">
            <Pencil className="mr-2 h-4 w-4" />
            Edit Listing
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="border-2 border-foreground">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Eye className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="applicants" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="mr-2 h-4 w-4" />
            Applicants ({applicants.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Photos Gallery */}
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle>Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-video bg-muted border-2 border-foreground flex items-center justify-center"
                  >
                    <Home className="h-8 w-8 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-2 border-foreground">
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <BedDouble className="h-5 w-5 text-muted-foreground" />
                    <span>{listing.beds} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-muted-foreground" />
                    <span>{listing.baths} Bathrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Square className="h-5 w-5 text-muted-foreground" />
                    <span>{listing.sqft} sqft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-muted-foreground" />
                    <span className="capitalize">{listing.propertyType}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Rent</span>
                    <span className="font-bold">{formatCurrency(listing.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available Date</span>
                    <span>{formatDate(listing.availableDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Days on Market</span>
                    <span>{listing.daysOnMarket} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-foreground">
              <CardHeader>
                <CardTitle>Screening Criteria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Min Credit Score</span>
                  <span className="font-medium">{listing.screeningCriteria.minCreditScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Income-to-Rent Ratio</span>
                  <span className="font-medium">{listing.screeningCriteria.incomeToRentRatio}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Eviction Years</span>
                  <span className="font-medium">{listing.screeningCriteria.maxEvictionYears} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Background Check</span>
                  <span className="font-medium">
                    {listing.screeningCriteria.backgroundCheckRequired ? 'Required' : 'Not Required'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Amenities */}
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle>Amenities & Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {listing.amenities.map(amenity => (
                    <Badge key={amenity} variant="outline" className="border-2">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Pet Policy</p>
                  <p className="text-sm text-muted-foreground">{listing.petPolicy}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Parking</p>
                  <p className="text-sm text-muted-foreground">{listing.parkingOptions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Syndication Status */}
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Syndication Status
              </CardTitle>
              <CardDescription>
                Where your listing is currently published
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(listing.syndicationStatus).map(([platform, active]) => (
                  <div
                    key={platform}
                    className={`p-4 border-2 text-center ${active ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 bg-gray-50 dark:bg-gray-800'}`}
                  >
                    <p className="font-medium capitalize">{platform}</p>
                    <div className="flex items-center justify-center mt-2">
                      {active ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Applicants Tab */}
        <TabsContent value="applicants" className="mt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{applicants.length} Applicants</h3>
                <p className="text-sm text-muted-foreground">
                  Review and manage applications for this listing
                </p>
              </div>
              <Link href={`/agent/listings/${listingId}/applicants`}>
                <Button className="border-2 border-foreground">
                  View All Applicants
                </Button>
              </Link>
            </div>

            {applicants.length > 0 ? (
              <div className="space-y-3">
                {applicants.slice(0, 3).map((applicant) => (
                  <Card key={applicant.id} className="border-2 border-foreground">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{applicant.displayId}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>Income: {applicant.incomeRatio}x</span>
                            <span>Credit: {applicant.creditBand}</span>
                            <span>{applicant.employmentTenure}</span>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`border-2 ${getApplicantStatusColor(applicant.status)}`}
                        >
                          {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No applicants yet</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
          {analytics ? (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <Card className="border-2 border-foreground">
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{analytics.totalViews}</p>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-foreground">
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{analytics.uniqueViews}</p>
                    <p className="text-sm text-muted-foreground">Unique Views</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-foreground">
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{analytics.inquiries}</p>
                    <p className="text-sm text-muted-foreground">Inquiries</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-foreground">
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{analytics.applications}</p>
                    <p className="text-sm text-muted-foreground">Applications</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-foreground">
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{analytics.conversionRate}%</p>
                    <p className="text-sm text-muted-foreground">Conversion</p>
                  </CardContent>
                </Card>
              </div>

              <Link href={`/agent/listings/${listingId}/analytics`}>
                <Button variant="outline" className="w-full border-2">
                  View Detailed Analytics
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No analytics data available yet</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
