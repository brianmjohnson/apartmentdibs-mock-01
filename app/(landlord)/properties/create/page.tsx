'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Building } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { propertyTypeOptions } from '@/lib/mock-data/landlord'

export default function CreatePropertyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Redirect to properties list
    router.push('/properties')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/properties">
          <Button variant="ghost" size="icon" className="border-2 border-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Property</h1>
          <p className="text-muted-foreground">
            Enter details about your rental property
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="border-2 border-foreground max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Property Details
          </CardTitle>
          <CardDescription>
            Provide basic information about your property
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Property Address *</Label>
              <Input
                id="address"
                placeholder="123 Main St, Brooklyn, NY 11201"
                required
                className="border-2"
              />
            </div>

            {/* Property Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Property Type *</Label>
              <Select required>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Number of Units */}
            <div className="space-y-2">
              <Label htmlFor="units">Number of Units *</Label>
              <Input
                id="units"
                type="number"
                min="1"
                placeholder="1"
                required
                className="border-2"
              />
              <p className="text-xs text-muted-foreground">
                Total number of rentable units in this property
              </p>
            </div>

            {/* Year Built */}
            <div className="space-y-2">
              <Label htmlFor="yearBuilt">Year Built</Label>
              <Input
                id="yearBuilt"
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                placeholder={new Date().getFullYear().toString()}
                className="border-2"
              />
            </div>

            {/* Property Manager */}
            <div className="space-y-3">
              <Label>Property Manager *</Label>
              <RadioGroup defaultValue="self" className="space-y-2">
                <div className="flex items-center space-x-3 p-3 border-2 border-border rounded-md">
                  <RadioGroupItem value="self" id="self" />
                  <div className="flex-1">
                    <Label htmlFor="self" className="font-medium cursor-pointer">
                      Self-managed
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      You will manage this property directly
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border-2 border-border rounded-md">
                  <RadioGroupItem value="agent" id="agent" />
                  <div className="flex-1">
                    <Label htmlFor="agent" className="font-medium cursor-pointer">
                      Agent-managed
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      An agent will handle tenant screening and management
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t-2 border-border">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="border-2 border-foreground"
              >
                {isSubmitting ? 'Adding Property...' : 'Add Property'}
              </Button>
              <Link href="/properties">
                <Button type="button" variant="outline" className="border-2">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Help Text */}
      <Card className="border-2 border-border max-w-2xl">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> After adding your property, you&apos;ll be able to add individual units with their specific details like bedrooms, bathrooms, and rent amounts.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
