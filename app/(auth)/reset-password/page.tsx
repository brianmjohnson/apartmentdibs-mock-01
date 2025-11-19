'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Lock, Eye, EyeOff, Loader2, CheckCircle, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({})

  const passwordRequirements = [
    { label: '8+ characters', test: (p: string) => p.length >= 8 },
    { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'Number', test: (p: string) => /[0-9]/.test(p) },
    { label: 'Special character', test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  ]

  const getPasswordStrength = () => {
    const passed = passwordRequirements.filter((req) => req.test(password)).length
    if (passed === 0) return { label: '', width: '0%', color: '' }
    if (passed === 1) return { label: 'Weak', width: '25%', color: 'bg-destructive' }
    if (passed === 2) return { label: 'Fair', width: '50%', color: 'bg-orange-500' }
    if (passed === 3) return { label: 'Good', width: '75%', color: 'bg-yellow-500' }
    return { label: 'Strong', width: '100%', color: 'bg-green-500' }
  }

  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {}

    if (!password) {
      newErrors.password = 'Password is required'
    } else {
      const failedRequirements = passwordRequirements.filter((req) => !req.test(password))
      if (failedRequirements.length > 0) {
        newErrors.password = 'Password does not meet all requirements'
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSuccess(true)
  }

  const passwordStrength = getPasswordStrength()

  if (isSuccess) {
    return (
      <Card className="border-foreground border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-green-100 text-green-600">
            <CheckCircle className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Password Reset!</CardTitle>
          <CardDescription>
            Your password has been successfully reset. Redirecting to login...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="border-foreground w-full border-2" asChild>
            <Link href="/login">Go to Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-foreground border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`border-2 pr-10 pl-10 ${errors.password ? 'border-destructive' : 'border-foreground'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {password && (
              <div className="space-y-2">
                <div className="bg-muted h-1 overflow-hidden rounded-full">
                  <div
                    className={`h-full transition-all ${passwordStrength.color}`}
                    style={{ width: passwordStrength.width }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {passwordRequirements.map((req) => (
                    <div
                      key={req.label}
                      className={`flex items-center text-xs ${
                        req.test(password) ? 'text-green-600' : 'text-muted-foreground'
                      }`}
                    >
                      {req.test(password) ? (
                        <Check className="mr-1 h-3 w-3" />
                      ) : (
                        <X className="mr-1 h-3 w-3" />
                      )}
                      {req.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`border-2 pr-10 pl-10 ${errors.confirmPassword ? 'border-destructive' : 'border-foreground'}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-destructive text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="border-foreground w-full border-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              'Reset Password'
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
