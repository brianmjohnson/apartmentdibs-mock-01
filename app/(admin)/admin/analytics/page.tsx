'use client'

import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Target,
  DollarSign,
  Globe,
  Smartphone,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  mockAnalyticsMetrics,
  mockRevenueBreakdown,
  formatCurrency,
  formatNumber,
  getPercentageChange,
} from '@/lib/mock-data/admin'

function MetricCard({
  name,
  value,
  previousValue,
  unit,
  icon: Icon,
}: {
  name: string
  value: number
  previousValue: number
  unit?: string
  icon?: React.ElementType
}) {
  const change = getPercentageChange(value, previousValue)

  return (
    <Card className="border-foreground border-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
        {Icon && <Icon className="text-muted-foreground h-5 w-5" />}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {formatNumber(value)}
          {unit}
        </div>
        <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
          {change.isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
          <span className={change.isPositive ? 'text-green-600' : 'text-red-600'}>
            {change.isPositive ? '+' : '-'}
            {change.value.toFixed(1)}%
          </span>
          <span>vs last month</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
        <p className="text-muted-foreground">Track key metrics and platform performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          name="Daily Active Users"
          value={mockAnalyticsMetrics[0].value}
          previousValue={mockAnalyticsMetrics[0].previousValue}
          icon={Users}
        />
        <MetricCard
          name="Monthly Active Users"
          value={mockAnalyticsMetrics[1].value}
          previousValue={mockAnalyticsMetrics[1].previousValue}
          icon={Users}
        />
        <MetricCard
          name="User Retention (30-day)"
          value={mockAnalyticsMetrics[2].value}
          previousValue={mockAnalyticsMetrics[2].previousValue}
          unit="%"
          icon={Target}
        />
        <MetricCard
          name="Application Conversion"
          value={mockAnalyticsMetrics[3].value}
          previousValue={mockAnalyticsMetrics[3].previousValue}
          unit="%"
          icon={Target}
        />
        <MetricCard
          name="Avg Session Duration"
          value={mockAnalyticsMetrics[4].value}
          previousValue={mockAnalyticsMetrics[4].previousValue}
          unit=" min"
          icon={Clock}
        />
        <MetricCard
          name="Bounce Rate"
          value={mockAnalyticsMetrics[5].value}
          previousValue={mockAnalyticsMetrics[5].previousValue}
          unit="%"
          icon={TrendingDown}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Acquisition Sources */}
        <Card className="border-foreground border-2">
          <CardHeader>
            <CardTitle>User Acquisition Sources</CardTitle>
            <CardDescription>Where users are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { source: 'Organic Search', percentage: 35 },
                { source: 'Direct', percentage: 25 },
                { source: 'Social Media', percentage: 20 },
                { source: 'Referral', percentage: 12 },
                { source: 'Paid Ads', percentage: 8 },
              ].map((item) => (
                <div key={item.source} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.source}</span>
                    <span className="font-medium">{item.percentage}%</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card className="border-foreground border-2">
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>User distribution by region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { region: 'New York City', percentage: 45 },
                { region: 'Los Angeles', percentage: 18 },
                { region: 'Chicago', percentage: 12 },
                { region: 'Houston', percentage: 8 },
                { region: 'Other', percentage: 17 },
              ].map((item) => (
                <div key={item.region} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.region}</span>
                    <span className="font-medium">{item.percentage}%</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
          <CardDescription>Revenue by source this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {mockRevenueBreakdown.map((item) => (
              <div key={item.source} className="border-border border-2 p-4 text-center">
                <div className="text-2xl font-bold">{formatCurrency(item.amount)}</div>
                <div className="mt-1 text-sm font-medium">{item.source}</div>
                <div className="text-muted-foreground mt-1 text-xs">
                  {item.percentage}% of total
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Funnel and Churn */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Conversion Funnel */}
        <Card className="border-foreground border-2">
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>User journey through the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-2 py-8">
              {[
                { label: 'Visit', count: 50000, percentage: 100 },
                { label: 'Signup', count: 12500, percentage: 25 },
                { label: 'Profile', count: 9375, percentage: 75 },
                { label: 'Apply', count: 4688, percentage: 50 },
                { label: 'Leased', count: 1172, percentage: 25 },
              ].map((stage, index) => (
                <div key={stage.label} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="bg-primary/20 border-foreground flex h-16 w-full items-center justify-center border-2 font-bold"
                    style={{
                      opacity: 1 - index * 0.15,
                      transform: `scale(${1 - index * 0.05})`,
                    }}
                  >
                    {formatNumber(stage.count)}
                  </div>
                  <span className="text-muted-foreground text-xs font-medium">{stage.label}</span>
                  {index > 0 && (
                    <span className="text-muted-foreground text-xs">{stage.percentage}%</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Churn Rate */}
        <Card className="border-foreground border-2">
          <CardHeader>
            <CardTitle>Churn Rate</CardTitle>
            <CardDescription>Monthly user churn by persona</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { persona: 'Tenants', rate: 5.2, change: -0.8 },
                { persona: 'Agents', rate: 3.1, change: -0.3 },
                { persona: 'Landlords', rate: 2.8, change: +0.2 },
              ].map((item) => (
                <div
                  key={item.persona}
                  className="border-border flex items-center justify-between border-2 p-3"
                >
                  <span className="font-medium">{item.persona}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{item.rate}%</span>
                    <span
                      className={`text-sm ${item.change < 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {item.change > 0 ? '+' : ''}
                      {item.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Usage */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle>Feature Usage</CardTitle>
          <CardDescription>Engagement with platform features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { feature: 'Search', usage: 89, icon: Globe },
              { feature: 'Applications', usage: 67, icon: Target },
              { feature: 'Messaging', usage: 54, icon: Users },
              { feature: 'Mobile App', usage: 42, icon: Smartphone },
            ].map((item) => (
              <div key={item.feature} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon className="text-muted-foreground h-4 w-4" />
                    <span className="font-medium">{item.feature}</span>
                  </div>
                  <span className="text-sm font-bold">{item.usage}%</span>
                </div>
                <Progress value={item.usage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart Placeholders */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-foreground border-2">
          <CardHeader>
            <CardTitle>DAU/MAU Trend</CardTitle>
            <CardDescription>Daily vs Monthly active users over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-border bg-muted/20 flex h-48 items-center justify-center border-2 border-dashed">
              <p className="text-muted-foreground text-sm">
                Chart placeholder - integrate with charting library
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-foreground border-2">
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>Monthly recurring revenue trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-border bg-muted/20 flex h-48 items-center justify-center border-2 border-dashed">
              <p className="text-muted-foreground text-sm">
                Chart placeholder - integrate with charting library
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
