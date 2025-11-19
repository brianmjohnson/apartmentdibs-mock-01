'use client'

import Link from 'next/link'
import {
  Users,
  Building,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  UserPlus,
  Flag,
  Headphones,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  mockAdminStats,
  mockAdminProfile,
  mockRecentActivities,
  formatCurrency,
  formatNumber,
  formatDateTime,
  getPercentageChange,
} from '@/lib/mock-data/admin'

function KPICard({
  title,
  value,
  trend,
  trendValue,
  icon: Icon,
  subtitle,
}: {
  title: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon: React.ElementType
  subtitle?: string
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
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
}

function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case 'user_signup':
      return <UserPlus className="h-4 w-4 text-blue-500" />
    case 'flagged_content':
      return <Flag className="h-4 w-4 text-red-500" />
    case 'support_ticket':
      return <Headphones className="h-4 w-4 text-yellow-500" />
    case 'compliance_alert':
      return <AlertTriangle className="h-4 w-4 text-orange-500" />
    case 'listing_removed':
      return <Building className="h-4 w-4 text-gray-500" />
    default:
      return <FileText className="h-4 w-4" />
  }
}

export default function AdminDashboard() {
  const revenueChange = getPercentageChange(
    mockAdminStats.revenueThisMonth,
    mockAdminStats.previousMonthRevenue
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {mockAdminProfile.name.split(' ')[0]}. Here&apos;s your platform overview.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Users"
          value={formatNumber(mockAdminStats.totalUsers)}
          trend="up"
          trendValue="+5.2% this month"
          icon={Users}
          subtitle={`${formatNumber(mockAdminStats.usersByPersona.tenants)} tenants, ${formatNumber(mockAdminStats.usersByPersona.agents)} agents`}
        />
        <KPICard
          title="Active Listings"
          value={formatNumber(mockAdminStats.activeListings)}
          trend="up"
          trendValue="+127 this week"
          icon={Building}
        />
        <KPICard
          title="Applications This Month"
          value={formatNumber(mockAdminStats.applicationsThisMonth)}
          trend="up"
          trendValue="+12.3% vs last month"
          icon={FileText}
        />
        <KPICard
          title="Revenue This Month"
          value={formatCurrency(mockAdminStats.revenueThisMonth)}
          trend={revenueChange.isPositive ? 'up' : 'down'}
          trendValue={`${revenueChange.isPositive ? '+' : '-'}${revenueChange.value.toFixed(1)}% vs last month`}
          icon={DollarSign}
        />
      </div>

      {/* User Breakdown */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle>User Breakdown by Persona</CardTitle>
          <CardDescription>Distribution of users across different roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border-2 border-border">
              <div className="text-2xl font-bold">{formatNumber(mockAdminStats.usersByPersona.tenants)}</div>
              <div className="text-sm text-muted-foreground">Tenants</div>
              <div className="text-xs text-muted-foreground mt-1">
                {((mockAdminStats.usersByPersona.tenants / mockAdminStats.totalUsers) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="text-center p-4 border-2 border-border">
              <div className="text-2xl font-bold">{formatNumber(mockAdminStats.usersByPersona.agents)}</div>
              <div className="text-sm text-muted-foreground">Agents</div>
              <div className="text-xs text-muted-foreground mt-1">
                {((mockAdminStats.usersByPersona.agents / mockAdminStats.totalUsers) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="text-center p-4 border-2 border-border">
              <div className="text-2xl font-bold">{formatNumber(mockAdminStats.usersByPersona.landlords)}</div>
              <div className="text-sm text-muted-foreground">Landlords</div>
              <div className="text-xs text-muted-foreground mt-1">
                {((mockAdminStats.usersByPersona.landlords / mockAdminStats.totalUsers) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="text-center p-4 border-2 border-border">
              <div className="text-2xl font-bold">{formatNumber(mockAdminStats.usersByPersona.admins)}</div>
              <div className="text-sm text-muted-foreground">Admins</div>
              <div className="text-xs text-muted-foreground mt-1">
                {((mockAdminStats.usersByPersona.admins / mockAdminStats.totalUsers) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Placeholder */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2 border-foreground">
          <CardHeader>
            <CardTitle>User Growth Over Time</CardTitle>
            <CardDescription>Monthly user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center border-2 border-dashed border-border bg-muted/20">
              <p className="text-sm text-muted-foreground">
                Chart placeholder - integrate with charting library
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-foreground">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center border-2 border-dashed border-border bg-muted/20">
              <p className="text-sm text-muted-foreground">
                Chart placeholder - integrate with charting library
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications by Status Chart */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle>Applications by Status</CardTitle>
          <CardDescription>Current application pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-2 py-8">
            {[
              { label: 'Submitted', count: 3421 },
              { label: 'Under Review', count: 2156 },
              { label: 'Verified', count: 1847 },
              { label: 'Approved', count: 1234 },
              { label: 'Leased', count: 892 },
            ].map((stage, index) => (
              <div key={stage.label} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-full h-16 bg-primary/20 border-2 border-foreground flex items-center justify-center font-bold"
                  style={{
                    opacity: 1 - index * 0.15,
                    transform: `scale(${1 - index * 0.05})`,
                  }}
                >
                  {formatNumber(stage.count)}
                </div>
                <span className="text-xs font-medium text-muted-foreground">{stage.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Recent Activity
          </CardTitle>
          <CardDescription>Latest platform events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="mt-1 p-2 rounded-md bg-muted">
                  <ActivityIcon type={activity.type} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(activity.timestamp)}
                  </p>
                </div>
                {activity.link && (
                  <Link href={activity.link}>
                    <Button variant="outline" size="sm" className="border-2">
                      View
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/admin/users">
            <Button className="border-2 border-foreground">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
          </Link>
          <Link href="/admin/listings">
            <Button variant="outline" className="border-2">
              <Building className="mr-2 h-4 w-4" />
              Review Listings
            </Button>
          </Link>
          <Link href="/admin/support">
            <Button variant="outline" className="border-2">
              <Headphones className="mr-2 h-4 w-4" />
              Support Queue
            </Button>
          </Link>
          <Link href="/admin/compliance">
            <Button variant="outline" className="border-2">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Compliance Alerts
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
