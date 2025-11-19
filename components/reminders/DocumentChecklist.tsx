'use client'

import { CheckCircle, Circle, Upload, Clock, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export interface DocumentItem {
  id: string
  name: string
  description: string
  status: 'completed' | 'pending' | 'required' | 'expired'
  uploadedAt?: Date
  expiresAt?: Date
}

interface DocumentChecklistProps {
  documents: DocumentItem[]
  deadline?: Date
  onUpload: (documentId: string) => void
  className?: string
}

export function DocumentChecklist({
  documents,
  deadline,
  onUpload,
  className,
}: DocumentChecklistProps) {
  const completedCount = documents.filter((d) => d.status === 'completed').length
  const completionPercentage = Math.round((completedCount / documents.length) * 100)

  const daysUntilDeadline = deadline
    ? Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  const getStatusIcon = (status: DocumentItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'expired':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Circle className="text-muted-foreground h-5 w-5" />
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Document Checklist</CardTitle>
          {daysUntilDeadline !== null && (
            <span
              className={cn(
                'text-sm font-medium',
                daysUntilDeadline <= 2
                  ? 'text-red-600'
                  : daysUntilDeadline <= 5
                    ? 'text-yellow-600'
                    : 'text-muted-foreground'
              )}
            >
              {daysUntilDeadline > 0 ? (
                <>
                  <Clock className="mr-1 inline h-4 w-4" />
                  {daysUntilDeadline} days left
                </>
              ) : (
                <>
                  <AlertCircle className="mr-1 inline h-4 w-4" />
                  Deadline passed
                </>
              )}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>
              {completedCount} of {documents.length} complete
            </span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Document List */}
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={cn(
                'flex items-start justify-between rounded-lg border p-3',
                doc.status === 'completed' && 'border-green-200 bg-green-50/50',
                doc.status === 'expired' && 'border-red-200 bg-red-50/50'
              )}
            >
              <div className="flex items-start gap-3">
                {getStatusIcon(doc.status)}
                <div>
                  <p className="text-sm font-medium">{doc.name}</p>
                  <p className="text-muted-foreground text-xs">{doc.description}</p>
                  {doc.uploadedAt && (
                    <p className="text-muted-foreground mt-1 text-xs">
                      Uploaded {formatDate(doc.uploadedAt)}
                    </p>
                  )}
                  {doc.status === 'expired' && doc.expiresAt && (
                    <p className="text-destructive mt-1 text-xs">
                      Expired {formatDate(doc.expiresAt)}
                    </p>
                  )}
                </div>
              </div>
              {(doc.status === 'required' ||
                doc.status === 'pending' ||
                doc.status === 'expired') && (
                <Button
                  size="sm"
                  variant={doc.status === 'expired' ? 'destructive' : 'secondary'}
                  onClick={() => onUpload(doc.id)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {doc.status === 'expired' ? 'Re-upload' : 'Upload'}
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Compact version for applicant detail panel
interface CompactDocumentChecklistProps {
  documents: DocumentItem[]
  onUpload: (documentId: string) => void
  className?: string
}

export function CompactDocumentChecklist({
  documents,
  onUpload,
  className,
}: CompactDocumentChecklistProps) {
  const incomplete = documents.filter((d) => d.status !== 'completed')

  if (incomplete.length === 0) {
    return (
      <div className={cn('flex items-center gap-2 text-sm text-green-600', className)}>
        <CheckCircle className="h-4 w-4" />
        <span>All documents complete</span>
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-sm font-medium">
        {incomplete.length} document{incomplete.length !== 1 ? 's' : ''} needed:
      </p>
      <div className="space-y-1">
        {incomplete.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{doc.name}</span>
            <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => onUpload(doc.id)}>
              <Upload className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
