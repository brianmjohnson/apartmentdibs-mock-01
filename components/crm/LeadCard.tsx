'use client'

import { Calendar, MapPin, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { MatchScoreBadge } from './MatchScoreBadge'

export interface CRMLead {
  id: string
  applicantId: string
  budgetMin: number
  budgetMax: number
  neighborhoods: string[]
  moveInStart: Date
  moveInEnd: Date
  mustHaves: string[]
  verificationExpiresAt: Date
  createdAt: Date
  expiresAt: Date
  contactedCount: number
  lastContactedAt?: Date
  matchScore?: number
  deniedListingAddress?: string
}

interface LeadCardProps {
  lead: CRMLead
  selected?: boolean
  onSelect?: (id: string, selected: boolean) => void
  onContact?: (lead: CRMLead) => void
  onArchive?: (lead: CRMLead) => void
  onExtend?: (lead: CRMLead) => void
  showActions?: boolean
  className?: string
}

export function LeadCard({
  lead,
  selected = false,
  onSelect,
  onContact,
  onArchive,
  onExtend,
  showActions = true,
  className,
}: LeadCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const isExpiringSoon = () => {
    const daysUntilExpiry = Math.ceil(
      (lead.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    return daysUntilExpiry <= 14 && daysUntilExpiry > 0
  }

  const isVerificationExpired = () => {
    return lead.verificationExpiresAt < new Date()
  }

  const daysUntilExpiry = Math.ceil((lead.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <Card className={`${className} ${selected ? 'ring-primary ring-2' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {onSelect && (
              <Checkbox
                checked={selected}
                onCheckedChange={(checked) => onSelect(lead.id, checked as boolean)}
                aria-label={`Select lead ${lead.applicantId}`}
              />
            )}
            <div>
              <h3 className="font-semibold">Lead #{lead.applicantId}</h3>
              {lead.deniedListingAddress && (
                <p className="text-muted-foreground text-xs">
                  Previously denied: {lead.deniedListingAddress}
                </p>
              )}
            </div>
          </div>
          {lead.matchScore && <MatchScoreBadge score={lead.matchScore} />}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Lead Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="text-muted-foreground h-4 w-4" />
            <span>
              {formatCurrency(lead.budgetMin)} - {formatCurrency(lead.budgetMax)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="text-muted-foreground h-4 w-4" />
            <span>
              {formatDate(lead.moveInStart)} - {formatDate(lead.moveInEnd)}
            </span>
          </div>
        </div>

        {/* Neighborhoods */}
        <div className="flex items-start gap-2">
          <MapPin className="text-muted-foreground mt-0.5 h-4 w-4" />
          <div className="flex flex-wrap gap-1">
            {lead.neighborhoods.map((neighborhood) => (
              <Badge key={neighborhood} variant="secondary" className="text-xs">
                {neighborhood}
              </Badge>
            ))}
          </div>
        </div>

        {/* Must-haves */}
        {lead.mustHaves.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {lead.mustHaves.map((item) => (
              <Badge key={item} variant="outline" className="text-xs">
                {item}
              </Badge>
            ))}
          </div>
        )}

        {/* Status indicators */}
        <div className="flex items-center gap-4 text-xs">
          {isVerificationExpired() ? (
            <span className="text-destructive flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              Verification expired
            </span>
          ) : (
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-3 w-3" />
              Verified
            </span>
          )}

          {isExpiringSoon() && (
            <span className="flex items-center gap-1 text-yellow-600">
              <Clock className="h-3 w-3" />
              Expires in {daysUntilExpiry} days
            </span>
          )}

          {lead.contactedCount > 0 && (
            <span className="text-muted-foreground">Contacted {lead.contactedCount}x</span>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            {onContact && (
              <Button size="sm" onClick={() => onContact(lead)} disabled={isVerificationExpired()}>
                Contact
              </Button>
            )}
            {isExpiringSoon() && onExtend && (
              <Button size="sm" variant="secondary" onClick={() => onExtend(lead)}>
                Extend
              </Button>
            )}
            {onArchive && (
              <Button size="sm" variant="ghost" onClick={() => onArchive(lead)}>
                Archive
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
