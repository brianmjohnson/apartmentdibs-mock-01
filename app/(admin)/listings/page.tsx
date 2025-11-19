'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Flag,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
  ExternalLink,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  mockModeratedListings,
  getModerationStatusColor,
  formatDate,
  formatCurrency,
} from '@/lib/mock-data/admin'

export default function ListingsModerationPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState<string | null>(null)
  const [removalReason, setRemovalReason] = useState('')

  const flaggedCount = mockModeratedListings.filter((l) => l.status === 'flagged').length
  const underReviewCount = mockModeratedListings.filter((l) => l.status === 'under_review').length

  const filteredListings = mockModeratedListings.filter((listing) => {
    const matchesSearch =
      listing.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.agentOrLandlord.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab =
      activeTab === 'all' || listing.status === activeTab
    return matchesSearch && matchesTab
  })

  const handleRemove = (listingId: string) => {
    setSelectedListing(listingId)
    setRemoveDialogOpen(true)
  }

  const getFlagTypeLabel = (type: string) => {
    switch (type) {
      case 'fair_housing':
        return 'Fair Housing'
      case 'misleading_info':
        return 'Misleading Info'
      case 'duplicate':
        return 'Duplicate'
      case 'scam':
        return 'Potential Scam'
      case 'inappropriate_content':
        return 'Inappropriate'
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Listing Moderation</h1>
          <p className="text-muted-foreground">
            Review and moderate platform listings
          </p>
        </div>
        <div className="flex items-center gap-2">
          {flaggedCount > 0 && (
            <Badge variant="destructive" className="gap-1">
              <Flag className="h-3 w-3" />
              {flaggedCount} Flagged
            </Badge>
          )}
          {underReviewCount > 0 && (
            <Badge variant="outline" className="border-yellow-300 text-yellow-700 gap-1">
              <AlertTriangle className="h-3 w-3" />
              {underReviewCount} Under Review
            </Badge>
          )}
        </div>
      </div>

      {/* Search */}
      <Card className="border-2 border-foreground">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by address or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs and Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border-2 border-foreground">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="flagged">Flagged</TabsTrigger>
          <TabsTrigger value="under_review">Under Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="removed">Removed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle>Listings ({filteredListings.length})</CardTitle>
              <CardDescription>
                {activeTab === 'all'
                  ? 'All listings on the platform'
                  : `Listings with status: ${activeTab.replace('_', ' ')}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border-2 border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Address</TableHead>
                      <TableHead>Agent/Landlord</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Flags</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredListings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{listing.address}</p>
                            <p className="text-sm text-muted-foreground">
                              {listing.beds} bed, {listing.baths} bath
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{listing.agentOrLandlord}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {listing.userType}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(listing.price)}/mo</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`border ${getModerationStatusColor(listing.status)}`}
                          >
                            {listing.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {listing.flags.length > 0 ? (
                            <div className="space-y-1">
                              {listing.flags.slice(0, 2).map((flag) => (
                                <Badge
                                  key={flag.id}
                                  variant="outline"
                                  className="border-red-300 text-red-700 text-xs"
                                >
                                  {getFlagTypeLabel(flag.type)}
                                </Badge>
                              ))}
                              {listing.flags.length > 2 && (
                                <span className="text-xs text-muted-foreground">
                                  +{listing.flags.length - 2} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">None</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="border-2">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Listing
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Public Page
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {listing.status !== 'approved' && (
                                <DropdownMenuItem className="text-green-600">
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                              )}
                              {listing.status !== 'removed' && (
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleRemove(listing.id)}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Remove
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Warn User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Flag Details Dialog */}
      {selectedListing && (
        <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
          <DialogContent className="border-2 border-foreground">
            <DialogHeader>
              <DialogTitle>Remove Listing</DialogTitle>
              <DialogDescription>
                This will remove the listing from the platform and notify the user.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <label className="text-sm font-medium">Reason for removal</label>
              <Textarea
                placeholder="Enter the reason for removing this listing..."
                value={removalReason}
                onChange={(e) => setRemovalReason(e.target.value)}
                className="mt-2 border-2"
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setRemoveDialogOpen(false)
                  setRemovalReason('')
                }}
                className="border-2"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  // Handle removal
                  setRemoveDialogOpen(false)
                  setRemovalReason('')
                }}
              >
                Remove Listing
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
