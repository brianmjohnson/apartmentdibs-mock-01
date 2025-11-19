'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Users, UserPlus, Mail, Trash2, Crown, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'

// Mock team members
const mockTeamMembers = [
  {
    id: '1',
    name: 'Jessica Martinez',
    email: 'jessica@brooklynre.com',
    role: 'owner',
    status: 'active',
    joinedAt: '2023-01-15',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@brooklynre.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-03-20',
  },
  {
    id: '3',
    name: 'Sarah Williams',
    email: 'sarah@brooklynre.com',
    role: 'member',
    status: 'active',
    joinedAt: '2024-06-10',
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@brooklynre.com',
    role: 'member',
    status: 'pending',
    joinedAt: '2025-11-15',
  },
]

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'owner':
      return <Crown className="h-4 w-4 text-yellow-600" />
    case 'admin':
      return <Shield className="h-4 w-4 text-blue-600" />
    default:
      return null
  }
}

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'owner':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'admin':
      return 'bg-blue-100 text-blue-800 border-blue-300'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

export default function TeamSettingsPage() {
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)

  const activeMembers = mockTeamMembers.filter((m) => m.status === 'active').length
  const pendingInvites = mockTeamMembers.filter((m) => m.status === 'pending').length

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/agent/settings"
        className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Settings
      </Link>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground">
            {activeMembers} active member(s), {pendingInvites} pending invite(s)
          </p>
        </div>
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="border-foreground border-2">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent className="border-foreground border-2">
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your team on ApartmentDibs.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger className="border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-muted-foreground text-xs">
                  Admins can manage listings and team members. Members can only view and manage
                  their assigned listings.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setInviteDialogOpen(false)} disabled={!inviteEmail}>
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Members List */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
          <CardDescription>People who have access to your ApartmentDibs account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTeamMembers.map((member) => (
              <div
                key={member.id}
                className="border-muted flex items-center justify-between rounded-md border-2 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.name}</p>
                      {getRoleIcon(member.role)}
                      {member.status === 'pending' && (
                        <Badge
                          variant="outline"
                          className="border-yellow-300 bg-yellow-100 text-yellow-800"
                        >
                          Pending
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={getRoleBadge(member.role)}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </Badge>
                  {member.role !== 'owner' && (
                    <Button
                      size="icon"
                      variant="outline"
                      className="border-2 border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>What each role can do in your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="border-muted rounded-md border-2 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-600" />
                <p className="font-medium">Owner</p>
              </div>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>- Full account access</li>
                <li>- Manage billing</li>
                <li>- Manage team members</li>
                <li>- Delete account</li>
              </ul>
            </div>
            <div className="border-muted rounded-md border-2 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <p className="font-medium">Admin</p>
              </div>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>- Manage all listings</li>
                <li>- Invite/remove members</li>
                <li>- View analytics</li>
                <li>- Manage CRM</li>
              </ul>
            </div>
            <div className="border-muted rounded-md border-2 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-600" />
                <p className="font-medium">Member</p>
              </div>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>- View assigned listings</li>
                <li>- Manage applicants</li>
                <li>- Send messages</li>
                <li>- View own analytics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
