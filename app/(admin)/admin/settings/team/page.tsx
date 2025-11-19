'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, UserPlus, Mail, Shield, Trash2, MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockAdminTeam, formatDate } from '@/lib/mock-data/admin'

export default function TeamSettingsPage() {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<string | null>(null)

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'support':
        return 'bg-green-100 text-green-800 border-green-300'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300'
    }
  }

  const handleRemove = (memberId: string) => {
    setSelectedMember(memberId)
    setRemoveDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link href="/admin/settings">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Settings
        </Button>
      </Link>

      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Team</h1>
          <p className="text-muted-foreground">Manage admin team members and roles</p>
        </div>
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="border-foreground border-2">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="border-foreground border-2">
            <DialogHeader>
              <DialogTitle>Invite New Admin</DialogTitle>
              <DialogDescription>Send an invitation to a new team member</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@apartmentdibs.com"
                  className="mt-1 border-2"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger className="mt-1 border-2">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-muted-foreground text-sm">
                <p className="mb-1 font-medium">Role permissions:</p>
                <ul className="list-inside list-disc space-y-1">
                  <li>
                    <strong>Super Admin:</strong> Full access to all features
                  </li>
                  <li>
                    <strong>Admin:</strong> All features except team management
                  </li>
                  <li>
                    <strong>Support:</strong> Support tickets and user management only
                  </li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setInviteDialogOpen(false)}
                className="border-2"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Handle invite
                  setInviteDialogOpen(false)
                }}
                className="border-foreground border-2"
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Table */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle>Team Members ({mockAdminTeam.length})</CardTitle>
          <CardDescription>All admin users with platform access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-border rounded-md border-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAdminTeam.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`border ${getRoleColor(member.role)}`}>
                        {member.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`border ${getStatusColor(member.status)}`}
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(member.joinedAt)}</TableCell>
                    <TableCell>{formatDate(member.lastActive)}</TableCell>
                    <TableCell className="text-right">
                      {member.role !== 'super_admin' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="border-2">
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem>
                            {member.status === 'pending' && (
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Resend Invitation
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleRemove(member.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Remove Dialog */}
      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent className="border-foreground border-2">
          <DialogHeader>
            <DialogTitle>Remove Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this admin? They will lose all access to the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRemoveDialogOpen(false)
                setSelectedMember(null)
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
                setSelectedMember(null)
              }}
            >
              Remove Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
