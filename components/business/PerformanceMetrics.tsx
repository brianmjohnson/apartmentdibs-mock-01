'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, Clock, MessageSquare, CheckCircle2 } from 'lucide-react'

interface PerformanceMetricsProps {
  activeListings: number
  avgDaysToFill: number
  responseTime: string
  leasesClosed: number
}

export function PerformanceMetrics({
  activeListings,
  avgDaysToFill,
  responseTime,
  leasesClosed,
}: PerformanceMetricsProps) {
  const metrics = [
    {
      icon: <Home className="h-5 w-5" />,
      label: 'Active Listings',
      value: activeListings.toString(),
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: 'Avg Days to Fill',
      value: avgDaysToFill.toString(),
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: 'Response Time',
      value: responseTime,
    },
    {
      icon: <CheckCircle2 className="h-5 w-5" />,
      label: 'Leases Closed',
      value: leasesClosed.toString(),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="text-center">
              <div className="text-primary bg-primary/10 mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full">
                {metric.icon}
              </div>
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className="text-muted-foreground text-xs">{metric.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
