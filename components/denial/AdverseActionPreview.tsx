'use client'

import { useState } from 'react'
import { FileText, Send, Download, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ApplicantInfo {
  id: string
  name: string
  email: string
  address?: string
}

interface PropertyInfo {
  address: string
}

interface LandlordInfo {
  name: string
}

interface AdverseActionPreviewProps {
  applicant: ApplicantInfo
  property: PropertyInfo
  landlord: LandlordInfo
  denialReason: string
  denialReasonLabel: string
  creditUsed: boolean
  creditBureauName?: string
  creditBureauContact?: string
  onSend: () => void
  onCancel: () => void
  isLoading?: boolean
  className?: string
}

export function AdverseActionPreview({
  applicant,
  property,
  landlord,
  denialReason: _denialReason,
  denialReasonLabel,
  creditUsed,
  creditBureauName = 'TransUnion',
  creditBureauContact = '1-800-888-4213',
  onSend,
  onCancel,
  isLoading = false,
  className,
}: AdverseActionPreviewProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleSend = () => {
    setShowConfirmDialog(false)
    onSend()

    // Track analytics
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('adverse_action_generated', {
        applicantId: applicant.id,
      })
    }
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <Card className={`border-foreground border-2 ${className || ''}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="text-primary h-5 w-5" />
              <CardTitle>Adverse Action Letter Preview</CardTitle>
            </div>
            <Badge variant="outline" className="border-foreground">
              FCRA Compliant
            </Badge>
          </div>
          <CardDescription>
            Review the letter before sending. This letter meets all FCRA 15 USC 1681m(a)
            requirements.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Letter Content */}
          <div className="bg-muted/50 border-border rounded-md border p-6 font-serif">
            <h2 className="mb-6 text-center text-xl font-bold">Notice of Adverse Action</h2>

            <p className="mb-4">{currentDate}</p>

            <p className="mb-4">Dear {applicant.name},</p>

            <p className="mb-4">
              Thank you for applying to <strong>{property.address}</strong>. After careful review of
              all applications received, we have selected another applicant.
            </p>

            <div className="mb-4">
              <p className="mb-2 font-bold">Reason for Denial:</p>
              <p className="border-primary border-l-2 pl-4">{denialReasonLabel}</p>
            </div>

            {creditUsed && (
              <div className="bg-background border-border mb-4 rounded border p-3">
                <p className="mb-2 font-bold">Credit Report Information:</p>
                <p>Your credit report was obtained from {creditBureauName}.</p>
                <p>Contact: {creditBureauContact}</p>
              </div>
            )}

            <div className="mb-4">
              <p className="mb-2 font-bold">Your Rights:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  You have the right to obtain a free copy of your credit report within 60 days.
                </li>
                <li>You have the right to dispute any inaccuracies in your credit report.</li>
              </ul>
            </div>

            <div className="bg-background border-border mb-6 rounded border p-3">
              <p className="mb-2 font-bold">Fair Housing Compliance:</p>
              <p className="text-sm">
                This decision complied with Fair Housing Act requirements. All applicants were
                evaluated using identical, objective criteria. A complete audit trail is maintained
                for 3 years.
              </p>
            </div>

            <p>Sincerely,</p>
            <p className="font-medium">{landlord.name}</p>
            <p className="text-muted-foreground text-sm">via ApartmentDibs</p>
          </div>

          {/* Delivery Information */}
          <div className="bg-muted rounded-md p-4">
            <p className="mb-2 font-medium">Delivery Channels:</p>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>Email: {applicant.email} (within 24 hours)</li>
              <li>SMS: Notification will be sent</li>
              {applicant.address && <li>Certified Mail: {applicant.address} (if email bounces)</li>}
            </ul>
          </div>
        </CardContent>

        <Separator />

        <CardFooter className="flex flex-col gap-3 pt-4 sm:flex-row">
          <Button
            variant="outline"
            className="border-foreground flex-1 border-2"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            className="border-foreground flex-1 border-2"
            disabled={isLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button
            className="border-foreground flex-1 border-2"
            onClick={() => setShowConfirmDialog(true)}
            disabled={isLoading}
          >
            <Send className="mr-2 h-4 w-4" />
            {isLoading ? 'Sending...' : 'Send Letter'}
          </Button>
        </CardFooter>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="border-foreground border-2">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-primary h-5 w-5" />
              Confirm Adverse Action Letter
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. The letter will be sent to the applicant via email and
              SMS within 24 hours.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-muted-foreground text-sm">
              By sending this letter, you confirm that:
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">&#x2713;</span>
                The denial reason is accurate and factual
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">&#x2713;</span>
                All applicants were evaluated using identical criteria
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">&#x2713;</span>
                This decision complies with Fair Housing laws
              </li>
            </ul>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="border-foreground border-2"
            >
              Cancel
            </Button>
            <Button onClick={handleSend} className="border-foreground border-2">
              <Send className="mr-2 h-4 w-4" />
              Confirm &amp; Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
