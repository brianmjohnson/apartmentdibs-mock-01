'use client'

import {
  Lightbulb,
  UserPlus,
  DollarSign,
  Search,
  CreditCard,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Tip {
  id: string
  icon: 'cosigner' | 'deposit' | 'search' | 'credit' | 'general'
  title: string
  description: string
  actionLabel?: string
  actionUrl?: string
}

interface ImprovementTipsProps {
  tips: Tip[]
  onTipAction?: (tipId: string) => void
  className?: string
}

export function ImprovementTips({
  tips,
  onTipAction,
  className,
}: ImprovementTipsProps) {
  const getIcon = (iconType: Tip['icon']) => {
    switch (iconType) {
      case 'cosigner':
        return <UserPlus className="h-5 w-5" />
      case 'deposit':
        return <DollarSign className="h-5 w-5" />
      case 'search':
        return <Search className="h-5 w-5" />
      case 'credit':
        return <CreditCard className="h-5 w-5" />
      default:
        return <Lightbulb className="h-5 w-5" />
    }
  }

  const handleAction = (tip: Tip) => {
    // Track analytics
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('tip_clicked', {
        tipId: tip.id,
        tipType: tip.icon,
      })
    }

    if (tip.actionUrl) {
      window.open(tip.actionUrl, '_blank')
    } else if (onTipAction) {
      onTipAction(tip.id)
    }
  }

  if (tips.length === 0) return null

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Ways to Improve Your Chances
        </CardTitle>
        <CardDescription>
          Consider these options to strengthen your application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className="rounded-lg border p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-muted-foreground">{getIcon(tip.icon)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{tip.title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {tip.description}
                </p>
                {tip.actionLabel && (
                  <Button
                    variant="link"
                    className="h-auto p-0 mt-2 text-sm"
                    onClick={() => handleAction(tip)}
                  >
                    {tip.actionLabel}
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Pre-defined tips for common scenarios
export const commonTips: Record<string, Tip> = {
  addCosigner: {
    id: 'add-cosigner',
    icon: 'cosigner',
    title: 'Add a Co-Signer',
    description:
      'A co-signer with strong credit and income can strengthen your application and help meet income requirements.',
    actionLabel: 'Learn about co-signers',
  },
  extraDeposit: {
    id: 'extra-deposit',
    icon: 'deposit',
    title: 'Offer Additional Security Deposit',
    description:
      'Some landlords accept a larger security deposit (2-3 months) to offset lower credit scores.',
    actionLabel: 'How this works',
  },
  lowerRequirements: {
    id: 'lower-requirements',
    icon: 'search',
    title: 'Look for Listings with Lower Requirements',
    description:
      'Filter for listings that accept credit scores in your range or have lower income requirements.',
    actionLabel: 'Search with filters',
  },
  improveCredit: {
    id: 'improve-credit',
    icon: 'credit',
    title: 'Improve Your Credit Score',
    description:
      'Pay down balances, dispute errors, and become an authorized user to boost your score.',
    actionLabel: 'Credit improvement tips',
  },
  provideContext: {
    id: 'provide-context',
    icon: 'general',
    title: 'Provide Context',
    description:
      'Write a cover letter explaining any issues like gaps in employment or past credit problems.',
    actionLabel: 'Cover letter template',
  },
}

// Helper component to show relevant tips based on qualification gaps
export function QualificationGapTips({
  gaps,
  onTipAction,
  className,
}: {
  gaps: {
    income?: boolean
    credit?: boolean
    background?: boolean
  }
  onTipAction?: (tipId: string) => void
  className?: string
}) {
  const tips: Tip[] = []

  if (gaps.income) {
    tips.push(commonTips.addCosigner)
    tips.push(commonTips.lowerRequirements)
  }

  if (gaps.credit) {
    tips.push(commonTips.extraDeposit)
    tips.push(commonTips.improveCredit)
  }

  if (gaps.background) {
    tips.push(commonTips.provideContext)
  }

  return <ImprovementTips tips={tips} onTipAction={onTipAction} className={className} />
}
