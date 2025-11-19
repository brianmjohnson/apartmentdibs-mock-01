'use client'

import Link from 'next/link'
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Shield,
  CreditCard,
  UserCheck,
  ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  mockTenantProfile,
  mockDocuments,
  getVerificationStatusColor,
  getDocumentStatusColor,
  formatDate
} from '@/lib/mock-data/tenant'

export default function ProfilePage() {
  const verificationItems = [
    {
      key: 'identity',
      label: 'Identity Verification',
      description: 'Government-issued ID verification',
      icon: UserCheck,
      status: mockTenantProfile.verifications.identity,
      href: '/tenant/profile/verification/identity'
    },
    {
      key: 'income',
      label: 'Income Verification',
      description: 'Employment and income verification',
      icon: FileText,
      status: mockTenantProfile.verifications.income,
      href: '/tenant/profile/verification/income'
    },
    {
      key: 'credit',
      label: 'Credit Authorization',
      description: 'Soft credit check authorization',
      icon: CreditCard,
      status: mockTenantProfile.verifications.credit,
      href: '/tenant/profile/verification/credit'
    },
    {
      key: 'background',
      label: 'Background Check',
      description: 'Background screening authorization',
      icon: Shield,
      status: mockTenantProfile.verifications.background,
      href: '/tenant/profile/verification/background'
    }
  ]

  const getStatusIcon = (status: 'verified' | 'pending' | 'not_started') => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'not_started':
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusLabel = (status: 'verified' | 'pending' | 'not_started') => {
    switch (status) {
      case 'verified':
        return 'Verified'
      case 'pending':
        return 'Pending'
      case 'not_started':
        return 'Not Started'
    }
  }

  // Check if profile is expiring soon (within 30 days)
  const profileValidDate = new Date(mockTenantProfile.profileValidUntil)
  const today = new Date()
  const daysUntilExpiry = Math.ceil((profileValidDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground">
            Profile completion: {mockTenantProfile.profileCompletion}%
          </p>
        </div>
        <Button asChild className="border-2 border-foreground">
          <Link href="/tenant/profile/edit">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Link>
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={mockTenantProfile.profileCompletion} className="h-3" />
        <p className="text-sm text-muted-foreground">
          {mockTenantProfile.profileCompletion === 100
            ? 'Your profile is complete!'
            : 'Complete your profile to improve your application success rate'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Summary Card */}
        <Card className="border-2 border-foreground">
          <CardHeader>
            <CardTitle>Profile Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-foreground">
                <AvatarImage
                  src={undefined}
                  alt={`${mockTenantProfile.firstName} ${mockTenantProfile.lastName}`}
                />
                <AvatarFallback className="text-lg">
                  {mockTenantProfile.firstName[0]}{mockTenantProfile.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold">
                  {mockTenantProfile.firstName} {mockTenantProfile.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Member since {formatDate(mockTenantProfile.memberSince)}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{mockTenantProfile.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{mockTenantProfile.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {mockTenantProfile.address.street}, {mockTenantProfile.address.city}, {mockTenantProfile.address.state} {mockTenantProfile.address.zip}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Validity */}
        <Card className={`border-2 ${isExpiringSoon ? 'border-yellow-500' : 'border-foreground'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Profile Validity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-2xl font-bold">
                Valid until {formatDate(mockTenantProfile.profileValidUntil)}
              </p>
              <p className="text-sm text-muted-foreground">
                {daysUntilExpiry > 0
                  ? `${daysUntilExpiry} days remaining`
                  : 'Profile has expired'}
              </p>
            </div>

            {isExpiringSoon && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium">
                  Your profile is expiring soon. Renew to continue applying to listings.
                </p>
                <Button size="sm" className="mt-2 border-2 border-foreground">
                  Renew Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Verification Status Cards */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle>Verification Status</CardTitle>
          <CardDescription>
            Complete all verifications to unlock faster applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {verificationItems.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 border-2 border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-2 border-foreground"
                    >
                      <Link href={item.href}>
                        {item.status === 'not_started' ? 'Start' : 'View'}
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Documents Section */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Your uploaded verification documents</CardDescription>
            </div>
            <Button variant="outline" asChild className="border-2 border-foreground">
              <Link href="/tenant/profile/documents">
                Manage Documents
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {mockDocuments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No documents uploaded yet</p>
              <Button asChild className="mt-4 border-2 border-foreground">
                <Link href="/tenant/profile/documents">Upload Documents</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {mockDocuments.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded {formatDate(doc.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getDocumentStatusColor(doc.status)} border text-xs`}>
                    {doc.status === 'pending_review' ? 'Pending' : doc.status === 'verified' ? 'Verified' : 'Rejected'}
                  </Badge>
                </div>
              ))}
              {mockDocuments.length > 4 && (
                <p className="text-sm text-muted-foreground text-center pt-2">
                  +{mockDocuments.length - 4} more documents
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
