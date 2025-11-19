'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Building,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Info,
  ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  mockTenantProfile,
  getVerificationStatusColor
} from '@/lib/mock-data/tenant'

export default function IncomeVerificationPage() {
  const status = mockTenantProfile.verifications.income
  const [selectedMethod, setSelectedMethod] = useState<'plaid' | 'manual'>('plaid')

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
        return 'Verified'
      case 'pending':
        return 'Pending Review'
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
          <h1 className="text-3xl font-bold tracking-tight">Income Verification</h1>
          <p className="text-muted-foreground">
            Verify your income to show landlords you qualify
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <Badge className={`${getVerificationStatusColor(status)} border`}>
            {getStatusLabel()}
          </Badge>
        </div>
      </div>

      {status === 'not_started' && (
        <>
          {/* Verification Methods */}
          <Tabs defaultValue="plaid" onValueChange={(v) => setSelectedMethod(v as 'plaid' | 'manual')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="plaid">Bank Connection (Preferred)</TabsTrigger>
              <TabsTrigger value="manual">Manual Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="plaid" className="space-y-6 mt-6">
              {/* Plaid Connection */}
              <Card className="border-2 border-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Connect Your Bank Account
                  </CardTitle>
                  <CardDescription>
                    Securely connect your bank to instantly verify your income
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Instant Verification</p>
                        <p className="text-sm text-muted-foreground">
                          Get verified in minutes, not days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Bank-Level Security</p>
                        <p className="text-sm text-muted-foreground">
                          Powered by Plaid with 256-bit encryption
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Read-Only Access</p>
                        <p className="text-sm text-muted-foreground">
                          We can only view your account, never move funds
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <Button className="w-full border-2 border-foreground">
                    <Building className="h-4 w-4 mr-2" />
                    Connect with Plaid
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Security Info */}
              <Card className="border-2 border-border bg-muted/50">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">How we use your data</p>
                      <p className="mt-1">
                        We only access the last 3 months of transaction data to verify your income.
                        Your login credentials are never stored on our servers.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manual" className="space-y-6 mt-6">
              {/* Manual Upload */}
              <Card className="border-2 border-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Upload Pay Stubs
                  </CardTitle>
                  <CardDescription>
                    Manually upload your income documentation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Required documents:</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                        Last 3 months of pay stubs
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                        Employment verification letter (optional)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                        Tax returns (if self-employed)
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <Button variant="outline" asChild className="w-full border-2 border-foreground">
                    <Link href="/profile/documents">
                      <FileText className="h-4 w-4 mr-2" />
                      Go to Documents
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Note about manual */}
              <Card className="border-2 border-border bg-muted/50">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800">Manual verification takes longer</p>
                      <p className="mt-1 text-muted-foreground">
                        Manual document review typically takes 2-3 business days.
                        For faster results, we recommend connecting your bank account.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {status === 'pending' && (
        <Card className="border-2 border-yellow-500 bg-yellow-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Verification in Progress</p>
                <p className="text-sm text-yellow-700">
                  We're reviewing your income documentation. This usually takes 1-2 business days.
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
                <p className="font-medium text-green-800">Income Verified</p>
                <p className="text-sm text-green-700">
                  Your income has been successfully verified.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
