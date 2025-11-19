'use client'

import Link from 'next/link'
import { User, CreditCard, Bell, Check, Download, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/mock-data/landlord'

// Mock billing data
const currentPlan = {
  name: 'Professional',
  price: 49,
  billing: 'monthly',
  features: [
    'Up to 25 units',
    'Unlimited applications',
    'Tenant screening',
    'Online rent collection',
    'Maintenance tracking',
    'Financial reporting'
  ]
}

const paymentMethods = [
  {
    id: 'card-1',
    type: 'Visa',
    last4: '4242',
    expiry: '12/26',
    isDefault: true
  },
  {
    id: 'card-2',
    type: 'Mastercard',
    last4: '8888',
    expiry: '03/25',
    isDefault: false
  }
]

const billingHistory = [
  {
    id: 'inv-1',
    date: '2025-11-01',
    description: 'Professional Plan - November 2025',
    amount: 49,
    status: 'paid'
  },
  {
    id: 'inv-2',
    date: '2025-10-01',
    description: 'Professional Plan - October 2025',
    amount: 49,
    status: 'paid'
  },
  {
    id: 'inv-3',
    date: '2025-09-01',
    description: 'Professional Plan - September 2025',
    amount: 49,
    status: 'paid'
  },
  {
    id: 'inv-4',
    date: '2025-08-01',
    description: 'Professional Plan - August 2025',
    amount: 49,
    status: 'paid'
  }
]

const plans = [
  {
    name: 'Starter',
    price: 0,
    features: ['Up to 5 units', 'Basic applications', 'Email support'],
    current: false
  },
  {
    name: 'Professional',
    price: 49,
    features: ['Up to 25 units', 'Tenant screening', 'Online payments', 'Priority support'],
    current: true
  },
  {
    name: 'Enterprise',
    price: 149,
    features: ['Unlimited units', 'All features', 'API access', 'Dedicated support'],
    current: false
  }
]

export default function BillingSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription and payment methods
        </p>
      </div>

      {/* Settings Navigation */}
      <div className="flex gap-2 flex-wrap">
        <Link href="/landlord/settings">
          <Button variant="outline" className="border-2">
            <User className="h-4 w-4 mr-2" />
            Account
          </Button>
        </Link>
        <Button variant="default" className="border-2 border-foreground">
          <CreditCard className="h-4 w-4 mr-2" />
          Billing
        </Button>
        <Link href="/landlord/settings/notifications">
          <Button variant="outline" className="border-2">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
        </Link>
      </div>

      {/* Current Plan */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your active subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                <Badge variant="outline" className="border-2 border-green-400 text-green-700">
                  Active
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {formatCurrency(currentPlan.price)}/month
              </p>
              <ul className="mt-4 space-y-1">
                {currentPlan.features.map((feature, idx) => (
                  <li key={idx} className="text-sm flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Next billing date: December 1, 2025
              </p>
              <Button variant="outline" className="border-2 text-red-600 hover:text-red-700">
                Cancel Subscription
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment cards</CardDescription>
            </div>
            <Button variant="outline" className="border-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Card
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-3 border-2 border-border"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {method.type} ending in {method.last4}
                      {method.isDefault && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Default
                        </Badge>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires {method.expiry}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!method.isDefault && (
                    <Button variant="ghost" size="sm">
                      Set Default
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View and download past invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{formatDate(invoice.date)}</TableCell>
                  <TableCell>{invoice.description}</TableCell>
                  <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-green-400 text-green-700">
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle>Upgrade Your Plan</CardTitle>
          <CardDescription>Choose the plan that fits your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`p-4 border-2 ${plan.current ? 'border-foreground bg-muted/50' : 'border-border'}`}
              >
                <h3 className="font-bold text-lg">{plan.name}</h3>
                <p className="text-2xl font-bold mt-2">
                  {plan.price === 0 ? 'Free' : formatCurrency(plan.price)}
                  {plan.price > 0 && <span className="text-sm font-normal">/mo</span>}
                </p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-sm flex items-center gap-2">
                      <Check className="h-3 w-3 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-4 border-2"
                  variant={plan.current ? 'outline' : 'default'}
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : 'Upgrade'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
