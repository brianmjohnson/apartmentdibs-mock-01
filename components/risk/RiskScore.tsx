'use client'

import { Shield, Info, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type RiskLevel = 'very_low' | 'low' | 'moderate' | 'high' | 'very_high'

interface RiskScoreProps {
  score: number // Default probability percentage (0-100)
  level: RiskLevel
  confidence?: number // Confidence interval (0-100)
  comparisonToAverage?: 'better' | 'average' | 'worse'
  showDetails?: boolean
  className?: string
}

const riskConfig: Record<
  RiskLevel,
  { label: string; color: string; bgColor: string; description: string }
> = {
  very_low: {
    label: 'Very Low Risk',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    description: 'Excellent candidate with minimal default risk',
  },
  low: {
    label: 'Low Risk',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    description: 'Strong candidate with low default probability',
  },
  moderate: {
    label: 'Moderate Risk',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    description: 'Average risk profile, review factors carefully',
  },
  high: {
    label: 'High Risk',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    description: 'Above average default risk, consider mitigations',
  },
  very_high: {
    label: 'Very High Risk',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    description: 'Significant default risk, review thoroughly',
  },
}

export function RiskScore({
  score,
  level,
  confidence = 85,
  comparisonToAverage,
  showDetails = true,
  className,
}: RiskScoreProps) {
  const config = riskConfig[level]

  const getComparisonIcon = () => {
    switch (comparisonToAverage) {
      case 'better':
        return <TrendingDown className="h-4 w-4 text-green-500" />
      case 'worse':
        return <TrendingUp className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getComparisonLabel = () => {
    switch (comparisonToAverage) {
      case 'better':
        return 'Below average risk'
      case 'worse':
        return 'Above average risk'
      default:
        return 'Average risk'
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Risk Assessment
            </CardTitle>
            <CardDescription>Predicted default probability</CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="text-muted-foreground h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Risk score is calculated using credit history, income stability, rental history,
                  and other factors. Based on analysis of 50,000+ historical tenant outcomes.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Score Display */}
        <div className={cn('rounded-lg p-6 text-center', config.bgColor)}>
          <div className="mb-2">
            <Badge className={cn(config.bgColor, config.color, 'text-sm font-medium')}>
              {config.label}
            </Badge>
          </div>
          <p className={cn('text-4xl font-bold', config.color)}>{score}%</p>
          <p className="text-muted-foreground mt-1 text-sm">Predicted default rate</p>
        </div>

        {showDetails && (
          <>
            {/* Description */}
            <p className="text-muted-foreground text-sm">{config.description}</p>

            {/* Comparison to Average */}
            {comparisonToAverage && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">vs. Platform Average</span>
                <div className="flex items-center gap-1">
                  {getComparisonIcon()}
                  <span>{getComparisonLabel()}</span>
                </div>
              </div>
            )}

            {/* Confidence */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Model Confidence</span>
              <span className="font-medium">{confidence}%</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// Compact version for use in tables/lists
export function RiskScoreBadge({
  score,
  level,
  className,
}: {
  score: number
  level: RiskLevel
  className?: string
}) {
  const config = riskConfig[level]

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={cn(config.bgColor, config.color, 'cursor-help', className)}>
            {score}%
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{config.label}</p>
          <p className="text-xs">{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
