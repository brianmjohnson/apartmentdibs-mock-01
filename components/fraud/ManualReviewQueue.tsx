'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  MessageSquare,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface ReviewItem {
  id: string
  applicantName: string
  applicantEmail: string
  documentType: string
  flagReason: string
  flaggedAt: Date
  priority: 'high' | 'medium' | 'low'
}

interface ManualReviewQueueProps {
  items: ReviewItem[]
  onApprove?: (id: string, notes: string) => void
  onReject?: (id: string, notes: string) => void
  onRequestDocuments?: (id: string, request: string) => void
  onViewDetails?: (id: string) => void
  className?: string
}

export function ManualReviewQueue({
  items,
  onApprove,
  onReject,
  onRequestDocuments,
  onViewDetails,
  className,
}: ManualReviewQueueProps) {
  const [selectedItem, setSelectedItem] = useState<ReviewItem | null>(null)
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'request' | null>(null)
  const [notes, setNotes] = useState('')

  const handleAction = () => {
    if (!selectedItem || !actionType) return

    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('manual_review_completed', {
        applicantId: selectedItem.id,
        decision: actionType,
      })
    }

    switch (actionType) {
      case 'approve':
        onApprove?.(selectedItem.id, notes)
        break
      case 'reject':
        onReject?.(selectedItem.id, notes)
        break
      case 'request':
        onRequestDocuments?.(selectedItem.id, notes)
        break
    }

    setSelectedItem(null)
    setActionType(null)
    setNotes('')
  }

  const getPriorityBadge = (priority: ReviewItem['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>
      case 'medium':
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
          >
            Medium
          </Badge>
        )
      case 'low':
        return <Badge variant="secondary">Low</Badge>
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  const getDialogTitle = () => {
    switch (actionType) {
      case 'approve':
        return 'Approve Application'
      case 'reject':
        return 'Reject Application'
      case 'request':
        return 'Request Additional Documents'
      default:
        return ''
    }
  }

  const getDialogDescription = () => {
    switch (actionType) {
      case 'approve':
        return 'Confirm that you have reviewed this application and it passes verification.'
      case 'reject':
        return 'Provide a reason for rejecting this application.'
      case 'request':
        return 'Specify what additional documents are needed from the applicant.'
      default:
        return ''
    }
  }

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Manual Review Queue
              </CardTitle>
              <CardDescription>
                {items.length} {items.length === 1 ? 'item' : 'items'} requiring review
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              <CheckCircle className="mx-auto mb-3 h-8 w-8 text-green-600" />
              <p>No items pending review</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Flag Reason</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Flagged</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.applicantName}</p>
                        <p className="text-muted-foreground text-sm">{item.applicantEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>{item.documentType}</TableCell>
                    <TableCell className="max-w-[200px]">
                      <p className="truncate text-sm">{item.flagReason}</p>
                    </TableCell>
                    <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                    <TableCell>
                      <div className="text-muted-foreground flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        {formatDate(item.flaggedAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => onViewDetails?.(item.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item)
                            setActionType('request')
                          }}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            setSelectedItem(item)
                            setActionType('reject')
                          }}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => {
                            setSelectedItem(item)
                            setActionType('approve')
                          }}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedItem && !!actionType}
        onOpenChange={() => {
          setSelectedItem(null)
          setActionType(null)
          setNotes('')
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>{getDialogDescription()}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedItem && (
              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm font-medium">{selectedItem.applicantName}</p>
                <p className="text-muted-foreground text-sm">
                  {selectedItem.documentType} - {selectedItem.flagReason}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="notes">
                {actionType === 'request' ? 'Document Request' : 'Notes'}
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  actionType === 'request'
                    ? 'Specify the documents needed...'
                    : 'Add any relevant notes...'
                }
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedItem(null)
                setActionType(null)
                setNotes('')
              }}
            >
              Cancel
            </Button>
            <Button
              variant={actionType === 'reject' ? 'destructive' : 'default'}
              onClick={handleAction}
            >
              {actionType === 'approve' && 'Approve'}
              {actionType === 'reject' && 'Reject'}
              {actionType === 'request' && 'Send Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
