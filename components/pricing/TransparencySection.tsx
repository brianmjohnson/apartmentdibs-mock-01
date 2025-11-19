'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HelpCircle, RefreshCcw, Shield, Users } from 'lucide-react'

export function TransparencySection() {
  const benefits = [
    {
      icon: <RefreshCcw className="h-5 w-5" />,
      title: 'Reuse for unlimited applications',
      description:
        'Create once, apply everywhere. Your profile works for every listing during its validity period.',
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: 'Your data stays with you',
      description:
        "No more scattering sensitive documents across landlords' email inboxes. You control who sees what.",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: 'Fair evaluation for all',
      description:
        'Every applicant is measured by the same objective criteria, ensuring fair comparison.',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Why Do Tenants Pay for Screening?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg bg-muted p-4">
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 font-medium">Traditional Model</p>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>Landlord pays for screening</li>
                <li>Landlord chooses the company</li>
                <li>Landlord sets all criteria</li>
                <li>Report exists only for that application</li>
              </ul>
            </div>
            <div>
              <p className="mb-2 font-medium text-primary">ApartmentDibs Model</p>
              <ul className="space-y-1 text-sm">
                <li>Tenant pays once, owns profile</li>
                <li>Tenant controls their data</li>
                <li>Tenant applies to unlimited listings</li>
                <li>Fair metrics for all applicants</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="font-medium">Benefits of Tenant-Owned Profiles</p>
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex gap-3">
              <div className="bg-primary/10 text-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                {benefit.icon}
              </div>
              <div>
                <p className="font-medium">{benefit.title}</p>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
