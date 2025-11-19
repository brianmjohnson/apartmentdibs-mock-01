'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Headphones, Eye, UserPlus, CheckCircle, Clock, MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  mockSupportTickets,
  mockAdminTeam,
  getTicketPriorityColor,
  getTicketStatusColor,
  formatDateTime,
} from '@/lib/mock-data/admin'

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const openCount = mockSupportTickets.filter((t) => t.status === 'open').length
  const inProgressCount = mockSupportTickets.filter((t) => t.status === 'in_progress').length

  const filteredTickets = mockSupportTickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'all' || ticket.status === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Queue</h1>
          <p className="text-muted-foreground">Manage customer support tickets</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 border-blue-300 text-blue-700">
            <Clock className="h-3 w-3" />
            {openCount} Open
          </Badge>
          <Badge variant="outline" className="gap-1 border-yellow-300 text-yellow-700">
            <Headphones className="h-3 w-3" />
            {inProgressCount} In Progress
          </Badge>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="border-foreground border-2">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Search by ticket ID, subject, or user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-2 pl-9"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs and Tickets */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border-foreground border-2">
          <TabsTrigger value="all">All ({mockSupportTickets.length})</TabsTrigger>
          <TabsTrigger value="open">Open ({openCount})</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress ({inProgressCount})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="border-foreground border-2">
                <CardContent className="p-4">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link href={`/admin/support/${ticket.id}`}>
                            <h3 className="font-semibold hover:underline">{ticket.subject}</h3>
                          </Link>
                          <p className="text-muted-foreground text-sm">
                            {ticket.id} - {ticket.userName} ({ticket.userEmail})
                          </p>
                        </div>
                        <div className="md:hidden">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="border-2">
                              <Link href={`/admin/support/${ticket.id}`}>
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Assign
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Close
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`border ${getTicketPriorityColor(ticket.priority)}`}
                        >
                          {ticket.priority}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`border ${getTicketStatusColor(ticket.status)}`}
                        >
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="border">
                          {ticket.category}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground line-clamp-2 text-sm">
                        {ticket.description}
                      </p>

                      <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-xs">
                        <span>Created: {formatDateTime(ticket.createdAt)}</span>
                        {ticket.assignedTo && <span>Assigned to: {ticket.assignedTo}</span>}
                      </div>
                    </div>

                    <div className="hidden items-center gap-2 md:flex">
                      <Link href={`/admin/support/${ticket.id}`}>
                        <Button variant="outline" size="sm" className="border-2">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </Link>
                      <Select>
                        <SelectTrigger className="h-9 w-[140px] border-2">
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockAdminTeam
                            .filter((m) => m.status === 'active')
                            .map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" className="border-2">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Close
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredTickets.length === 0 && (
              <Card className="border-foreground border-2">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No tickets found matching your criteria</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
