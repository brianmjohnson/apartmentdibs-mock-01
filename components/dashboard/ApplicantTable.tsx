'use client'

import { useState, useMemo } from 'react'
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Filter,
  Search,
  MoreHorizontal,
  Eye,
  MessageSquare,
  Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge, type ApplicationStatus } from './StatusBadge'
import { BulkActionBar } from './BulkActionBar'

export interface ApplicantRow {
  id: string
  applicantId: string
  listingAddress: string
  status: ApplicationStatus
  applicationDate: Date
  lastActivity: Date
  nextAction: string
  incomeRatio?: number
  creditBand?: string
  verificationStatus: 'verified' | 'pending' | 'expired'
}

type SortField = 'applicationDate' | 'status' | 'listingAddress' | 'incomeRatio' | 'creditBand'
type SortDirection = 'asc' | 'desc'

interface ApplicantTableProps {
  applicants: ApplicantRow[]
  isLoading?: boolean
  onViewDetails: (applicant: ApplicantRow) => void
  onMessage: (applicantId: string) => void
  onForwardToLandlord: (ids: string[]) => void
  onRequestDocuments: (ids: string[]) => void
  onDeny: (ids: string[]) => void
  pageSize?: number
  className?: string
}

export function ApplicantTable({
  applicants,
  isLoading = false,
  onViewDetails,
  onMessage,
  onForwardToLandlord,
  onRequestDocuments,
  onDeny,
  pageSize = 50,
  className,
}: ApplicantTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [sortField, setSortField] = useState<SortField>('applicationDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Filter and sort applicants
  const filteredApplicants = useMemo(() => {
    let result = [...applicants]

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((a) => a.status === statusFilter)
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (a) =>
          a.applicantId.toLowerCase().includes(term) ||
          a.listingAddress.toLowerCase().includes(term)
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case 'applicationDate':
          comparison = a.applicationDate.getTime() - b.applicationDate.getTime()
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
        case 'listingAddress':
          comparison = a.listingAddress.localeCompare(b.listingAddress)
          break
        case 'incomeRatio':
          comparison = (a.incomeRatio || 0) - (b.incomeRatio || 0)
          break
        case 'creditBand':
          comparison = (a.creditBand || '').localeCompare(b.creditBand || '')
          break
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [applicants, statusFilter, searchTerm, sortField, sortDirection])

  // Paginate
  const totalPages = Math.ceil(filteredApplicants.length / pageSize)
  const paginatedApplicants = filteredApplicants.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }

    // Track analytics
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('applicant_filtered', {
        filterType: 'sort',
        filterValue: field,
      })
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedApplicants.map((a) => a.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id])
    } else {
      setSelectedIds(selectedIds.filter((i) => i !== id))
    }
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value as ApplicationStatus | 'all')
    setCurrentPage(1)

    // Track analytics
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('applicant_filtered', {
        filterType: 'status',
        filterValue: value,
      })
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown className="ml-1 h-4 w-4" />
    return sortDirection === 'asc' ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    )
  }

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative max-w-sm min-w-[200px] flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search applicants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="documents_complete">Documents Complete</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="offer_extended">Offer Extended</SelectItem>
            <SelectItem value="lease_signed">Lease Signed</SelectItem>
            <SelectItem value="incomplete">Incomplete</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="denied">Denied</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-muted-foreground text-sm">
          {filteredApplicants.length} applicant{filteredApplicants.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        selectedIds={selectedIds}
        onForwardToLandlord={onForwardToLandlord}
        onRequestDocuments={onRequestDocuments}
        onDeny={onDeny}
        onClearSelection={() => setSelectedIds([])}
      />

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    paginatedApplicants.length > 0 &&
                    paginatedApplicants.every((a) => selectedIds.includes(a.id))
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all applicants"
                />
              </TableHead>
              <TableHead>Applicant ID</TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort('listingAddress')}
                  className="flex items-center font-medium hover:underline"
                >
                  Listing
                  <SortIcon field="listingAddress" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center font-medium hover:underline"
                >
                  Status
                  <SortIcon field="status" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort('applicationDate')}
                  className="flex items-center font-medium hover:underline"
                >
                  Applied
                  <SortIcon field="applicationDate" />
                </button>
              </TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>Next Action</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedApplicants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-muted-foreground h-32 text-center">
                  No applicants found
                </TableCell>
              </TableRow>
            ) : (
              paginatedApplicants.map((applicant) => (
                <TableRow key={applicant.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(applicant.id)}
                      onCheckedChange={(checked) =>
                        handleSelectRow(applicant.id, checked as boolean)
                      }
                      aria-label={`Select applicant ${applicant.applicantId}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">#{applicant.applicantId}</TableCell>
                  <TableCell>{applicant.listingAddress}</TableCell>
                  <TableCell>
                    <StatusBadge status={applicant.status} />
                  </TableCell>
                  <TableCell>{formatDate(applicant.applicationDate)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatRelativeTime(applicant.lastActivity)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {applicant.nextAction}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetails(applicant)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onMessage(applicant.id)}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Message
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onForwardToLandlord([applicant.id])}>
                          <Send className="mr-2 h-4 w-4" />
                          Forward to Landlord
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
