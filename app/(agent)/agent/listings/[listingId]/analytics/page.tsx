'use client'

import { use } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  Eye,
  Users,
  FileText,
  Percent,
  TrendingUp,
  BarChart3,
  Globe
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  mockAgentListings,
  mockListingAnalytics,
  formatDate
} from '@/lib/mock-data/agent'

export default function ListingAnalytics({
  params
}: {
  params: Promise<{ listingId: string }>
}) {
  const { listingId } = use(params)
  const listing = mockAgentListings.find(l => l.id === listingId)
  const analytics = mockListingAnalytics[listingId]

  if (!listing) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Listing not found</h2>
        <Link href="/agent/listings">
          <Button variant="outline" className="mt-4 border-2">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Button>
        </Link>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Link
          href={`/agent/listings/${listingId}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Listing
        </Link>

        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold">No Analytics Data</h2>
          <p className="text-muted-foreground mt-2">
            Analytics data will appear once the listing receives traffic.
          </p>
        </div>
      </div>
    )
  }

  // Calculate funnel data
  const funnelData = [
    { stage: 'Views', count: analytics.totalViews, icon: Eye },
    { stage: 'Inquiries', count: analytics.inquiries, icon: Users },
    { stage: 'Applications', count: analytics.applications, icon: FileText },
  ]

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href={`/agent/listings/${listingId}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Listing
      </Link>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Listing Analytics</h1>
        <p className="text-muted-foreground">
          {listing.address} - Performance metrics and insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card className="border-2 border-foreground">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Total Views</span>
            </div>
            <p className="text-3xl font-bold mt-2">{analytics.totalViews}</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-foreground">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Unique Views</span>
            </div>
            <p className="text-3xl font-bold mt-2">{analytics.uniqueViews}</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-foreground">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Inquiries</span>
            </div>
            <p className="text-3xl font-bold mt-2">{analytics.inquiries}</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-foreground">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Applications</span>
            </div>
            <p className="text-3xl font-bold mt-2">{analytics.applications}</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-foreground">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Conversion</span>
            </div>
            <p className="text-3xl font-bold mt-2">{analytics.conversionRate}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Views Over Time Chart Placeholder */}
        <Card className="border-2 border-foreground">
          <CardHeader>
            <CardTitle>Views Over Time</CardTitle>
            <CardDescription>
              Daily view count for the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.viewsByDay.map((day) => (
                <div key={day.date} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{formatDate(day.date)}</span>
                    <span className="font-medium">{day.views} views</span>
                  </div>
                  <Progress
                    value={(day.views / Math.max(...analytics.viewsByDay.map(d => d.views))) * 100}
                    className="h-3"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">
              Chart placeholder - integrate with charting library
            </p>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="border-2 border-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Traffic Sources
            </CardTitle>
            <CardDescription>
              Where your views are coming from
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.trafficSources.map((source) => (
                <div key={source.source} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{source.source}</span>
                    <span className="font-medium">{source.count} ({source.percentage}%)</span>
                  </div>
                  <Progress value={source.percentage} className="h-3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applicant Funnel */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle>Applicant Funnel</CardTitle>
          <CardDescription>
            Conversion from views to applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-4 h-48">
            {funnelData.map((stage, index) => {
              const maxCount = funnelData[0].count
              const height = maxCount > 0 ? (stage.count / maxCount) * 100 : 0
              const Icon = stage.icon

              return (
                <div key={stage.stage} className="flex flex-col items-center flex-1">
                  <div className="flex-1 w-full flex items-end">
                    <div
                      className="w-full bg-primary/80 border-2 border-foreground transition-all flex items-center justify-center"
                      style={{ height: `${height}%`, minHeight: '40px' }}
                    >
                      <span className="text-lg font-bold text-primary-foreground">
                        {stage.count}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{stage.stage}</span>
                  </div>
                  {index < funnelData.length - 1 && (
                    <span className="text-xs text-muted-foreground mt-1">
                      {funnelData[index + 1].count > 0
                        ? `${((funnelData[index + 1].count / stage.count) * 100).toFixed(1)}%`
                        : '0%'}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          <p className="text-sm text-muted-foreground text-center mt-6">
            Chart placeholder - integrate with charting library for better visualization
          </p>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle>Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
              <div>
                <p className="font-medium">Strong conversion rate</p>
                <p className="text-sm text-muted-foreground">
                  Your {analytics.conversionRate}% view-to-application rate is above the market average of 2.5%.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
              <div>
                <p className="font-medium">Zillow driving most traffic</p>
                <p className="text-sm text-muted-foreground">
                  Consider boosting your listing on Zillow for even more visibility.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2" />
              <div>
                <p className="font-medium">Add more photos</p>
                <p className="text-sm text-muted-foreground">
                  Listings with 10+ photos typically receive 3x more inquiries.
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
