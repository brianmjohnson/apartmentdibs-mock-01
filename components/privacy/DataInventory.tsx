'use client'

import { Database, Clock, Users, Shield, ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useState } from 'react'

interface DataCategory {
  id: string
  name: string
  description: string
  dataTypes: string[]
  retentionPeriod: string
  sharedWith: string[]
  purpose: string
}

const dataCategories: DataCategory[] = [
  {
    id: 'identity',
    name: 'Identity Information',
    description: 'Information used to verify your identity',
    dataTypes: ['Full name', 'Date of birth', 'Government ID', 'Selfie photo'],
    retentionPeriod: '90 days after account deletion',
    sharedWith: ['Identity verification provider'],
    purpose: 'To verify you are who you say you are and prevent fraud',
  },
  {
    id: 'contact',
    name: 'Contact Information',
    description: 'How we reach you',
    dataTypes: ['Email address', 'Phone number', 'Mailing address'],
    retentionPeriod: 'Until account deletion',
    sharedWith: ['Landlords you apply to', 'Email service provider'],
    purpose: 'To communicate with you and facilitate applications',
  },
  {
    id: 'financial',
    name: 'Financial Information',
    description: 'Information about your finances',
    dataTypes: ['Income', 'Employment history', 'Bank statements', 'Pay stubs'],
    retentionPeriod: '3 years (FCRA requirement)',
    sharedWith: ['Landlords you apply to', 'Credit bureaus', 'Background check providers'],
    purpose: 'To verify your ability to pay rent',
  },
  {
    id: 'screening',
    name: 'Screening Results',
    description: 'Results from background and credit checks',
    dataTypes: ['Credit score', 'Credit history', 'Criminal records', 'Eviction history'],
    retentionPeriod: '3 years (FCRA requirement)',
    sharedWith: ['Landlords you apply to'],
    purpose: 'To help landlords make informed decisions',
  },
  {
    id: 'activity',
    name: 'Activity Data',
    description: 'How you use the platform',
    dataTypes: ['Applications submitted', 'Messages sent', 'Listings viewed', 'Search history'],
    retentionPeriod: '2 years',
    sharedWith: ['Analytics providers (anonymized)'],
    purpose: 'To improve our services and your experience',
  },
]

interface DataInventoryProps {
  className?: string
}

export function DataInventory({ className }: DataInventoryProps) {
  const [openCategories, setOpenCategories] = useState<string[]>([])

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Your Data Inventory
        </CardTitle>
        <CardDescription>
          A complete overview of the personal data we store about you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {dataCategories.map((category) => {
          const isOpen = openCategories.includes(category.id)

          return (
            <Collapsible key={category.id} open={isOpen}>
              <CollapsibleTrigger
                className="flex w-full items-center justify-between rounded-lg border p-4 text-left hover:bg-muted/50"
                onClick={() => toggleCategory(category.id)}
              >
                <div>
                  <p className="font-medium">{category.name}</p>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                {isOpen ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <div className="mt-3 space-y-4 rounded-lg bg-muted/50 p-4">
                  <div>
                    <p className="mb-2 text-sm font-medium">Data Types:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.dataTypes.map((type) => (
                        <Badge key={type} variant="secondary">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Retention Period</p>
                      <p className="text-sm text-muted-foreground">{category.retentionPeriod}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Users className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Shared With</p>
                      <p className="text-sm text-muted-foreground">
                        {category.sharedWith.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Shield className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Purpose</p>
                      <p className="text-sm text-muted-foreground">{category.purpose}</p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        })}

        <div className="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Under GDPR and CCPA, you have the right to access, export, and delete your personal data.
            Use the options below to exercise these rights.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
