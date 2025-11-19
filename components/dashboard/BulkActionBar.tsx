'use client'

import { useState } from 'react'
import { Send, Mail, XCircle, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface BulkActionBarProps {
  selectedCount: number
  selectedIds: string[]
  onForwardToLandlord: (ids: string[]) => void
  onRequestDocuments: (ids: string[]) => void
  onDeny: (ids: string[]) => void
  onClearSelection: () => void
  className?: string
}

export function BulkActionBar({
  selectedCount,
  selectedIds,
  onForwardToLandlord,
  onRequestDocuments,
  onDeny,
  onClearSelection,
  className,
}: BulkActionBarProps) {
  const [showDenyDialog, setShowDenyDialog] = useState(false)

  if (selectedCount === 0) {
    return null
  }

  const handleForward = () => {
    onForwardToLandlord(selectedIds)

    // Track analytics
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('bulk_action_performed', {
        actionType: 'forward_to_landlord',
        count: selectedCount,
      })
    }
  }

  const handleRequestDocs = () => {
    onRequestDocuments(selectedIds)

    // Track analytics
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('bulk_action_performed', {
        actionType: 'request_documents',
        count: selectedCount,
      })
    }
  }

  const handleDeny = () => {
    setShowDenyDialog(false)
    onDeny(selectedIds)

    // Track analytics
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('bulk_action_performed', {
        actionType: 'deny',
        count: selectedCount,
      })
    }
  }

  return (
    <>
      <div
        className={`bg-primary/10 border-primary flex items-center justify-between rounded-lg border p-4 ${className}`}
      >
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            {selectedCount} applicant{selectedCount !== 1 ? 's' : ''} selected
          </span>
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            Clear selection
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" onClick={handleForward} className="gap-2">
            <Send className="h-4 w-4" />
            Forward to Landlord
          </Button>

          <Button variant="secondary" size="sm" onClick={handleRequestDocs} className="gap-2">
            <Mail className="h-4 w-4" />
            Request Documents
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setShowDenyDialog(true)}
                className="text-destructive"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Deny with Reason
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onClearSelection}>Clear Selection</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={showDenyDialog} onOpenChange={setShowDenyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deny {selectedCount} Applicants?</AlertDialogTitle>
            <AlertDialogDescription>
              This will generate individual adverse action letters for each selected applicant. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeny}
              className="bg-destructive hover:bg-destructive/90"
            >
              Deny Applicants
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
