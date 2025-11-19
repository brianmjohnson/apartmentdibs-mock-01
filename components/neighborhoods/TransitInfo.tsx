'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Train, Clock, Footprints, Bike } from 'lucide-react'

interface TransitInfoProps {
  subwayLines: string[]
  travelTimes: {
    destination: string
    time: string
  }[]
  walkScore: number
  bikeScore: number
}

export function TransitInfo({ subwayLines, travelTimes, walkScore, bikeScore }: TransitInfoProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    if (score >= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Walker\'s Paradise'
    if (score >= 70) return 'Very Walkable'
    if (score >= 50) return 'Somewhat Walkable'
    return 'Car-Dependent'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Train className="h-5 w-5" />
          Transit & Transportation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Subway Lines */}
        <div>
          <p className="mb-2 text-sm font-medium">Subway Lines</p>
          <div className="flex flex-wrap gap-2">
            {subwayLines.map((line) => (
              <Badge key={line} variant="outline" className="font-mono">
                {line}
              </Badge>
            ))}
          </div>
        </div>

        {/* Travel Times */}
        <div>
          <p className="mb-2 text-sm font-medium">Travel Times</p>
          <div className="space-y-2">
            {travelTimes.map((item) => (
              <div key={item.destination} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.destination}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Walk & Bike Scores */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-3 text-center">
            <div className="mb-1 flex items-center justify-center gap-1">
              <Footprints className="h-4 w-4" />
              <span className="text-sm font-medium">Walk Score</span>
            </div>
            <p className={`text-2xl font-bold ${getScoreColor(walkScore)}`}>{walkScore}</p>
            <p className="text-muted-foreground text-xs">{getScoreLabel(walkScore)}</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <div className="mb-1 flex items-center justify-center gap-1">
              <Bike className="h-4 w-4" />
              <span className="text-sm font-medium">Bike Score</span>
            </div>
            <p className={`text-2xl font-bold ${getScoreColor(bikeScore)}`}>{bikeScore}</p>
            <p className="text-muted-foreground text-xs">
              {bikeScore >= 70 ? 'Very Bikeable' : bikeScore >= 50 ? 'Bikeable' : 'Some Bike Infrastructure'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
