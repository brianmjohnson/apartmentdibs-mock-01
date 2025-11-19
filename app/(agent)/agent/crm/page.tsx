'use client'

import Link from 'next/link'
import {
  Users,
  UserPlus,
  Info,
  Building,
  Calendar,
  TrendingUp,
  Send,
  Eye
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/mock-data/agent'

// Mock CRM leads data
export const mockCRMLeads = [
  {
    id: 'crm-001',
    displayId: 'Applicant #2301',
    originalListingId: 'agent-listing-1',
    originalListingAddress: '123 Main St, Brooklyn, NY',
    denialDate: '2025-10-28',
    denialReason: 'Higher qualified applicant selected',
    incomeRatio: 4.2,
    creditBand: '720-740',
    matchingListings: 3,
    matchScore: 92,
    lastOutreach: null
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
    matchingListings: 2,
    matchScore: 85,
    lastOutreach: '2025-11-01'
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
    matchingListings: 4,
    matchScore: 96,
    lastOutreach: null
  },
  {
    id: 'crm-004',
    displayId: 'Applicant #2445',
    originalListingId: 'agent-listing-1',
    originalListingAddress: '123 Main St, Brooklyn, NY',
    denialDate: '2025-11-01',
    denialReason: 'Pet policy mismatch',
    incomeRatio: 4.0,
    creditBand: '680-700',
    matchingListings: 5,
    matchScore: 88,
    lastOutreach: '2025-11-10'
  },
  {
    id: 'crm-005',
    displayId: 'Applicant #2567',
    originalListingId: 'agent-listing-4',
    originalListingAddress: '321 Atlantic Ave, Brooklyn, NY',
    denialDate: '2025-11-05',
    denialReason: 'Higher qualified applicant selected',
    incomeRatio: 4.5,
    creditBand: '740-760',
    matchingListings: 3,
    matchScore: 91,
    lastOutreach: null
  }
]

export default function CRMPage() {
  const totalLeads = mockCRMLeads.length
  const noOutreachLeads = mockCRMLeads.filter(l => !l.lastOutreach).length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">CRM - Warm Leads</h1>
        <p className="text-muted-foreground">
          {totalLeads} leads available for re-engagement
        </p>
      </div>

      {/* Explanation Card */}
      <Card className="border-2 border-blue-300 bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">
                These are denied applicants who match your current listings
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Re-engage them with one-tap outreach. They&apos;ve already been verified and are actively looking for housing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2 border-foreground">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{totalLeads}</p>
                <p className="text-sm text-muted-foreground">Total Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-foreground">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserPlus className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{noOutreachLeads}</p>
                <p className="text-sm text-muted-foreground">Awaiting Outreach</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-foreground">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">24%</p>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {mockCRMLeads.map((lead) => (
          <Card key={lead.id} className="border-2 border-foreground">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{lead.displayId}</CardTitle>
                  <CardDescription>
                    Originally applied to {lead.originalListingAddress.split(',')[0]}
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className={`${
                    lead.matchScore >= 90
                      ? 'bg-green-100 text-green-800 border-green-300'
                      : lead.matchScore >= 80
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                      : 'bg-gray-100 text-gray-800 border-gray-300'
                  }`}
                >
                  {lead.matchScore}% match
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Income</p>
                  <p className={`font-medium ${lead.incomeRatio >= 4 ? 'text-green-600' : ''}`}>
                    {lead.incomeRatio}x
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Credit</p>
                  <p className="font-medium">{lead.creditBand}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Denied</p>
                  <p className="font-medium">{formatDate(lead.denialDate)}</p>
                </div>
              </div>

              {/* Matching Listings */}
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">{lead.matchingListings}</span> matching listings available
                </span>
              </div>

              {/* Last Outreach */}
              {lead.lastOutreach && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Last contacted: {formatDate(lead.lastOutreach)}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Link href={`/agent/crm/${lead.id}`} className="flex-1">
                  <Button variant="outline" className="w-full border-2">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </Link>
                <Button className="flex-1 border-2 border-foreground">
                  <Send className="mr-2 h-4 w-4" />
                  Invite to Apply
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockCRMLeads.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No CRM leads yet</h3>
          <p className="text-muted-foreground">
            Denied applicants who match your listings will appear here.
          </p>
        </div>
      )}
    </div>
  )
}
