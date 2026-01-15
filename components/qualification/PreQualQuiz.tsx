'use client'

import { useState } from 'react'
import { Calculator, DollarSign, CreditCard, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

type CreditScoreRange = 'excellent' | 'good' | 'fair' | 'poor' | 'unknown'

interface PreQualResult {
  maxRent: number
  incomeRatio: number
  creditBand: CreditScoreRange
  hasEviction: boolean
  qualifiedMessage: string
}

interface PreQualQuizProps {
  onComplete?: (result: PreQualResult) => void
  onCreateProfile?: () => void
  className?: string
}

export function PreQualQuiz({ onComplete, onCreateProfile, className }: PreQualQuizProps) {
  const [annualIncome, setAnnualIncome] = useState('')
  const [creditScore, setCreditScore] = useState<CreditScoreRange | ''>('')
  const [hasEviction, setHasEviction] = useState<'yes' | 'no' | ''>('')
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<PreQualResult | null>(null)

  const canCalculate = annualIncome && creditScore && hasEviction

  const handleCalculate = async () => {
    if (!canCalculate) return

    setIsCalculating(true)

    // Simulate calculation delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const income = parseFloat(annualIncome.replace(/,/g, ''))
    const monthlyIncome = income / 12

    // Standard formula: rent should be ~30-33% of monthly income
    // Or 3x monthly income
    const maxRent = Math.floor(monthlyIncome / 3)

    // Income ratio calculation (using 40x annual as standard)
    const incomeRatio = income / (maxRent * 12)

    let qualifiedMessage = ''
    if (hasEviction === 'yes') {
      qualifiedMessage = `Based on your answers, you may qualify for apartments up to $${maxRent.toLocaleString()}/month, but your eviction history may limit your options. Consider looking for landlords who offer second-chance housing.`
    } else if (creditScore === 'poor' || creditScore === 'fair') {
      qualifiedMessage = `Based on your answers, you qualify for apartments up to $${maxRent.toLocaleString()}/month. Your credit score may require additional security deposit or a co-signer.`
    } else {
      qualifiedMessage = `Based on your answers, you qualify for apartments up to $${maxRent.toLocaleString()}/month. Create a profile for more accurate assessment.`
    }

    const calculatedResult: PreQualResult = {
      maxRent,
      incomeRatio,
      creditBand: creditScore as CreditScoreRange,
      hasEviction: hasEviction === 'yes',
      qualifiedMessage,
    }

    setResult(calculatedResult)

    // Track analytics
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('prequal_completed', {
        maxBudget: maxRent,
        creditBand: creditScore,
        hasEviction: hasEviction === 'yes',
      })
    }

    onComplete?.(calculatedResult)
    setIsCalculating(false)
  }

  const formatCurrency = (value: string) => {
    const num = value.replace(/[^\d]/g, '')
    if (!num) return ''
    return parseInt(num).toLocaleString()
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Budget Pre-Qualification
        </CardTitle>
        <CardDescription>Answer a few questions to see what you can afford</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!result ? (
          <>
            {/* Annual Income */}
            <div className="space-y-2">
              <Label htmlFor="income" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                What&apos;s your annual income?
              </Label>
              <div className="relative">
                <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
                  $
                </span>
                <Input
                  id="income"
                  type="text"
                  placeholder="75,000"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(formatCurrency(e.target.value))}
                  className="pl-7"
                />
              </div>
              <p className="text-muted-foreground text-xs">
                Include all sources: salary, bonuses, investments
              </p>
            </div>

            {/* Credit Score */}
            <div className="space-y-2">
              <Label htmlFor="credit" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                What&apos;s your estimated credit score?
              </Label>
              <Select
                value={creditScore}
                onValueChange={(v) => setCreditScore(v as CreditScoreRange)}
              >
                <SelectTrigger id="credit">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent (750+)</SelectItem>
                  <SelectItem value="good">Good (700-749)</SelectItem>
                  <SelectItem value="fair">Fair (650-699)</SelectItem>
                  <SelectItem value="poor">Poor (below 650)</SelectItem>
                  <SelectItem value="unknown">I don&apos;t know</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Eviction History */}
            <div className="space-y-2">
              <Label htmlFor="eviction" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Do you have any eviction history?
              </Label>
              <Select value={hasEviction} onValueChange={(v) => setHasEviction(v as 'yes' | 'no')}>
                <SelectTrigger id="eviction">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full"
              onClick={handleCalculate}
              disabled={!canCalculate || isCalculating}
            >
              {isCalculating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate My Budget
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            {/* Results */}
            <div className="bg-primary/10 rounded-lg p-6 text-center">
              <p className="text-muted-foreground mb-2 text-sm">Your maximum monthly rent</p>
              <p className="text-primary text-4xl font-bold">${result.maxRent.toLocaleString()}</p>
              <p className="text-muted-foreground mt-2 text-sm">per month</p>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm">{result.qualifiedMessage}</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Next Steps</h4>
              {onCreateProfile && (
                <Button className="w-full" onClick={onCreateProfile}>
                  Create Profile for Accurate Assessment
                </Button>
              )}
              <Button variant="outline" className="w-full" onClick={() => setResult(null)}>
                Recalculate
              </Button>
            </div>

            <p className="text-muted-foreground text-center text-xs">
              This is an estimate based on standard 3x income requirements. Actual qualifications
              vary by landlord and location.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
