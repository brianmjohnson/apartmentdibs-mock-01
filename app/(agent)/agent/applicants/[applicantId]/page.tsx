'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  User,
  DollarSign,
  CreditCard,
  Briefcase,
  Home,
  ShieldCheck,
  Sparkles,
  StickyNote,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Send,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  mockApplicants,
  mockAgentListings,
  getApplicantStatusColor,
  formatDate,
} from '@/lib/mock-data/agent'

// Mock internal notes
const mockNotes = [
  {
    id: '1',
    content: 'Strong income ratio, employer verified. Good candidate.',
    timestamp: '2025-11-16T10:30:00Z',
    author: 'Jessica Martinez',
  },
  {
    id: '2',
    content: 'Follow up on rental history - need to verify previous landlord reference.',
    timestamp: '2025-11-15T14:00:00Z',
    author: 'Jessica Martinez',
  },
]

// Mock communication history
const mockCommunications = [
  {
    id: '1',
    type: 'outbound',
    content:
      'Thank you for your application! We have received your documents and are currently reviewing them.',
    timestamp: '2025-11-15T09:00:00Z',
  },
  {
    id: '2',
    type: 'inbound',
    content: 'Thank you for the update. Please let me know if you need any additional information.',
    timestamp: '2025-11-15T10:30:00Z',
  },
  {
    id: '3',
    type: 'outbound',
    content: 'Could you please provide an additional pay stub from your current employer?',
    timestamp: '2025-11-16T11:00:00Z',
  },
]

