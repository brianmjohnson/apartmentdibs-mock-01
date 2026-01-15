'use client'

import { useState } from 'react'
import { Calculator, DollarSign, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'

interface ROICalculatorProps {
  complianceTierPrice?: number
  onCalculate?: (estimatedSavings: number) => void
  className?: string
}

export function ROICalculator({
  complianceTierPrice = 249,
  onCalculate,
  className,
}: ROICalculatorProps) {
  const [units, setUnits] = useState(5)
  const [avgRent, setAvgRent] = useState(1500)
  const [vacancyRate, setVacancyRate] = useState(8)

  // ROI calculations based on industry averages
  const attorneyRetainer = 5000 // Average annual attorney retainer
  const avgLegalFeePerDispute = 3500 // Average cost per fair housing dispute
  const avgDisputesWithoutCompliance = 0.15 // 15% chance per year for unprotected landlords
  const avgDisputesWithCompliance = 0.02 // 2% with compliance tools
  const vacancyReduction = 2 // Percentage points reduced with better screening

  const disputeRiskSavings =
    (avgDisputesWithoutCompliance - avgDisputesWithCompliance) * avgLegalFeePerDispute * units

  const vacancySavings = (vacancyReduction / 100) * avgRent * 12 * units

  const attorneySavings = attorneyRetainer // Don't need retainer with compliance tools

  const totalAnnualSavings =
    disputeRiskSavings + vacancySavings + attorneySavings - complianceTierPrice
  const roi = ((totalAnnualSavings / complianceTierPrice) * 100).toFixed(0)

  // Track analytics when values change
  const handleCalculation = () => {
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('roi_calculated', {
        units,
        avgRent,
        vacancyRate,
        estimatedSavings: totalAnnualSavings,
      })
    }

    onCalculate?.(totalAnnualSavings)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          ROI Calculator
        </CardTitle>
        <CardDescription>See how much you can save with compliance protection</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="units">Number of Units</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="units"
                value={[units]}
                onValueChange={([value]) => {
                  setUnits(value)
                  handleCalculation()
                }}
                min={1}
                max={100}
                step={1}
                className="flex-1"
              />
              <Input
                type="number"
                value={units}
                onChange={(e) => {
                  setUnits(Number(e.target.value) || 1)
                  handleCalculation()
                }}
                className="w-20"
                min={1}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avgRent">Average Monthly Rent ($)</Label>
            <Input
              id="avgRent"
              type="number"
              value={avgRent}
              onChange={(e) => {
                setAvgRent(Number(e.target.value) || 0)
                handleCalculation()
              }}
              min={0}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vacancy">Current Vacancy Rate (%)</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="vacancy"
                value={[vacancyRate]}
                onValueChange={([value]) => {
                  setVacancyRate(value)
                  handleCalculation()
                }}
                min={0}
                max={30}
                step={1}
                className="flex-1"
              />
              <span className="w-12 text-right">{vacancyRate}%</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-medium">Annual Savings Breakdown</h4>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reduced legal risk</span>
              <span className="font-medium text-green-600">+${disputeRiskSavings.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lower vacancy losses</span>
              <span className="font-medium text-green-600">+${vacancySavings.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Attorney retainer saved</span>
              <span className="font-medium text-green-600">+${attorneySavings.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Compliance tier cost</span>
              <span className="font-medium text-red-600">-${complianceTierPrice}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="bg-primary/5 rounded-lg p-4 text-center">
          <div className="text-primary flex items-center justify-center gap-2">
            <DollarSign className="h-5 w-5" />
            <span className="text-lg font-semibold">Estimated Annual Savings</span>
          </div>
          <p className="text-primary mt-2 text-3xl font-bold">${totalAnnualSavings.toFixed(0)}</p>
          <div className="text-muted-foreground mt-2 flex items-center justify-center gap-1 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span>{roi}% ROI on your investment</span>
          </div>
        </div>

        <p className="text-muted-foreground text-xs">
          * Estimates based on industry averages. Actual savings may vary based on location and
          circumstances.
        </p>
      </CardContent>
    </Card>
  )
}
