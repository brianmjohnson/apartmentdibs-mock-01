'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  User,
  DollarSign,
  CreditCard,
  Building,
  Calendar,
  AlertCircle,
  Send,
  Trash2,
  Mail,
  Eye,
  Check,
  X,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
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
import { formatDate, mockAgentListings } from '@/lib/mock-data/agent'

// Import from CRM page (in real app, this would be in a shared file)
const mockCRMLeads = [
  {
    id: 'crm-001',
    displayId: 'Applicant #2301',
    originalListingId: 'agent-listing-1',
    originalListingAddress: '123 Main St, Brooklyn, NY',
    denialDate: '2025-10-28',
    denialReason: 'Higher qualified applicant selected',
    incomeRatio: 4.2,
    creditBand: '720-740',
    employmentTenure: '3+ years',
    matchingListings: 3,
    matchScore: 92,
    lastOutreach: null,
    budgetMin: 2500,
    budgetMax: 3200,
    preferredBeds: 2,
    preferredNeighborhoods: ['Brooklyn Heights', 'Park Slope', 'Cobble Hill'],
  },
  {
    id: 'crm-002',
    displayId: 'Applicant #2156',
    originalListingId: 'agent-listing-2',
    originalListingAddress: '456 Bedford Ave, Brooklyn, NY',
    denialDate: '2025-10-15',
    denialReason: 'Unit rented to another applicant',
    incomeRatio: 3.8,
    creditBand: '700-720',
    employmentTenure: '2-3 years',
    matchingListings: 2,
    matchScore: 85,
    lastOutreach: '2025-11-01',
    budgetMin: 4000,
    budgetMax: 5000,
    preferredBeds: 3,
    preferredNeighborhoods: ['Williamsburg', 'Bedford-Stuyvesant'],
  },
  {
    id: 'crm-003',
    displayId: 'Applicant #2089',
    originalListingId: 'agent-listing-3',
    originalListingAddress: '789 Park Place, Brooklyn, NY',
    denialDate: '2025-10-20',
    denialReason: 'Listing removed from market',
    incomeRatio: 5.1,
    creditBand: '760-780',
    employmentTenure: '5+ years',
    matchingListings: 4,
    matchScore: 96,
    lastOutreach: null,
    budgetMin: 2000,
    budgetMax: 2800,
    preferredBeds: 1,
    preferredNeighborhoods: ['Crown Heights', 'Prospect Heights', 'Park Slope'],
  },
]

// Mock outreach history
const mockOutreachHistory = [
  {
    id: '1',
    type: 'invitation',
    listingAddress: '456 Bedford Ave, Brooklyn, NY',
    sentAt: '2025-11-01T10:00:00Z',
    opened: true,
    responded: false,
  },
  {
    id: '2',
    type: 'follow-up',
    listingAddress: '456 Bedford Ave, Brooklyn, NY',
    sentAt: '2025-11-05T14:00:00Z',
    opened: true,
    responded: true,
  },
]

