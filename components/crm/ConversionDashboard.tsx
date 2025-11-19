'use client'

import { TrendingUp, Users, FileText, Clock, DollarSign } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface ConversionMetrics {
  leadsContactedThisMonth: number
  applicationsReceived: number
  leaseConversionRate: number
  avgDaysToFillCRM: number
  avgDaysToFillNew: number
  totalLeads: number
  activeLeads: number
  expiringSoonCount: number
  estimatedRevenueSaved: number
}

interface ConversionDashboardProps {
  metrics: ConversionMetrics
  className?: string
}

export function ConversionDashboard({ metrics, className }: ConversionDashboardProps) {
  const conversionFunnel = [
    {
      label: 'Total CRM Leads',
      value: metrics.totalLeads,
      percentage: 100,
    },
    {
      label: 'Active Leads',
      value: metrics.activeLeads,
      percentage: (metrics.activeLeads / metrics.totalLeads) * 100,
    },
    {
      label: 'Contacted This Month',
      value: metrics.leadsContactedThisMonth,
      percentage: (metrics.leadsContactedThisMonth / metrics.totalLeads) * 100,
    },
    {
      label: 'Applications Received',
      value: metrics.applicationsReceived,
      percentage: (metrics.applicationsReceived / metrics.totalLeads) * 100,
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.leaseConversionRate}%</div>
            <p className="text-muted-foreground text-xs">CRM leads to signed leases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.avgDaysToFillNew - metrics.avgDaysToFillCRM} days
            </div>
            <p className="text-muted-foreground text-xs">
              Faster fill vs. new leads ({metrics.avgDaysToFillCRM} vs {metrics.avgDaysToFillNew}{' '}
              days)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeLeads}</div>
            <p className="text-muted-foreground text-xs">
              {metrics.expiringSoonCount} expiring soon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.estimatedRevenueSaved)}
            </div>
            <p className="text-muted-foreground text-xs">Estimated from CRM conversions</p>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">CRM Conversion Funnel</CardTitle>
          <CardDescription>Track your leads from CRM entry to lease signing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {conversionFunnel.map((stage, index) => (
            <div key={stage.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{stage.label}</span>
                <span className="font-medium">{stage.value}</span>
              </div>
              <Progress value={stage.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ROI Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ROI Summary</CardTitle>
          <CardDescription>Estimated value from CRM lead conversions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Applications from CRM</span>
              <span className="font-medium">{metrics.applicationsReceived}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Conversion Rate</span>
              <span className="font-medium">{metrics.leaseConversionRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Time Saved per Fill</span>
              <span className="font-medium">
                {metrics.avgDaysToFillNew - metrics.avgDaysToFillCRM} days
              </span>
            </div>
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Estimated Revenue Impact</span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(metrics.estimatedRevenueSaved)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
