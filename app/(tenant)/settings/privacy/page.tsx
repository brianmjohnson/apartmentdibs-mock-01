'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Eye, Share2, Download, Trash2, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PrivacySettings {
  profileVisibility: 'public' | 'landlords_only' | 'private'
  shareWithPartners: boolean
  shareAnalytics: boolean
  personalizedAds: boolean
}

export default function PrivacySettingsPage() {
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: 'landlords_only',
    shareWithPartners: false,
    shareAnalytics: true,
    personalizedAds: false,
  })
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [exportRequested, setExportRequested] = useState(false)
  const [deleteRequested, setDeleteRequested] = useState(false)

  const handleSave = () => {
    // Mock save - in real app would call API
    console.log('Saving privacy settings:', settings)
  }

  const handleExportData = () => {
    // Mock export - in real app would trigger data export
    setExportRequested(true)
    setShowExportDialog(false)
    // Show toast notification in real app
  }

  const handleDeleteData = () => {
    // Mock delete request - in real app would submit GDPR deletion request
    setDeleteRequested(true)
    setShowDeleteDialog(false)
    // Show toast notification in real app
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/settings"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Settings
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Settings</h1>
        <p className="text-muted-foreground">
          Control your privacy and data preferences
        </p>
      </div>

      {/* Profile Visibility */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Profile Visibility
          </CardTitle>
          <CardDescription>
            Control who can see your renter profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="visibility">Who can view your profile?</Label>
            <Select
              value={settings.profileVisibility}
              onValueChange={(value: PrivacySettings['profileVisibility']) =>
                setSettings(prev => ({ ...prev, profileVisibility: value }))
              }
            >
              <SelectTrigger className="border-2 border-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  Public - Anyone can view
                </SelectItem>
                <SelectItem value="landlords_only">
                  Landlords Only - Only verified landlords
                </SelectItem>
                <SelectItem value="private">
                  Private - Only when you apply
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {settings.profileVisibility === 'public' &&
                'Your profile will be visible to all users on the platform.'}
              {settings.profileVisibility === 'landlords_only' &&
                'Only verified landlords can view your profile to reach out about listings.'}
              {settings.profileVisibility === 'private' &&
                'Your profile is only shared with landlords when you apply to their listings.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Sharing */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Data Sharing
          </CardTitle>
          <CardDescription>
            Control how your data is shared and used
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex items-center justify-between py-3">
            <div className="space-y-0.5">
              <Label className="font-medium">Share with Partners</Label>
              <p className="text-sm text-muted-foreground">
                Allow us to share your data with trusted third-party partners for better service
              </p>
            </div>
            <Switch
              checked={settings.shareWithPartners}
              onCheckedChange={(checked) =>
                setSettings(prev => ({ ...prev, shareWithPartners: checked }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between py-3">
            <div className="space-y-0.5">
              <Label className="font-medium">Analytics & Improvements</Label>
              <p className="text-sm text-muted-foreground">
                Help us improve by sharing anonymous usage data
              </p>
            </div>
            <Switch
              checked={settings.shareAnalytics}
              onCheckedChange={(checked) =>
                setSettings(prev => ({ ...prev, shareAnalytics: checked }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between py-3">
            <div className="space-y-0.5">
              <Label className="font-medium">Personalized Advertising</Label>
              <p className="text-sm text-muted-foreground">
                See ads tailored to your interests based on your activity
              </p>
            </div>
            <Switch
              checked={settings.personalizedAds}
              onCheckedChange={(checked) =>
                setSettings(prev => ({ ...prev, personalizedAds: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* GDPR/CCPA Data Rights */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Your Data Rights
          </CardTitle>
          <CardDescription>
            Exercise your rights under GDPR/CCPA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Export Data */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-2 border-border rounded-lg">
            <div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <p className="font-medium">Export Your Data</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Download a copy of all data we have about you
              </p>
            </div>
            <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-2 border-foreground" disabled={exportRequested}>
                  {exportRequested ? 'Export Requested' : 'Export Data'}
                </Button>
              </DialogTrigger>
              <DialogContent className="border-2 border-foreground">
                <DialogHeader>
                  <DialogTitle>Export Your Data</DialogTitle>
                  <DialogDescription>
                    We will compile all your data and send you a download link via email within 48 hours.
                    This includes your profile information, applications, documents, and activity history.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowExportDialog(false)} className="border-2 border-foreground">
                    Cancel
                  </Button>
                  <Button onClick={handleExportData} className="border-2 border-foreground">
                    Request Export
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Delete Data */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-2 border-red-200 rounded-lg bg-red-50">
            <div>
              <div className="flex items-center gap-2 text-red-800">
                <Trash2 className="h-4 w-4" />
                <p className="font-medium">Delete Your Data</p>
              </div>
              <p className="text-sm text-red-600 mt-1">
                Request deletion of all your personal data
              </p>
            </div>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-2 border-red-500 text-red-600 hover:bg-red-100" disabled={deleteRequested}>
                  {deleteRequested ? 'Request Submitted' : 'Delete Data'}
                </Button>
              </DialogTrigger>
              <DialogContent className="border-2 border-foreground">
                <DialogHeader>
                  <DialogTitle className="text-red-600">Delete Your Data</DialogTitle>
                  <DialogDescription>
                    This will submit a request to delete all your personal data from our systems.
                    This action is irreversible and will be processed within 30 days as required by law.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground">
                    Note: Some data may be retained for legal or compliance purposes.
                    Your account will remain active unless you also delete your account.
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="border-2 border-foreground">
                    Cancel
                  </Button>
                  <Button onClick={handleDeleteData} className="bg-red-600 hover:bg-red-700 border-2 border-red-600">
                    Submit Request
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="border-2 border-foreground">
          Save Preferences
        </Button>
      </div>
    </div>
  )
}
