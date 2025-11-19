'use client'

import { useState } from 'react'
import { QrCode, Download, Share2, Copy, Check, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ProfileShareQRProps {
  profileId: string
  tenantName: string
  verificationUrl: string
  onDownloadPDF?: () => void
  onDownloadJSON?: () => void
  className?: string
}

export function ProfileShareQR({
  profileId,
  tenantName,
  verificationUrl,
  onDownloadPDF,
  onDownloadJSON,
  className,
}: ProfileShareQRProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  // Generate a simple QR code placeholder (in production, use a QR library)
  const qrCodePlaceholder = (
    <div className="w-48 h-48 bg-white p-4 flex items-center justify-center border-2 border-foreground">
      <div className="text-center">
        <QrCode className="h-24 w-24 mx-auto text-foreground" />
        <p className="text-xs text-muted-foreground mt-2">QR Code</p>
      </div>
    </div>
  )

  return (
    <Card className={`border-2 border-foreground ${className || ''}`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share Your Profile
        </CardTitle>
        <CardDescription>
          Export your verified profile to apply outside ApartmentDibs
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* QR Code Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full border-2 border-foreground"
              >
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
            </DialogTrigger>
            <DialogContent className="border-2 border-foreground">
              <DialogHeader>
                <DialogTitle>Profile Verification QR Code</DialogTitle>
                <DialogDescription>
                  Show this to landlords for instant verification
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center py-6">
                {qrCodePlaceholder}
                <p className="text-sm font-medium mt-4">{tenantName}</p>
                <p className="text-xs text-muted-foreground">Profile ID: {profileId}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-2 border-foreground"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
                <Button className="flex-1 border-2 border-foreground">
                  <Download className="h-4 w-4 mr-2" />
                  Save QR
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Download PDF */}
          <Button
            variant="outline"
            className="w-full border-2 border-foreground"
            onClick={onDownloadPDF}
          >
            <FileText className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>

        {/* Export Options Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" className="w-full text-sm">
              View all export options
            </Button>
          </DialogTrigger>
          <DialogContent className="border-2 border-foreground max-w-md">
            <DialogHeader>
              <DialogTitle>Export Profile</DialogTitle>
              <DialogDescription>
                Choose your preferred export format
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="pdf" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pdf">PDF</TabsTrigger>
                <TabsTrigger value="qr">QR Code</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
              </TabsList>

              <TabsContent value="pdf" className="space-y-3 mt-4">
                <p className="text-sm text-muted-foreground">
                  Download a PDF summary of your verified profile for manual sharing with landlords.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>&#x2713; Includes all verified data</li>
                  <li>&#x2713; Professional formatting</li>
                  <li>&#x2713; Meets PTSR standards</li>
                </ul>
                <Button
                  className="w-full border-2 border-foreground"
                  onClick={onDownloadPDF}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download PDF Summary
                </Button>
              </TabsContent>

              <TabsContent value="qr" className="space-y-3 mt-4">
                <p className="text-sm text-muted-foreground">
                  Generate a QR code that links to your verification page for instant verification.
                </p>
                <div className="flex justify-center py-4">
                  {qrCodePlaceholder}
                </div>
                <Button className="w-full border-2 border-foreground">
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
              </TabsContent>

              <TabsContent value="json" className="space-y-3 mt-4">
                <p className="text-sm text-muted-foreground">
                  Export your profile data in JSON format for integration with other platforms.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>&#x2713; Machine-readable format</li>
                  <li>&#x2713; API integrations</li>
                  <li>&#x2713; Portable data</li>
                </ul>
                <Button
                  className="w-full border-2 border-foreground"
                  onClick={onDownloadJSON}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
