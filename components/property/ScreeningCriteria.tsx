'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface ScreeningCriteriaProps {
  hardCriteria: string[]
  softCriteria: string[]
}

export function ScreeningCriteria({ hardCriteria, softCriteria }: ScreeningCriteriaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Screening Criteria</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium">Required (Hard Criteria)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {hardCriteria.map((criteria) => (
              <Badge key={criteria} variant="destructive" className="font-normal">
                {criteria}
              </Badge>
            ))}
          </div>
        </div>

        {softCriteria.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Preferred (Soft Criteria)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {softCriteria.map((criteria) => (
                <Badge key={criteria} variant="secondary" className="font-normal">
                  {criteria}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <p className="text-muted-foreground text-xs">
          Meeting hard criteria is required for approval. Soft criteria improve your application
          but are not mandatory.
        </p>
      </CardContent>
    </Card>
  )
}
