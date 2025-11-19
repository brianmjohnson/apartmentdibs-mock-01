'use client'

import { Scale, ExternalLink, BookOpen, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface ComplianceRule {
  lawName: string
  lawCitation: string
  jurisdiction: string
  plainEnglishExplanation: string
  requirements: string[]
  penalties: string
  effectiveDate: string
  sourceUrl: string
  fullLawText?: string
}

interface ComplianceEducationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rule: ComplianceRule
}

export function ComplianceEducationModal({
  open,
  onOpenChange,
  rule,
}: ComplianceEducationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-foreground max-h-[90vh] max-w-2xl overflow-y-auto border-2">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Scale className="text-primary h-5 w-5" />
            <DialogTitle>{rule.lawName}</DialogTitle>
          </div>
          <DialogDescription>
            {rule.lawCitation} - Effective {rule.effectiveDate}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Jurisdiction */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Jurisdiction:</span>
            <span className="text-muted-foreground">{rule.jurisdiction}</span>
          </div>

          <Separator />

          {/* Plain English Explanation */}
          <div>
            <h4 className="mb-2 flex items-center gap-2 font-medium">
              <BookOpen className="text-primary h-4 w-4" />
              What This Means For You
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {rule.plainEnglishExplanation}
            </p>
          </div>

          <Separator />

          {/* Requirements */}
          <div>
            <h4 className="mb-2 font-medium">Key Requirements</h4>
            <ul className="space-y-2">
              {rule.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary shrink-0 font-bold">&#x2713;</span>
                  <span className="text-muted-foreground">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Penalties */}
          <div className="bg-destructive/10 border-destructive/20 rounded-md border p-3">
            <h4 className="text-destructive mb-1 flex items-center gap-2 font-medium">
              <AlertCircle className="h-4 w-4" />
              Non-Compliance Penalties
            </h4>
            <p className="text-muted-foreground text-sm">{rule.penalties}</p>
          </div>

          {/* Full Law Text (Expandable) */}
          {rule.fullLawText && (
            <Accordion type="single" collapsible>
              <AccordionItem value="full-text" className="border-foreground rounded-md border-2">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <span className="text-sm font-medium">View Full Law Text</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="bg-muted max-h-60 overflow-y-auto rounded p-4 font-mono text-xs whitespace-pre-wrap">
                    {rule.fullLawText}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="border-foreground border-2"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button className="border-foreground border-2" asChild>
            <a href={rule.sourceUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Official Source
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export type { ComplianceRule }
