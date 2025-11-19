'use client'

import { useState } from 'react'
import { Bell, Mail, MessageSquare, Moon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

type EmailFrequency = 'immediate' | 'daily' | 'weekly'

interface NotificationPreferences {
  pushEnabled: boolean
  emailEnabled: boolean
  smsEnabled: boolean
  emailFrequency: EmailFrequency
  quietHoursEnabled: boolean
  quietHoursStart: string
  quietHoursEnd: string
}

interface NotificationSettingsProps {
  preferences: NotificationPreferences
  onSave: (preferences: NotificationPreferences) => Promise<void>
  className?: string
}

export function NotificationSettings({
  preferences,
  onSave,
  className,
}: NotificationSettingsProps) {
  const [settings, setSettings] = useState(preferences)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const updateSetting = <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Track analytics
      if (typeof window !== 'undefined' && window.posthog) {
        window.posthog.capture('notification_settings_updated', {
          pushEnabled: settings.pushEnabled,
          emailEnabled: settings.emailEnabled,
          smsEnabled: settings.smsEnabled,
          emailFrequency: settings.emailFrequency,
        })
      }

      await onSave(settings)
      setHasChanges(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Choose how and when you want to receive updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notification Channels */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Notification Channels</h3>

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label htmlFor="push">Push Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Instant updates on your device
                </p>
              </div>
            </div>
            <Switch
              id="push"
              checked={settings.pushEnabled}
              onCheckedChange={(checked) => updateSetting('pushEnabled', checked)}
            />
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label htmlFor="email">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Updates sent to your email
                </p>
              </div>
            </div>
            <Switch
              id="email"
              checked={settings.emailEnabled}
              onCheckedChange={(checked) => updateSetting('emailEnabled', checked)}
            />
          </div>

          {/* Email Frequency */}
          {settings.emailEnabled && (
            <div className="ml-7 space-y-2">
              <Label htmlFor="frequency" className="text-sm">
                Email Frequency
              </Label>
              <Select
                value={settings.emailFrequency}
                onValueChange={(value) =>
                  updateSetting('emailFrequency', value as EmailFrequency)
                }
              >
                <SelectTrigger id="frequency" className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* SMS Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label htmlFor="sms">SMS Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Urgent updates only (decisions, selections)
                </p>
              </div>
            </div>
            <Switch
              id="sms"
              checked={settings.smsEnabled}
              onCheckedChange={(checked) => updateSetting('smsEnabled', checked)}
            />
          </div>
        </div>

        <Separator />

        {/* Quiet Hours */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label htmlFor="quiet">Quiet Hours</Label>
                <p className="text-xs text-muted-foreground">
                  Pause push notifications during set hours
                </p>
              </div>
            </div>
            <Switch
              id="quiet"
              checked={settings.quietHoursEnabled}
              onCheckedChange={(checked) =>
                updateSetting('quietHoursEnabled', checked)
              }
            />
          </div>

          {settings.quietHoursEnabled && (
            <div className="ml-7 flex items-center gap-2">
              <Select
                value={settings.quietHoursStart}
                onValueChange={(value) => updateSetting('quietHoursStart', value)}
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0')
                    return (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {i === 0
                          ? '12:00 AM'
                          : i < 12
                            ? `${i}:00 AM`
                            : i === 12
                              ? '12:00 PM'
                              : `${i - 12}:00 PM`}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">to</span>
              <Select
                value={settings.quietHoursEnd}
                onValueChange={(value) => updateSetting('quietHoursEnd', value)}
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0')
                    return (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {i === 0
                          ? '12:00 AM'
                          : i < 12
                            ? `${i}:00 AM`
                            : i === 12
                              ? '12:00 PM'
                              : `${i - 12}:00 PM`}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="w-full"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Preferences'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
