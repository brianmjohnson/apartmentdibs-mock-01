'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Camera, CheckCircle2, Clock, AlertCircle, Info } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { mockTenantProfile, getVerificationStatusColor } from '@/lib/mock-data/tenant'

export default function IdentityVerificationPage() {
  const status = mockTenantProfile.verifications.identity
  const [frontUploaded, setFrontUploaded] = useState(status === 'verified' || status === 'pending')
  const [backUploaded, setBackUploaded] = useState(status === 'verified' || status === 'pending')
  const [selfieUploaded, setSelfieUploaded] = useState(
    status === 'verified' || status === 'pending'
  )

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

  const canSubmit = frontUploaded && backUploaded && selfieUploaded && status === 'not_started'

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
          <h1 className="text-3xl font-bold tracking-tight">Identity Verification</h1>
          <p className="text-muted-foreground">Verify your identity with a government-issued ID</p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <Badge className={`${getVerificationStatusColor(status)} border`}>
            {getStatusLabel()}
          </Badge>
        </div>
      </div>

      {/* Instructions */}
      <Card className="border-foreground bg-muted/50 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="space-y-2 text-sm">
            <li className="flex gap-3">
              <span className="font-bold">1.</span>
              <span>Take a clear photo of the front of your government-issued ID</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">2.</span>
              <span>Take a clear photo of the back of your ID</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">3.</span>
              <span>Take a selfie for identity matching</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">4.</span>
              <span>Submit for review (usually completed within 24 hours)</span>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Accepted IDs */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle>Accepted ID Types</CardTitle>
          <CardDescription>We accept the following government-issued IDs</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm md:grid-cols-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Driver's License
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              State ID Card
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Passport
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Passport Card
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Upload Areas */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Front of ID */}
        <Card className="border-foreground border-2">
          <CardHeader>
            <CardTitle className="text-lg">Front of ID</CardTitle>
            <CardDescription>Photo side of your ID</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`hover:border-primary hover:bg-primary/5 cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${frontUploaded ? 'border-green-500 bg-green-50' : 'border-border'} `}
              onClick={() => {
                if (status === 'not_started') setFrontUploaded(true)
              }}
            >
              {frontUploaded ? (
                <div className="space-y-2">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-green-600" />
                  <p className="text-sm font-medium text-green-600">Uploaded</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="text-muted-foreground mx-auto h-8 w-8" />
                  <p className="text-muted-foreground text-sm">Click to upload</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Back of ID */}
        <Card className="border-foreground border-2">
          <CardHeader>
            <CardTitle className="text-lg">Back of ID</CardTitle>
            <CardDescription>Back side of your ID</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`hover:border-primary hover:bg-primary/5 cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${backUploaded ? 'border-green-500 bg-green-50' : 'border-border'} `}
              onClick={() => {
                if (status === 'not_started') setBackUploaded(true)
              }}
            >
              {backUploaded ? (
                <div className="space-y-2">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-green-600" />
                  <p className="text-sm font-medium text-green-600">Uploaded</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="text-muted-foreground mx-auto h-8 w-8" />
                  <p className="text-muted-foreground text-sm">Click to upload</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Selfie */}
        <Card className="border-foreground border-2">
          <CardHeader>
            <CardTitle className="text-lg">Selfie</CardTitle>
            <CardDescription>For identity matching</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`hover:border-primary hover:bg-primary/5 cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${selfieUploaded ? 'border-green-500 bg-green-50' : 'border-border'} `}
              onClick={() => {
                if (status === 'not_started') setSelfieUploaded(true)
              }}
            >
              {selfieUploaded ? (
                <div className="space-y-2">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-green-600" />
                  <p className="text-sm font-medium text-green-600">Captured</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Camera className="text-muted-foreground mx-auto h-8 w-8" />
                  <p className="text-muted-foreground text-sm">Click to capture</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Button */}
      {status === 'not_started' && (
        <div className="flex justify-end">
          <Button disabled={!canSubmit} className="border-foreground border-2">
            Submit for Verification
          </Button>
        </div>
      )}

      {status === 'pending' && (
        <Card className="border-2 border-yellow-500 bg-yellow-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Verification in Progress</p>
                <p className="text-sm text-yellow-700">
                  We're reviewing your documents. This usually takes less than 24 hours.
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
                <p className="font-medium text-green-800">Identity Verified</p>
                <p className="text-sm text-green-700">
                  Your identity has been successfully verified.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
