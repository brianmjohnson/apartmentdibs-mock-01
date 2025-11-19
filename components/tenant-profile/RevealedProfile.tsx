'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  CreditCard,
  Home,
  ShieldCheck,
  DollarSign,
  Calendar,
  Users,
  PawPrint,
  Sparkles
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LandlordApplicant, formatDate } from '@/lib/mock-data/landlord'
import { CreditBand } from './CreditBand'
import { EmploymentTenure } from './EmploymentTenure'

interface RevealedProfileProps {
  applicant: LandlordApplicant
  showAnimation?: boolean
  className?: string
}

export function RevealedProfile({
  applicant,
  showAnimation = true,
  className = ''
}: RevealedProfileProps) {
  const [isRevealed, setIsRevealed] = useState(!showAnimation)

  useEffect(() => {
    if (showAnimation) {
      // Trigger reveal animation after mount
      const timer = setTimeout(() => setIsRevealed(true), 100)
      return () => clearTimeout(timer)
    }
  }, [showAnimation])

  if (!applicant.revealedData) {
    return (
      <Card className={`border-2 border-foreground ${className}`}>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            PII data not available. Please contact support.
          </p>
        </CardContent>
      </Card>
    )
  }

  const { revealedData } = applicant
  const initials = revealedData.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <Card
      className={`border-2 border-foreground transition-all duration-500 ${
        isRevealed ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
      } ${className}`}
    >
      <CardHeader>
        <div className="flex items-start gap-4">
          {/* Profile Photo */}
          <Avatar className="h-20 w-20 border-2 border-foreground">
            <AvatarImage
              src={revealedData.photoUrl}
              alt={`Photo of ${revealedData.name}`}
            />
            <AvatarFallback className="text-lg font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Name and Contact */}
          <div className="flex-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              {revealedData.name}
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 border-green-300"
              >
                Selected
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1">
              {applicant.displayId} - PII Revealed
            </CardDescription>

            {/* Contact Info */}
            <div className="mt-3 space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${revealedData.email}`}
                  className="hover:underline"
                >
                  {revealedData.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`tel:${revealedData.phone}`}
                  className="hover:underline"
                >
                  {revealedData.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Address and Employer */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-3 bg-muted rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Current Address
              </span>
            </div>
            <p className="font-medium text-sm">{revealedData.address}</p>
          </div>

          <div className="p-3 bg-muted rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Employer</span>
            </div>
            <p className="font-medium text-sm">{revealedData.employer}</p>
          </div>
        </div>

        <Separator />

        {/* Financial Details */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Financial Details
          </h4>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Exact Credit Score */}
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground mb-1">
                Credit Score (Exact)
              </p>
              <p className="font-bold text-lg">{revealedData.exactCreditScore}</p>
              <CreditBand
                creditBand={applicant.creditBand}
                showIcon={false}
                size="sm"
                className="mt-1"
              />
            </div>

            {/* Income Ratio */}
            <div className="p-3 bg-muted rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Income Ratio
                </span>
              </div>
              <p className="font-bold text-lg">{applicant.incomeRatio}x</p>
            </div>

            {/* Employment */}
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground mb-1">Employment</p>
              <EmploymentTenure
                tenure={applicant.employmentTenure}
                employmentType={applicant.employmentType}
                showIcon={false}
                showStabilityBadge={false}
                size="sm"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Rental History and Background */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-3 bg-muted rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <Home className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Rental History
              </span>
            </div>
            <p className="font-medium">
              {applicant.rentalHistory || '5+ years, no evictions'}
            </p>
          </div>

          <div className="p-3 bg-muted rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Background Check
              </span>
            </div>
            <p className={`font-medium ${
              applicant.backgroundCheck === 'Pass' ? 'text-green-600' : 'text-red-600'
            }`}>
              {applicant.backgroundCheck || 'Pass'}
            </p>
          </div>
        </div>

        <Separator />

        {/* Additional Info */}
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />
              Move-in Date
            </div>
            <p className="font-medium text-sm">
              {formatDate(applicant.moveInDate)}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              Occupants
            </div>
            <p className="font-medium text-sm">{applicant.occupants}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <PawPrint className="h-4 w-4" />
              Pets
            </div>
            <p className="font-medium text-sm">
              {applicant.pets ? applicant.petDetails || 'Yes' : 'No'}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />
              Applied
            </div>
            <p className="font-medium text-sm">
              {formatDate(applicant.appliedAt)}
            </p>
          </div>
        </div>

        {/* Competitive Edge */}
        {applicant.competitiveEdge && (
          <>
            <Separator />
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-300 rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">
                  Competitive Edge
                </span>
              </div>
              <p className="text-sm">{applicant.competitiveEdge}</p>
            </div>
          </>
        )}

        {/* Reveal Timestamp */}
        {applicant.piiRevealedAt && (
          <p className="text-xs text-muted-foreground text-center">
            PII revealed on {formatDate(applicant.piiRevealedAt)}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
