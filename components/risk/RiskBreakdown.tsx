'use client'

import {
  CreditCard,
  Briefcase,
  DollarSign,
  Home,
  AlertTriangle,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

type FactorType =
  | 'credit_score'
  | 'income_stability'
  | 'income_ratio'
  | 'rental_history'
  | 'eviction_history'
  | 'employment_type'
  | 'references'

interface RiskFactor {
  type: FactorType
  label: string
  value: string
  impact: 'positive' | 'neutral' | 'negative'
  weight: number // 0-100, how much this factor affects the score
  details?: string
}

interface RiskBreakdownProps {
  factors: RiskFactor[]
  className?: string
}

const factorIcons: Record<FactorType, React.ElementType> = {
  credit_score: CreditCard,
  income_stability: Briefcase,
  income_ratio: DollarSign,
  rental_history: Home,
  eviction_history: AlertTriangle,
  employment_type: Briefcase,
  references: Users,
}

export function RiskBreakdown({ factors, className }: RiskBreakdownProps) {
  // Sort factors by weight (most impactful first)
  const sortedFactors = [...factors].sort((a, b) => b.weight - a.weight)

  const positiveFactors = sortedFactors.filter((f) => f.impact === 'positive')
  const negativeFactors = sortedFactors.filter((f) => f.impact === 'negative')
  const neutralFactors = sortedFactors.filter((f) => f.impact === 'neutral')

  const getImpactIcon = (impact: RiskFactor['impact']) => {
    switch (impact) {
      case 'positive':
        return <TrendingDown className="h-4 w-4 text-green-500" />
      case 'negative':
        return <TrendingUp className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getImpactColor = (impact: RiskFactor['impact']) => {
    switch (impact) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const renderFactor = (factor: RiskFactor) => {
    const Icon = factorIcons[factor.type]

    return (
      <div key={factor.type} className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">{factor.label}</span>
          </div>
          <div className="flex items-center gap-2">
            {getImpactIcon(factor.impact)}
            <span className={cn('text-sm font-medium', getImpactColor(factor.impact))}>
              {factor.value}
            </span>
          </div>
        </div>
        <div className="ml-6">
          <div className="flex items-center gap-2 mb-1">
            <Progress value={factor.weight} className="h-1.5 flex-1" />
            <span className="text-xs text-muted-foreground w-8">
              {factor.weight}%
            </span>
          </div>
          {factor.details && (
            <p className="text-xs text-muted-foreground">{factor.details}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Risk Factor Breakdown</CardTitle>
        <CardDescription>
          How each factor contributes to the risk score
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Positive Factors */}
        {positiveFactors.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-green-600 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Positive Factors
            </h3>
            <div className="space-y-4">
              {positiveFactors.map(renderFactor)}
            </div>
          </div>
        )}

        {positiveFactors.length > 0 && negativeFactors.length > 0 && <Separator />}

        {/* Negative Factors */}
        {negativeFactors.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-red-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Risk Factors
            </h3>
            <div className="space-y-4">
              {negativeFactors.map(renderFactor)}
            </div>
          </div>
        )}

        {(positiveFactors.length > 0 || negativeFactors.length > 0) &&
          neutralFactors.length > 0 && <Separator />}

        {/* Neutral Factors */}
        {neutralFactors.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Minus className="h-4 w-4" />
              Neutral Factors
            </h3>
            <div className="space-y-4">
              {neutralFactors.map(renderFactor)}
            </div>
          </div>
        )}

        <div className="rounded-lg bg-muted p-3">
          <p className="text-xs text-muted-foreground">
            Weights indicate how much each factor affects the overall risk score.
            Higher weights mean greater influence on the prediction.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
