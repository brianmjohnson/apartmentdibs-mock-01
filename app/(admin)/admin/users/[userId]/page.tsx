'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Mail,
  Calendar,
  Shield,
  Edit,
  Key,
  UserX,
  LogIn,
  Ban,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  mockUserActivities,
  getUserStatusColor,
  getPersonaColor,
  formatDate,
  formatDateTime,
} from '@/lib/mock-data/admin'

export default function UserDetailsPage() {
  const params = useParams()
  const userId = params.userId as string
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<'suspend' | 'ban' | 'reset'>('suspend')

  const user = mockUsers.find((u) => u.id === userId)
  const userActivities = mockUserActivities.filter((a) => a.userId === userId)

  if (!user) {
    return (
      <div className="space-y-6">
        <Link href="/admin/users">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
        </Link>
        <Card className="border-2 border-foreground">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">User not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleAction = (type: 'suspend' | 'ban' | 'reset') => {
    setActionType(type)
    setActionDialogOpen(true)
  }

  const actionMessages = {
    suspend: {
      title: 'Suspend User',
      description: 'This will temporarily prevent the user from accessing the platform.',
    },
    ban: {
      title: 'Ban User',
      description: 'This will permanently ban the user from the platform. This action cannot be undone.',
    },
    reset: {
      title: 'Reset Password',
      description: 'This will send a password reset email to the user.',
    },
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link href="/admin/users">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Button>
      </Link>

      {/* User Header */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={`border ${getPersonaColor(user.persona)}`}
              >
                {user.persona}
              </Badge>
              <Badge
                variant="outline"
                className={`border ${getUserStatusColor(user.status)}`}
              >
                {user.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Join Date</p>
              <p className="font-medium">{formatDate(user.joinDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Active</p>
              <p className="font-medium">{formatDate(user.lastActive)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Verification</p>
              <div className="flex items-center gap-1">
                {user.verificationStatus === 'verified' && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                {user.verificationStatus === 'pending' && (
                  <Clock className="h-4 w-4 text-yellow-600" />
                )}
                {user.verificationStatus === 'unverified' && (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <span className="font-medium capitalize">{user.verificationStatus}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {user.persona === 'tenant' ? 'Applications' : 'Listings'}
              </p>
              <p className="font-medium">
                {user.persona === 'tenant' ? user.applicationsCount : user.listingsCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Manage this user account</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" className="border-2">
            <Edit className="mr-2 h-4 w-4" />
            Edit User
          </Button>
          <Button
            variant="outline"
            className="border-2"
            onClick={() => handleAction('reset')}
          >
            <Key className="mr-2 h-4 w-4" />
            Reset Password
          </Button>
          <Button variant="outline" className="border-2">
            <LogIn className="mr-2 h-4 w-4" />
            Impersonate
          </Button>
          <Separator orientation="vertical" className="h-9 hidden md:block" />
          <Button
            variant="outline"
            className="border-2 text-yellow-600 hover:text-yellow-700"
            onClick={() => handleAction('suspend')}
          >
            <UserX className="mr-2 h-4 w-4" />
            Suspend
          </Button>
          <Button
            variant="outline"
            className="border-2 text-red-600 hover:text-red-700"
            onClick={() => handleAction('ban')}
          >
            <Ban className="mr-2 h-4 w-4" />
            Ban User
          </Button>
        </CardContent>
      </Card>

      {/* Activity Tabs */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList className="border-2 border-foreground">
          <TabsTrigger value="activity">Activity History</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>Recent user actions on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {userActivities.length > 0 ? (
                <div className="space-y-4">
                  {userActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start justify-between p-4 border-2 border-border"
                    >
                      <div>
                        <p className="font-medium capitalize">
                          {activity.action.replace(/_/g, ' ')}
                        </p>
                        {activity.details && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.details}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDateTime(activity.timestamp)}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        IP: {activity.ipAddress}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No activity recorded for this user
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>Administrative actions taken on this account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start justify-between p-4 border-2 border-border">
                  <div>
                    <p className="font-medium">Account Created</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      User registered via email
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDateTime(user.joinDate + 'T10:00:00Z')}
                    </p>
                  </div>
                  <Badge variant="outline" className="border">
                    System
                  </Badge>
                </div>
                {user.status === 'suspended' && (
                  <div className="flex items-start justify-between p-4 border-2 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20">
                    <div>
                      <p className="font-medium">Account Suspended</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        User violated community guidelines
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Nov 1, 2025, 3:00 PM
                      </p>
                    </div>
                    <Badge variant="outline" className="border">
                      Admin
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="border-2 border-foreground">
          <DialogHeader>
            <DialogTitle>{actionMessages[actionType].title}</DialogTitle>
            <DialogDescription>
              {actionMessages[actionType].description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialogOpen(false)}
              className="border-2"
            >
              Cancel
            </Button>
            <Button
              variant={actionType === 'ban' ? 'destructive' : 'default'}
              onClick={() => {
                // Handle action
                setActionDialogOpen(false)
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
