'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface RentChartProps {
  data: {
    month: string
    rent: number
  }[]
  averageRent: number
  cityAverage: number
}

export function RentChart({ data, averageRent, cityAverage }: RentChartProps) {
  // Calculate trend
  const firstRent = data[0]?.rent || 0
  const lastRent = data[data.length - 1]?.rent || 0
  const percentChange = firstRent > 0 ? ((lastRent - firstRent) / firstRent) * 100 : 0
  const trendUp = percentChange > 1
  const trendDown = percentChange < -1

  // Find max for scaling
  const maxRent = Math.max(...data.map((d) => d.rent))
  const minRent = Math.min(...data.map((d) => d.rent))
  const range = maxRent - minRent || 1

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rent Prices</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current average */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-muted-foreground text-sm">Average 1BR Rent</p>
            <p className="text-3xl font-bold">${averageRent.toLocaleString()}</p>
            <div className="mt-1 flex items-center justify-center gap-1 text-sm">
              {trendUp && <TrendingUp className="h-4 w-4 text-red-500" />}
              {trendDown && <TrendingDown className="h-4 w-4 text-green-500" />}
              {!trendUp && !trendDown && <Minus className="text-muted-foreground h-4 w-4" />}
              <span className={trendUp ? 'text-red-500' : trendDown ? 'text-green-500' : 'text-muted-foreground'}>
                {Math.abs(percentChange).toFixed(1)}% YoY
              </span>
            </div>
          </div>
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-muted-foreground text-sm">vs City Average</p>
            <p className="text-3xl font-bold">
              {averageRent > cityAverage ? '+' : ''}
              {Math.round(((averageRent - cityAverage) / cityAverage) * 100)}%
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              City avg: ${cityAverage.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Simple bar chart */}
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium">12-Month Trend</p>
          <div className="flex h-24 items-end gap-1">
            {data.map((item, index) => {
              const height = ((item.rent - minRent) / range) * 100
              return (
                <div
                  key={index}
                  className="group relative flex-1"
                  title={`${item.month}: $${item.rent.toLocaleString()}`}
                >
                  <div
                    className="bg-primary/70 hover:bg-primary w-full rounded-t transition-colors"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  />
                  <div className="absolute -bottom-5 left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-xs group-hover:block">
                    ${item.rent.toLocaleString()}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="text-muted-foreground mt-6 flex justify-between text-xs">
            <span>{data[0]?.month}</span>
            <span>{data[data.length - 1]?.month}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Rent breakdown by unit type
interface RentBreakdownProps {
  studio: number
  oneBed: number
  twoBed: number
  threeBed: number
}

export function RentBreakdown({ studio, oneBed, twoBed, threeBed }: RentBreakdownProps) {
  const units = [
    { type: 'Studio', rent: studio },
    { type: '1 Bedroom', rent: oneBed },
    { type: '2 Bedroom', rent: twoBed },
    { type: '3 Bedroom', rent: threeBed },
  ]

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Average Rent by Unit Type</p>
      <div className="space-y-2">
        {units.map((unit) => (
          <div key={unit.type} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{unit.type}</span>
            <span className="font-medium">${unit.rent.toLocaleString()}/mo</span>
          </div>
        ))}
      </div>
    </div>
  )
}
