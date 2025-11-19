'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, MessageSquare, Bell } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

interface NotificationSettings {
  email: {
    applications: boolean
    listings: boolean
    marketing: boolean
  }
  sms: {
    applications: boolean
    listings: boolean
    marketing: boolean
  }
  push: {
    applications: boolean
    listings: boolean
    marketing: boolean
  }
}

export default function NotificationsSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      applications: true,
      listings: true,
      marketing: false,
    },
    sms: {
      applications: true,
      listings: false,
      marketing: false,
    },
    push: {
      applications: true,
      listings: true,
      marketing: false,
    },
  })

  const updateSetting = (
    channel: keyof NotificationSettings,
    category: string,
    value: boolean
  ) => {
    setSettings(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [category]: value,
      },
    }))
  }

  const handleSave = () => {
    // Mock save - in real app would call API
    console.log('Saving notification settings:', settings)
  }

  const NotificationCategory = ({
    title,
    description,
    channel,
    category,
  }: {
    title: string
    description: string
    channel: keyof NotificationSettings
    category: 'applications' | 'listings' | 'marketing'
  }) => (
    <div className="flex items-center justify-between py-3">
      <div className="space-y-0.5">
        <Label className="font-medium">{title}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={settings[channel][category]}
        onCheckedChange={(checked) => updateSetting(channel, category, checked)}
      />
    </div>
  )

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
        <h1 className="text-3xl font-bold tracking-tight">Notification Preferences</h1>
        <p className="text-muted-foreground">
          Choose how you want to be notified about important updates
        </p>
      </div>

      {/* Email Notifications */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Receive updates via email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          <NotificationCategory
            title="Application Updates"
            description="Status changes, messages from landlords, and decision notifications"
            channel="email"
            category="applications"
          />
          <Separator />
          <NotificationCategory
            title="Listing Alerts"
            description="New listings matching your preferences and price drops on saved listings"
            channel="email"
            category="listings"
          />
          <Separator />
          <NotificationCategory
            title="Marketing & Tips"
            description="Renting tips, market insights, and promotional offers"
            channel="email"
            category="marketing"
          />
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            SMS Notifications
          </CardTitle>
          <CardDescription>
            Receive text messages for urgent updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          <NotificationCategory
            title="Application Updates"
            description="Urgent status changes and time-sensitive requests"
            channel="sms"
            category="applications"
          />
          <Separator />
          <NotificationCategory
            title="Listing Alerts"
            description="Immediate alerts for new listings matching your criteria"
            channel="sms"
            category="listings"
          />
          <Separator />
          <NotificationCategory
            title="Marketing & Tips"
            description="Promotional offers and special announcements"
            channel="sms"
            category="marketing"
          />
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Receive notifications on your device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          <NotificationCategory
            title="Application Updates"
            description="Real-time updates on your applications"
            channel="push"
            category="applications"
          />
          <Separator />
          <NotificationCategory
            title="Listing Alerts"
            description="Instant alerts for new listings and saved listing updates"
            channel="push"
            category="listings"
          />
          <Separator />
          <NotificationCategory
            title="Marketing & Tips"
            description="Promotional offers and helpful tips"
            channel="push"
            category="marketing"
          />
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
