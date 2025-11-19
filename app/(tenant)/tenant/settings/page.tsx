'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, Mail, Phone, Lock, Trash2, Bell, Shield, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { mockTenantProfile } from '@/lib/mock-data/tenant'

export default function SettingsPage() {
  const [email, setEmail] = useState(mockTenantProfile.email)
  const [phone, setPhone] = useState(mockTenantProfile.phone)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')

  const handleSaveAccount = () => {
    // Mock save - in real app would call API
    console.log('Saving account settings:', { email, phone })
  }

  const handleChangePassword = () => {
    // Mock password change - in real app would call API
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    console.log('Changing password')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmation === 'DELETE') {
      // Mock delete - in real app would call API
      console.log('Deleting account')
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Settings Navigation */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/tenant/settings/notifications">
          <Card className="border-foreground hover:bg-muted/50 cursor-pointer border-2 transition-colors">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5" />
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-muted-foreground text-sm">
                    Email, SMS, and push notification preferences
                  </p>
                </div>
              </div>
              <ChevronRight className="text-muted-foreground h-5 w-5" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/tenant/settings/privacy">
          <Card className="border-foreground hover:bg-muted/50 cursor-pointer border-2 transition-colors">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5" />
                <div>
                  <p className="font-medium">Privacy</p>
                  <p className="text-muted-foreground text-sm">
                    Profile visibility and data preferences
                  </p>
                </div>
              </div>
              <ChevronRight className="text-muted-foreground h-5 w-5" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Account Settings */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>Update your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-foreground border-2"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border-foreground border-2"
            />
          </div>

          <Button onClick={handleSaveAccount} className="border-foreground border-2">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border-foreground border-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border-foreground border-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-foreground border-2"
            />
          </div>

          <Button
            onClick={handleChangePassword}
            disabled={!currentPassword || !newPassword || !confirmPassword}
            className="border-foreground border-2"
          >
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-2 border-red-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 rounded-lg border-2 border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-red-800">Delete Account</p>
              <p className="text-sm text-red-600">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-2 border-red-500 text-red-600 hover:bg-red-100"
                >
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent className="border-foreground border-2">
                <DialogHeader>
                  <DialogTitle className="text-red-600">Delete Account</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account and
                    remove all your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-muted-foreground text-sm">
                    To confirm, type <span className="font-mono font-bold">DELETE</span> below:
                  </p>
                  <Input
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="Type DELETE to confirm"
                    className="border-foreground border-2"
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteDialog(false)
                      setDeleteConfirmation('')
                    }}
                    className="border-foreground border-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmation !== 'DELETE'}
                    className="border-2 border-red-600 bg-red-600 hover:bg-red-700"
                  >
                    Delete Account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
