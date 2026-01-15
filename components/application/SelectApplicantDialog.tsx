/**
 * @file SelectApplicantDialog component
 * @story US-001 - PII Anonymization Before Landlord Review
 *
 * Dialog for confirming applicant selection with entrance/exit animations
 */

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { LandlordApplicant, formatCurrency } from '@/lib/mock-data/landlord'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { dialogVariants, springTransition } from '@/lib/animations/variants'

interface SelectApplicantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  applicant: LandlordApplicant | null
  listingAddress: string
  unitNumber: string
  price: number
  beds: number
  baths: number
  onConfirm: () => void
}

export function SelectApplicantDialog({
  open,
  onOpenChange,
  applicant,
  listingAddress,
  unitNumber,
  price,
  beds,
  baths,
  onConfirm,
}: SelectApplicantDialogProps) {
  const shouldReduceMotion = useReducedMotion()

  if (!applicant) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent className="border-foreground border-2" asChild>
            <motion.div
              variants={dialogVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={shouldReduceMotion ? { duration: 0 } : springTransition}
            >
              <DialogHeader>
                <DialogTitle>Confirm Selection</DialogTitle>
                <DialogDescription>
                  Are you sure you want to select {applicant.displayId} for this unit?
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="bg-muted border-border space-y-2 border-2 p-4">
                  <p className="font-medium">
                    {listingAddress}, Unit {unitNumber}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {formatCurrency(price)}/mo - {beds} bed, {baths} bath
                  </p>
                </div>
                <p className="text-muted-foreground mt-4 text-sm">
                  This will notify the applicant and your agent to proceed with lease preparation.
                  Other applicants will be notified that the unit is no longer available.
                </p>
              </div>
              <DialogFooter>
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="border-2"
                  >
                    Cancel
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                >
                  <Button onClick={onConfirm} className="border-foreground border-2">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm Selection
                  </Button>
                </motion.div>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
