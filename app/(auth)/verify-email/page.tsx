'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  // Mock email - in real app, this would come from auth context or URL params
  const email = 'user@example.com'
  const maskedEmail = email.replace(/(.{1})(.*)(@.*)/, '$1***$3')

  const handleResend = async () => {
    setIsResending(true)
    setResendSuccess(false)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsResending(false)
    setResendSuccess(true)
  }

  return (
    <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader className="text-center">
        <div className="mx-auto h-16 w-16 bg-primary text-primary-foreground flex items-center justify-center mb-4">
          <Mail className="h-8 w-8" />
        </div>
        <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
        <CardDescription>
          We&apos;ve sent a verification link to your email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email Display */}
        <div className="text-center py-4 bg-muted border-2 border-foreground">
          <p className="text-sm text-muted-foreground">Sent to</p>
          <p className="font-medium">{maskedEmail}</p>
        </div>

        {/* Success Message */}
        {resendSuccess && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border-2 border-green-600 text-green-600">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <p className="text-sm">Verification email resent successfully!</p>
          </div>
        )}

        {/* Instructions */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            Click the link in the email to verify your account. If you don&apos;t see it,
            check your spam folder.
          </p>
        </div>

        {/* Resend Button */}
        <Button
          onClick={handleResend}
          variant="outline"
          className="w-full border-2 border-foreground"
          disabled={isResending}
        >
          {isResending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resending...
            </>
          ) : (
            'Resend Verification Email'
          )}
        </Button>

        {/* Change Email Link */}
        <div className="pt-2 text-center">
          <Link
            href="/register"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Wrong email? Change it
          </Link>
        </div>

        {/* Back to Sign In */}
        <div className="pt-4 border-t">
          <p className="text-center text-sm text-muted-foreground">
            Already verified?{' '}
            <Link
              href="/login"
              className="font-medium text-foreground hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
