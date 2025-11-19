'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  FileText,
  Users,
  Building,
  Save,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function NotificationsSettingsPage() {
  const [notifications, setNotifications] = useState({
    // Applications
    newApplication: { email: true, sms: true, push: true },
    applicationUpdate: { email: true, sms: false, push: true },
    shortlisted: { email: true, sms: true, push: true },
    denied: { email: true, sms: false, push: false },

    // CRM
    newCrmMatch: { email: true, sms: false, push: true },
    crmOutreachResponse: { email: true, sms: true, push: true },

    // Landlord
    landlordDecision: { email: true, sms: true, push: true },
    landlordMessage: { email: true, sms: false, push: true },

    // System
    weeklyReport: { email: true, sms: false, push: false },
    billingReminder: { email: true, sms: false, push: false },
  })

  const updateNotification = (
    category: keyof typeof notifications,
    channel: 'email' | 'sms' | 'push',
    value: boolean
  ) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [channel]: value,
      },
    }))
  }

  const NotificationRow = ({
    label,
    description,
    category,
  }: {
    label: string
    description: string
    category: keyof typeof notifications
  }) => (
    <div className="flex items-center justify-between py-3">
      <div className="space-y-0.5">
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Mail className="text-muted-foreground h-4 w-4" />
          <Switch
            checked={notifications[category].email}
            onCheckedChange={(value) => updateNotification(category, 'email', value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="text-muted-foreground h-4 w-4" />
          <Switch
            checked={notifications[category].sms}
            onCheckedChange={(value) => updateNotification(category, 'sms', value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Smartphone className="text-muted-foreground h-4 w-4" />
          <Switch
            checked={notifications[category].push}
            onCheckedChange={(value) => updateNotification(category, 'push', value)}
          />
        </div>
      </div>
    </div>
  )

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">Choose how you want to be notified</p>
      </div>

      {/* Channel Legend */}
      <Card className="border-foreground border-2">
        <CardContent className="p-4">
          <div className="flex items-center gap-6 text-sm">
            <span className="font-medium">Channels:</span>
            <div className="flex items-center gap-2">
              <Mail className="text-muted-foreground h-4 w-4" />
              <span>Email</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="text-muted-foreground h-4 w-4" />
              <span>SMS</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="text-muted-foreground h-4 w-4" />
              <span>Push</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Applications
          </CardTitle>
          <CardDescription>Notifications about applicant activity</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <NotificationRow
            label="New Application"
            description="When a new application is submitted"
            category="newApplication"
          />
          <NotificationRow
            label="Application Updated"
            description="When an applicant updates their application"
            category="applicationUpdate"
          />
          <NotificationRow
            label="Applicant Shortlisted"
            description="When you shortlist an applicant"
            category="shortlisted"
          />
          <NotificationRow
            label="Applicant Denied"
            description="When you deny an applicant"
            category="denied"
          />
        </CardContent>
      </Card>

      {/* CRM */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            CRM
          </CardTitle>
          <CardDescription>Notifications about CRM leads</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <NotificationRow
            label="New CRM Match"
            description="When a denied applicant matches a new listing"
            category="newCrmMatch"
          />
          <NotificationRow
            label="Outreach Response"
            description="When a CRM lead responds to your invitation"
            category="crmOutreachResponse"
          />
        </CardContent>
      </Card>

      {/* Landlord */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Landlord Decisions
          </CardTitle>
          <CardDescription>Notifications about landlord activity</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <NotificationRow
            label="Landlord Decision"
            description="When a landlord approves or denies an applicant"
            category="landlordDecision"
          />
          <NotificationRow
            label="Landlord Message"
            description="When a landlord sends you a message"
            category="landlordMessage"
          />
        </CardContent>
      </Card>

      {/* System */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            System
          </CardTitle>
          <CardDescription>Reports and account notifications</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <NotificationRow
            label="Weekly Report"
            description="Summary of your listings performance"
            category="weeklyReport"
          />
          <NotificationRow
            label="Billing Reminder"
            description="Notifications about upcoming payments"
            category="billingReminder"
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="border-foreground border-2">
          <Save className="mr-2 h-4 w-4" />
          Save Preferences
        </Button>
      </div>
    </div>
  )
}
