'use client'

import { Lock, ArrowUp, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ComplianceGateProps {
  featureName: string
  featureDescription?: string
  requiredTier: string
  currentTier?: string
  onUpgrade?: () => void
  className?: string
}

export function ComplianceGate({
  featureName,
  featureDescription,
  requiredTier,
  currentTier = 'free',
  onUpgrade,
  className,
}: ComplianceGateProps) {
  // Track view analytics
  if (typeof window !== 'undefined' && window.posthog) {
    window.posthog.capture('compliance_feature_gated', {
      featureName,
      requiredTier,
      currentTier,
    })
  }

  return (
    <Card className={`border-2 border-dashed ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardTitle className="text-lg">
          {featureName}
        </CardTitle>
        {featureDescription && (
          <CardDescription>
            {featureDescription}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="text-center">
        <div className="mb-4 rounded-lg bg-muted/50 p-3">
          <p className="text-sm text-muted-foreground">
            This feature requires the{' '}
            <span className="font-semibold text-primary">{requiredTier}</span> tier
          </p>
        </div>

        <div className="space-y-3">
          <Button className="w-full" onClick={onUpgrade}>
            <ArrowUp className="mr-2 h-4 w-4" />
            Upgrade to {requiredTier}
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Protect your investment with compliance tools</span>
          </div>
        </div>

        {currentTier === 'free' && (
          <p className="mt-4 text-xs text-muted-foreground">
            You are currently on the Free tier
          </p>
        )}
      </CardContent>
    </Card>
  )
}
