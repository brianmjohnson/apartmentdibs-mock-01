'use client'

import {
  HelpCircle,
  FileText,
  Video,
  MessageCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'

interface HelpResource {
  id: string
  type: 'article' | 'video' | 'faq'
  title: string
  description?: string
  url?: string
  duration?: string
}

interface HelpDrawerProps {
  stepId: string
  stepTitle: string
  resources: HelpResource[]
  faqs?: { question: string; answer: string }[]
  onContactSupport?: () => void
  trigger?: React.ReactNode
}

export function HelpDrawer({
  stepId,
  stepTitle,
  resources,
  faqs = [],
  onContactSupport,
  trigger,
}: HelpDrawerProps) {
  const handleResourceClick = (resource: HelpResource) => {
    // Track analytics
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('help_resource_clicked', {
        stepId,
        resourceId: resource.id,
        resourceType: resource.type,
      })
    }

    if (resource.url) {
      window.open(resource.url, '_blank')
    }
  }

  const getResourceIcon = (type: HelpResource['type']) => {
    switch (type) {
      case 'article':
        return <FileText className="h-4 w-4" />
      case 'video':
        return <Video className="h-4 w-4" />
      case 'faq':
        return <HelpCircle className="h-4 w-4" />
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Help: {stepTitle}</SheetTitle>
          <SheetDescription>
            Find answers and resources to complete this step
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Resources */}
          {resources.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-sm">Resources</h3>
              <div className="space-y-2">
                {resources.map((resource) => (
                  <button
                    key={resource.id}
                    onClick={() => handleResourceClick(resource)}
                    className="w-full flex items-start gap-3 rounded-lg border p-3 text-left hover:bg-muted/50 transition-colors"
                  >
                    <div className="mt-0.5 text-muted-foreground">
                      {getResourceIcon(resource.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{resource.title}</span>
                        {resource.url && (
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      {resource.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {resource.description}
                        </p>
                      )}
                      {resource.duration && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {resource.duration}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground mt-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {faqs.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Common Questions</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="space-y-1">
                      <p className="font-medium text-sm">{faq.question}</p>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Contact Support */}
          {onContactSupport && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Still need help?</h3>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onContactSupport}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
