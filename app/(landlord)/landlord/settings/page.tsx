'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, Building, CreditCard, Bell, Save } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { mockLandlordProfile } from '@/lib/mock-data/landlord'

export default function SettingsPage() {
  const [name, setName] = useState(mockLandlordProfile.name)
  const [email, setEmail] = useState(mockLandlordProfile.email)
  const [phone, setPhone] = useState(mockLandlordProfile.phone)
  const [companyName, setCompanyName] = useState('Patel Properties LLC')
  const [companyAddress, setCompanyAddress] = useState('123 Business St, Brooklyn, NY 11201')

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Settings Navigation */}
      <div className="flex flex-wrap gap-2">
        <Button variant="default" className="border-foreground border-2">
          <User className="mr-2 h-4 w-4" />
          Account
        </Button>
        <Link href="/landlord/settings/billing">
          <Button variant="outline" className="border-2">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </Button>
        </Link>
        <Link href="/landlord/settings/notifications">
          <Button variant="outline" className="border-2">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
        </Link>
      </div>

      {/* Account Settings */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>Update your personal account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border-2"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Enter current password"
              className="border-2 md:w-1/2"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                className="border-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                className="border-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Company Information
          </CardTitle>
          <CardDescription>Business details for your property management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="border-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyAddress">Business Address</Label>
              <Input
                id="companyAddress"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                className="border-2"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID / EIN</Label>
              <Input id="taxId" placeholder="XX-XXXXXXX" className="border-2" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessLicense">Business License #</Label>
              <Input id="businessLicense" placeholder="Enter license number" className="border-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="border-foreground border-2">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
