'use client'

import {
  Building,
  Users,
  Clock,
  UserPlus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  FileText,
  CheckCircle,
  MessageSquare,
  Globe
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  mockAgentProfile,
  mockAgentActivities,
  mockUrgentActions,
  formatRelativeTime
} from '@/lib/mock-data/agent'

function KPICard({
  title,
  value,
  trend,
  trendValue,
  icon: Icon
}: {
  title: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon: React.ElementType
}) {
  return (
    <Card className="border-2 border-foreground">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {trendValue && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
            {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
            <span className={trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : ''}>
              {trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case 'application':
      return <FileText className="h-4 w-4" />
    case 'decision':
      return <CheckCircle className="h-4 w-4" />
    case 'crm_match':
      return <Users className="h-4 w-4" />
    case 'inquiry':
      return <MessageSquare className="h-4 w-4" />
    case 'syndication':
      return <Globe className="h-4 w-4" />
    default:
      return <FileText className="h-4 w-4" />
  }
}

export default function AgentDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {mockAgentProfile.name.split(' ')[0]}. Here&apos;s your overview.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Listings"
          value={mockAgentProfile.activeListings}
          trend="up"
          trendValue="+2 this week"
          icon={Building}
        />
        <KPICard
          title="Total Applicants"
          value={mockAgentProfile.totalApplicants}
          trend="up"
          trendValue="+12 this month"
          icon={Users}
        />
        <KPICard
          title="Avg Days-to-Fill"
          value={mockAgentProfile.avgDaysToFill}
          trend="down"
          trendValue="-3 days"
          icon={Clock}
        />
        <KPICard
          title="CRM Leads"
          value={mockAgentProfile.crmLeads}
          trendValue="Awaiting outreach"
          icon={UserPlus}
        />
      </div>

      {/* Applications Funnel Placeholder */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle>Applications Funnel</CardTitle>
          <CardDescription>
            Pipeline overview for all active listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-2 py-8">
            {['Inquiries', 'Applications', 'Verified', 'Shortlisted', 'Leased'].map((stage, index) => (
              <div key={stage} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-full h-16 bg-primary/20 border-2 border-foreground flex items-center justify-center font-bold"
                  style={{
                    opacity: 1 - (index * 0.15),
                    transform: `scale(${1 - (index * 0.05)})`
                  }}
                >
                  {[156, 47, 38, 12, 3][index]}
                </div>
                <span className="text-xs font-medium text-muted-foreground">{stage}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Chart placeholder - integrate with charting library
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity Feed */}
        <Card className="border-2 border-foreground">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates across your listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAgentActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-1 p-2 rounded-md bg-muted">
                    <ActivityIcon type={activity.type} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 border-2">
              View All Activity
            </Button>
          </CardContent>
        </Card>

        {/* Urgent Actions */}
        <Card className="border-2 border-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Urgent Actions
            </CardTitle>
            <CardDescription>
              Items requiring your immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUrgentActions.map((action) => (
                <div
                  key={action.id}
                  className="p-4 border-2 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">{action.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {action.description}
                      </p>
                    </div>
                    {action.daysOld && (
                      <Badge variant="outline" className="shrink-0 border-yellow-400 text-yellow-700 dark:text-yellow-300">
                        {action.daysOld}d
                      </Badge>
                    )}
                  </div>
                  {action.listingId && (
                    <Link href={`/dashboard/listings/${action.listingId}`}>
                      <Button size="sm" variant="outline" className="mt-3 border-2">
                        View Listing
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/dashboard/listings/create">
            <Button className="border-2 border-foreground">
              <Building className="mr-2 h-4 w-4" />
              Create Listing
            </Button>
          </Link>
          <Link href="/dashboard/leads">
            <Button variant="outline" className="border-2">
              <UserPlus className="mr-2 h-4 w-4" />
              View CRM Leads
            </Button>
          </Link>
          <Link href="/dashboard/applications">
            <Button variant="outline" className="border-2">
              <FileText className="mr-2 h-4 w-4" />
              Review Applications
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
