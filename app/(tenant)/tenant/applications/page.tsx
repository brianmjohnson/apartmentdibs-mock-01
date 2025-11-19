'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, FileText, MapPin, Bed, Bath, Calendar, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  mockApplications,
  getStatusColor,
  getStatusLabel,
  formatDate,
  mockApplicationDetails,
} from '@/lib/mock-data/tenant'
import { formatPrice } from '@/lib/mock-data/listings'

type FilterTab = 'all' | 'active' | 'completed'

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const filterApplications = (tab: FilterTab) => {
    switch (tab) {
      case 'active':
        return mockApplications.filter(
          (app) => !['denied', 'withdrawn', 'approved'].includes(app.status)
        )
      case 'completed':
        return mockApplications.filter((app) =>
          ['denied', 'withdrawn', 'approved'].includes(app.status)
        )
      default:
        return mockApplications
    }
  }

  const filteredApplications = filterApplications(activeTab)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Your Applications</h1>
        <p className="text-muted-foreground">Track and manage your rental applications</p>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FilterTab)}>
        <TabsList className="border-foreground border-2">
          <TabsTrigger value="all">All ({mockApplications.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({filterApplications('active').length})</TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({filterApplications('completed').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredApplications.length === 0 ? (
            <Card className="border-foreground border-2">
              <CardContent className="py-12">
                <div className="text-center">
                  <FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <h3 className="mb-2 text-lg font-semibold">No applications yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start searching for your perfect apartment and submit your first application
                  </p>
                  <Button asChild className="border-foreground border-2">
                    <Link href="/search">
                      <Search className="mr-2 h-4 w-4" />
                      Search Apartments
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => {
                const detail = mockApplicationDetails[application.id]
                const propertyImage = detail?.propertyImage || '/images/listings/listing-1-1.jpg'

                return (
                  <Card key={application.id} className="border-foreground overflow-hidden border-2">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Property Image */}
                        <div className="relative h-48 w-full flex-shrink-0 md:h-auto md:w-48">
                          <Image
                            src={propertyImage}
                            alt={application.address}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 192px"
                          />
                        </div>

                        {/* Application Details */}
                        <div className="flex-1 p-4 md:p-6">
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="space-y-3">
                              {/* Address */}
                              <div className="flex items-center gap-2">
                                <MapPin className="text-muted-foreground h-4 w-4" />
                                <span className="text-lg font-semibold">
                                  {application.address}
                                  {application.unit && `, ${application.unit}`}
                                </span>
                              </div>

                              {/* Property Details */}
                              <div className="text-muted-foreground flex items-center gap-4 text-sm">
                                <span className="text-foreground font-medium">
                                  {formatPrice(application.rent)}/mo
                                </span>
                                <span className="flex items-center gap-1">
                                  <Bed className="h-3 w-3" /> {application.beds} bed
                                </span>
                                <span className="flex items-center gap-1">
                                  <Bath className="h-3 w-3" /> {application.baths} bath
                                </span>
                              </div>

                              {/* Dates */}
                              <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Applied {formatDate(application.appliedAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Updated {formatDate(application.lastUpdate)}
                                </span>
                              </div>
                            </div>

                            {/* Status and Actions */}
                            <div className="flex flex-col items-start gap-3 md:items-end">
                              <Badge className={`${getStatusColor(application.status)} border`}>
                                {getStatusLabel(application.status)}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="border-foreground border-2"
                              >
                                <Link href={`/tenant/applications/${application.id}`}>
                                  View Details
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
