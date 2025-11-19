'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  CreditCard,
  Check,
  Building,
  Users,
  TrendingUp,
  Receipt,
  Download,
  Edit,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { formatDate } from '@/lib/mock-data/agent'

// Mock billing data
const mockBillingData = {
  currentPlan: 'Professional',
  planPrice: 99,
  billingCycle: 'monthly',
  nextBillingDate: '2025-12-19',
  usage: {
    listings: { used: 5, limit: 25 },
    applications: { used: 47, limit: 200 },
    teamMembers: { used: 4, limit: 10 },
    crmLeads: { used: 12, limit: 100 },
  },
  paymentMethod: {
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    expiry: '12/26',
  },
  invoices: [
    { id: 'inv-001', date: '2025-11-19', amount: 99, status: 'paid' },
    { id: 'inv-002', date: '2025-10-19', amount: 99, status: 'paid' },
    { id: 'inv-003', date: '2025-09-19', amount: 99, status: 'paid' },
    { id: 'inv-004', date: '2025-08-19', amount: 99, status: 'paid' },
  ],
}

const plans = [
  {
    name: 'Starter',
    price: 49,
    features: ['10 listings', '50 applications/mo', '3 team members', '50 CRM leads'],
    popular: false,
  },
  {
    name: 'Professional',
    price: 99,
    features: ['25 listings', '200 applications/mo', '10 team members', '100 CRM leads'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 249,
    features: ['Unlimited listings', 'Unlimited applications', 'Unlimited team', 'Unlimited CRM'],
    popular: false,
  },
]

export default function BillingSettingsPage() {
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/agent/settings"
        className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Settings
      </Link>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and payment methods</p>
      </div>

      {/* Current Plan */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold">{mockBillingData.currentPlan}</h3>
                <Badge className="border-green-300 bg-green-100 text-green-800">Active</Badge>
              </div>
              <p className="text-muted-foreground">
                ${mockBillingData.planPrice}/{mockBillingData.billingCycle}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                Next billing date: {formatDate(mockBillingData.nextBillingDate)}
              </p>
            </div>
            <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-2">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Change Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="border-foreground max-w-3xl border-2">
                <DialogHeader>
                  <DialogTitle>Choose a Plan</DialogTitle>
                  <DialogDescription>Select the plan that best fits your needs</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 md:grid-cols-3">
                  {plans.map((plan) => (
                    <div
                      key={plan.name}
                      className={`rounded-md border-2 p-4 ${
                        plan.name === mockBillingData.currentPlan
                          ? 'border-primary bg-primary/5'
                          : plan.popular
                            ? 'border-yellow-400'
                            : 'border-muted'
                      }`}
                    >
                      {plan.popular && (
                        <Badge className="mb-2 border-yellow-300 bg-yellow-100 text-yellow-800">
                          Most Popular
                        </Badge>
                      )}
                      <h4 className="text-lg font-bold">{plan.name}</h4>
                      <p className="mt-2 text-2xl font-bold">
                        ${plan.price}
                        <span className="text-muted-foreground text-sm font-normal">/mo</span>
                      </p>
                      <ul className="mt-4 space-y-2">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`mt-4 w-full ${
                          plan.name === mockBillingData.currentPlan
                            ? 'bg-muted text-muted-foreground'
                            : ''
                        }`}
                        disabled={plan.name === mockBillingData.currentPlan}
                      >
                        {plan.name === mockBillingData.currentPlan ? 'Current Plan' : 'Select'}
                      </Button>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Usage Metrics */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle>Usage This Month</CardTitle>
          <CardDescription>Track your resource consumption</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Building className="text-muted-foreground h-4 w-4" />
                  <span>Active Listings</span>
                </div>
                <span className="font-medium">
                  {mockBillingData.usage.listings.used} / {mockBillingData.usage.listings.limit}
                </span>
              </div>
              <Progress
                value={
                  (mockBillingData.usage.listings.used / mockBillingData.usage.listings.limit) * 100
                }
                className="h-2"
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Receipt className="text-muted-foreground h-4 w-4" />
                  <span>Applications</span>
                </div>
                <span className="font-medium">
                  {mockBillingData.usage.applications.used} /{' '}
                  {mockBillingData.usage.applications.limit}
                </span>
              </div>
              <Progress
                value={
                  (mockBillingData.usage.applications.used /
                    mockBillingData.usage.applications.limit) *
                  100
                }
                className="h-2"
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="text-muted-foreground h-4 w-4" />
                  <span>Team Members</span>
                </div>
                <span className="font-medium">
                  {mockBillingData.usage.teamMembers.used} /{' '}
                  {mockBillingData.usage.teamMembers.limit}
                </span>
              </div>
              <Progress
                value={
                  (mockBillingData.usage.teamMembers.used /
                    mockBillingData.usage.teamMembers.limit) *
                  100
                }
                className="h-2"
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-muted-foreground h-4 w-4" />
                  <span>CRM Leads</span>
                </div>
                <span className="font-medium">
                  {mockBillingData.usage.crmLeads.used} / {mockBillingData.usage.crmLeads.limit}
                </span>
              </div>
              <Progress
                value={
                  (mockBillingData.usage.crmLeads.used / mockBillingData.usage.crmLeads.limit) * 100
                }
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment Method */}
        <Card className="border-foreground border-2">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Your current payment details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-muted flex items-center justify-between rounded-md border-2 p-4">
              <div className="flex items-center gap-3">
                <div className="bg-muted rounded-md p-2">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">
                    {mockBillingData.paymentMethod.brand} ****{mockBillingData.paymentMethod.last4}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Expires {mockBillingData.paymentMethod.expiry}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-2">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" className="mt-4 w-full border-2">
              Add Payment Method
            </Button>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card className="border-foreground border-2">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Recent invoices and receipts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockBillingData.invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="border-muted flex items-center justify-between rounded-md border-2 p-3"
                >
                  <div>
                    <p className="font-medium">${invoice.amount}</p>
                    <p className="text-muted-foreground text-sm">{formatDate(invoice.date)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-green-300 bg-green-100 text-green-800"
                    >
                      {invoice.status}
                    </Badge>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cancel Subscription */}
      <Card className="border-2 border-red-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-800 dark:text-red-200">Cancel Subscription</p>
              <p className="text-sm text-red-600 dark:text-red-300">
                Your access will continue until {formatDate(mockBillingData.nextBillingDate)}
              </p>
            </div>
            <Button
              variant="outline"
              className="border-2 border-red-300 text-red-700 hover:bg-red-50"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