export default function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ applicantId: string }>
}) {
  const { applicantId } = use(params)
  const applicant = mockApplicants.find((a) => a.id === applicantId)
  const listing = applicant ? mockAgentListings.find((l) => l.id === applicant.listingId) : null

  const [newNote, setNewNote] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [denyDialogOpen, setDenyDialogOpen] = useState(false)
  const [denyReason, setDenyReason] = useState('')

  if (!applicant) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold">Applicant not found</h2>
        <Link href="/agent/applicants">
          <Button variant="outline" className="mt-4 border-2">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Applicants
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/agent/applicants"
        className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to All Applicants
      </Link>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{applicant.displayId}</h1>
            <Badge
              variant="outline"
              className={`border ${getApplicantStatusColor(applicant.status)}`}
            >
              {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Applied for {listing?.address || 'Unknown Listing'} on {formatDate(applicant.appliedAt)}
          </p>
        </div>
        <div className="flex gap-3">
          {applicant.status !== 'shortlisted' && applicant.status !== 'denied' && (
            <>
              <Button className="border-foreground border-2 bg-green-600 text-white hover:bg-green-700">
                <ThumbsUp className="mr-2 h-4 w-4" />
                Shortlist
              </Button>
              <Dialog open={denyDialogOpen} onOpenChange={setDenyDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-2 border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    Deny
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-foreground border-2">
                  <DialogHeader>
                    <DialogTitle>Deny Application</DialogTitle>
                    <DialogDescription>
                      Please provide a reason for denying this application. This will be recorded
                      internally.
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="Enter denial reason..."
                    value={denyReason}
                    onChange={(e) => setDenyReason(e.target.value)}
                    className="min-h-[100px] border-2"
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDenyDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-red-600 text-white hover:bg-red-700"
                      onClick={() => setDenyDialogOpen(false)}
                    >
                      Confirm Denial
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Obfuscated Profile */}
        <Card className="border-foreground border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Obfuscated Profile
            </CardTitle>
            <CardDescription>Anonymized applicant information for fair evaluation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Income Ratio */}
            <div className="bg-muted flex items-center justify-between rounded-md p-3">
              <div className="flex items-center gap-3">
                <DollarSign className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-muted-foreground text-sm">Income-to-Rent Ratio</p>
                  <p className={`font-bold ${applicant.incomeRatio >= 4 ? 'text-green-600' : ''}`}>
                    {applicant.incomeRatio}x monthly rent
                  </p>
                </div>
              </div>
              {applicant.incomeRatio >= 4 && (
                <Badge className="border-green-300 bg-green-100 text-green-800">Strong</Badge>
              )}
            </div>

            {/* Credit Score Band */}
            <div className="bg-muted flex items-center justify-between rounded-md p-3">
              <div className="flex items-center gap-3">
                <CreditCard className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-muted-foreground text-sm">Credit Score Band</p>
                  <p className="font-bold">{applicant.creditBand}</p>
                </div>
              </div>
              {parseInt(applicant.creditBand.split('-')[0]) >= 700 && (
                <Badge className="border-green-300 bg-green-100 text-green-800">Good</Badge>
              )}
            </div>

            {/* Employment */}
            <div className="bg-muted flex items-center justify-between rounded-md p-3">
              <div className="flex items-center gap-3">
                <Briefcase className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-muted-foreground text-sm">Employment Tenure</p>
                  <p className="font-bold">{applicant.employmentTenure}</p>
                </div>
              </div>
              {applicant.employmentTenure.includes('3+') ||
              applicant.employmentTenure.includes('5+') ? (
                <Badge className="border-green-300 bg-green-100 text-green-800">Stable</Badge>
              ) : null}
            </div>

            {/* Rental History */}
            <div className="bg-muted flex items-center justify-between rounded-md p-3">
              <div className="flex items-center gap-3">
                <Home className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-muted-foreground text-sm">Rental History</p>
                  <p className="font-bold">5+ years, no evictions</p>
                </div>
              </div>
              <Badge className="border-green-300 bg-green-100 text-green-800">Clean</Badge>
            </div>

            {/* Background Check */}
            <div className="bg-muted flex items-center justify-between rounded-md p-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-muted-foreground text-sm">Background Check</p>
                  <p className="font-bold text-green-600">Pass</p>
                </div>
              </div>
            </div>

            {/* Competitive Edge */}
            {applicant.incomeRatio >= 4.5 && (
              <div className="flex items-center gap-3 rounded-md border-2 border-purple-300 bg-purple-50 p-3 dark:bg-purple-900/20">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-muted-foreground text-sm">Competitive Edge</p>
                  <p className="font-bold text-purple-600">Offered 2 months upfront</p>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Occupants</p>
                <p className="font-medium">{applicant.occupants}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Pets</p>
                <p className="font-medium">{applicant.pets ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Desired Move-in</p>
                <p className="font-medium">{formatDate(applicant.moveInDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Internal Notes */}
        <Card className="border-foreground border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StickyNote className="h-5 w-5" />
              Internal Notes
            </CardTitle>
            <CardDescription>Private notes about this applicant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Note */}
            <div className="space-y-2">
              <Textarea
                placeholder="Add a note about this applicant..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[80px] border-2"
              />
              <Button size="sm" className="border-foreground border-2" disabled={!newNote.trim()}>
                Add Note
              </Button>
            </div>

            <Separator />

            {/* Notes History */}
            <ScrollArea className="h-[200px]">
              <div className="space-y-3">
                {mockNotes.map((note) => (
                  <div key={note.id} className="bg-muted rounded-md p-3">
                    <p className="text-sm">{note.content}</p>
                    <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
                      <Clock className="h-3 w-3" />
                      {formatDate(note.timestamp)} - {note.author}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Communication History */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Communication History
          </CardTitle>
          <CardDescription>Messages exchanged with this applicant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Message History */}
          <ScrollArea className="h-[250px] pr-4">
            <div className="space-y-3">
              {mockCommunications.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-md p-3 ${
                    message.type === 'outbound' ? 'bg-primary/10 ml-8' : 'bg-muted mr-8'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-muted-foreground mt-2 text-xs">
                    {message.type === 'outbound' ? 'You' : applicant.displayId} -{' '}
                    {formatDate(message.timestamp)}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Separator />

          {/* Send Message */}
          <div className="flex gap-2">
            <Textarea
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[60px] border-2"
            />
            <Button className="border-foreground border-2" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