export default function CRMLeadDetailPage({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = use(params)
  const lead = mockCRMLeads.find((l) => l.id === leadId)

  const [inviteMessage, setInviteMessage] = useState('')
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [selectedListings, setSelectedListings] = useState<string[]>([])

  // Get matching listings based on budget and preferences
  const matchingListings = mockAgentListings.filter((listing) => {
    if (!lead) return false
    return (
      listing.status === 'active' &&
      listing.price >= lead.budgetMin &&
      listing.price <= lead.budgetMax &&
      listing.beds >= lead.preferredBeds
    )
  })

  if (!lead) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold">Lead not found</h2>
        <Link href="/agent/crm">
          <Button variant="outline" className="mt-4 border-2">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to CRM
          </Button>
        </Link>
      </div>
    )
  }

  const toggleListing = (listingId: string) => {
    setSelectedListings((prev) =>
      prev.includes(listingId) ? prev.filter((id) => id !== listingId) : [...prev, listingId]
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/agent/crm"
        className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to CRM
      </Link>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{lead.displayId}</h1>
            <Badge
              variant="outline"
              className={`${
                lead.matchScore >= 90
                  ? 'border-green-300 bg-green-100 text-green-800'
                  : 'border-yellow-300 bg-yellow-100 text-yellow-800'
              }`}
            >
              {lead.matchScore}% match
            </Badge>
          </div>
          <p className="text-muted-foreground">
            CRM Lead - Originally applied {formatDate(lead.denialDate)}
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="border-foreground border-2">
                <Send className="mr-2 h-4 w-4" />
                Send Invitation
              </Button>
            </DialogTrigger>
            <DialogContent className="border-foreground max-w-lg border-2">
              <DialogHeader>
                <DialogTitle>Invite to Apply</DialogTitle>
                <DialogDescription>
                  Select listings and compose a personalized invitation message.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-sm font-medium">Select Listings:</p>
                  <div className="max-h-32 space-y-2 overflow-y-auto">
                    {matchingListings.map((listing) => (
                      <label
                        key={listing.id}
                        className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md p-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedListings.includes(listing.id)}
                          onChange={() => toggleListing(listing.id)}
                          className="h-4 w-4"
                        />
                        <span className="text-sm">
                          {listing.address.split(',')[0]} - ${listing.price}/mo
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <Textarea
                  placeholder="Add a personalized message (optional)..."
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="min-h-[100px] border-2"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => setInviteDialogOpen(false)}
                  disabled={selectedListings.length === 0}
                >
                  Send Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-2 border-red-300 text-red-700 hover:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </DialogTrigger>
            <DialogContent className="border-foreground border-2">
              <DialogHeader>
                <DialogTitle>Remove from CRM</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove this lead from your CRM? This action cannot be
                  undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setRemoveDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 text-white hover:bg-red-700"
                  onClick={() => setRemoveDialogOpen(false)}
                >
                  Remove Lead
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lead Profile */}
        <Card className="border-foreground border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Lead Profile
            </CardTitle>
            <CardDescription>Obfuscated applicant information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Income Ratio */}
            <div className="bg-muted flex items-center justify-between rounded-md p-3">
              <div className="flex items-center gap-3">
                <DollarSign className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-muted-foreground text-sm">Income-to-Rent Ratio</p>
                  <p className={`font-bold ${lead.incomeRatio >= 4 ? 'text-green-600' : ''}`}>
                    {lead.incomeRatio}x monthly rent
                  </p>
                </div>
              </div>
            </div>

            {/* Credit Score Band */}
            <div className="bg-muted flex items-center justify-between rounded-md p-3">
              <div className="flex items-center gap-3">
                <CreditCard className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-muted-foreground text-sm">Credit Score Band</p>
                  <p className="font-bold">{lead.creditBand}</p>
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="bg-muted flex items-center justify-between rounded-md p-3">
              <div className="flex items-center gap-3">
                <Building className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-muted-foreground text-sm">Budget Range</p>
                  <p className="font-bold">
                    ${lead.budgetMin} - ${lead.budgetMax}/mo
                  </p>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium">Preferences</p>
              <div className="text-sm">
                <span className="text-muted-foreground">Bedrooms: </span>
                <span className="font-medium">{lead.preferredBeds}+</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Neighborhoods: </span>
                <span className="font-medium">{lead.preferredNeighborhoods.join(', ')}</span>
              </div>
            </div>

            {/* Original Application */}
            <Separator />
            <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 dark:bg-yellow-900/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Original Application
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    {lead.originalListingAddress}
                  </p>
                  <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
                    Denial reason: {lead.denialReason}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Matching Listings */}
        <Card className="border-foreground border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Matching Listings ({matchingListings.length})
            </CardTitle>
            <CardDescription>Current listings that match this lead&apos;s criteria</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {matchingListings.length > 0 ? (
              matchingListings.map((listing) => (
                <div key={listing.id} className="border-muted rounded-md border-2 p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{listing.address.split(',')[0]}</p>
                      <p className="text-muted-foreground text-sm">
                        {listing.beds}BR / {listing.baths}BA - {listing.sqft} sqft
                      </p>
                      <p className="mt-1 text-lg font-bold">${listing.price}/mo</p>
                    </div>
                    <Link href={`/agent/listings/${listing.id}`}>
                      <Button size="sm" variant="outline" className="border-2">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {listing.applicantCount} applicants
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {listing.daysOnMarket} days
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground py-6 text-center">
                <Building className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>No matching listings available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Outreach History */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Outreach History
          </CardTitle>
          <CardDescription>Previous messages sent to this lead</CardDescription>
        </CardHeader>
        <CardContent>
          {mockOutreachHistory.length > 0 && lead.lastOutreach ? (
            <div className="space-y-3">
              {mockOutreachHistory.map((outreach) => (
                <div
                  key={outreach.id}
                  className="border-muted flex items-center justify-between rounded-md border-2 p-3"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="text-muted-foreground h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium capitalize">{outreach.type}</p>
                      <p className="text-muted-foreground text-xs">
                        {outreach.listingAddress.split(',')[0]} - {formatDate(outreach.sentAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={outreach.opened ? 'border-blue-300 bg-blue-100 text-blue-800' : ''}
                    >
                      {outreach.opened ? (
                        <Check className="mr-1 h-3 w-3" />
                      ) : (
                        <X className="mr-1 h-3 w-3" />
                      )}
                      Opened
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        outreach.responded ? 'border-green-300 bg-green-100 text-green-800' : ''
                      }
                    >
                      {outreach.responded ? (
                        <Check className="mr-1 h-3 w-3" />
                      ) : (
                        <X className="mr-1 h-3 w-3" />
                      )}
                      Responded
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground py-6 text-center">
              <Mail className="mx-auto mb-2 h-8 w-8 opacity-50" />
              <p>No outreach history yet</p>
              <p className="text-sm">Send an invitation to start the conversation</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
