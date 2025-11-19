'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Info,
  Shield
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

export default function CreditVerificationPage() {
  const status = mockTenantProfile.verifications.credit
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
          <Link href="/tenant/profile">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Credit Authorization</h1>
          <p className="text-muted-foreground">
            Authorize a soft credit check for rental applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <Badge className={`${getVerificationStatusColor(status)} border`}>
            {getStatusLabel()}
          </Badge>
        </div>
      </div>

      {/* Soft vs Hard Pull Explanation */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Understanding Credit Checks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Soft Pull */}
            <div className="p-4 border-2 border-green-500 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h3 className="font-bold text-green-800">Soft Pull (What We Do)</h3>
              </div>
              <ul className="space-y-1 text-sm text-green-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1">-</span>
                  Does NOT affect your credit score
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">-</span>
                  Not visible to other lenders
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">-</span>
                  One authorization for multiple applications
                </li>
              </ul>
            </div>

            {/* Hard Pull */}
            <div className="p-4 border-2 border-red-500 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h3 className="font-bold text-red-800">Hard Pull (Traditional)</h3>
              </div>
              <ul className="space-y-1 text-sm text-red-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1">-</span>
                  Can lower your credit score
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">-</span>
                  Visible to other lenders
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">-</span>
                  Required for each application
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {status === 'not_started' && (
        <>
          {/* What We Check */}
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle>What We Check</CardTitle>
              <CardDescription>
                Information included in the credit report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  Credit score range (not exact number)
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  Payment history
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  Outstanding debts
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  Bankruptcies or collections
                </li>
              </ul>
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
                  I authorize ApartmentDibs to perform a soft credit inquiry on my behalf.
                  I understand this will not affect my credit score and the results will be
                  shared with landlords I apply to through this platform.
                </Label>
              </div>

              <Separator />

              <Button
                disabled={!authorized}
                className="w-full border-2 border-foreground"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Authorize Credit Check
              </Button>
            </CardContent>
          </Card>

          {/* Privacy Note */}
          <Card className="border-2 border-border bg-muted/50">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Your privacy matters</p>
                  <p className="mt-1">
                    Your credit information is encrypted and only shared with landlords
                    when you submit an application. You can revoke access at any time.
                  </p>
                </div>
              </div>
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
                <p className="font-medium text-yellow-800">Processing Credit Check</p>
                <p className="text-sm text-yellow-700">
                  Your credit check is being processed. This usually completes within a few minutes.
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
                <p className="font-medium text-green-800">Credit Check Completed</p>
                <p className="text-sm text-green-700">
                  Your credit report is on file and ready to share with landlords.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
