'use client'

import { useState } from 'react'
import { Trash2, AlertTriangle, Loader2, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type RequestState = 'idle' | 'confirming' | 'submitting' | 'submitted'

interface DeletionRequestProps {
  userEmail: string
  onSubmit?: (confirmEmail: string) => Promise<void>
  className?: string
}

export function DeletionRequest({ userEmail, onSubmit, className }: DeletionRequestProps) {
  const [requestState, setRequestState] = useState<RequestState>('idle')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)

  const handleRequestDeletion = () => {
    setRequestState('confirming')
  }

  const handleConfirmDeletion = async () => {
    if (confirmEmail.toLowerCase() !== userEmail.toLowerCase()) {
      return
    }

    setRequestState('submitting')

    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('deletion_requested', {
        scope: 'full',
      })
    }

    try {
      await onSubmit?.(confirmEmail)
      setRequestState('submitted')
    } catch {
      setRequestState('confirming')
    }
  }

  const isEmailMatch = confirmEmail.toLowerCase() === userEmail.toLowerCase()

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete Your Account
          </CardTitle>
          <CardDescription>Permanently delete your account and all associated data</CardDescription>
        </CardHeader>
        <CardContent>
          {requestState === 'submitted' ? (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800 dark:text-green-200">
                Deletion Request Submitted
              </AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-300">
                <p>
                  Your account deletion request has been received. Your data will be permanently
                  deleted within 30 days.
                </p>
                <p className="mt-2 text-sm">
                  You will receive a confirmation email once the deletion is complete.
                </p>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>This action cannot be undone</AlertTitle>
                <AlertDescription>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    <li>Your profile and all applications will be deleted</li>
                    <li>Your screening results will be removed</li>
                    <li>Any active conversations will be ended</li>
                    <li>You will lose access immediately</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium">What we retain:</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Anonymized audit logs are retained for 3 years as required by FCRA for compliance
                  purposes. These logs do not contain personally identifiable information.
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Need to delete specific data instead?
                </p>
                <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                  You can selectively delete individual documents or application history while
                  keeping your account active.
                </p>
              </div>

              <Button variant="destructive" className="w-full" onClick={handleRequestDeletion}>
                <Trash2 className="mr-2 h-4 w-4" />
                Request Account Deletion
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={requestState === 'confirming' || requestState === 'submitting'}
        onOpenChange={() => {
          if (requestState !== 'submitting') {
            setRequestState('idle')
            setConfirmEmail('')
            setAcknowledged(false)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirm Account Deletion</DialogTitle>
            <DialogDescription>This action is permanent and cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="confirm-email">
                Type your email to confirm: <span className="font-mono">{userEmail}</span>
              </Label>
              <Input
                id="confirm-email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="Enter your email"
              />
              {confirmEmail && !isEmailMatch && (
                <p className="text-sm text-red-600">Email does not match</p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="acknowledge"
                checked={acknowledged}
                onCheckedChange={(checked) => setAcknowledged(checked as boolean)}
              />
              <Label htmlFor="acknowledge" className="cursor-pointer text-sm leading-tight">
                I understand that my account and all data will be permanently deleted and this
                action cannot be undone.
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRequestState('idle')
                setConfirmEmail('')
                setAcknowledged(false)
              }}
              disabled={requestState === 'submitting'}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDeletion}
              disabled={!isEmailMatch || !acknowledged || requestState === 'submitting'}
            >
              {requestState === 'submitting' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete My Account'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
