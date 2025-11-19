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
  X
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
    preferredNeighborhoods: ['Brooklyn Heights', 'Park Slope', 'Cobble Hill']
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
    preferredNeighborhoods: ['Williamsburg', 'Bedford-Stuyvesant']
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
    preferredNeighborhoods: ['Crown Heights', 'Prospect Heights', 'Park Slope']
  }
]

// Mock outreach history
const mockOutreachHistory = [
  {
    id: '1',
    type: 'invitation',
    listingAddress: '456 Bedford Ave, Brooklyn, NY',
    sentAt: '2025-11-01T10:00:00Z',
    opened: true,
    responded: false
  },
  {
    id: '2',
    type: 'follow-up',
    listingAddress: '456 Bedford Ave, Brooklyn, NY',
    sentAt: '2025-11-05T14:00:00Z',
    opened: true,
    responded: true
  }
]

export default function CRMLeadDetailPage({
  params
}: {
  params: Promise<{ leadId: string }>
}) {
  const { leadId } = use(params)
  const lead = mockCRMLeads.find(l => l.id === leadId)

  const [inviteMessage, setInviteMessage] = useState('')
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [selectedListings, setSelectedListings] = useState<string[]>([])

  // Get matching listings based on budget and preferences
  const matchingListings = mockAgentListings.filter(listing => {
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
      <div className="text-center py-12">
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
    setSelectedListings(prev =>
      prev.includes(listingId)
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/agent/crm"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to CRM
      </Link>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{lead.displayId}</h1>
            <Badge
              variant="outline"
              className={`${
                lead.matchScore >= 90
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : 'bg-yellow-100 text-yellow-800 border-yellow-300'
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
              <Button className="border-2 border-foreground">
                <Send className="mr-2 h-4 w-4" />
                Send Invitation
              </Button>
            </DialogTrigger>
            <DialogContent className="border-2 border-foreground max-w-lg">
              <DialogHeader>
                <DialogTitle>Invite to Apply</DialogTitle>
                <DialogDescription>
                  Select listings and compose a personalized invitation message.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Select Listings:</p>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {matchingListings.map(listing => (
                      <label
                        key={listing.id}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedListings.includes(listing.id)}
                          onChange={() => toggleListing(listing.id)}
                          className="h-4 w-4"
                        />
                        <span className="text-sm">{listing.address.split(',')[0]} - ${listing.price}/mo</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Textarea
                  placeholder="Add a personalized message (optional)..."
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="border-2 min-h-[100px]"
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
              <Button variant="outline" className="border-2 border-red-300 text-red-700 hover:bg-red-50">
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </DialogTrigger>
            <DialogContent className="border-2 border-foreground">
              <DialogHeader>
                <DialogTitle>Remove from CRM</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove this lead from your CRM? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setRemoveDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
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
        <Card className="border-2 border-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Lead Profile
            </CardTitle>
            <CardDescription>
              Obfuscated applicant information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Income Ratio */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Income-to-Rent Ratio</p>
                  <p className={`font-bold ${lead.incomeRatio >= 4 ? 'text-green-600' : ''}`}>
                    {lead.incomeRatio}x monthly rent
                  </p>
                </div>
              </div>
            </div>

            {/* Credit Score Band */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Credit Score Band</p>
                  <p className="font-bold">{lead.creditBand}</p>
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Budget Range</p>
                  <p className="font-bold">${lead.budgetMin} - ${lead.budgetMax}/mo</p>
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
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Original Application
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    {lead.originalListingAddress}
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    Denial reason: {lead.denialReason}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Matching Listings */}
        <Card className="border-2 border-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Matching Listings ({matchingListings.length})
            </CardTitle>
            <CardDescription>
              Current listings that match this lead&apos;s criteria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {matchingListings.length > 0 ? (
              matchingListings.map(listing => (
                <div
                  key={listing.id}
                  className="p-3 border-2 border-muted rounded-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{listing.address.split(',')[0]}</p>
                      <p className="text-sm text-muted-foreground">
                        {listing.beds}BR / {listing.baths}BA - {listing.sqft} sqft
                      </p>
                      <p className="text-lg font-bold mt-1">${listing.price}/mo</p>
                    </div>
                    <Link href={`/agent/listings/${listing.id}`}>
                      <Button size="sm" variant="outline" className="border-2">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
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
              <div className="text-center py-6 text-muted-foreground">
                <Building className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No matching listings available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Outreach History */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Outreach History
          </CardTitle>
          <CardDescription>
            Previous messages sent to this lead
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockOutreachHistory.length > 0 && lead.lastOutreach ? (
            <div className="space-y-3">
              {mockOutreachHistory.map(outreach => (
                <div
                  key={outreach.id}
                  className="flex items-center justify-between p-3 border-2 border-muted rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm capitalize">{outreach.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {outreach.listingAddress.split(',')[0]} - {formatDate(outreach.sentAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={outreach.opened ? 'bg-blue-100 text-blue-800 border-blue-300' : ''}
                    >
                      {outreach.opened ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                      Opened
                    </Badge>
                    <Badge
                      variant="outline"
                      className={outreach.responded ? 'bg-green-100 text-green-800 border-green-300' : ''}
                    >
                      {outreach.responded ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                      Responded
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No outreach history yet</p>
              <p className="text-sm">Send an invitation to start the conversation</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
