'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock } from 'lucide-react'

interface ApplyButtonProps {
  listingId: string
  hasVerifiedProfile?: boolean
  className?: string
}

export function ApplyButton({ listingId, hasVerifiedProfile, className }: ApplyButtonProps) {
  return (
    <div className={className}>
      <Button asChild size="lg" className="w-full">
        <Link href={`/apply/${listingId}`}>
          {hasVerifiedProfile ? 'Apply with Verified Profile' : 'Apply with Dibs'}
        </Link>
      </Button>

      {hasVerifiedProfile ? (
        <div className="mt-2 flex items-center justify-center gap-1 text-sm text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          <span>Your profile is ready</span>
        </div>
      ) : (
        <div className="text-muted-foreground mt-2 flex items-center justify-center gap-1 text-sm">
          <Clock className="h-4 w-4" />
          <span>5-minute setup</span>
        </div>
      )}
    </div>
  )
}

// Quick qualification badge
interface QualificationBadgeProps {
  qualified: boolean
  reason?: string
}

export function QualificationPreview({ qualified, reason }: QualificationBadgeProps) {
  if (qualified) {
    return (
      <Badge variant="default" className="bg-green-600">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Likely Qualified
      </Badge>
    )
  }

  return <Badge variant="secondary">{reason || 'Check Qualification'}</Badge>
}
