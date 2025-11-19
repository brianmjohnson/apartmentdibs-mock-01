'use client'

import { Users, ArrowRight } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type RiskLevel = 'very_low' | 'low' | 'moderate' | 'high' | 'very_high'

interface ApplicantRisk {
  id: string
  name: string
  score: number
  level: RiskLevel
  keyStrengths?: string[]
  keyRisks?: string[]
}

interface RiskComparisonProps {
  applicants: ApplicantRisk[]
  onSelect?: (applicantId: string) => void
  onViewDetails?: (applicantId: string) => void
  selectedId?: string
  className?: string
}

const levelConfig: Record<RiskLevel, { color: string; bgColor: string }> = {
  very_low: { color: 'text-green-700', bgColor: 'bg-green-100' },
  low: { color: 'text-blue-700', bgColor: 'bg-blue-100' },
  moderate: { color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  high: { color: 'text-orange-700', bgColor: 'bg-orange-100' },
  very_high: { color: 'text-red-700', bgColor: 'bg-red-100' },
}

export function RiskComparison({
  applicants,
  onSelect,
  onViewDetails,
  selectedId,
  className,
}: RiskComparisonProps) {
  // Sort by risk score (lowest risk first)
  const sortedApplicants = [...applicants].sort((a, b) => a.score - b.score)

  // Get the lowest risk applicant for recommendation
  const lowestRisk = sortedApplicants[0]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Risk Comparison
        </CardTitle>
        <CardDescription>
          Compare default risk across {applicants.length} applicants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recommendation */}
        {lowestRisk && (
          <div className="rounded-lg bg-primary/10 p-4">
            <p className="text-sm font-medium text-primary">
              Lowest Risk Applicant
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {lowestRisk.name} has the lowest predicted default rate at{' '}
              {lowestRisk.score}%
            </p>
          </div>
        )}

        {/* Comparison Table */}
        <div className="space-y-3">
          {sortedApplicants.map((applicant, index) => {
            const config = levelConfig[applicant.level]
            const isLowest = index === 0
            const isSelected = applicant.id === selectedId

            return (
              <div
                key={applicant.id}
                className={cn(
                  'rounded-lg border p-4 transition-colors',
                  isSelected && 'border-primary bg-primary/5',
                  isLowest && !isSelected && 'border-green-200 bg-green-50/50'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{applicant.name}</span>
                      {isLowest && (
                        <Badge variant="secondary" className="text-xs">
                          Lowest Risk
                        </Badge>
                      )}
                    </div>
                    <Badge className={cn(config.bgColor, config.color, 'mt-1')}>
                      {applicant.score}% default risk
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    {onViewDetails && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(applicant.id)}
                      >
                        Details
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Visual comparison bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Risk Level</span>
                    <span>{applicant.score}%</span>
                  </div>
                  <Progress
                    value={applicant.score}
                    className={cn(
                      'h-2',
                      applicant.level === 'very_low' && '[&>div]:bg-green-500',
                      applicant.level === 'low' && '[&>div]:bg-blue-500',
                      applicant.level === 'moderate' && '[&>div]:bg-yellow-500',
                      applicant.level === 'high' && '[&>div]:bg-orange-500',
                      applicant.level === 'very_high' && '[&>div]:bg-red-500'
                    )}
                  />
                </div>

                {/* Key Points */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  {applicant.keyStrengths && applicant.keyStrengths.length > 0 && (
                    <div>
                      <p className="font-medium text-green-600 mb-1">Strengths</p>
                      <ul className="space-y-0.5">
                        {applicant.keyStrengths.slice(0, 2).map((s, i) => (
                          <li key={i} className="text-muted-foreground">
                            + {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {applicant.keyRisks && applicant.keyRisks.length > 0 && (
                    <div>
                      <p className="font-medium text-red-600 mb-1">Risks</p>
                      <ul className="space-y-0.5">
                        {applicant.keyRisks.slice(0, 2).map((r, i) => (
                          <li key={i} className="text-muted-foreground">
                            - {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {onSelect && (
                  <Button
                    className="w-full mt-3"
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onSelect(applicant.id)}
                  >
                    {isSelected ? 'Selected' : 'Select Applicant'}
                  </Button>
                )}
              </div>
            )
          })}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Risk scores are predictions, not guarantees. Final selection should
          consider all factors.
        </p>
      </CardContent>
    </Card>
  )
}
