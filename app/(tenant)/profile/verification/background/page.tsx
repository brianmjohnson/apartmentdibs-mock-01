'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Shield,
  CheckCircle2,
  Clock,
  AlertCircle,
  Info
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  mockTenantProfile,
  getVerificationStatusColor
} from '@/lib/mock-data/tenant'

export default function BackgroundVerificationPage() {
  const status = mockTenantProfile.verifications.background
  const [authorized, setAuthorized] = useState(false)

  const getStatusIcon = () => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="h-6 w-6 text-green-600" />
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-600" />
      case 'not_started':
        return <AlertCircle className="h-6 w-6 text-gray-400" />
    }
  }

  const getStatusLabel = () => {
    switch (status) {
      case 'verified':
        return 'Completed'
      case 'pending':
        return 'Processing'
      case 'not_started':
        return 'Not Started'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/profile">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Background Check</h1>
          <p className="text-muted-foreground">
            Authorize a background screening for rental applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <Badge className={`${getVerificationStatusColor(status)} border`}>
            {getStatusLabel()}
          </Badge>
        </div>
      </div>

      {/* What We Check */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Scope of Background Check
          </CardTitle>
          <CardDescription>
            What is included in the background screening
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Included */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Included
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>- Criminal history (7 years)</li>
                <li>- Sex offender registry</li>
                <li>- Eviction history</li>
                <li>- Terrorist watchlist</li>
              </ul>
            </div>

            {/* Not Included */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                Not Included
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>- Arrests without conviction</li>
                <li>- Sealed or expunged records</li>
                <li>- Minor traffic violations</li>
                <li>- Medical records</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {status === 'not_started' && (
        <>
          {/* Fair Housing Notice */}
          <Card className="border-2 border-blue-500 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">Fair Housing Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-700">
                Background checks are conducted in compliance with the Fair Housing Act.
                Landlords cannot deny applications solely based on arrest records or certain
                types of criminal history. Each application is evaluated on an individual basis
                considering the nature, severity, and recency of any findings.
              </p>
            </CardContent>
          </Card>

          {/* Authorization */}
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Authorization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="authorize"
                  checked={authorized}
                  onCheckedChange={(checked) => setAuthorized(checked as boolean)}
                />
                <Label htmlFor="authorize" className="text-sm leading-relaxed cursor-pointer">
                  I authorize ApartmentDibs and its designated consumer reporting agency to
                  conduct a background investigation. I understand this report will include
                  criminal records, eviction history, and other relevant public records.
                  I acknowledge that I have been provided with a Summary of Rights under
                  the Fair Credit Reporting Act (FCRA).
                </Label>
              </div>

              <Separator />

              <Button
                disabled={!authorized}
                className="w-full border-2 border-foreground"
              >
                <Shield className="h-4 w-4 mr-2" />
                Authorize Background Check
              </Button>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-2 border-border bg-muted/50">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Processing Time</p>
                  <p className="mt-1">
                    Background checks typically complete within 24-48 hours. You'll receive
                    an email notification when the results are ready.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="text-lg">Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  You have the right to receive a copy of your background report
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  You can dispute any inaccurate information in your report
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  If denied based on the report, you'll be informed of the reason
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  You can add a statement explaining circumstances in your record
                </li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}

      {status === 'pending' && (
        <Card className="border-2 border-yellow-500 bg-yellow-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Background Check in Progress</p>
                <p className="text-sm text-yellow-700">
                  Your background check is being processed. This typically takes 24-48 hours.
                  You'll receive an email when it's complete.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {status === 'verified' && (
        <Card className="border-2 border-green-500 bg-green-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Background Check Completed</p>
                <p className="text-sm text-green-700">
                  Your background check is complete and on file for rental applications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
