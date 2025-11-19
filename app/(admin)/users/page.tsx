'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  Eye,
  UserX,
  LogIn,
  MoreHorizontal,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import {
  mockUsers,
  getUserStatusColor,
  getPersonaColor,
  formatDate,
} from '@/lib/mock-data/admin'

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [personaFilter, setPersonaFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPersona = personaFilter === 'all' || user.persona === personaFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesPersona && matchesStatus
  })

  const handleSuspend = (userId: string) => {
    setSelectedUser(userId)
    setSuspendDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          View and manage all platform users
        </p>
      </div>

      {/* Filters */}
      <Card className="border-2 border-foreground">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-2"
                />
              </div>
            </div>
            <Select value={personaFilter} onValueChange={setPersonaFilter}>
              <SelectTrigger className="w-full md:w-[180px] border-2">
                <SelectValue placeholder="All Personas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Personas</SelectItem>
                <SelectItem value="tenant">Tenant</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="landlord">Landlord</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px] border-2">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Showing {filteredUsers.length} of {mockUsers.length} users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border-2 border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Persona</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`border ${getPersonaColor(user.persona)}`}
                      >
                        {user.persona}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`border ${getUserStatusColor(user.status)}`}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.joinDate)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-2">
                          <Link href={`/users/${user.id}`}>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem>
                            <LogIn className="mr-2 h-4 w-4" />
                            Impersonate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleSuspend(user.id)}
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Suspend User
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

      {/* Suspend Dialog */}
      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent className="border-2 border-foreground">
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
            <DialogDescription>
              Are you sure you want to suspend this user? They will not be able to access the platform until reinstated.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSuspendDialogOpen(false)}
              className="border-2"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                // Handle suspension
                setSuspendDialogOpen(false)
              }}
            >
              Suspend User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
