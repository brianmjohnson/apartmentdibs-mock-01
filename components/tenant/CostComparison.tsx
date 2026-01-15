'use client'

import { TrendingDown, DollarSign, Check, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface CostComparisonProps {
  ourPrice: number
  traditionalPricePerApp: number
  avgApplications?: number
  className?: string
}

export function CostComparison({
  ourPrice = 54.99,
  traditionalPricePerApp = 50,
  avgApplications = 5,
  className,
}: CostComparisonProps) {
  const traditionalTotal = traditionalPricePerApp * avgApplications
  const savings = traditionalTotal - ourPrice
  const savingsPercentage = ((savings / traditionalTotal) * 100).toFixed(0)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-green-600" />
          Save with ApartmentDibs
        </CardTitle>
        <CardDescription>Compare our pricing to traditional per-application fees</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <X className="h-4 w-4" />
              <span className="font-medium">Traditional Way</span>
            </div>
            <div className="mt-3">
              <p className="text-sm text-red-700 dark:text-red-300">
                ${traditionalPricePerApp}/app x {avgApplications} applications
              </p>
              <p className="mt-1 text-2xl font-bold text-red-900 dark:text-red-100">
                ${traditionalTotal}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-950/20">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <Check className="h-4 w-4" />
              <span className="font-medium">ApartmentDibs</span>
            </div>
            <div className="mt-3">
              <p className="text-sm text-green-700 dark:text-green-300">
                One profile, unlimited applications
              </p>
              <p className="mt-1 text-2xl font-bold text-green-900 dark:text-green-100">
                ${ourPrice}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="bg-primary/5 rounded-lg p-4 text-center">
          <div className="text-primary flex items-center justify-center gap-2">
            <DollarSign className="h-5 w-5" />
            <span className="text-lg font-semibold">Your Savings</span>
          </div>
          <p className="text-primary mt-2 text-3xl font-bold">${savings.toFixed(2)}</p>
          <p className="text-muted-foreground mt-1 text-sm">
            That is {savingsPercentage}% less than traditional screening fees
          </p>
        </div>

        <div className="text-muted-foreground text-center text-sm">
          <p>Average tenant applies to {avgApplications} apartments before finding a home.</p>
          <p className="mt-1">Pay once, apply everywhere.</p>
        </div>
      </CardContent>
    </Card>
  )
}
