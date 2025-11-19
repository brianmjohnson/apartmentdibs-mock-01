'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type ApplicationStatus =
  | 'new'
  | 'documents_complete'
  | 'under_review'
  | 'shortlisted'
  | 'offer_extended'
  | 'lease_signed'
  | 'denied'
  | 'incomplete'
  | 'expired'
  | 'withdrawn'

interface StatusBadgeProps {
  status: ApplicationStatus
  className?: string
}

const statusConfig: Record<
  ApplicationStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }
> = {
  new: {
    label: 'New',
    variant: 'default',
    className: 'bg-blue-500 hover:bg-blue-600 text-white',
  },
  documents_complete: {
    label: 'Documents Complete',
    variant: 'default',
    className: 'bg-green-500 hover:bg-green-600 text-white',
  },
  under_review: {
    label: 'Under Review',
    variant: 'default',
    className: 'bg-blue-400 hover:bg-blue-500 text-white',
  },
  shortlisted: {
    label: 'Shortlisted',
    variant: 'default',
    className: 'bg-purple-500 hover:bg-purple-600 text-white',
  },
  offer_extended: {
    label: 'Offer Extended',
    variant: 'default',
    className: 'bg-indigo-500 hover:bg-indigo-600 text-white',
  },
  lease_signed: {
    label: 'Lease Signed',
    variant: 'default',
    className: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  },
  denied: {
    label: 'Denied',
    variant: 'destructive',
    className: 'bg-gray-500 hover:bg-gray-600 text-white',
  },
  incomplete: {
    label: 'Incomplete',
    variant: 'default',
    className: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  },
  expired: {
    label: 'Expired',
    variant: 'destructive',
    className: 'bg-red-500 hover:bg-red-600 text-white',
  },
  withdrawn: {
    label: 'Withdrawn',
    variant: 'secondary',
    className: 'bg-gray-400 hover:bg-gray-500 text-white',
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge
      variant={config.variant}
      className={cn(config.className, className)}
      aria-label={`Status: ${config.label}`}
    >
      {config.label}
    </Badge>
  )
}

export { statusConfig }
