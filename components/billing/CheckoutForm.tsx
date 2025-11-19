'use client'

import { useState } from 'react'
import { CreditCard, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

interface CheckoutFormProps {
  planName: string
  planPrice: number
  billingPeriod: 'monthly' | 'annual'
  onSubmit?: (paymentData: PaymentData) => Promise<void>
  onCancel?: () => void
  className?: string
}

interface PaymentData {
  cardNumber: string
  expiryDate: string
  cvc: string
  name: string
}

export function CheckoutForm({
  planName,
  planPrice,
  billingPeriod,
  onSubmit,
  onCancel,
  className,
}: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<PaymentData>({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    name: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('checkout_submitted', {
        planName,
        billingPeriod,
      })
    }

    try {
      await onSubmit?.(formData)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : value
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const annualTotal = billingPeriod === 'annual' ? planPrice * 12 * 0.8 : null

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Complete Your Subscription
        </CardTitle>
        <CardDescription>
          Subscribe to {planName} - {billingPeriod} billing
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <div className="flex justify-between">
              <span className="font-medium">{planName} Plan</span>
              <span className="font-bold">${planPrice}/mo</span>
            </div>
            {annualTotal && (
              <>
                <Separator className="my-2" />
                <div className="flex justify-between text-sm">
                  <span>Annual total (20% off)</span>
                  <span className="font-semibold text-green-600">
                    ${annualTotal.toFixed(0)}/year
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Cardholder Name</Label>
            <Input
              id="name"
              placeholder="John Smith"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card">Card Number</Label>
            <div className="relative">
              <Input
                id="card"
                placeholder="4242 4242 4242 4242"
                value={formData.cardNumber}
                onChange={(e) =>
                  setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })
                }
                maxLength={19}
                required
              />
              <CreditCard className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: formatExpiry(e.target.value) })
                }
                maxLength={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                value={formData.cvc}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cvc: e.target.value.replace(/[^0-9]/g, '').slice(0, 4),
                  })
                }
                maxLength={4}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            Your payment is secured with 256-bit SSL encryption
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Subscribe Now
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
