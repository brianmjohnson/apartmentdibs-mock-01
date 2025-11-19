'use client'

import Link from 'next/link'
import {
  FileText,
  User,
  Heart,
  Activity,
  ArrowRight,
  Calendar,
  MapPin,
  Bed,
  Bath,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  mockTenantProfile,
  mockApplications,
  mockActivities,
  getStatusColor,
  getStatusLabel,
  formatDate,
  formatRelativeTime,
} from '@/lib/mock-data/tenant'
import { mockListings, formatPrice } from '@/lib/mock-data/listings'

export default function TenantDashboard() {
  const activeApplications = mockApplications.filter(
    (app) => !['denied', 'withdrawn'].includes(app.status)
  )
  const savedListingsCount = 5 // Mock count
  const lastActivity = mockActivities[0]

  // Get recommended listings based on preferences
  const recommendedListings = mockListings
    .filter(
      (listing) =>
        listing.price >= mockTenantProfile.preferences.budgetMin &&
        listing.price <= mockTenantProfile.preferences.budgetMax
    )
    .slice(0, 3)

  // Calculate missing profile items
  const missingItems = []
  if (mockTenantProfile.verifications.credit === 'not_started') {
    missingItems.push({
      label: 'Credit Authorization',
      href: '/tenant/profile/verification/credit',
    })
  }
  if (mockTenantProfile.verifications.background === 'not_started') {
    missingItems.push({
      label: 'Background Check',
      href: '/tenant/profile/verification/background',
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {mockTenantProfile.firstName}!
        </h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Active Applications */}
        <Card className="border-foreground border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeApplications.length}</div>
            <Link
              href="/tenant/applications"
              className="text-muted-foreground hover:text-foreground mt-1 inline-flex items-center gap-1 text-sm"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        {/* Profile Status */}
        <Card className="border-foreground border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
            <User className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTenantProfile.profileCompletion === 100 ? (
                <Badge className="border border-green-300 bg-green-100 text-green-800">
                  Verified
                </Badge>
              ) : (
                `${mockTenantProfile.profileCompletion}% Complete`
              )}
            </div>
            <Link
              href="/tenant/profile"
              className="text-muted-foreground hover:text-foreground mt-1 inline-flex items-center gap-1 text-sm"
            >
              View Profile <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        {/* Saved Listings */}
        <Card className="border-foreground border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Listings</CardTitle>
            <Heart className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedListingsCount}</div>
            <Link
              href="/tenant/saved-listings"
              className="text-muted-foreground hover:text-foreground mt-1 inline-flex items-center gap-1 text-sm"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-foreground border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="truncate text-sm font-medium">{lastActivity.description}</div>
            <p className="text-muted-foreground mt-1 text-sm">
              {formatRelativeTime(lastActivity.timestamp)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Application Status Section */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>Track your active applications</CardDescription>
            </div>
            <Button variant="outline" asChild className="border-foreground border-2">
              <Link href="/tenant/applications">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeApplications.length === 0 ? (
            <div className="py-8 text-center">
              <FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground">No active applications</p>
              <Button asChild className="border-foreground mt-4 border-2">
                <Link href="/search">Browse Listings</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeApplications.map((application) => (
                <div
                  key={application.id}
                  className="border-border flex flex-col justify-between rounded-lg border-2 p-4 md:flex-row md:items-center"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="text-muted-foreground h-4 w-4" />
                      <span className="font-medium">
                        {application.address}
                        {application.unit && `, ${application.unit}`}
                      </span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Bed className="h-3 w-3" /> {application.beds} bed
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="h-3 w-3" /> {application.baths} bath
                      </span>
                      <span>{formatPrice(application.rent)}/mo</span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Applied {formatDate(application.appliedAt)}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-3 md:mt-0">
                    <Badge className={`${getStatusColor(application.status)} border`}>
                      {getStatusLabel(application.status)}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-foreground border-2"
                    >
                      <Link href={`/tenant/applications/${application.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommended Listings */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recommended Listings</CardTitle>
              <CardDescription>Based on your preferences</CardDescription>
            </div>
            <Button variant="outline" asChild className="border-foreground border-2">
              <Link href="/search">See More</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {recommendedListings.map((listing) => (
              <Link
                key={listing.id}
                href={`/search/${listing.id}`}
                className="border-border hover:border-foreground block overflow-hidden rounded-lg border-2 transition-colors"
              >
                <div className="bg-muted relative aspect-video">
                  {listing.images[0] && (
                    <img
                      src={listing.images[0]}
                      alt={listing.address}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="p-3">
                  <p className="font-bold">{formatPrice(listing.price)}/mo</p>
                  <p className="truncate text-sm font-medium">
                    {listing.address}
                    {listing.unit && `, ${listing.unit}`}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {listing.beds} bed {listing.baths} bath {listing.sqft} sqft
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profile Completion Prompt */}
      {mockTenantProfile.profileCompletion < 100 && (
        <Card className="border-foreground bg-muted/50 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              Complete Your Profile
            </CardTitle>
            <CardDescription>
              Complete your profile to apply faster and increase your chances of approval
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Profile Completion</span>
                <span className="font-medium">{mockTenantProfile.profileCompletion}%</span>
              </div>
              <Progress value={mockTenantProfile.profileCompletion} className="h-2" />
            </div>

            {missingItems.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Missing items:</p>
                <ul className="space-y-1">
                  {missingItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm"
                      >
                        <Clock className="h-3 w-3" />
                        {item.label}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button asChild className="border-foreground border-2">
              <Link href="/tenant/profile">Complete Profile</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
