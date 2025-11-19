'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { ShieldCheck } from 'lucide-react'

interface GuaranteeCardProps {
  days?: number
}

export function GuaranteeCard({ days = 30 }: GuaranteeCardProps) {
  return (
    <Card className="border-primary bg-primary/5">
      <CardContent className="py-6">
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
          <div className="bg-primary/10 text-primary flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <h3 className="mb-1 text-lg font-semibold">{days}-Day Money-Back Guarantee</h3>
            <p className="text-muted-foreground text-sm">
              If your profile is denied by all landlords within {days} days, we&apos;ll refund your
              fee in full. No questions asked.
            </p>
            <Link
              href="/terms#guarantee"
              className="text-primary mt-2 inline-block text-sm underline hover:no-underline"
            >
              See terms and conditions
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
