/**
 * @file ObfuscatedProfile component
 * @story US-001 - PII Anonymization Before Landlord Review
 *
 * Wrapper for skeleton → content transition with crossfade animation
 */

'use client'

import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ApplicantCardSkeleton } from './ApplicantCardSkeleton'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

interface ObfuscatedProfileProps {
  isLoading: boolean
  children: ReactNode
  className?: string
}

export function ObfuscatedProfile({ isLoading, children, className = '' }: ObfuscatedProfileProps) {
  const shouldReduceMotion = useReducedMotion()

  const skeletonVariants = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 },
      }

  const contentVariants = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.4, delay: 0.1 },
      }

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="skeleton" {...skeletonVariants}>
            <ApplicantCardSkeleton />
          </motion.div>
        ) : (
          <motion.div key="content" {...contentVariants}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
