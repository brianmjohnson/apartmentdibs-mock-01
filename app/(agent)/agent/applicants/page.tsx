'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, Filter, Eye, ThumbsUp, ThumbsDown, Calendar, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  mockApplicants,
  mockAgentListings,
  getApplicantStatusColor,
  formatDate,
} from '@/lib/mock-data/agent'

type StatusFilter = 'all' | 'new' | 'reviewed' | 'shortlisted' | 'denied'

export default function AllApplicantsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [listingFilter, setListingFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('all')

  // Get listing address by ID
  const getListingAddress = (listingId: string) => {
    const listing = mockAgentListings.find((l) => l.id === listingId)
    return listing ? listing.address : 'Unknown'
  }

  // Filter applicants
  const filteredApplicants = mockApplicants.filter((applicant) => {
    if (statusFilter !== 'all' && applicant.status !== statusFilter) return false
    if (listingFilter !== 'all' && applicant.listingId !== listingFilter) return false

    // Date range filtering
    if (dateRange !== 'all') {
      const appliedDate = new Date(applicant.appliedAt)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24))

      if (dateRange === '7' && daysDiff > 7) return false
      if (dateRange === '30' && daysDiff > 30) return false
      if (dateRange === '90' && daysDiff > 90) return false
    }

    return true
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Applicants</h1>
        <p className="text-muted-foreground">
          {mockApplicants.length} total applicants across all listings
        </p>
      </div>

      {/* Filters */}
      <Card className="border-foreground border-2">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Filter className="text-muted-foreground h-4 w-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
              <SelectTrigger className="w-40 border-2">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
              </SelectContent>
            </Select>

            {/* Listing Filter */}
            <Select value={listingFilter} onValueChange={setListingFilter}>
              <SelectTrigger className="w-48 border-2">
                <SelectValue placeholder="Listing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Listings</SelectItem>
                {mockAgentListings.map((listing) => (
                  <SelectItem key={listing.id} value={listing.id}>
                    {listing.address.split(',')[0]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Range */}
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40 border-2">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Showing {filteredApplicants.length} of {mockApplicants.length} applicants
        </p>
      </div>

      {/* Applicants Table */}
      {filteredApplicants.length > 0 ? (
        <Card className="border-foreground border-2">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-foreground border-b-2">
                  <TableHead className="font-bold">Applicant ID</TableHead>
                  <TableHead className="font-bold">Listing</TableHead>
                  <TableHead className="font-bold">Income Ratio</TableHead>
                  <TableHead className="font-bold">Credit Band</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Applied</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.map((applicant) => (
                  <TableRow key={applicant.id} className="border-b">
                    <TableCell className="font-medium">{applicant.displayId}</TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {getListingAddress(applicant.listingId).split(',')[0]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={applicant.incomeRatio >= 4 ? 'font-bold text-green-600' : ''}
                      >
                        {applicant.incomeRatio}x
                      </span>
                    </TableCell>
                    <TableCell>{applicant.creditBand}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`border ${getApplicantStatusColor(applicant.status)}`}
                      >
                        {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {formatDate(applicant.appliedAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/agent/applicants/${applicant.id}`}>
                          <Button size="sm" variant="outline" className="border-2">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </Link>
                        {applicant.status !== 'shortlisted' && applicant.status !== 'denied' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-2 border-green-300 text-green-700 hover:bg-green-50"
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-2 border-red-300 text-red-700 hover:bg-red-50"
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <div className="py-12 text-center">
          <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="text-lg font-semibold">No applicants found</h3>
          <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  )
}
