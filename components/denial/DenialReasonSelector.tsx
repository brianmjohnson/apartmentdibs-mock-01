'use client'

import { useState } from 'react'
import { AlertCircle, Check, X, Info } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface DenialReason {
  value: string
  label: string
  description: string
  requiresCreditBureau: boolean
  disabled?: boolean
  disabledReason?: string
}

const denialReasons: DenialReason[] = [
  {
    value: 'higher_income_ratio',
    label: 'Another applicant had higher income-to-rent ratio',
    description: 'Selected applicant demonstrated higher qualified income relative to rent amount',
    requiresCreditBureau: false,
  },
  {
    value: 'higher_credit_score',
    label: 'Another applicant had higher credit score',
    description: 'Selected applicant had better credit history and score',
    requiresCreditBureau: true,
  },
  {
    value: 'longer_lease_term',
    label: 'Another applicant offered longer lease term',
    description: 'Selected applicant committed to a longer rental period',
    requiresCreditBureau: false,
  },
  {
    value: 'income_below_threshold',
    label: 'Applicant&apos;s income-to-rent ratio below my threshold',
    description: 'Applicant did not meet minimum income requirements (typically 40x rent)',
    requiresCreditBureau: false,
  },
  {
    value: 'credit_below_threshold',
    label: 'Applicant&apos;s credit score below my threshold',
    description: 'Applicant credit score did not meet minimum requirement',
    requiresCreditBureau: true,
  },
  {
    value: 'eviction_history',
    label: 'Applicant had eviction history within my restriction period',
    description: 'Applicant had previous evictions within stated timeframe',
    requiresCreditBureau: false,
  },
  // Disabled options that create liability
  {
    value: 'personal_preference',
    label: 'Personal preference',
    description: '',
    requiresCreditBureau: false,
    disabled: true,
    disabledReason: 'This reason may violate Fair Housing laws and creates legal liability',
  },
  {
    value: 'seemed_nervous',
    label: 'Applicant seemed nervous during showing',
    description: '',
    requiresCreditBureau: false,
    disabled: true,
    disabledReason: 'Subjective observations cannot be used as denial reasons under FCRA',
  },
]

interface DenialReasonSelectorProps {
  value: string
  onChange: (value: string) => void
  validationError?: string
  className?: string
}

export function DenialReasonSelector({
  value,
  onChange,
  validationError,
  className,
}: DenialReasonSelectorProps) {
  const [showInfo, setShowInfo] = useState(false)
  const selectedReason = denialReasons.find((r) => r.value === value)

  const handleChange = (newValue: string) => {
    onChange(newValue)

    // Track analytics
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('denial_reason_selected', {
        reason: newValue,
      })
    }
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        <Label htmlFor="denial-reason" className="font-medium">
          Denial Reason <span className="text-destructive">*</span>
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setShowInfo(!showInfo)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="More information about denial reasons"
              >
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>
                FCRA requires you to provide a specific, factual reason for denying an applicant.
                Only pre-approved compliance-safe options are available.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger
          id="denial-reason"
          className={`border-2 ${validationError ? 'border-destructive' : 'border-foreground'}`}
        >
          <SelectValue placeholder="Select a denial reason" />
        </SelectTrigger>
        <SelectContent className="border-2 border-foreground max-h-80">
          {denialReasons.map((reason) => (
            <SelectItem
              key={reason.value}
              value={reason.value}
              disabled={reason.disabled}
              className={reason.disabled ? 'text-muted-foreground' : ''}
            >
              <div className="flex items-center gap-2">
                {reason.disabled ? (
                  <X className="h-4 w-4 text-destructive shrink-0" />
                ) : (
                  <Check className="h-4 w-4 text-primary shrink-0 opacity-0" />
                )}
                <span>{reason.label}</span>
                {reason.disabled && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{reason.disabledReason}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {validationError && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Validation Error</AlertTitle>
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}

      {selectedReason && !selectedReason.disabled && (
        <div className="mt-3 p-3 bg-muted rounded-md border border-border">
          <p className="text-sm text-muted-foreground">{selectedReason.description}</p>
          {selectedReason.requiresCreditBureau && (
            <p className="text-xs text-primary mt-2 font-medium">
              Credit bureau information will be included in the adverse action letter
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export { denialReasons }
export type { DenialReason }
