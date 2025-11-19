'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, CreditCard, Bell, Save } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

interface NotificationSetting {
  id: string
  label: string
  description: string
  email: boolean
  sms: boolean
  push: boolean
}

const initialSettings: Record<string, NotificationSetting[]> = {
  payments: [
    {
      id: 'payment_received',
      label: 'Payment Received',
      description: 'When a tenant submits a rent payment',
      email: true,
      sms: false,
      push: true
    },
    {
      id: 'payment_late',
      label: 'Late Payment',
      description: 'When a rent payment is overdue',
      email: true,
      sms: true,
      push: true
    },
    {
      id: 'payment_failed',
      label: 'Failed Payment',
      description: 'When a payment attempt fails',
      email: true,
      sms: true,
      push: true
    }
  ],
  maintenance: [
    {
      id: 'maintenance_new',
      label: 'New Request',
      description: 'When a tenant submits a maintenance request',
      email: true,
      sms: false,
      push: true
    },
    {
      id: 'maintenance_urgent',
      label: 'Urgent Request',
      description: 'When an urgent maintenance issue is reported',
      email: true,
      sms: true,
      push: true
    },
    {
      id: 'maintenance_completed',
      label: 'Request Completed',
      description: 'When a maintenance request is marked complete',
      email: true,
      sms: false,
      push: false
    }
  ],
  leases: [
    {
      id: 'lease_expiring',
      label: 'Lease Expiring',
      description: 'Reminder when a lease is about to expire',
      email: true,
      sms: false,
      push: true
    },
    {
      id: 'lease_renewed',
      label: 'Lease Renewed',
      description: 'When a tenant accepts a renewal offer',
      email: true,
      sms: false,
      push: true
    },
    {
      id: 'lease_terminated',
      label: 'Lease Terminated',
      description: 'When a lease is terminated',
      email: true,
      sms: true,
      push: true
    }
  ],
  applications: [
    {
      id: 'application_new',
      label: 'New Application',
      description: 'When someone applies for a listing',
      email: true,
      sms: false,
      push: true
    },
    {
      id: 'application_shortlisted',
      label: 'Applicant Shortlisted',
      description: 'When your agent shortlists an applicant',
      email: true,
      sms: false,
      push: true
    },
    {
      id: 'screening_complete',
      label: 'Screening Complete',
      description: 'When tenant screening results are ready',
      email: true,
      sms: false,
      push: true
    }
  ]
}

