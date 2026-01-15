'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface DemoRequestFormProps {
  type: 'landlord' | 'agent'
  onSubmit?: (data: DemoFormData) => void
}

export interface DemoFormData {
  name: string
  email: string
  phone: string
  company: string
  role: string
  teamSize?: string
  unitCount?: string
  currentTools: string[]
  painPoint: string
}

const roleOptions = [
  { value: 'property-manager', label: 'Property Manager' },
  { value: 'leasing-agent', label: 'Leasing Agent' },
  { value: 'brokerage-owner', label: 'Brokerage Owner' },
  { value: 'institutional-landlord', label: 'Institutional Landlord' },
  { value: 'other', label: 'Other' },
]

const teamSizeOptions = [
  { value: '1-4', label: '1-4 agents' },
  { value: '5-19', label: '5-19 agents' },
  { value: '20-49', label: '20-49 agents' },
  { value: '50+', label: '50+ agents' },
]

const unitCountOptions = [
  { value: '1-9', label: '1-9 units' },
  { value: '10-49', label: '10-49 units' },
  { value: '50-99', label: '50-99 units' },
  { value: '100+', label: '100+ units' },
]

const toolOptions = [
  { id: 'rentspree', label: 'RentSpree' },
  { id: 'appfolio', label: 'AppFolio' },
  { id: 'buildium', label: 'Buildium' },
  { id: 'zillow', label: 'Zillow' },
  { id: 'excel', label: 'Excel/Spreadsheets' },
  { id: 'other', label: 'Other' },
]

export function DemoRequestForm({ type, onSubmit }: DemoRequestFormProps) {
  const [formData, setFormData] = useState<DemoFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    teamSize: '',
    unitCount: '',
    currentTools: [],
    painPoint: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleToolChange = (toolId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      currentTools: checked
        ? [...prev.currentTools, toolId]
        : prev.currentTools.filter((t) => t !== toolId),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSubmit?.(formData)
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-primary bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-8 w-8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold">Request Submitted!</h3>
          <p className="text-muted-foreground">
            We&apos;ll be in touch within 24 hours to schedule your personalized demo.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request a Demo</CardTitle>
        <CardDescription>
          Fill out the form below and we&apos;ll schedule a personalized demo for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Business Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                required
                value={formData.company}
                onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Your Role *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {type === 'agent' && (
            <div className="space-y-2">
              <Label htmlFor="teamSize">Team Size</Label>
              <Select
                value={formData.teamSize}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, teamSize: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team size" />
                </SelectTrigger>
                <SelectContent>
                  {teamSizeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {type === 'landlord' && (
            <div className="space-y-2">
              <Label htmlFor="unitCount">Units Managed</Label>
              <Select
                value={formData.unitCount}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, unitCount: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit count" />
                </SelectTrigger>
                <SelectContent>
                  {unitCountOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-3">
            <Label>Current Tools Used</Label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {toolOptions.map((tool) => (
                <div key={tool.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={tool.id}
                    checked={formData.currentTools.includes(tool.id)}
                    onCheckedChange={(checked) => handleToolChange(tool.id, checked as boolean)}
                  />
                  <Label htmlFor={tool.id} className="text-sm font-normal">
                    {tool.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="painPoint">What&apos;s your biggest challenge?</Label>
            <Textarea
              id="painPoint"
              placeholder="Tell us about your current workflow and what you'd like to improve..."
              value={formData.painPoint}
              onChange={(e) => setFormData((prev) => ({ ...prev, painPoint: e.target.value }))}
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Request Demo'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
