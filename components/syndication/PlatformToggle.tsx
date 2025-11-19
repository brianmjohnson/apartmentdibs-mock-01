'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

export interface SyndicationPlatform {
  id: string
  name: string
  enabled: boolean
  available: boolean
  unavailableReason?: string
  requiresAuth?: boolean
  isAuthenticated?: boolean
}

interface PlatformToggleProps {
  platform: SyndicationPlatform
  onToggle: (platformId: string, enabled: boolean) => void
  className?: string
}

export function PlatformToggle({ platform, onToggle, className }: PlatformToggleProps) {
  const isDisabled = !platform.available || (platform.requiresAuth && !platform.isAuthenticated)

  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-4 ${
        platform.enabled && !isDisabled ? 'border-primary/50 bg-primary/5' : ''
      } ${className}`}
    >
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Label htmlFor={`platform-${platform.id}`} className="font-medium">
              {platform.name}
            </Label>
            {platform.requiresAuth && !platform.isAuthenticated && (
              <Badge variant="secondary" className="text-xs">
                Requires Auth
              </Badge>
            )}
            {!platform.available && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="text-muted-foreground h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{platform.unavailableReason || 'Platform not available'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
      <Switch
        id={`platform-${platform.id}`}
        checked={platform.enabled}
        onCheckedChange={(checked) => onToggle(platform.id, checked)}
        disabled={isDisabled}
      />
    </div>
  )
}

// Platform selector list component
interface PlatformSelectorProps {
  platforms: SyndicationPlatform[]
  onToggle: (platformId: string, enabled: boolean) => void
  className?: string
}

export function PlatformSelector({ platforms, onToggle, className }: PlatformSelectorProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {platforms.map((platform) => (
        <PlatformToggle key={platform.id} platform={platform} onToggle={onToggle} />
      ))}
    </div>
  )
}

// Default platforms configuration
export const defaultPlatforms: SyndicationPlatform[] = [
  {
    id: 'zillow',
    name: 'Zillow Rental Manager',
    enabled: true,
    available: true,
    requiresAuth: true,
    isAuthenticated: true,
  },
  {
    id: 'apartments_com',
    name: 'Apartments.com',
    enabled: true,
    available: true,
    requiresAuth: true,
    isAuthenticated: true,
  },
  {
    id: 'craigslist',
    name: 'Craigslist',
    enabled: true,
    available: true,
    requiresAuth: false,
  },
  {
    id: 'facebook',
    name: 'Facebook Marketplace',
    enabled: true,
    available: true,
    requiresAuth: true,
    isAuthenticated: false,
  },
  {
    id: 'streeteasy',
    name: 'StreetEasy',
    enabled: false,
    available: false,
    unavailableReason: 'NYC listings only',
  },
  {
    id: 'google',
    name: 'Google Search (Schema.org)',
    enabled: true,
    available: true,
    requiresAuth: false,
  },
]
