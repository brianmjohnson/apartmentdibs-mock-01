'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface MatchScoreBadgeProps {
  score: number
  showTooltip?: boolean
  className?: string
}

export function MatchScoreBadge({ score, showTooltip = true, className }: MatchScoreBadgeProps) {
  const getScoreConfig = (score: number) => {
    if (score >= 90) {
      return {
        label: 'Excellent Match',
        className: 'bg-green-500 hover:bg-green-600 text-white',
      }
    }
    if (score >= 75) {
      return {
        label: 'Good Match',
        className: 'bg-blue-500 hover:bg-blue-600 text-white',
      }
    }
    if (score >= 60) {
      return {
        label: 'Fair Match',
        className: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      }
    }
    return {
      label: 'Low Match',
      className: 'bg-gray-500 hover:bg-gray-600 text-white',
    }
  }

  const config = getScoreConfig(score)

  const badge = <Badge className={cn(config.className, className)}>{score}% Match</Badge>

  if (!showTooltip) return badge

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <p>{config.label}</p>
          <p className="text-muted-foreground mt-1 text-xs">
            Based on budget, location, move-in date, and must-haves
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
