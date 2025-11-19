/**
 * @file ApplicationCard component
 * @story US-001 - PII Anonymization Before Landlord Review
 *
 * Displays anonymized applicant card with hover animations and badge animations
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { User, Lock, Eye, CheckCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  LandlordApplicant,
  formatDate,
  getApplicantStatusColor,
  getCreditBandColor,
  getCreditBandLabel,
} from '@/lib/mock-data/landlord'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { bouncySpring } from '@/lib/animations/variants'

interface ApplicationCardProps {
  applicant: LandlordApplicant
  onSelect: (applicant: LandlordApplicant) => void
  onDeny: (applicant: LandlordApplicant) => void
  className?: string
}

export function ApplicationCard({ applicant, onSelect, onDeny, className = '' }: ApplicationCardProps) {
  const shouldReduceMotion = useReducedMotion()

  const cardVariants = shouldReduceMotion
    ? {}
    : {
        whileHover: { y: -4, scale: 1.01 },
        whileTap: { scale: 0.98 },
      }

  const badgeVariants = shouldReduceMotion
    ? {}
    : {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { ...bouncySpring, delay: 0.2 },
      }

  const lockIconVariants = shouldReduceMotion
    ? {}
    : {
        animate: { scale: [1, 1.1, 1] },
        transition: { duration: 2, repeat: Infinity, repeatDelay: 3 },
      }

  return (
    <motion.div
      className={`border-border border-2 p-4 ${className}`}
      {...cardVariants}
      transition={shouldReduceMotion ? {} : { type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          {/* Anonymous Avatar */}
          <div className="bg-muted border-muted-foreground flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-dashed">
            <User className="text-muted-foreground h-7 w-7" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold">{applicant.displayId}</p>
                  <motion.div {...badgeVariants}>
                    <Badge
                      variant="outline"
                      className="border-muted-foreground text-muted-foreground border-2 text-xs"
                    >
                      <motion.span {...lockIconVariants}>
                        <Lock className="mr-1 h-3 w-3" />
                      </motion.span>
                      Anonymized
                    </Badge>
                  </motion.div>
                </div>
                <p className="text-muted-foreground text-sm">Applied {formatDate(applicant.appliedAt)}</p>
              </div>
              <Badge variant="outline" className={`${getApplicantStatusColor(applicant.status)} border-2`}>
                {applicant.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Applicant Details */}
        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Income Ratio</p>
            <p className={`font-bold ${applicant.incomeRatio >= 4 ? 'text-green-600' : ''}`}>
              {applicant.incomeRatio}x
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Credit Band</p>
            <div className="flex items-center gap-2">
              <p className="font-bold">{applicant.creditBand}</p>
              <Badge variant="outline" className={`${getCreditBandColor(applicant.creditBand)} border text-xs`}>
                {getCreditBandLabel(applicant.creditBand)}
              </Badge>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground">Employment</p>
            <p className="font-bold">{applicant.employmentTenure}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Move-in Date</p>
            <p className="font-bold">{formatDate(applicant.moveInDate)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-2">
            {applicant.employmentType}
          </Badge>
          <Badge variant="outline" className="border-2">
            {applicant.occupants} occupant{applicant.occupants !== 1 ? 's' : ''}
          </Badge>
          {applicant.pets ? (
            <Badge variant="outline" className="border-2">
              Pet: {applicant.petDetails || 'Yes'}
            </Badge>
          ) : (
            <Badge variant="outline" className="border-2">
              No Pets
            </Badge>
          )}
        </div>

        {/* Competitive Edge */}
        <div className="bg-muted/50 border-border border-2 p-3">
          <p className="text-muted-foreground mb-1 text-xs">Competitive Edge</p>
          <p className="text-sm">{applicant.competitiveEdge}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link href={`/landlord/applicant/${applicant.id}`} className="flex-1">
            <Button variant="outline" className="w-full border-2">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </Link>
          <motion.div className="flex-1" whileHover={shouldReduceMotion ? {} : { scale: 1.05 }} whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}>
            <Button className="border-foreground w-full border-2" onClick={() => onSelect(applicant)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Select
            </Button>
          </motion.div>
          <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.05 }} whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}>
            <Button variant="outline" className="border-2" onClick={() => onDeny(applicant)}>
              <XCircle className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
