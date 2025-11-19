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
      <DialogContent className="border-2 border-foreground max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
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
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              What This Means For You
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {rule.plainEnglishExplanation}
            </p>
          </div>

          <Separator />

          {/* Requirements */}
          <div>
            <h4 className="font-medium mb-2">Key Requirements</h4>
            <ul className="space-y-2">
              {rule.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary font-bold shrink-0">&#x2713;</span>
                  <span className="text-muted-foreground">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Penalties */}
          <div className="p-3 bg-destructive/10 rounded-md border border-destructive/20">
            <h4 className="font-medium mb-1 flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              Non-Compliance Penalties
            </h4>
            <p className="text-sm text-muted-foreground">{rule.penalties}</p>
          </div>

          {/* Full Law Text (Expandable) */}
          {rule.fullLawText && (
            <Accordion type="single" collapsible>
              <AccordionItem value="full-text" className="border-2 border-foreground rounded-md">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <span className="text-sm font-medium">View Full Law Text</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="bg-muted p-4 rounded text-xs font-mono whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {rule.fullLawText}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="border-2 border-foreground"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            className="border-2 border-foreground"
            asChild
          >
            <a href={rule.sourceUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Official Source
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export type { ComplianceRule }
