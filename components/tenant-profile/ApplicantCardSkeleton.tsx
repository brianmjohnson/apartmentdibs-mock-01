'use client'

import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

/**
 * @story US-001 - PII Anonymization Before Landlord Review
 */
export function ApplicantCardSkeleton() {
  const shouldReduceMotion = useReducedMotion()

  const shimmerVariants = shouldReduceMotion
    ? {}
    : {
        animate: {
          backgroundPosition: ['200% 0', '-200% 0'],
        },
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        },
      }

  const SkeletonWrapper = shouldReduceMotion ? 'div' : motion.div

  return (
    <motion.div
      className="border-border border-2 p-4"
      initial={shouldReduceMotion ? {} : { opacity: 0 }}
      animate={shouldReduceMotion ? {} : { opacity: 1 }}
      exit={shouldReduceMotion ? {} : { opacity: 0 }}
      transition={shouldReduceMotion ? {} : { duration: 0.3 }}
    >
      <div className="space-y-4">
        {/* Header with avatar */}
        <div className="flex items-start gap-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="flex-1">
            <Skeleton className="mb-2 h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <Skeleton className="mb-1 h-4 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Competitive edge */}
        <Skeleton className="h-16 w-full" />

        {/* Actions */}
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </motion.div>
  )
}

export function ApplicantListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <ApplicantCardSkeleton key={i} />
      ))}
    </div>
  )
}
