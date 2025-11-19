'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
    <Card className="border-foreground border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader className="text-center">
        <div className="bg-primary text-primary-foreground mx-auto mb-4 flex h-16 w-16 items-center justify-center">
          <Mail className="h-8 w-8" />
        </div>
        <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
        <CardDescription>We&apos;ve sent a verification link to your email</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email Display */}
        <div className="bg-muted border-foreground border-2 py-4 text-center">
          <p className="text-muted-foreground text-sm">Sent to</p>
          <p className="font-medium">{maskedEmail}</p>
        </div>

        {/* Success Message */}
        {resendSuccess && (
          <div className="flex items-center gap-2 border-2 border-green-600 bg-green-50 p-3 text-green-600">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <p className="text-sm">Verification email resent successfully!</p>
          </div>
        )}

        {/* Instructions */}
        <div className="text-muted-foreground space-y-2 text-sm">
          <p>
            Click the link in the email to verify your account. If you don&apos;t see it, check your
            spam folder.
          </p>
        </div>

        {/* Resend Button */}
        <Button
          onClick={handleResend}
          variant="outline"
          className="border-foreground w-full border-2"
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
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Wrong email? Change it
          </Link>
        </div>

        {/* Back to Sign In */}
        <div className="border-t pt-4">
          <p className="text-muted-foreground text-center text-sm">
            Already verified?{' '}
            <Link href="/login" className="text-foreground font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
