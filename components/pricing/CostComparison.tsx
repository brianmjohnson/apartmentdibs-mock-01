'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, DollarSign, Sparkles } from 'lucide-react'

interface CostComparisonProps {
  traditionalCost?: number
  dibsCost?: number
}

export function CostComparison({
  traditionalCost = 375,
  dibsCost = 54.99,
}: CostComparisonProps) {
  const savings = traditionalCost - dibsCost

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Cost Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3 md:items-center">
          {/* Traditional */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
            <p className="mb-2 text-sm font-medium text-red-700 dark:text-red-300">
              Traditional Process
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">$50 app fee x 5</span>
                <span>$250</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">$25 credit x 5</span>
                <span>$125</span>
              </div>
              <div className="mt-2 flex justify-between border-t pt-2">
                <span className="font-medium">Total</span>
                <span className="font-bold text-red-600 dark:text-red-400">
                  ${traditionalCost}+
                </span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowRight className="text-muted-foreground hidden h-8 w-8 md:block" />
          </div>

          {/* ApartmentDibs */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
            <p className="mb-2 text-sm font-medium text-green-700 dark:text-green-300">
              ApartmentDibs
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">One-time fee</span>
                <span>${dibsCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unlimited apps</span>
                <span>$0</span>
              </div>
              <div className="mt-2 flex justify-between border-t pt-2">
                <span className="font-medium">Total</span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  ${dibsCost}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Savings callout */}
        <div className="mt-4 rounded-lg bg-primary/10 p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="text-primary h-5 w-5" />
            <span className="text-xl font-bold">Save ${Math.round(savings)}+</span>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            That&apos;s {Math.round((savings / traditionalCost) * 100)}% less than traditional
            applications
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
