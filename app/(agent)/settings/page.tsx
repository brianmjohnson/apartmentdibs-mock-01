'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  User,
  Building,
  Mail,
  Phone,
  CreditCard,
  Users,
  Bell,
  Save,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { mockAgentProfile } from '@/lib/mock-data/agent'

export default function AgentSettingsPage() {
  const [formData, setFormData] = useState({
    name: mockAgentProfile.name,
    email: mockAgentProfile.email,
    phone: mockAgentProfile.phone,
    company: mockAgentProfile.company,
    licenseNumber: 'NYS-2024-78542',
    website: 'https://brooklynre.com',
    bio: 'Experienced real estate agent specializing in Brooklyn rentals with 8+ years in the market.'
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/settings/team">
          <Card className="border-2 border-foreground hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Team</p>
                  <p className="text-sm text-muted-foreground">Manage team members</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/settings/billing">
          <Card className="border-2 border-foreground hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Billing</p>
                  <p className="text-sm text-muted-foreground">Plans and payments</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/settings/notifications">
          <Card className="border-2 border-foreground hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-muted-foreground">Alert preferences</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Account Information */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Your personal and business details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="border-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="pl-10 border-2"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="pl-10 border-2"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className="border-2"
              />
            </div>
          </div>

          <Separator />

          {/* Business Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className="pl-10 border-2"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">License Number</Label>
              <Input
                id="license"
                value={formData.licenseNumber}
                onChange={(e) => handleChange('licenseNumber', e.target.value)}
                className="border-2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Professional Bio</Label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="w-full min-h-[100px] px-3 py-2 border-2 rounded-md bg-background resize-none"
            />
          </div>

          <Button className="border-2 border-foreground">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-2 border-red-300">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
            <div>
              <p className="font-medium text-red-800 dark:text-red-200">Delete Account</p>
              <p className="text-sm text-red-600 dark:text-red-300">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="outline" className="border-2 border-red-300 text-red-700 hover:bg-red-50">
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
