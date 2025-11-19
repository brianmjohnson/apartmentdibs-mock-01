'use client'

import { useState } from 'react'
import { Mail, MessageSquare, Bell, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface CommunicationContent {
  tenant: string
  agent: string
  landlord: string
}

interface CommunicationData {
  sms: CommunicationContent
  email: CommunicationContent
  inApp: CommunicationContent
}

// Mock communication data for different scenarios
const mockCommunications: Record<string, CommunicationData> = {
  applicationSubmitted: {
    sms: {
      tenant:
        "Your application for 123 Main St has been submitted! We'll update you within 48 hours. Track status: apartmentdibs.com/app",
      agent:
        'New application received for 123 Main St from John Doe. Background check in progress. Review: apartmentdibs.com/agent',
      landlord:
        'New application alert: John Doe applied for 123 Main St. Pre-screening complete. View details: apartmentdibs.com/owner',
    },
    email: {
      tenant: `Subject: Application Submitted - 123 Main St

Dear John,

Thank you for submitting your application for the property at 123 Main St.

Your application is now being reviewed. Here's what happens next:
- Background check (1-2 business days)
- Credit verification (1 business day)
- Landlord decision (2-3 business days)

You can track your application status anytime at your dashboard.

Best regards,
ApartmentDibs Team`,
      agent: `Subject: New Application - 123 Main St - John Doe

A new application has been submitted:

Property: 123 Main St, Apt 4B
Applicant: John Doe
Income: $85,000/year (3.2x rent)
Credit Score: 720+
Employment: Verified

Pre-screening Status: PASSED
Background Check: In Progress

Review the full application in your agent dashboard.

- ApartmentDibs`,
      landlord: `Subject: Application Received - 123 Main St

Property Owner,

You have received a new rental application:

Property: 123 Main St
Unit: Apartment 4B
Monthly Rent: $2,200

Applicant Summary:
- Income: $85,000/year (verified)
- Credit Score: 720+
- Employment: Software Engineer at Tech Corp (2 years)

Fair Housing Compliance: All criteria met

View the complete application and make your decision in your owner portal.

ApartmentDibs Team`,
    },
    inApp: {
      tenant:
        'Your application for 123 Main St is being processed. Background check in progress. Expected completion: 48 hours.',
      agent:
        'New application: John Doe for 123 Main St. Pre-screening passed. Background check pending. Click to review.',
      landlord:
        'Application received for 123 Main St from pre-qualified tenant. Income: 3.2x rent. Click to review and decide.',
    },
  },
  applicationApproved: {
    sms: {
      tenant:
        'Congratulations! Your application for 123 Main St is APPROVED! Next: Sign lease within 48 hours. Check email for details.',
      agent:
        'Application APPROVED: John Doe for 123 Main St. Lease signing scheduled. Commission pending: $2,200.',
      landlord:
        'Application APPROVED for 123 Main St. Tenant: John Doe. Lease generated. Move-in: Dec 1. View: apartmentdibs.com/owner',
    },
    email: {
      tenant: `Subject: Congratulations! Application Approved - 123 Main St

Dear John,

Great news! Your application for 123 Main St has been APPROVED!

Next Steps:
1. Review and sign the lease (available in your dashboard)
2. Pay security deposit ($2,200) and first month's rent
3. Schedule move-in inspection

Deadline: Please complete these steps within 48 hours to secure your new home.

Welcome to your new apartment!

ApartmentDibs Team`,
      agent: `Subject: Application Approved - Commission Pending

Congratulations!

Application Status: APPROVED
Property: 123 Main St, Apt 4B
Tenant: John Doe
Move-in Date: December 1, 2024

Commission Details:
- Amount: $2,200 (one month's rent)
- Status: Pending lease signature
- Expected Payment: Upon lease execution

Lease signing link has been sent to the tenant. Track progress in your dashboard.

Great work!
ApartmentDibs`,
      landlord: `Subject: Application Approved - 123 Main St

Your Property: 123 Main St is now leased!

Tenant Details:
- Name: John Doe
- Move-in Date: December 1, 2024
- Lease Term: 12 months
- Monthly Rent: $2,200

Expected Income:
- Security Deposit: $2,200 (pending)
- First Month: $2,200 (pending)
- Total Annual: $26,400

The lease has been sent to the tenant for signature. You'll be notified when all documents are completed.

Thank you for using ApartmentDibs!`,
    },
    inApp: {
      tenant:
        'Application APPROVED! Sign your lease now to secure 123 Main St. Deadline: 48 hours. Click to proceed.',
      agent:
        'Approved! John Doe for 123 Main St. Lease pending signature. Your commission: $2,200.',
      landlord:
        'Tenant approved for 123 Main St. Move-in: Dec 1. Expected annual rent: $26,400. Lease pending signature.',
    },
  },
}

interface CommunicationModalProps {
  trigger?: React.ReactNode
  scenario?: 'applicationSubmitted' | 'applicationApproved'
  defaultOpen?: boolean
}

export function CommunicationModal({
  trigger,
  scenario = 'applicationSubmitted',
  defaultOpen = false,
}: CommunicationModalProps) {
  const [open, setOpen] = useState(defaultOpen)
  const data = mockCommunications[scenario]

  const communicationTypes = [
    { id: 'sms', label: 'SMS', icon: MessageSquare },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'inApp', label: 'In-App', icon: Bell },
  ] as const

  const personas = [
    { id: 'tenant', label: 'Tenant', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    { id: 'agent', label: 'Agent', color: 'bg-green-100 text-green-800 border-green-300' },
    { id: 'landlord', label: 'Landlord', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  ] as const

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="border-foreground max-h-[90vh] max-w-5xl border-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Communication Preview</DialogTitle>
          <DialogDescription>
            View how communications are sent to each persona via different channels.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="sms" className="w-full">
          <TabsList className="border-foreground grid w-full grid-cols-3 border-2">
            {communicationTypes.map((type) => (
              <TabsTrigger
                key={type.id}
                value={type.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
              >
                <type.icon className="h-4 w-4" />
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {communicationTypes.map((type) => (
            <TabsContent key={type.id} value={type.id} className="mt-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {personas.map((persona) => (
                  <Card key={persona.id} className="border-foreground border-2">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Badge variant="outline" className={`${persona.color} border`}>
                          {persona.label}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[200px] w-full">
                        <div className="text-sm whitespace-pre-wrap">
                          {data[type.id][persona.id]}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-4 flex justify-end">
          <Button onClick={() => setOpen(false)} className="border-foreground border-2">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Export a function to trigger the modal with a Sonner toast
export function showCommunicationToast(
  toast: (message: string, options?: object) => void,
  scenario: 'applicationSubmitted' | 'applicationApproved' = 'applicationSubmitted'
) {
  toast('Communication sent successfully!', {
    description: 'Click to view how each persona receives this notification.',
    action: {
      label: 'View Communications',
      onClick: () => {
        // This would typically update state in a parent component
        // For now, we'll use a custom event
        window.dispatchEvent(new CustomEvent('openCommunicationModal', { detail: { scenario } }))
      },
    },
  })
}
