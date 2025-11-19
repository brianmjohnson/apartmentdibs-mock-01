'use client'

import {
  Building,
  Home,
  Clock,
  DollarSign,
  AlertCircle,
  FileText,
  Wrench,
  CreditCard,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  mockLandlordProfile,
  mockProperties,
  mockUnits,
  mockLandlordActivities,
  mockPendingDecisions,
  mockLeaseExpirations,
  formatCurrency,
  formatRelativeTime
} from '@/lib/mock-data/landlord'

function KPICard({
  title,
  value,
  subtext,
  icon: Icon
}: {
  title: string
  value: string | number
  subtext?: string
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
        {subtext && (
          <p className="text-sm text-muted-foreground mt-1">{subtext}</p>
        )}
      </CardContent>
    </Card>
  )
}

function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case 'application':
      return <FileText className="h-4 w-4" />
    case 'agent_update':
      return <Building className="h-4 w-4" />
    case 'maintenance':
      return <Wrench className="h-4 w-4" />
    case 'payment':
      return <CreditCard className="h-4 w-4" />
    case 'lease':
      return <Calendar className="h-4 w-4" />
    default:
      return <FileText className="h-4 w-4" />
  }
}

export default function LandlordDashboard() {
  const vacantUnits = mockUnits.filter(unit => unit.status !== 'occupied').length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {mockLandlordProfile.name.split(' ')[0]}. Here&apos;s your portfolio overview.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Properties"
          value={mockLandlordProfile.properties}
          subtext={`${mockLandlordProfile.totalUnits} total units`}
          icon={Building}
        />
        <KPICard
          title="Vacant Units"
          value={vacantUnits}
          subtext={`${mockLandlordProfile.occupiedUnits} occupied`}
          icon={Home}
        />
        <KPICard
          title="Pending Decisions"
          value={mockPendingDecisions.length}
          subtext="Applicants awaiting review"
          icon={Clock}
        />
        <KPICard
          title="Monthly Revenue"
          value={formatCurrency(mockLandlordProfile.monthlyRevenue)}
          subtext="From all properties"
          icon={DollarSign}
        />
      </div>

      {/* Pending Decisions Section */}
      {mockPendingDecisions.length > 0 && (
        <Card className="border-2 border-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Pending Decisions
            </CardTitle>
            <CardDescription>
              Listings awaiting your applicant selection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPendingDecisions.map((decision) => (
                <div
                  key={decision.id}
                  className="p-4 border-2 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">
                        {decision.propertyAddress}, Unit {decision.unitNumber}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {decision.shortlistedCount} shortlisted applicants - {formatCurrency(decision.price)}/mo
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Pending for {decision.daysPending} days
                      </p>
                    </div>
                    <Link href={`/landlord/listings/${decision.listingId}`}>
                      <Button size="sm" className="border-2 border-foreground">
                        Review Applicants
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Lease Expirations */}
        <Card className="border-2 border-foreground">
          <CardHeader>
            <CardTitle>Upcoming Lease Expirations</CardTitle>
            <CardDescription>
              Units with leases expiring soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockLeaseExpirations.slice(0, 4).map((expiration) => (
                <div key={expiration.id} className="flex items-center justify-between gap-4 p-3 border-2 border-border">
                  <div>
                    <p className="font-medium text-sm">
                      {expiration.propertyAddress}, Unit {expiration.unitNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {expiration.tenantName}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={expiration.daysUntilExpiration <= 30
                        ? 'border-red-400 text-red-700 dark:text-red-300'
                        : expiration.daysUntilExpiration <= 60
                        ? 'border-yellow-400 text-yellow-700 dark:text-yellow-300'
                        : 'border-blue-400 text-blue-700 dark:text-blue-300'
                      }
                    >
                      {expiration.daysUntilExpiration} days
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(expiration.rent)}/mo
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="border-2">
                Send Renewals
              </Button>
              <Button variant="outline" size="sm" className="border-2">
                Start Marketing
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-2 border-foreground">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates across your properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockLandlordActivities.slice(0, 5).map((activity) => (
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
      </div>

      {/* Quick Actions */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/landlord/properties/create">
            <Button className="border-2 border-foreground">
              <Building className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </Link>
          <Link href="/landlord/properties">
            <Button variant="outline" className="border-2">
              <Home className="mr-2 h-4 w-4" />
              View Properties
            </Button>
          </Link>
          <Link href="/landlord/listings">
            <Button variant="outline" className="border-2">
              <FileText className="mr-2 h-4 w-4" />
              Manage Listings
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
