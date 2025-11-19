'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Building,
  Plus,
  Eye,
  Pencil,
  Users,
  Home,
  BedDouble,
  Bath
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  mockAgentListings,
  getListingStatusColor,
  formatCurrency
} from '@/lib/mock-data/agent'

type StatusFilter = 'all' | 'active' | 'pending' | 'rented' | 'expired'

export default function AgentListings() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filteredListings = statusFilter === 'all'
    ? mockAgentListings
    : mockAgentListings.filter(listing => listing.status === statusFilter)

  const statusCounts = {
    all: mockAgentListings.length,
    active: mockAgentListings.filter(l => l.status === 'active').length,
    pending: mockAgentListings.filter(l => l.status === 'pending').length,
    rented: mockAgentListings.filter(l => l.status === 'rented').length,
    expired: mockAgentListings.filter(l => l.status === 'expired').length,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Listings</h1>
          <p className="text-muted-foreground">
            Manage and monitor all your property listings
          </p>
        </div>
        <Link href="/dashboard/listings/create">
          <Button className="border-2 border-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Create Listing
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
        <TabsList className="border-2 border-foreground">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            All ({statusCounts.all})
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Active ({statusCounts.active})
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Pending ({statusCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="rented" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Rented ({statusCounts.rented})
          </TabsTrigger>
          <TabsTrigger value="expired" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Expired ({statusCounts.expired})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Listings Table */}
      <Card className="border-2 border-foreground">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-foreground">
                <TableHead className="font-bold">Property</TableHead>
                <TableHead className="font-bold">Price</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold text-center">Days</TableHead>
                <TableHead className="font-bold text-center">Applicants</TableHead>
                <TableHead className="font-bold text-center">Views</TableHead>
                <TableHead className="font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredListings.map((listing) => (
                <TableRow key={listing.id} className="border-b border-border">
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="h-16 w-16 bg-muted border-2 border-foreground flex items-center justify-center shrink-0">
                        <Home className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{listing.address}</p>
                        {listing.unit && (
                          <p className="text-sm text-muted-foreground">{listing.unit}</p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <BedDouble className="h-3 w-3" />
                            {listing.beds}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="h-3 w-3" />
                            {listing.baths}
                          </span>
                          <span>{listing.sqft} sqft</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold">{formatCurrency(listing.price)}</span>
                    <span className="text-muted-foreground">/mo</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`border-2 ${getListingStatusColor(listing.status)}`}
                    >
                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">{listing.daysOnMarket}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{listing.applicantCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{listing.views}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dashboard/listings/${listing.id}`}>
                        <Button size="sm" variant="outline" className="border-2">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/listings/${listing.id}/edit`}>
                        <Button size="sm" variant="outline" className="border-2">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No listings found</h3>
          <p className="text-muted-foreground mb-4">
            {statusFilter === 'all'
              ? "You haven't created any listings yet."
              : `No ${statusFilter} listings found.`}
          </p>
          <Link href="/dashboard/listings/create">
            <Button className="border-2 border-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Listing
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
