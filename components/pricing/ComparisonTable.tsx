'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, X, Minus } from 'lucide-react'

interface Feature {
  name: string
  basic: boolean | string
  premium: boolean | string
  group: boolean | string
}

const features: Feature[] = [
  { name: 'Credit Report (TransUnion)', basic: true, premium: true, group: true },
  { name: 'Basic Background Check', basic: true, premium: true, group: true },
  { name: 'Full Criminal Background', basic: false, premium: true, group: true },
  { name: 'Eviction History Search', basic: false, premium: true, group: true },
  { name: 'Income Verification (Plaid)', basic: false, premium: true, group: true },
  { name: 'Profile Validity', basic: '60 days', premium: '90 days', group: '90 days' },
  { name: 'Application Limit', basic: 'Unlimited', premium: 'Unlimited', group: 'Unlimited' },
  { name: 'Roommate Profiles', basic: false, premium: false, group: '2-4' },
  { name: 'Priority Support', basic: false, premium: true, group: true },
]

export function ComparisonTable() {
  const renderValue = (value: boolean | string) => {
    if (typeof value === 'string') {
      return <span className="text-sm">{value}</span>
    }
    if (value) {
      return <Check className="h-5 w-5 text-green-500" />
    }
    return <X className="text-muted-foreground h-5 w-5" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compare All Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left font-medium">Feature</th>
                <th className="px-4 py-3 text-center font-medium">Basic</th>
                <th className="px-4 py-3 text-center font-medium">Premium</th>
                <th className="px-4 py-3 text-center font-medium">Group</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature.name} className="border-b last:border-0">
                  <td className="py-3 text-sm">{feature.name}</td>
                  <td className="px-4 py-3 text-center">{renderValue(feature.basic)}</td>
                  <td className="bg-primary/5 px-4 py-3 text-center">
                    {renderValue(feature.premium)}
                  </td>
                  <td className="px-4 py-3 text-center">{renderValue(feature.group)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
