'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Building, Plus, Eye, Pencil, Users, Home, BedDouble, Bath } from 'lucide-react'
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
import { mockAgentListings, getListingStatusColor, formatCurrency } from '@/lib/mock-data/agent'

type StatusFilter = 'all' | 'active' | 'pending' | 'rented' | 'expired'

export default function AgentListings() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filteredListings =
    statusFilter === 'all'
      ? mockAgentListings
      : mockAgentListings.filter((listing) => listing.status === statusFilter)

  const statusCounts = {
    all: mockAgentListings.length,
    active: mockAgentListings.filter((l) => l.status === 'active').length,
    pending: mockAgentListings.filter((l) => l.status === 'pending').length,
    rented: mockAgentListings.filter((l) => l.status === 'rented').length,
    expired: mockAgentListings.filter((l) => l.status === 'expired').length,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Listings</h1>
          <p className="text-muted-foreground">Manage and monitor all your property listings</p>
        </div>
        <Link href="/agent/listings/create">
          <Button className="border-foreground border-2">
            <Plus className="mr-2 h-4 w-4" />
            Create Listing
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
        <TabsList className="border-foreground border-2">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All ({statusCounts.all})
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Active ({statusCounts.active})
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Pending ({statusCounts.pending})
          </TabsTrigger>
          <TabsTrigger
            value="rented"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Rented ({statusCounts.rented})
          </TabsTrigger>
          <TabsTrigger
            value="expired"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Expired ({statusCounts.expired})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Listings Table */}
      <Card className="border-foreground border-2">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-foreground border-b-2">
                <TableHead className="font-bold">Property</TableHead>
                <TableHead className="font-bold">Price</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-center font-bold">Days</TableHead>
                <TableHead className="text-center font-bold">Applicants</TableHead>
                <TableHead className="text-center font-bold">Views</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredListings.map((listing) => (
                <TableRow key={listing.id} className="border-border border-b">
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="bg-muted border-foreground flex h-16 w-16 shrink-0 items-center justify-center border-2">
                        <Home className="text-muted-foreground h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium">{listing.address}</p>
                        {listing.unit && (
                          <p className="text-muted-foreground text-sm">{listing.unit}</p>
                        )}
                        <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
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
                      <Users className="text-muted-foreground h-4 w-4" />
                      <span className="font-medium">{listing.applicantCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="text-muted-foreground h-4 w-4" />
                      <span className="font-medium">{listing.views}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/agent/listings/${listing.id}`}>
                        <Button size="sm" variant="outline" className="border-2">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/agent/listings/${listing.id}/edit`}>
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
        <div className="py-12 text-center">
          <Building className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="text-lg font-semibold">No listings found</h3>
          <p className="text-muted-foreground mb-4">
            {statusFilter === 'all'
              ? "You haven't created any listings yet."
              : `No ${statusFilter} listings found.`}
          </p>
          <Link href="/agent/listings/create">
            <Button className="border-foreground border-2">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Listing
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
