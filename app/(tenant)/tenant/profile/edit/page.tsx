'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  mockTenantProfile,
  neighborhoodOptions,
  mustHaveOptions,
  niceToHaveOptions,
} from '@/lib/mock-data/tenant'

export default function EditProfilePage() {
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState({
    firstName: mockTenantProfile.firstName,
    lastName: mockTenantProfile.lastName,
    email: mockTenantProfile.email,
    phone: mockTenantProfile.phone,
    street: mockTenantProfile.address.street,
    city: mockTenantProfile.address.city,
    state: mockTenantProfile.address.state,
    zip: mockTenantProfile.address.zip,
    budgetRange: [mockTenantProfile.preferences.budgetMin, mockTenantProfile.preferences.budgetMax],
    neighborhoods: mockTenantProfile.preferences.neighborhoods,
    moveInDate: mockTenantProfile.preferences.moveInDate,
    mustHaves: mockTenantProfile.preferences.mustHaves,
    niceToHaves: mockTenantProfile.preferences.niceToHaves,
    employmentStatus: mockTenantProfile.employment.status,
    hasPets: mockTenantProfile.pets.hasPets,
    petType: mockTenantProfile.pets.type || '',
    petCount: mockTenantProfile.pets.count || 0,
    occupants: mockTenantProfile.occupants,
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: 'mustHaves' | 'niceToHaves' | 'neighborhoods', item: string) => {
    setFormData((prev) => {
      const current = prev[field]
      const updated = current.includes(item)
        ? current.filter((i) => i !== item)
        : [...current, item]
      return { ...prev, [field]: updated }
    })
  }

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving profile:', formData)
    router.push('/profile')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/tenant/profile">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild className="border-foreground border-2">
            <Link href="/tenant/profile">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Link>
          </Button>
          <Button onClick={handleSave} className="border-foreground border-2">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Personal Information */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your basic contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="border-border focus:border-foreground border-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="border-border focus:border-foreground border-2"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="border-border focus:border-foreground border-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="border-border focus:border-foreground border-2"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label>Current Address</Label>
            <div className="space-y-2">
              <Label htmlFor="street" className="text-muted-foreground text-sm">
                Street
              </Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                className="border-border focus:border-foreground border-2"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-muted-foreground text-sm">
                  City
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="border-border focus:border-foreground border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-muted-foreground text-sm">
                  State
                </Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="border-border focus:border-foreground border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip" className="text-muted-foreground text-sm">
                  ZIP Code
                </Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => handleInputChange('zip', e.target.value)}
                  className="border-border focus:border-foreground border-2"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rental Preferences */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle>Rental Preferences</CardTitle>
          <CardDescription>Help us find the perfect apartment for you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Budget Range */}
          <div className="space-y-4">
            <Label>Target Budget</Label>
            <div className="px-2">
              <Slider
                value={formData.budgetRange}
                onValueChange={(value) => handleInputChange('budgetRange', value)}
                min={500}
                max={10000}
                step={100}
                className="w-full"
              />
            </div>
            <div className="text-muted-foreground flex justify-between text-sm">
              <span>${formData.budgetRange[0].toLocaleString()}</span>
              <span>${formData.budgetRange[1].toLocaleString()}</span>
            </div>
          </div>

          <Separator />

          {/* Preferred Neighborhoods */}
          <div className="space-y-3">
            <Label>Preferred Neighborhoods</Label>
            <div className="grid gap-2 md:grid-cols-3">
              {neighborhoodOptions.map((neighborhood) => (
                <div key={neighborhood} className="flex items-center space-x-2">
                  <Checkbox
                    id={`neighborhood-${neighborhood}`}
                    checked={formData.neighborhoods.includes(neighborhood)}
                    onCheckedChange={() => toggleArrayItem('neighborhoods', neighborhood)}
                  />
                  <Label
                    htmlFor={`neighborhood-${neighborhood}`}
                    className="cursor-pointer text-sm font-normal"
                  >
                    {neighborhood}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Move-in Date */}
          <div className="space-y-2">
            <Label htmlFor="moveInDate">Move-in Timeline</Label>
            <Input
              id="moveInDate"
              type="date"
              value={formData.moveInDate}
              onChange={(e) => handleInputChange('moveInDate', e.target.value)}
              className="border-border focus:border-foreground max-w-xs border-2"
            />
          </div>

          <Separator />

          {/* Must-Haves */}
          <div className="space-y-3">
            <Label>Must-Haves</Label>
            <div className="grid gap-2 md:grid-cols-4">
              {mustHaveOptions.map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`must-${item}`}
                    checked={formData.mustHaves.includes(item)}
                    onCheckedChange={() => toggleArrayItem('mustHaves', item)}
                  />
                  <Label htmlFor={`must-${item}`} className="cursor-pointer text-sm font-normal">
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Nice-to-Haves */}
          <div className="space-y-3">
            <Label>Nice-to-Haves</Label>
            <div className="grid gap-2 md:grid-cols-3">
              {niceToHaveOptions.map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`nice-${item}`}
                    checked={formData.niceToHaves.includes(item)}
                    onCheckedChange={() => toggleArrayItem('niceToHaves', item)}
                  />
                  <Label htmlFor={`nice-${item}`} className="cursor-pointer text-sm font-normal">
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>Help landlords understand your situation better</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Employment Status */}
          <div className="space-y-2">
            <Label htmlFor="employmentStatus">Employment Status</Label>
            <Select
              value={formData.employmentStatus}
              onValueChange={(value) => handleInputChange('employmentStatus', value)}
            >
              <SelectTrigger className="border-border focus:border-foreground max-w-xs border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employed">Employed</SelectItem>
                <SelectItem value="self_employed">Self-Employed</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Pets */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasPets"
                checked={formData.hasPets}
                onCheckedChange={(checked) => handleInputChange('hasPets', checked)}
              />
              <Label htmlFor="hasPets" className="cursor-pointer">
                I have pets
              </Label>
            </div>

            {formData.hasPets && (
              <div className="grid gap-4 pl-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="petType">Pet Type</Label>
                  <Input
                    id="petType"
                    value={formData.petType}
                    onChange={(e) => handleInputChange('petType', e.target.value)}
                    placeholder="e.g., Dog, Cat"
                    className="border-border focus:border-foreground border-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="petCount">Number of Pets</Label>
                  <Input
                    id="petCount"
                    type="number"
                    min="1"
                    value={formData.petCount}
                    onChange={(e) => handleInputChange('petCount', parseInt(e.target.value) || 0)}
                    className="border-border focus:border-foreground border-2"
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Number of Occupants */}
          <div className="space-y-2">
            <Label htmlFor="occupants">Number of Occupants</Label>
            <Input
              id="occupants"
              type="number"
              min="1"
              max="10"
              value={formData.occupants}
              onChange={(e) => handleInputChange('occupants', parseInt(e.target.value) || 1)}
              className="border-border focus:border-foreground max-w-xs border-2"
            />
            <p className="text-muted-foreground text-sm">
              Include yourself and anyone who will be living in the apartment
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save/Cancel Buttons (Bottom) */}
      <div className="flex justify-end gap-2 pb-8">
        <Button variant="outline" asChild className="border-foreground border-2">
          <Link href="/tenant/profile">Cancel</Link>
        </Button>
        <Button onClick={handleSave} className="border-foreground border-2">
          Save Changes
        </Button>
      </div>
    </div>
  )
}
