'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  Users,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Scale,
  UserPlus,
  Filter,
  Check
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  mockAgentListings,
  mockApplicants,
  getApplicantStatusColor,
  formatDate,
  Applicant
} from '@/lib/mock-data/agent'

type StatusFilter = 'all' | 'new' | 'reviewed' | 'shortlisted' | 'denied'

export default function ListingApplicants({
  params
}: {
  params: Promise<{ listingId: string }>
}) {
  const { listingId } = use(params)
  const listing = mockAgentListings.find(l => l.id === listingId)
  const allApplicants = mockApplicants.filter(a => a.listingId === listingId)

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([])
  const [compareOpen, setCompareOpen] = useState(false)

  const filteredApplicants = statusFilter === 'all'
    ? allApplicants
    : allApplicants.filter(a => a.status === statusFilter)

  const toggleApplicant = (id: string) => {
    setSelectedApplicants(prev => {
      if (prev.includes(id)) {
        return prev.filter(a => a !== id)
      }
      if (prev.length >= 3) {
        return prev // Max 3 for comparison
      }
      return [...prev, id]
    })
  }

  const selectedForComparison = allApplicants.filter(a => selectedApplicants.includes(a.id))

  if (!listing) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Listing not found</h2>
        <Link href="/dashboard/listings">
          <Button variant="outline" className="mt-4 border-2">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href={`/dashboard/listings/${listingId}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Listing
      </Link>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applicants</h1>
          <p className="text-muted-foreground">
            {listing.address} - {allApplicants.length} applicants
          </p>
        </div>
        <div className="flex gap-3">
          {selectedApplicants.length >= 2 && (
            <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-2">
                  <Scale className="mr-2 h-4 w-4" />
                  Compare ({selectedApplicants.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl border-2 border-foreground">
                <DialogHeader>
                  <DialogTitle>Compare Applicants</DialogTitle>
                  <DialogDescription>
                    Side-by-side comparison of selected applicants
                  </DialogDescription>
                </DialogHeader>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b-2 border-foreground">
                        <TableHead className="font-bold">Criteria</TableHead>
                        {selectedForComparison.map(a => (
                          <TableHead key={a.id} className="font-bold text-center">
                            {a.displayId}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Income Ratio</TableCell>
                        {selectedForComparison.map(a => (
                          <TableCell key={a.id} className="text-center">
                            <span className={a.incomeRatio >= 4 ? 'text-green-600 font-bold' : ''}>
                              {a.incomeRatio}x
                            </span>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Credit Band</TableCell>
                        {selectedForComparison.map(a => (
                          <TableCell key={a.id} className="text-center">
                            {a.creditBand}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Employment</TableCell>
                        {selectedForComparison.map(a => (
                          <TableCell key={a.id} className="text-center">
                            {a.employmentTenure}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Pets</TableCell>
                        {selectedForComparison.map(a => (
                          <TableCell key={a.id} className="text-center">
                            {a.pets ? 'Yes' : 'No'}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Occupants</TableCell>
                        {selectedForComparison.map(a => (
                          <TableCell key={a.id} className="text-center">
                            {a.occupants}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Move-in Date</TableCell>
                        {selectedForComparison.map(a => (
                          <TableCell key={a.id} className="text-center">
                            {formatDate(a.moveInDate)}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Applied</TableCell>
                        {selectedForComparison.map(a => (
                          <TableCell key={a.id} className="text-center">
                            {formatDate(a.appliedAt)}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Status</TableCell>
                        {selectedForComparison.map(a => (
                          <TableCell key={a.id} className="text-center">
                            <Badge
                              variant="outline"
                              className={`border ${getApplicantStatusColor(a.status)}`}
                            >
                              {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                            </Badge>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* CRM Matches Banner */}
      <Card className="border-2 border-blue-300 bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserPlus className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">3 CRM leads match this listing</p>
                <p className="text-sm text-muted-foreground">
                  Invite qualified leads from your CRM to apply
                </p>
              </div>
            </div>
            <Button size="sm" className="border-2 border-foreground">
              Invite to Apply
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <SelectTrigger className="w-40 border-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ({allApplicants.length})</SelectItem>
            <SelectItem value="new">New ({allApplicants.filter(a => a.status === 'new').length})</SelectItem>
            <SelectItem value="reviewed">Reviewed ({allApplicants.filter(a => a.status === 'reviewed').length})</SelectItem>
            <SelectItem value="shortlisted">Shortlisted ({allApplicants.filter(a => a.status === 'shortlisted').length})</SelectItem>
            <SelectItem value="denied">Denied ({allApplicants.filter(a => a.status === 'denied').length})</SelectItem>
          </SelectContent>
        </Select>
        {selectedApplicants.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedApplicants([])}
          >
            Clear selection
          </Button>
        )}
      </div>

      {/* Applicants List */}
      {filteredApplicants.length > 0 ? (
        <div className="space-y-3">
          {filteredApplicants.map((applicant) => (
            <Card key={applicant.id} className={`border-2 ${selectedApplicants.includes(applicant.id) ? 'border-primary' : 'border-foreground'}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Checkbox for comparison */}
                  <div className="pt-1">
                    <Checkbox
                      checked={selectedApplicants.includes(applicant.id)}
                      onCheckedChange={() => toggleApplicant(applicant.id)}
                      disabled={!selectedApplicants.includes(applicant.id) && selectedApplicants.length >= 3}
                    />
                  </div>

                  {/* Applicant Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold">{applicant.displayId}</p>
                          <Badge
                            variant="outline"
                            className={`border ${getApplicantStatusColor(applicant.status)}`}
                          >
                            {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Applied {formatDate(applicant.appliedAt)}
                        </p>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Income Ratio</p>
                        <p className={`font-medium ${applicant.incomeRatio >= 4 ? 'text-green-600' : ''}`}>
                          {applicant.incomeRatio}x
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Credit Band</p>
                        <p className="font-medium">{applicant.creditBand}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Employment</p>
                        <p className="font-medium">{applicant.employmentTenure}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Move-in</p>
                        <p className="font-medium">{formatDate(applicant.moveInDate)}</p>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span>{applicant.occupants} occupant(s)</span>
                      <span>{applicant.pets ? 'Has pets' : 'No pets'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" className="border-2">
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                    {applicant.status !== 'shortlisted' && applicant.status !== 'denied' && (
                      <>
                        <Button size="sm" variant="outline" className="border-2 border-green-300 text-green-700 hover:bg-green-50">
                          <ThumbsUp className="mr-1 h-3 w-3" />
                          Shortlist
                        </Button>
                        <Button size="sm" variant="outline" className="border-2 border-red-300 text-red-700 hover:bg-red-50">
                          <ThumbsDown className="mr-1 h-3 w-3" />
                          Deny
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No applicants found</h3>
          <p className="text-muted-foreground">
            {statusFilter === 'all'
              ? "No applications received yet for this listing."
              : `No ${statusFilter} applicants.`}
          </p>
        </div>
      )}

      {/* Instructions */}
      {filteredApplicants.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Select 2-3 applicants using the checkboxes to compare them side-by-side
        </p>
      )}
    </div>
  )
}
