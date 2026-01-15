'use client'

import { FileText, Send, Clock, CheckCircle, Download, RefreshCw, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

type SignatureStatus = 'pending' | 'sent' | 'viewed' | 'signed' | 'declined'

interface Signer {
  id: string
  name: string
  email: string
  role: 'landlord' | 'tenant'
  status: SignatureStatus
  signedAt?: Date
  viewedAt?: Date
}

interface SignatureStatusProps {
  leaseId: string
  documentName: string
  signers: Signer[]
  sentAt?: Date
  completedAt?: Date
  onResend?: (signerId: string) => Promise<void>
  onDownload?: () => Promise<void>
  className?: string
}

const statusConfig: Record<
  SignatureStatus,
  { label: string; icon: React.ElementType; color: string; bgColor: string }
> = {
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
  sent: {
    label: 'Sent',
    icon: Send,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  viewed: {
    label: 'Viewed',
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  signed: {
    label: 'Signed',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  declined: {
    label: 'Declined',
    icon: Clock,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
}

export function SignatureStatus({
  leaseId: _leaseId,
  documentName,
  signers,
  sentAt,
  completedAt,
  onResend,
  onDownload,
  className,
}: SignatureStatusProps) {
  const signedCount = signers.filter((s) => s.status === 'signed').length
  const totalCount = signers.length
  const progress = (signedCount / totalCount) * 100
  const isComplete = signedCount === totalCount

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Signature Status
        </CardTitle>
        <CardDescription>{documentName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {signedCount} of {totalCount} signed
            </span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Status Badge */}
        {isComplete ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium text-green-700">Fully Executed</p>
                <p className="text-sm text-green-600">All parties have signed the lease</p>
              </div>
            </div>
            {completedAt && (
              <p className="mt-2 text-xs text-green-600">Completed: {formatDate(completedAt)}</p>
            )}
          </div>
        ) : sentAt ? (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium text-blue-700">Awaiting Signatures</p>
                <p className="text-sm text-blue-600">Sent for signing on {formatDate(sentAt)}</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Signer List */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Signers</h3>
          <div className="space-y-2">
            {signers.map((signer) => {
              const config = statusConfig[signer.status]
              const Icon = config.icon

              return (
                <div
                  key={signer.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full',
                        config.bgColor
                      )}
                    >
                      <Icon className={cn('h-4 w-4', config.color)} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{signer.name}</p>
                      <p className="text-muted-foreground text-xs">{signer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn(config.bgColor, config.color)}>{config.label}</Badge>
                    {(signer.status === 'sent' || signer.status === 'viewed') && onResend && (
                      <Button variant="ghost" size="sm" onClick={() => onResend(signer.id)}>
                        <RefreshCw className="mr-1 h-3 w-3" />
                        Resend
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Download Button */}
        {isComplete && onDownload && (
          <Button className="w-full" onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download Signed Lease
          </Button>
        )}

        {/* Timeline Footnote */}
        <p className="text-muted-foreground text-center text-xs">
          {isComplete
            ? 'Signed lease PDF is stored securely for the duration of the lease.'
            : 'Signers will receive email notifications with a link to sign.'}
        </p>
      </CardContent>
    </Card>
  )
}
