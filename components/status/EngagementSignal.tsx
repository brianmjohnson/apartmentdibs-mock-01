'use client'

import { Eye, Star, Clock, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface EngagementSignalProps {
  viewCount: number
  isShortlisted: boolean
  ranking?: number
  totalApplicants?: number
  lastViewedAt?: Date
  expectedDecisionDate?: Date
  className?: string
}

export function EngagementSignal({
  viewCount,
  isShortlisted,
  ranking,
  totalApplicants,
  lastViewedAt,
  expectedDecisionDate,
  className,
}: EngagementSignalProps) {
  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
  }

  const getEngagementLevel = () => {
    if (viewCount >= 5) return { label: 'High Interest', color: 'text-green-600' }
    if (viewCount >= 3) return { label: 'Good Interest', color: 'text-blue-600' }
    if (viewCount >= 1) return { label: 'Viewed', color: 'text-yellow-600' }
    return { label: 'Not Yet Viewed', color: 'text-gray-500' }
  }

  const engagement = getEngagementLevel()
  const rankPercentile =
    ranking && totalApplicants
      ? Math.round(((totalApplicants - ranking + 1) / totalApplicants) * 100)
      : null

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5" />
          Landlord Engagement
        </CardTitle>
        <CardDescription>How the landlord has interacted with your application</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* View Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">Profile Views</span>
          </div>
          <div className="text-right">
            <span className="font-semibold">{viewCount}</span>
            <span className={cn('ml-2 text-sm', engagement.color)}>{engagement.label}</span>
          </div>
        </div>

        {lastViewedAt && (
          <p className="text-muted-foreground text-xs">Last viewed: {formatDate(lastViewedAt)}</p>
        )}

        {/* Shortlist Status */}
        {isShortlisted && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium text-yellow-700">You&apos;re Shortlisted!</p>
                <p className="text-sm text-yellow-600">
                  {ranking
                    ? `You're in the top ${ranking} finalists`
                    : "You're among the top candidates"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Ranking */}
        {ranking && totalApplicants && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Your Position</span>
              <span className="font-medium">
                #{ranking} of {totalApplicants}
              </span>
            </div>
            <Progress value={rankPercentile || 0} className="h-2" />
            <p className="text-muted-foreground text-xs">Top {rankPercentile}% of applicants</p>
          </div>
        )}

        {/* Expected Decision */}
        {expectedDecisionDate && (
          <div className="flex items-center justify-between border-t pt-2">
            <div className="flex items-center gap-2">
              <Clock className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">Expected Decision</span>
            </div>
            <Badge variant="secondary">
              {new Date(expectedDecisionDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </Badge>
          </div>
        )}

        {/* Encouragement message */}
        {viewCount > 0 && !isShortlisted && (
          <p className="text-muted-foreground text-xs italic">
            The landlord is actively reviewing applications. Keep your profile up-to-date for the
            best chance.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
