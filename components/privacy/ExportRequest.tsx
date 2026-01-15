'use client'

import { useState } from 'react'
import { Download, FileJson, FileText, Loader2, CheckCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type ExportFormat = 'json' | 'pdf'
type RequestState = 'idle' | 'submitting' | 'submitted'

interface ExportRequestProps {
  onSubmit?: (format: ExportFormat, includeDocuments: boolean) => Promise<void>
  existingRequest?: {
    requestedAt: Date
    estimatedDelivery: Date
    format: ExportFormat
  }
  className?: string
}

export function ExportRequest({ onSubmit, existingRequest, className }: ExportRequestProps) {
  const [format, setFormat] = useState<ExportFormat>('json')
  const [includeDocuments, setIncludeDocuments] = useState(true)
  const [requestState, setRequestState] = useState<RequestState>(
    existingRequest ? 'submitted' : 'idle'
  )

  const handleSubmit = async () => {
    setRequestState('submitting')

    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('export_requested', {
        format,
        includeDocuments,
      })
    }

    try {
      await onSubmit?.(format, includeDocuments)
      setRequestState('submitted')
    } catch {
      setRequestState('idle')
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Your Data
        </CardTitle>
        <CardDescription>Download a copy of all your personal data</CardDescription>
      </CardHeader>
      <CardContent>
        {requestState === 'submitted' || existingRequest ? (
          <div className="space-y-4">
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800 dark:text-green-200">
                Export Request Submitted
              </AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-300">
                <p>
                  Your data export has been requested. You will receive an email with a download
                  link when it is ready.
                </p>
                {existingRequest && (
                  <p className="mt-2 text-sm">
                    Estimated delivery: {formatDate(existingRequest.estimatedDelivery)}
                  </p>
                )}
              </AlertDescription>
            </Alert>

            <div className="bg-muted/50 rounded-lg p-4 text-sm">
              <div className="text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  GDPR requires delivery within 30 days. We typically deliver within 48 hours.
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={() => setRequestState('idle')}>
              Request New Export
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Export Format</Label>
              <RadioGroup
                value={format}
                onValueChange={(value) => setFormat(value as ExportFormat)}
              >
                <div className="flex items-center space-x-3 rounded-lg border p-3">
                  <RadioGroupItem value="json" id="json" />
                  <Label htmlFor="json" className="flex flex-1 cursor-pointer items-center gap-3">
                    <FileJson className="text-muted-foreground h-5 w-5" />
                    <div>
                      <p className="font-medium">JSON (Machine-Readable)</p>
                      <p className="text-muted-foreground text-sm">
                        Portable format you can import to other services
                      </p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border p-3">
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label htmlFor="pdf" className="flex flex-1 cursor-pointer items-center gap-3">
                    <FileText className="text-muted-foreground h-5 w-5" />
                    <div>
                      <p className="font-medium">PDF (Human-Readable)</p>
                      <p className="text-muted-foreground text-sm">
                        Easy to read summary of your data
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-docs"
                checked={includeDocuments}
                onCheckedChange={(checked) => setIncludeDocuments(checked as boolean)}
              />
              <Label htmlFor="include-docs" className="cursor-pointer">
                Include uploaded documents (ID, pay stubs, etc.)
              </Label>
            </div>

            <div className="bg-muted/50 text-muted-foreground rounded-lg p-4 text-sm">
              <p className="text-foreground font-medium">What is included:</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Profile information</li>
                <li>Application history</li>
                <li>Messages and communications</li>
                <li>Activity logs</li>
                {includeDocuments && <li>Uploaded documents</li>}
              </ul>
            </div>

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={requestState === 'submitting'}
            >
              {requestState === 'submitting' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Request...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Request Data Export
                </>
              )}
            </Button>

            <p className="text-muted-foreground text-center text-xs">
              You will receive an email when your export is ready for download
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
