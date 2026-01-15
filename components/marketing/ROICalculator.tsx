'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calculator, DollarSign, TrendingUp } from 'lucide-react'

interface ROICalculatorProps {
  type: 'landlord' | 'agent'
}

export function ROICalculator({ type }: ROICalculatorProps) {
  const [units, setUnits] = useState<number>(10)
  const [rent, setRent] = useState<number>(2500)
  const [leases, setLeases] = useState<number>(50)
  const [commission, setCommission] = useState<number>(3000)

  // Landlord calculations
  const vacancySavings = units * rent * 0.56 // 56% faster fill = savings
  const complianceSavings = units * 500 // $500 per unit in compliance costs
  const landlordTotalSavings = Math.round(vacancySavings + complianceSavings)

  // Agent calculations
  const additionalLeases = Math.round(leases * 0.25) // 25% more leases
  const additionalRevenue = additionalLeases * commission
  const timeSavings = 20 * 52 * 75 // 20 hours/week * 52 weeks * $75/hour

  if (type === 'landlord') {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            ROI Calculator
          </CardTitle>
          <CardDescription>See how much you could save annually</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="units">Units Owned</Label>
              <Input
                id="units"
                type="number"
                min={1}
                value={units}
                onChange={(e) => setUnits(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rent">Average Monthly Rent ($)</Label>
              <Input
                id="rent"
                type="number"
                min={0}
                value={rent}
                onChange={(e) => setRent(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="bg-primary/10 rounded-lg p-6 text-center">
            <p className="text-muted-foreground mb-2 text-sm font-medium">
              Estimated Annual Savings
            </p>
            <div className="flex items-center justify-center gap-2">
              <DollarSign className="text-primary h-8 w-8" />
              <span className="text-4xl font-bold">{landlordTotalSavings.toLocaleString()}</span>
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              Based on 56% faster fills and compliance protection
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vacancy reduction savings:</span>
              <span className="font-medium">${Math.round(vacancySavings).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Compliance cost savings:</span>
              <span className="font-medium">${complianceSavings.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Revenue Calculator
        </CardTitle>
        <CardDescription>Calculate your additional annual revenue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="leases">Leases Per Year</Label>
            <Input
              id="leases"
              type="number"
              min={1}
              value={leases}
              onChange={(e) => setLeases(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="commission">Average Commission ($)</Label>
            <Input
              id="commission"
              type="number"
              min={0}
              value={commission}
              onChange={(e) => setCommission(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="bg-primary/10 rounded-lg p-6 text-center">
          <p className="text-muted-foreground mb-2 text-sm font-medium">
            Additional Annual Revenue
          </p>
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="text-primary h-8 w-8" />
            <span className="text-4xl font-bold">${additionalRevenue.toLocaleString()}</span>
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            Based on 25% more lease closings with CRM auto-matching
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Additional leases:</span>
            <span className="font-medium">{additionalLeases} per year</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Time savings value:</span>
            <span className="font-medium">${timeSavings.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
