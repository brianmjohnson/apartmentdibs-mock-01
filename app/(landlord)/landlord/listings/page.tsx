'use client'

import { useState } from 'react'
import { FileText, Users, Clock } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  mockLandlordListings,
  formatCurrency,
  getListingStatusColor
} from '@/lib/mock-data/landlord'

export default function LandlordListingsPage() {
  const [activeTab, setActiveTab] = useState('all')

  const filteredListings = mockLandlordListings.filter(listing => {
    if (activeTab === 'all') return true
    if (activeTab === 'active') return listing.status === 'active'
    if (activeTab === 'pending') return listing.status === 'pending_review'
    return true
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vacant Unit Listings</h1>
        <p className="text-muted-foreground">
          Review and manage your active rental listings
        </p>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border-2 border-foreground">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            All ({mockLandlordListings.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Active ({mockLandlordListings.filter(l => l.status === 'active').length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Pending Review ({mockLandlordListings.filter(l => l.status === 'pending_review').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Listings Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="border-2 border-foreground">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg">
                        {listing.propertyAddress}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Unit {listing.unitNumber}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${getListingStatusColor(listing.status)} border-2 shrink-0`}
                    >
                      {listing.status === 'pending_review' ? 'Pending Review' : listing.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Listing Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-bold text-lg">{formatCurrency(listing.price)}/mo</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Unit Details</p>
                      <p className="font-medium">
                        {listing.beds} bed, {listing.baths} bath
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{listing.daysListed} days</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{listing.applicantCount} applicants</span>
                    </div>
                  </div>

                  {/* Shortlisted Count */}
                  {listing.shortlistedCount > 0 && (
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-300">
                      <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                        {listing.shortlistedCount} applicant{listing.shortlistedCount !== 1 ? 's' : ''} shortlisted by agent
                      </p>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-2 border-t-2 border-border">
                    <Link href={`/landlord/listings/${listing.id}`}>
                      <Button
                        className="w-full border-2 border-foreground"
                        variant={listing.status === 'pending_review' ? 'default' : 'outline'}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        {listing.status === 'pending_review' ? 'Review Applicants' : 'View Listing'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredListings.length === 0 && (
            <Card className="border-2 border-dashed border-muted-foreground">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No listings found</h3>
                <p className="text-muted-foreground text-center">
                  {activeTab === 'all'
                    ? 'You have no active listings'
                    : `No ${activeTab} listings`}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