export default function NotificationsSettingsPage() {
  const [settings, setSettings] = useState(initialSettings)

  const toggleSetting = (
    category: string,
    settingId: string,
    channel: 'email' | 'sms' | 'push'
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: prev[category].map(setting =>
        setting.id === settingId
          ? { ...setting, [channel]: !setting[channel] }
          : setting
      )
    }))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notification Preferences</h1>
        <p className="text-muted-foreground">
          Choose how you want to be notified about important events
        </p>
      </div>

      {/* Settings Navigation */}
      <div className="flex gap-2 flex-wrap">
        <Link href="/settings">
          <Button variant="outline" className="border-2">
            <User className="h-4 w-4 mr-2" />
            Account
          </Button>
        </Link>
        <Link href="/settings/billing">
          <Button variant="outline" className="border-2">
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </Button>
        </Link>
        <Button variant="default" className="border-2 border-foreground">
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </Button>
      </div>

      {/* Payments Notifications */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle>Payment Notifications</CardTitle>
          <CardDescription>Alerts related to rent payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Header */}
            <div className="grid grid-cols-[1fr,60px,60px,60px] gap-4 text-sm font-medium text-muted-foreground">
              <div></div>
              <div className="text-center">Email</div>
              <div className="text-center">SMS</div>
              <div className="text-center">Push</div>
            </div>
            <Separator />
            {settings.payments.map(setting => (
              <div key={setting.id} className="grid grid-cols-[1fr,60px,60px,60px] gap-4 items-center">
                <div>
                  <Label className="font-medium">{setting.label}</Label>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
                <div className="flex justify-center">
                  <Switch
                    checked={setting.email}
                    onCheckedChange={() => toggleSetting('payments', setting.id, 'email')}
                  />
                </div>
                <div className="flex justify-center">
                  <Switch
                    checked={setting.sms}
                    onCheckedChange={() => toggleSetting('payments', setting.id, 'sms')}
                  />
                </div>
                <div className="flex justify-center">
                  <Switch
                    checked={setting.push}
                    onCheckedChange={() => toggleSetting('payments', setting.id, 'push')}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Notifications */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle>Maintenance Notifications</CardTitle>
          <CardDescription>Alerts for maintenance requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Header */}
            <div className="grid grid-cols-[1fr,60px,60px,60px] gap-4 text-sm font-medium text-muted-foreground">
              <div></div>
              <div className="text-center">Email</div>
              <div className="text-center">SMS</div>
              <div className="text-center">Push</div>
            </div>
            <Separator />
            {settings.maintenance.map(setting => (
              <div key={setting.id} className="grid grid-cols-[1fr,60px,60px,60px] gap-4 items-center">
                <div>
                  <Label className="font-medium">{setting.label}</Label>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
                <div className="flex justify-center">
                  <Switch
                    checked={setting.email}
                    onCheckedChange={() => toggleSetting('maintenance', setting.id, 'email')}
                  />
                </div>
                <div className="flex justify-center">
                  <Switch
                    checked={setting.sms}
                    onCheckedChange={() => toggleSetting('maintenance', setting.id, 'sms')}
                  />
                </div>
                <div className="flex justify-center">
                  <Switch
                    checked={setting.push}
                    onCheckedChange={() => toggleSetting('maintenance', setting.id, 'push')}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lease Notifications */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle>Lease Notifications</CardTitle>
          <CardDescription>Alerts for lease-related events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Header */}
            <div className="grid grid-cols-[1fr,60px,60px,60px] gap-4 text-sm font-medium text-muted-foreground">
              <div></div>
              <div className="text-center">Email</div>
              <div className="text-center">SMS</div>
              <div className="text-center">Push</div>
            </div>
            <Separator />
            {settings.leases.map(setting => (
              <div key={setting.id} className="grid grid-cols-[1fr,60px,60px,60px] gap-4 items-center">
                <div>
                  <Label className="font-medium">{setting.label}</Label>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
                <div className="flex justify-center">
                  <Switch
                    checked={setting.email}
                    onCheckedChange={() => toggleSetting('leases', setting.id, 'email')}
                  />
                </div>
                <div className="flex justify-center">
                  <Switch
                    checked={setting.sms}
                    onCheckedChange={() => toggleSetting('leases', setting.id, 'sms')}
                  />
                </div>
                <div className="flex justify-center">
                  <Switch
                    checked={setting.push}
                    onCheckedChange={() => toggleSetting('leases', setting.id, 'push')}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Application Notifications */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle>Application Notifications</CardTitle>
          <CardDescription>Alerts for rental applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Header */}
            <div className="grid grid-cols-[1fr,60px,60px,60px] gap-4 text-sm font-medium text-muted-foreground">
              <div></div>
              <div className="text-center">Email</div>
              <div className="text-center">SMS</div>
              <div className="text-center">Push</div>
            </div>
            <Separator />
            {settings.applications.map(setting => (
              <div key={setting.id} className="grid grid-cols-[1fr,60px,60px,60px] gap-4 items-center">
                <div>
                  <Label className="font-medium">{setting.label}</Label>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
                <div className="flex justify-center">
                  <Switch
                    checked={setting.email}
                    onCheckedChange={() => toggleSetting('applications', setting.id, 'email')}
                  />
                </div>
                <div className="flex justify-center">
                  <Switch
                    checked={setting.sms}
                    onCheckedChange={() => toggleSetting('applications', setting.id, 'sms')}
                  />
                </div>
                <div className="flex justify-center">
                  <Switch
                    checked={setting.push}
                    onCheckedChange={() => toggleSetting('applications', setting.id, 'push')}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="border-2 border-foreground">
          <Save className="h-4 w-4 mr-2" />
          Save Preferences
        </Button>
      </div>
    </div>
  )
}
