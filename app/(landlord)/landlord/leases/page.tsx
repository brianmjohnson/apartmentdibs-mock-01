'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, Calendar, RefreshCw, Eye } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  mockLeases,
  formatCurrency,
  formatDate,
  getLeaseStatusColor,
} from '@/lib/mock-data/landlord'

type LeaseFilter = 'all' | 'active' | 'expiring_soon' | 'expired'

export default function LeasesPage() {
  const [filter, setFilter] = useState<LeaseFilter>('all')

  const filteredLeases = mockLeases.filter((lease) => {
    if (filter === 'all') return true
    return lease.status === filter
  })

  const activeCount = mockLeases.filter((l) => l.status === 'active').length
  const expiringCount = mockLeases.filter((l) => l.status === 'expiring_soon').length
  const expiredCount = mockLeases.filter((l) => l.status === 'expired').length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lease Management</h1>
        <p className="text-muted-foreground">View and manage all leases across your properties</p>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as LeaseFilter)}>
        <TabsList className="border-foreground border-2">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-foreground data-[state=active]:text-background"
          >
            All ({mockLeases.length})
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-foreground data-[state=active]:text-background"
          >
            Active ({activeCount})
          </TabsTrigger>
          <TabsTrigger
            value="expiring_soon"
            className="data-[state=active]:bg-foreground data-[state=active]:text-background"
          >
            Expiring Soon ({expiringCount})
          </TabsTrigger>
          <TabsTrigger
            value="expired"
            className="data-[state=active]:bg-foreground data-[state=active]:text-background"
          >
            Expired ({expiredCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {filteredLeases.length === 0 ? (
            <Card className="border-foreground border-2">
              <CardContent className="py-12 text-center">
                <FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground">No leases found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredLeases.map((lease) => (
                <Card key={lease.id} className="border-foreground border-2">
                  <CardContent className="p-4">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {lease.propertyAddress}, Unit {lease.unitNumber}
                          </p>
                          <Badge
                            variant="outline"
                            className={`border ${getLeaseStatusColor(lease.status)}`}
                          >
                            {lease.status === 'expiring_soon'
                              ? 'Expiring Soon'
                              : lease.status.charAt(0).toUpperCase() + lease.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">{lease.tenantName}</p>
                        <div className="text-muted-foreground flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(lease.startDate)} - {formatDate(lease.endDate)}
                          </span>
                          <span>{formatCurrency(lease.monthlyRent)}/mo</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/landlord/leases/${lease.id}`}>
                          <Button variant="outline" size="sm" className="border-2">
                            <Eye className="mr-1 h-4 w-4" />
                            View
                          </Button>
                        </Link>
                        <Link href={`/landlord/leases/${lease.id}/renew`}>
                          <Button size="sm" className="border-foreground border-2">
                            <RefreshCw className="mr-1 h-4 w-4" />
                            Renew
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
