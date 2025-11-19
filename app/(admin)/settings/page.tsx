'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Settings,
  Users,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  Save,
  Gauge,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  mockFeatureFlags,
} from '@/lib/mock-data/admin'

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false)
  const [featureFlags, setFeatureFlags] = useState(mockFeatureFlags)

  const handleMaintenanceToggle = () => {
    if (!maintenanceMode) {
      setMaintenanceDialogOpen(true)
    } else {
      setMaintenanceMode(false)
    }
  }

  const handleFeatureFlagToggle = (flagId: string) => {
    setFeatureFlags((prev) =>
      prev.map((flag) =>
        flag.id === flagId ? { ...flag, enabled: !flag.enabled } : flag
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
          <p className="text-muted-foreground">
            Configure platform settings and features
          </p>
        </div>
        <Link href="/settings/team">
          <Button variant="outline" className="border-2">
            <Users className="mr-2 h-4 w-4" />
            Manage Team
          </Button>
        </Link>
      </div>

      {/* Maintenance Mode */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Maintenance Mode
          </CardTitle>
          <CardDescription>
            Enable maintenance mode to temporarily disable the platform for users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">
                {maintenanceMode ? 'Maintenance mode is ON' : 'Maintenance mode is OFF'}
              </p>
              <p className="text-sm text-muted-foreground">
                {maintenanceMode
                  ? 'Users will see a maintenance page'
                  : 'The platform is accessible to all users'}
              </p>
            </div>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={handleMaintenanceToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {featureFlags.some((f) => f.enabled) ? (
              <ToggleRight className="h-5 w-5" />
            ) : (
              <ToggleLeft className="h-5 w-5" />
            )}
            Feature Flags
          </CardTitle>
          <CardDescription>
            Enable or disable platform features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {featureFlags.map((flag) => (
            <div
              key={flag.id}
              className="flex items-center justify-between p-4 border-2 border-border"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{flag.name}</p>
                  {flag.rolloutPercentage > 0 && flag.rolloutPercentage < 100 && (
                    <Badge variant="outline" className="border text-xs">
                      {flag.rolloutPercentage}% rollout
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{flag.description}</p>
              </div>
              <Switch
                checked={flag.enabled}
                onCheckedChange={() => handleFeatureFlagToggle(flag.id)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* API Rate Limits */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            API Rate Limits
          </CardTitle>
          <CardDescription>
            Configure API rate limiting settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Requests per minute (per user)</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  defaultValue={[60]}
                  max={200}
                  step={10}
                  className="flex-1"
                />
                <Input
                  type="number"
                  defaultValue={60}
                  className="w-20 border-2"
                />
              </div>
            </div>

            <div>
              <Label>Requests per minute (global)</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  defaultValue={[1000]}
                  max={5000}
                  step={100}
                  className="flex-1"
                />
                <Input
                  type="number"
                  defaultValue={1000}
                  className="w-20 border-2"
                />
              </div>
            </div>

            <div>
              <Label>Burst limit</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  defaultValue={[10]}
                  max={50}
                  step={5}
                  className="flex-1"
                />
                <Input
                  type="number"
                  defaultValue={10}
                  className="w-20 border-2"
                />
              </div>
            </div>
          </div>

          <Button className="border-2 border-foreground">
            <Save className="mr-2 h-4 w-4" />
            Save Rate Limits
          </Button>
        </CardContent>
      </Card>

      {/* Other Settings */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Other Settings
          </CardTitle>
          <CardDescription>
            Additional platform configuration options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border-2 border-border">
            <div className="space-y-1">
              <p className="font-medium">Email notifications</p>
              <p className="text-sm text-muted-foreground">
                Enable system email notifications
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 border-2 border-border">
            <div className="space-y-1">
              <p className="font-medium">New user verification</p>
              <p className="text-sm text-muted-foreground">
                Require email verification for new accounts
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 border-2 border-border">
            <div className="space-y-1">
              <p className="font-medium">Two-factor authentication</p>
              <p className="text-sm text-muted-foreground">
                Require 2FA for admin accounts
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 border-2 border-border">
            <div className="space-y-1">
              <p className="font-medium">Audit logging</p>
              <p className="text-sm text-muted-foreground">
                Log all admin actions for compliance
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Mode Dialog */}
      <Dialog open={maintenanceDialogOpen} onOpenChange={setMaintenanceDialogOpen}>
        <DialogContent className="border-2 border-foreground">
          <DialogHeader>
            <DialogTitle>Enable Maintenance Mode</DialogTitle>
            <DialogDescription>
              This will make the platform inaccessible to all non-admin users. Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMaintenanceDialogOpen(false)}
              className="border-2"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setMaintenanceMode(true)
                setMaintenanceDialogOpen(false)
              }}
            >
              Enable Maintenance Mode
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
