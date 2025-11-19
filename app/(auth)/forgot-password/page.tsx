'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = () => {
    if (!email) {
      setError('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return false
    }
    setError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail()) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSuccess(true)
  }

  if (isSuccess) {
    return (
      <Card className="border-foreground border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-green-100 text-green-600">
            <CheckCircle className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription>
            We&apos;ve sent password reset instructions to{' '}
            <span className="text-foreground font-medium">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center text-sm">
            Didn&apos;t receive the email? Check your spam folder or{' '}
            <button
              onClick={() => {
                setIsSuccess(false)
                setEmail('')
              }}
              className="text-foreground font-medium hover:underline"
            >
              try again
            </button>
          </p>
          <div className="pt-2">
            <Button variant="outline" className="border-foreground w-full border-2" asChild>
              <Link href="/login">Back to Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-foreground border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
        <CardDescription>Enter your email and we&apos;ll send you a reset link</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`border-2 pl-10 ${error ? 'border-destructive' : 'border-foreground'}`}
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="border-foreground w-full border-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>

        {/* Back to Sign In */}
        <p className="text-muted-foreground mt-6 text-center text-sm">
          Remember your password?{' '}
          <Link href="/login" className="text-foreground font-medium hover:underline">
            Back to Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
