'use client'

import { DollarSign, Users, Shield, Star, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface MemberSummary {
  id: string
  name: string
  annualIncome: number
  creditScore?: number
  creditBand: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Pending'
  hasEvictionHistory: boolean
  backgroundCheckStatus: 'pass' | 'review' | 'fail' | 'pending'
  referencesComplete: boolean
}

interface HouseholdSummaryProps {
  members: MemberSummary[]
  monthlyRent: number
  requiredIncomeRatio?: number
  minimumCreditScore?: number
  className?: string
}

export function HouseholdSummary({
  members,
  monthlyRent,
  requiredIncomeRatio = 3,
  minimumCreditScore = 650,
  className,
}: HouseholdSummaryProps) {
  // Calculate combined metrics
  const totalAnnualIncome = members.reduce((sum, m) => sum + m.annualIncome, 0)
  const totalMonthlyIncome = totalAnnualIncome / 12
  const incomeToRentRatio = totalMonthlyIncome / monthlyRent
  const meetsIncomeRequirement = incomeToRentRatio >= requiredIncomeRatio

  // Credit score analysis
  const membersWithCredit = members.filter((m) => m.creditScore)
  const avgCreditScore =
    membersWithCredit.length > 0
      ? Math.round(
          membersWithCredit.reduce((sum, m) => sum + (m.creditScore || 0), 0) /
            membersWithCredit.length
        )
      : null
  const lowestCreditScore =
    membersWithCredit.length > 0
      ? Math.min(...membersWithCredit.map((m) => m.creditScore || 0))
      : null
  const meetsCreditRequirement = lowestCreditScore ? lowestCreditScore >= minimumCreditScore : false

  // Background check summary
  const hasEvictionHistory = members.some((m) => m.hasEvictionHistory)
  const allBackgroundsPassed = members.every((m) => m.backgroundCheckStatus === 'pass')
  const anyBackgroundFailed = members.some((m) => m.backgroundCheckStatus === 'fail')

  // Overall qualification
  const qualificationScore = [
    meetsIncomeRequirement,
    meetsCreditRequirement,
    !hasEvictionHistory,
    allBackgroundsPassed,
  ].filter(Boolean).length

  const getQualificationStatus = () => {
    if (qualificationScore === 4)
      return { label: 'Excellent Match', color: 'text-green-600', bg: 'bg-green-50' }
    if (qualificationScore >= 3)
      return { label: 'Good Match', color: 'text-blue-600', bg: 'bg-blue-50' }
    if (qualificationScore >= 2)
      return { label: 'Fair Match', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    return { label: 'Needs Review', color: 'text-red-600', bg: 'bg-red-50' }
  }

  const status = getQualificationStatus()

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Household Summary
        </CardTitle>
        <CardDescription>
          Combined qualifications for all {members.length} applicants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Status */}
        <div className={cn('rounded-lg p-4', status.bg)}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn('font-semibold', status.color)}>{status.label}</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {qualificationScore}/4 requirements met
              </p>
            </div>
            <div className="text-right">
              <Badge
                variant={qualificationScore >= 3 ? 'default' : 'secondary'}
                className="px-3 py-1 text-lg"
              >
                {Math.round((qualificationScore / 4) * 100)}%
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Income Analysis */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="text-muted-foreground h-4 w-4" />
            <span className="font-medium">Combined Income</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Total Annual</span>
              <span className="font-medium">${totalAnnualIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Monthly Income</span>
              <span className="font-medium">
                ${Math.round(totalMonthlyIncome).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Income-to-Rent Ratio</span>
              <span
                className={cn(
                  'font-medium',
                  meetsIncomeRequirement ? 'text-green-600' : 'text-red-600'
                )}
              >
                {incomeToRentRatio.toFixed(1)}x{' '}
                {!meetsIncomeRequirement && `(${requiredIncomeRatio}x required)`}
              </span>
            </div>
            <Progress
              value={Math.min((incomeToRentRatio / requiredIncomeRatio) * 100, 100)}
              className="h-2"
            />
          </div>
        </div>

        <Separator />

        {/* Credit Summary */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="text-muted-foreground h-4 w-4" />
            <span className="font-medium">Credit Summary</span>
          </div>
          <div className="space-y-2">
            {avgCreditScore && (
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Average Score</span>
                <span className="font-medium">{avgCreditScore}</span>
              </div>
            )}
            {lowestCreditScore && (
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Lowest Score</span>
                <span
                  className={cn(
                    'font-medium',
                    meetsCreditRequirement ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {lowestCreditScore}
                </span>
              </div>
            )}
            <div className="flex flex-wrap gap-1">
              {members.map((member) => (
                <Badge key={member.id} variant="outline" className="text-xs">
                  {member.name.split(' ')[0]}: {member.creditBand}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Background Check Summary */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="text-muted-foreground h-4 w-4" />
            <span className="font-medium">Background Checks</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Status</span>
              {anyBackgroundFailed ? (
                <Badge variant="destructive">Review Required</Badge>
              ) : allBackgroundsPassed ? (
                <Badge className="bg-green-500">All Passed</Badge>
              ) : (
                <Badge variant="secondary">Pending</Badge>
              )}
            </div>
            {hasEvictionHistory && (
              <div className="flex items-center gap-2 text-sm text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                <span>Eviction history found</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Individual Breakdown */}
        <div className="space-y-3">
          <span className="text-sm font-medium">Individual Contributions</span>
          <div className="space-y-2">
            {members.map((member) => (
              <div key={member.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{member.name}</span>
                <span>${(member.annualIncome / 12).toLocaleString()}/mo</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
