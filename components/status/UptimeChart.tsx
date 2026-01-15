'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface DayStatus {
  date: Date
  uptime: number
  status: 'operational' | 'degraded' | 'outage'
  incidents?: number
}

interface UptimeChartProps {
  data: DayStatus[]
  days?: number
  className?: string
}

export function UptimeChart({ data, days = 90, className }: UptimeChartProps) {
  const displayData = data.slice(-days)

  const averageUptime = displayData.reduce((sum, day) => sum + day.uptime, 0) / displayData.length

  const getStatusColor = (status: DayStatus['status']) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500'
      case 'degraded':
        return 'bg-yellow-500'
      case 'outage':
        return 'bg-red-500'
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Uptime</CardTitle>
            <CardDescription>Last {days} days</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">{averageUptime.toFixed(2)}%</p>
            <p className="text-muted-foreground text-sm">average</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="flex gap-0.5">
            {displayData.map((day, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div
                    className={`h-8 flex-1 cursor-pointer rounded-sm ${getStatusColor(day.status)} transition-opacity hover:opacity-80`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">
                    <p className="font-medium">{formatDate(day.date)}</p>
                    <p>Uptime: {day.uptime.toFixed(2)}%</p>
                    {day.incidents && day.incidents > 0 && (
                      <p className="text-muted-foreground">
                        {day.incidents} {day.incidents === 1 ? 'incident' : 'incidents'}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        <div className="text-muted-foreground mt-4 flex items-center justify-between text-sm">
          <span>{days} days ago</span>
          <span>Today</span>
        </div>

        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-green-500" />
            <span>Operational</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-yellow-500" />
            <span>Degraded</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-red-500" />
            <span>Outage</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
