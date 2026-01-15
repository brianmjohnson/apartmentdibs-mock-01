'use client'

import { useState } from 'react'
import {
  FileText,
  Calendar,
  DollarSign,
  Home,
  PawPrint,
  Plus,
  Loader2,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

interface TenantInfo {
  id: string
  name: string
  email: string
}

interface PropertyInfo {
  address: string
  unit?: string
  city: string
  state: string
  zipCode: string
}

interface LeaseTerms {
  startDate: string
  endDate: string
  monthlyRent: number
  securityDeposit: number
  petDeposit?: number
  hasPets: boolean
}

interface LeaseGeneratorProps {
  tenants: TenantInfo[]
  property: PropertyInfo
  defaultTerms?: Partial<LeaseTerms>
  availableTemplates?: { id: string; name: string; state: string }[]
  onGenerate: (terms: LeaseTerms, templateId: string, customClauses: string[]) => Promise<void>
  className?: string
}

export function LeaseGenerator({
  tenants,
  property,
  defaultTerms,
  availableTemplates = [],
  onGenerate,
  className,
}: LeaseGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [terms, setTerms] = useState<LeaseTerms>({
    startDate: defaultTerms?.startDate || '',
    endDate: defaultTerms?.endDate || '',
    monthlyRent: defaultTerms?.monthlyRent || 0,
    securityDeposit: defaultTerms?.securityDeposit || 0,
    petDeposit: defaultTerms?.petDeposit,
    hasPets: defaultTerms?.hasPets || false,
  })
  const [customClauses, setCustomClauses] = useState<string[]>([])
  const [newClause, setNewClause] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleAddClause = () => {
    if (newClause.trim()) {
      setCustomClauses([...customClauses, newClause.trim()])
      setNewClause('')
    }
  }

  const handleRemoveClause = (index: number) => {
    setCustomClauses(customClauses.filter((_, i) => i !== index))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      // Track analytics
      if (typeof window !== 'undefined' && window.posthog) {
        window.posthog.capture('lease_generated', {
          templateId: selectedTemplate,
          tenantCount: tenants.length,
          state: property.state,
          hasCustomClauses: customClauses.length > 0,
        })
      }

      await onGenerate(terms, selectedTemplate, customClauses)
    } finally {
      setIsGenerating(false)
    }
  }

  const isValid =
    selectedTemplate &&
    terms.startDate &&
    terms.endDate &&
    terms.monthlyRent > 0 &&
    terms.securityDeposit > 0

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generate Lease
        </CardTitle>
        <CardDescription>
          Auto-generate a state-compliant lease with pre-filled tenant and property information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pre-filled Information Summary */}
        <div className="bg-muted space-y-3 rounded-lg p-4">
          <h3 className="text-sm font-medium">Pre-Filled Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Tenants</p>
              <div className="mt-1 space-y-1">
                {tenants.map((tenant) => (
                  <p key={tenant.id} className="font-medium">
                    {tenant.name}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">Property</p>
              <p className="mt-1 font-medium">
                {property.address}
                {property.unit && `, Unit ${property.unit}`}
              </p>
              <p className="text-muted-foreground">
                {property.city}, {property.state} {property.zipCode}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Template Selection */}
        <div className="space-y-2">
          <Label htmlFor="template" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Lease Template
          </Label>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger id="template">
              <SelectValue placeholder="Select state-compliant template" />
            </SelectTrigger>
            <SelectContent>
              {availableTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name} ({template.state})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-xs">
            Templates include required state disclosures and addendums
          </p>
        </div>

        {/* Lease Terms */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="h-4 w-4" />
            Lease Terms
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={terms.startDate}
                onChange={(e) => setTerms({ ...terms, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={terms.endDate}
                onChange={(e) => setTerms({ ...terms, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rent" className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Monthly Rent
              </Label>
              <Input
                id="rent"
                type="number"
                value={terms.monthlyRent || ''}
                onChange={(e) =>
                  setTerms({ ...terms, monthlyRent: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deposit">Security Deposit</Label>
              <Input
                id="deposit"
                type="number"
                value={terms.securityDeposit || ''}
                onChange={(e) =>
                  setTerms({
                    ...terms,
                    securityDeposit: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          {/* Pet Section */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <PawPrint className="h-4 w-4" />
              Pet Policy
            </Label>
            <div className="flex items-center gap-4">
              <Select
                value={terms.hasPets ? 'yes' : 'no'}
                onValueChange={(v) => setTerms({ ...terms, hasPets: v === 'yes' })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No Pets</SelectItem>
                  <SelectItem value="yes">Pets Allowed</SelectItem>
                </SelectContent>
              </Select>
              {terms.hasPets && (
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Pet deposit"
                    value={terms.petDeposit || ''}
                    onChange={(e) =>
                      setTerms({
                        ...terms,
                        petDeposit: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Custom Clauses */}
        <div className="space-y-3">
          <Label>Custom Clauses (Optional)</Label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Tenant responsible for snow removal"
              value={newClause}
              onChange={(e) => setNewClause(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddClause()
                }
              }}
            />
            <Button variant="outline" onClick={handleAddClause}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {customClauses.length > 0 && (
            <div className="space-y-2">
              {customClauses.map((clause, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-2"
                >
                  <span className="text-sm">{clause}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveClause(index)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Generate Button */}
        <Button className="w-full" onClick={handleGenerate} disabled={!isValid || isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Lease...
            </>
          ) : (
            <>
              Generate Lease
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        <p className="text-muted-foreground text-center text-xs">
          Lease will be generated within 30 seconds and sent for e-signature
        </p>
      </CardContent>
    </Card>
  )
}
