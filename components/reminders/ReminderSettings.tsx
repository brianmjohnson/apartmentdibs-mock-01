'use client'

import { useState } from 'react'
import { Save, RotateCcw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface ReminderSettingsData {
  enabled: boolean
  channels: {
    email: boolean
    sms: boolean
  }
  schedule: {
    day1: boolean
    day3: boolean
    day5: boolean
    day7: boolean
  }
  customDays: number[]
  expirationDays: number
  templates: {
    day1: string
    day3: string
    day5: string
    day7: string
  }
}

interface ReminderSettingsProps {
  settings: ReminderSettingsData
  onSave: (settings: ReminderSettingsData) => Promise<void>
  className?: string
}

const defaultTemplates = {
  day1: 'Hi {name}, just a reminder to complete your application for {address}. You still need: {documents}',
  day3: 'Hi {name}, only 2 steps left for {address}! Please submit: {documents}',
  day5: 'Urgent: Your application for {address} expires in 48 hours. Missing: {documents}',
  day7: 'Final notice: Your application for {address} will expire today unless you submit: {documents}',
}

export function ReminderSettings({ settings, onSave, className }: ReminderSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('schedule')

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(localSettings)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setLocalSettings({
      ...localSettings,
      templates: defaultTemplates,
    })
  }

  const updateSettings = (updates: Partial<ReminderSettingsData>) => {
    setLocalSettings({ ...localSettings, ...updates })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Reminder Settings</CardTitle>
            <CardDescription>Configure automated document collection reminders</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="reminders-enabled" className="text-sm">
              Enabled
            </Label>
            <Switch
              id="reminders-enabled"
              checked={localSettings.enabled}
              onCheckedChange={(enabled) => updateSettings({ enabled })}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="mt-4 space-y-4">
            <div className="space-y-3">
              <Label>Send reminders on days:</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'day1', label: 'Day 1', desc: 'First reminder' },
                  { key: 'day3', label: 'Day 3', desc: 'Second reminder' },
                  { key: 'day5', label: 'Day 5', desc: 'Urgent notice' },
                  { key: 'day7', label: 'Day 7', desc: 'Final notice' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={localSettings.schedule[key as keyof typeof localSettings.schedule]}
                      onCheckedChange={(checked) =>
                        updateSettings({
                          schedule: {
                            ...localSettings.schedule,
                            [key]: checked,
                          },
                        })
                      }
                    />
                    <div>
                      <Label htmlFor={key} className="font-medium">
                        {label}
                      </Label>
                      <p className="text-muted-foreground text-xs">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiration">Application expiration (days)</Label>
              <Select
                value={localSettings.expirationDays.toString()}
                onValueChange={(value) => updateSettings({ expirationDays: parseInt(value) })}
              >
                <SelectTrigger id="expiration" className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="21">21 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Channels Tab */}
          <TabsContent value="channels" className="mt-4 space-y-4">
            <div className="space-y-3">
              <Label>Notification channels:</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label htmlFor="email-channel" className="font-medium">
                      Email
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Send reminder emails to applicants
                    </p>
                  </div>
                  <Switch
                    id="email-channel"
                    checked={localSettings.channels.email}
                    onCheckedChange={(email) =>
                      updateSettings({
                        channels: { ...localSettings.channels, email },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label htmlFor="sms-channel" className="font-medium">
                      SMS
                    </Label>
                    <p className="text-muted-foreground text-xs">Send text message reminders</p>
                  </div>
                  <Switch
                    id="sms-channel"
                    checked={localSettings.channels.sms}
                    onCheckedChange={(sms) =>
                      updateSettings({
                        channels: { ...localSettings.channels, sms },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label>Message templates</Label>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to defaults
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">
              Available variables: {'{name}'}, {'{address}'}, {'{documents}'}
            </p>
            <div className="space-y-4">
              {[
                { key: 'day1', label: 'Day 1 - First Reminder' },
                { key: 'day3', label: 'Day 3 - Second Reminder' },
                { key: 'day5', label: 'Day 5 - Urgent Notice' },
                { key: 'day7', label: 'Day 7 - Final Notice' },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={`template-${key}`} className="text-sm">
                    {label}
                  </Label>
                  <Textarea
                    id={`template-${key}`}
                    value={localSettings.templates[key as keyof typeof localSettings.templates]}
                    onChange={(e) =>
                      updateSettings({
                        templates: {
                          ...localSettings.templates,
                          [key]: e.target.value,
                        },
                      })
                    }
                    className="min-h-[80px]"
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
