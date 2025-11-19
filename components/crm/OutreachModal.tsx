'use client'

import { useState } from 'react'
import { Send, Mail, MessageSquare, Smartphone } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { CRMLead } from './LeadCard'

interface OutreachModalProps {
  open: boolean
  onClose: () => void
  leads: CRMLead[]
  listingAddress: string
  onSendOutreach: (leads: CRMLead[], channels: string[], customMessage?: string) => Promise<void>
}

export function OutreachModal({
  open,
  onClose,
  leads,
  listingAddress,
  onSendOutreach,
}: OutreachModalProps) {
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['email', 'sms', 'push'])
  const [customMessage, setCustomMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [messageTab, setMessageTab] = useState('default')

  const toggleChannel = (channel: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    )
  }

  const handleSend = async () => {
    if (selectedChannels.length === 0) return

    setIsSending(true)
    try {
      await onSendOutreach(
        leads,
        selectedChannels,
        messageTab === 'custom' ? customMessage : undefined
      )

      // Track analytics
      if (typeof window !== 'undefined' && window.posthog) {
        window.posthog.capture('crm_outreach_sent', {
          leadCount: leads.length,
          channels: selectedChannels,
          customMessage: messageTab === 'custom',
        })
      }

      onClose()
    } catch {
      // Error handling would go here
    } finally {
      setIsSending(false)
    }
  }

  const defaultMessage = `Hi {name}, a new ${listingAddress.includes('1BR') ? '1BR' : '2BR'} in ${listingAddress.split(',')[0]} matches your preferences. Apply with your existing profile?`

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Contact {leads.length} Matched Lead{leads.length !== 1 ? 's' : ''}
          </DialogTitle>
          <DialogDescription>Send personalized outreach for {listingAddress}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Channel Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Notification Channels</Label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => toggleChannel('email')}
                className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors ${
                  selectedChannels.includes('email')
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Mail
                  className={`h-5 w-5 ${selectedChannels.includes('email') ? 'text-primary' : 'text-muted-foreground'}`}
                />
                <span className="text-xs font-medium">Email</span>
              </button>
              <button
                onClick={() => toggleChannel('sms')}
                className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors ${
                  selectedChannels.includes('sms')
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Smartphone
                  className={`h-5 w-5 ${selectedChannels.includes('sms') ? 'text-primary' : 'text-muted-foreground'}`}
                />
                <span className="text-xs font-medium">SMS</span>
              </button>
              <button
                onClick={() => toggleChannel('push')}
                className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors ${
                  selectedChannels.includes('push')
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <MessageSquare
                  className={`h-5 w-5 ${selectedChannels.includes('push') ? 'text-primary' : 'text-muted-foreground'}`}
                />
                <span className="text-xs font-medium">Push</span>
              </button>
            </div>
          </div>

          {/* Message Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Message</Label>
            <Tabs value={messageTab} onValueChange={setMessageTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="default">Default</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>
              <TabsContent value="default" className="mt-3">
                <div className="bg-muted rounded-md p-3">
                  <p className="text-sm">{defaultMessage}</p>
                  <p className="text-muted-foreground mt-2 text-xs">
                    Message will be personalized with each lead&apos;s name
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="custom" className="mt-3">
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Enter your custom message. Use {name} to personalize."
                  className="min-h-[100px]"
                />
                <p className="text-muted-foreground mt-2 text-xs">
                  Use {'{name}'} to personalize the message for each lead
                </p>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview */}
          <div className="bg-muted/50 rounded-md p-3">
            <p className="text-muted-foreground text-xs font-medium">Preview for first lead:</p>
            <p className="mt-1 text-sm">
              {(messageTab === 'custom' && customMessage ? customMessage : defaultMessage).replace(
                '{name}',
                'Maya'
              )}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={selectedChannels.length === 0 || isSending}>
            {isSending ? (
              'Sending...'
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send to {leads.length} Lead{leads.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
