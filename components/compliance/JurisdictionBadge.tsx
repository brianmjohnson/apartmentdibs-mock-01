'use client'

import { MapPin, Shield, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface JurisdictionRule {
  name: string
  type: string
}

interface JurisdictionBadgeProps {
  city: string
  county?: string
  state: string
  activeRules: JurisdictionRule[]
  showDetails?: boolean
  className?: string
}

export function JurisdictionBadge({
  city,
  county,
  state,
  activeRules,
  showDetails = false,
  className,
}: JurisdictionBadgeProps) {
  const jurisdictionLabel = county ? `${city}, ${county}, ${state}` : `${city}, ${state}`

  const content = (
    <Badge
      variant="outline"
      className={`border-primary bg-primary/5 cursor-pointer border-2 ${className || ''}`}
    >
      <MapPin className="mr-1 h-3 w-3" />
      {jurisdictionLabel}
      <Shield className="text-primary ml-1 h-3 w-3" />
      <span className="ml-1 text-xs">
        {activeRules.length} rule{activeRules.length !== 1 ? 's' : ''}
      </span>
    </Badge>
  )

  if (!showDetails) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent>
            <p>{activeRules.length} compliance rules active for this jurisdiction</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{content}</PopoverTrigger>
      <PopoverContent className="border-foreground w-80 border-2">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="text-primary h-4 w-4" />
            <h4 className="font-medium">Active Compliance Rules</h4>
          </div>

          <p className="text-muted-foreground text-sm">
            The following fair housing laws apply to listings in {jurisdictionLabel}:
          </p>

          <ul className="space-y-2">
            {activeRules.map((rule, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Info className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-medium">{rule.name}</p>
                  <p className="text-muted-foreground text-xs">{rule.type}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="text-muted-foreground border-border border-t pt-2 text-xs">
            All screening criteria will be automatically validated against these rules.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
