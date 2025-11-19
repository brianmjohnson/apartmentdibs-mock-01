'use client'

import { useState } from 'react'
import { X, Calendar, MessageSquare, FileText, Clock, User, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { StatusBadge, type ApplicationStatus } from './StatusBadge'

export interface ApplicantDetails {
  id: string
  applicantId: string
  listingAddress: string
  status: ApplicationStatus
  applicationDate: Date
  lastActivity: Date
  nextAction: string
  // Obfuscated profile data
  incomeRatio: number
  creditBand: string
  employmentTenure: string
  rentalHistory: string
  // Timeline events
  timeline: TimelineEvent[]
  // Internal notes
  notes: string
  // Communication history
  communications: CommunicationEntry[]
}

interface TimelineEvent {
  id: string
  date: Date
  event: string
  description?: string
}

interface CommunicationEntry {
  id: string
  date: Date
  type: 'email' | 'sms' | 'in_app'
  direction: 'inbound' | 'outbound'
  preview: string
}

interface ApplicantDetailPanelProps {
  applicant: ApplicantDetails | null
  open: boolean
  onClose: () => void
  onSaveNotes: (applicantId: string, notes: string) => void
  onMessage: (applicantId: string) => void
}

export function ApplicantDetailPanel({
  applicant,
  open,
  onClose,
  onSaveNotes,
  onMessage,
}: ApplicantDetailPanelProps) {
  const [notes, setNotes] = useState(applicant?.notes || '')
  const [isSavingNotes, setIsSavingNotes] = useState(false)

  if (!applicant) return null

  const handleSaveNotes = async () => {
    setIsSavingNotes(true)
    await onSaveNotes(applicant.id, notes)
    setIsSavingNotes(false)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Applicant {applicant.applicantId}
          </SheetTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </SheetHeader>

        <ScrollArea className="mt-6 h-[calc(100vh-120px)]">
          <div className="space-y-6 pr-4">
            {/* Status and Listing */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <StatusBadge status={applicant.status} />
                <span className="text-muted-foreground text-sm">
                  Applied {formatDate(applicant.applicationDate)}
                </span>
              </div>
              <div className="bg-muted flex items-center gap-2 rounded-md p-3">
                <Home className="text-muted-foreground h-4 w-4" />
                <span className="text-sm font-medium">{applicant.listingAddress}</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>Next: {applicant.nextAction}</span>
              </div>
            </div>

            <Separator />

            {/* Obfuscated Profile Summary */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Profile Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted rounded-md p-3">
                  <p className="text-muted-foreground text-xs">Income Ratio</p>
                  <p className="text-lg font-semibold">{applicant.incomeRatio}x</p>
                </div>
                <div className="bg-muted rounded-md p-3">
                  <p className="text-muted-foreground text-xs">Credit Band</p>
                  <p className="text-lg font-semibold">{applicant.creditBand}</p>
                </div>
                <div className="bg-muted rounded-md p-3">
                  <p className="text-muted-foreground text-xs">Employment</p>
                  <p className="text-sm font-medium">{applicant.employmentTenure}</p>
                </div>
                <div className="bg-muted rounded-md p-3">
                  <p className="text-muted-foreground text-xs">Rental History</p>
                  <p className="text-sm font-medium">{applicant.rentalHistory}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Application Timeline */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Timeline</h3>
              <div className="space-y-3">
                {applicant.timeline.map((event, index) => (
                  <div key={event.id} className="relative flex gap-3">
                    {index < applicant.timeline.length - 1 && (
                      <div className="bg-border absolute top-6 left-[7px] h-full w-[2px]" />
                    )}
                    <div className="bg-primary mt-1 h-4 w-4 flex-shrink-0 rounded-full" />
                    <div className="flex-1 pb-3">
                      <p className="text-sm font-medium">{event.event}</p>
                      {event.description && (
                        <p className="text-muted-foreground text-xs">{event.description}</p>
                      )}
                      <p className="text-muted-foreground mt-1 text-xs">{formatDate(event.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Internal Notes */}
            <div className="space-y-3">
              <Label htmlFor="notes" className="text-sm font-semibold">
                Internal Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add private notes about this applicant..."
                className="min-h-[100px]"
              />
              <Button size="sm" onClick={handleSaveNotes} disabled={isSavingNotes}>
                {isSavingNotes ? 'Saving...' : 'Save Notes'}
              </Button>
            </div>

            <Separator />

            {/* Communication History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Communication History</h3>
                <Button variant="outline" size="sm" onClick={() => onMessage(applicant.id)}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
              </div>
              <div className="space-y-2">
                {applicant.communications.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No communications yet</p>
                ) : (
                  applicant.communications.map((comm) => (
                    <div key={comm.id} className="bg-muted flex items-start gap-3 rounded-md p-3">
                      <div
                        className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${
                          comm.direction === 'inbound' ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium uppercase">{comm.type}</span>
                          <span className="text-muted-foreground text-xs">
                            {comm.direction === 'inbound' ? 'Received' : 'Sent'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm">{comm.preview}</p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {formatTime(comm.date)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
