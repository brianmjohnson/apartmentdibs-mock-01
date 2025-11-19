'use client'

import { Phone, Mail, Calendar, Clock, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface AccountManager {
  id: string
  name: string
  title: string
  email: string
  phone: string
  photoUrl?: string
  availability: string
  rating?: number
  specialties?: string[]
}

interface AccountManagerCardProps {
  manager: AccountManager
  onCall?: () => void
  onEmail?: () => void
  onSchedule?: () => void
  className?: string
}

export function AccountManagerCard({
  manager,
  onCall,
  onEmail,
  onSchedule,
  className,
}: AccountManagerCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  const handleCall = () => {
    // Track analytics
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('concierge_call_initiated', {
        managerId: manager.id,
      })
    }

    if (onCall) {
      onCall()
    } else {
      window.location.href = `tel:${manager.phone}`
    }
  }

  const handleEmail = () => {
    // Track analytics
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('concierge_email_initiated', {
        managerId: manager.id,
      })
    }

    if (onEmail) {
      onEmail()
    } else {
      window.location.href = `mailto:${manager.email}`
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Your Account Manager</CardTitle>
        <CardDescription>
          Personal support for your concierge subscription
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Manager Info */}
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={manager.photoUrl} alt={manager.name} />
            <AvatarFallback className="text-lg">
              {getInitials(manager.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{manager.name}</h3>
            <p className="text-sm text-muted-foreground">{manager.title}</p>
            {manager.rating && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{manager.rating}</span>
                <span className="text-xs text-muted-foreground">rating</span>
              </div>
            )}
          </div>
        </div>

        {/* Specialties */}
        {manager.specialties && manager.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {manager.specialties.map((specialty) => (
              <Badge key={specialty} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        )}

        {/* Availability */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{manager.availability}</span>
        </div>

        {/* Contact Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button className="w-full" onClick={handleCall}>
            <Phone className="mr-2 h-4 w-4" />
            Call
          </Button>
          <Button variant="outline" className="w-full" onClick={handleEmail}>
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
        </div>

        {onSchedule && (
          <Button variant="outline" className="w-full" onClick={onSchedule}>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule a Call
          </Button>
        )}

        {/* Contact Details */}
        <div className="pt-3 border-t space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Direct Line</span>
            <a href={`tel:${manager.phone}`} className="font-medium hover:underline">
              {manager.phone}
            </a>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Email</span>
            <a
              href={`mailto:${manager.email}`}
              className="font-medium hover:underline truncate ml-2"
            >
              {manager.email}
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
