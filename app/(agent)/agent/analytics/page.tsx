'use client'

import {
  Building,
  Users,
  TrendingUp,
  Clock,
  UserPlus,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { mockAgentProfile, mockAgentListings, mockApplicants } from '@/lib/mock-data/agent'

export default function AgentAnalyticsPage() {
  // Calculate metrics
  const totalListings = mockAgentListings.length
  const activeListings = mockAgentListings.filter((l) => l.status === 'active').length
  const totalApplications = mockApplicants.length
  const totalViews = mockAgentListings.reduce((sum, l) => sum + l.views, 0)
  const conversionRate = ((totalApplications / totalViews) * 100).toFixed(1)
  const avgDaysToFill = mockAgentProfile.avgDaysToFill
  const crmConversionRate = 24 // Mock percentage

  // Applications by status
  const applicationsByStatus = {
    new: mockApplicants.filter((a) => a.status === 'new').length,
    reviewed: mockApplicants.filter((a) => a.status === 'reviewed').length,
    shortlisted: mockApplicants.filter((a) => a.status === 'shortlisted').length,
    denied: mockApplicants.filter((a) => a.status === 'denied').length,
  }

  // Top performing listings
  const topListings = [...mockAgentListings]
    .filter((l) => l.status === 'active')
    .sort((a, b) => b.applicantCount - a.applicantCount)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Performance metrics and insights for your listings</p>
      </div>

      {/* Overall Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-foreground border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Building className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalListings}</div>
            <p className="text-muted-foreground text-xs">{activeListings} active</p>
          </CardContent>
        </Card>

        <Card className="border-foreground border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-muted-foreground text-xs">{applicationsByStatus.new} new</p>
          </CardContent>
        </Card>

        <Card className="border-foreground border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-muted-foreground text-xs">Views to applications</p>
          </CardContent>
        </Card>

        <Card className="border-foreground border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Days-to-Fill</CardTitle>
            <Clock className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDaysToFill}</div>
            <p className="text-xs text-green-600">-3 days from avg</p>
          </CardContent>
        </Card>

        <Card className="border-foreground border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CRM Conversion</CardTitle>
            <UserPlus className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crmConversionRate}%</div>
            <p className="text-muted-foreground text-xs">Leads to leases</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Applications Over Time (Placeholder) */}
        <Card className="border-foreground border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Applications Over Time
            </CardTitle>
            <CardDescription>Daily application trends for the past 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 border-muted-foreground/30 flex h-[200px] items-center justify-center rounded-md border-2 border-dashed">
              <div className="text-center">
                <BarChart3 className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                <p className="text-muted-foreground text-sm">
                  Chart placeholder - integrate with charting library
                </p>
              </div>
            </div>
            {/* Mock data display */}
            <div className="mt-4 grid grid-cols-7 gap-2">
              {[12, 8, 15, 10, 18, 14, 20].map((value, index) => (
                <div key={index} className="text-center">
                  <div
                    className="bg-primary/80 mx-auto rounded-t-sm"
                    style={{ height: `${value * 3}px`, width: '100%' }}
                  />
                  <span className="text-muted-foreground text-xs">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Application Pipeline */}
        <Card className="border-foreground border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Application Pipeline
            </CardTitle>
            <CardDescription>Current status breakdown of all applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>New</span>
                  <span className="font-medium">{applicationsByStatus.new}</span>
                </div>
                <Progress
                  value={(applicationsByStatus.new / totalApplications) * 100}
                  className="h-2"
                />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Reviewed</span>
                  <span className="font-medium">{applicationsByStatus.reviewed}</span>
                </div>
                <Progress
                  value={(applicationsByStatus.reviewed / totalApplications) * 100}
                  className="h-2"
                />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Shortlisted</span>
                  <span className="font-medium">{applicationsByStatus.shortlisted}</span>
                </div>
                <Progress
                  value={(applicationsByStatus.shortlisted / totalApplications) * 100}
                  className="h-2"
                />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Denied</span>
                  <span className="font-medium">{applicationsByStatus.denied}</span>
                </div>
                <Progress
                  value={(applicationsByStatus.denied / totalApplications) * 100}
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Listings Performance */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle>Listings Performance</CardTitle>
          <CardDescription>Compare performance across your active listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topListings.map((listing) => {
              const performanceScore = Math.round(
                (listing.applicantCount * 10 + listing.views / 10 + listing.inquiries * 2) / 3
              )

              return (
                <div
                  key={listing.id}
                  className="border-muted flex items-center gap-4 rounded-md border-2 p-3"
                >
                  <div className="flex-1">
                    <p className="font-medium">{listing.address.split(',')[0]}</p>
                    <p className="text-muted-foreground text-sm">
                      ${listing.price}/mo - {listing.beds}BR
                    </p>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold">{listing.views}</p>
                      <p className="text-muted-foreground text-xs">Views</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">{listing.inquiries}</p>
                      <p className="text-muted-foreground text-xs">Inquiries</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">{listing.applicantCount}</p>
                      <p className="text-muted-foreground text-xs">Apps</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">{listing.daysOnMarket}</p>
                      <p className="text-muted-foreground text-xs">Days</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${
                      performanceScore >= 50
                        ? 'border-green-300 bg-green-100 text-green-800'
                        : performanceScore >= 30
                          ? 'border-yellow-300 bg-yellow-100 text-yellow-800'
                          : 'border-red-300 bg-red-100 text-red-800'
                    }`}
                  >
                    {performanceScore >= 50 ? 'High' : performanceScore >= 30 ? 'Medium' : 'Low'}
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Analytics (Placeholder) */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-foreground border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Revenue by Source
            </CardTitle>
            <CardDescription>Lease revenue from CRM vs new leads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 border-muted-foreground/30 flex h-[200px] items-center justify-center rounded-md border-2 border-dashed">
              <div className="text-center">
                <PieChart className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                <p className="text-muted-foreground text-sm">
                  Chart placeholder - integrate with charting library
                </p>
              </div>
            </div>
            {/* Mock metrics */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-md p-3 text-center">
                <p className="text-lg font-bold">76%</p>
                <p className="text-muted-foreground text-xs">New Leads</p>
              </div>
              <div className="bg-muted rounded-md p-3 text-center">
                <p className="text-lg font-bold">24%</p>
                <p className="text-muted-foreground text-xs">CRM Re-engagement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-foreground border-2">
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
            <CardDescription>AI-powered recommendations to improve performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="rounded-md border border-green-300 bg-green-50 p-3 dark:bg-green-900/20">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Strong Performance
                </p>
                <p className="mt-1 text-xs text-green-700 dark:text-green-300">
                  123 Main St is outperforming similar listings by 23% in applications
                </p>
              </div>
              <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 dark:bg-yellow-900/20">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Optimization Opportunity
                </p>
                <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                  888 Clinton St has low traffic - consider adjusting price or adding photos
                </p>
              </div>
              <div className="rounded-md border border-blue-300 bg-blue-50 p-3 dark:bg-blue-900/20">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  CRM Opportunity
                </p>
                <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
                  5 CRM leads haven&apos;t been contacted in 7+ days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
