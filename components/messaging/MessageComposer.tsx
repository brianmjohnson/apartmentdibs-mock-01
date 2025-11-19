'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { QuickReplies } from './QuickReplies'

interface Attachment {
  id: string
  file: File
  preview?: string
}

interface MessageComposerProps {
  onSend: (message: string, attachments: File[]) => Promise<void>
  onTyping?: (isTyping: boolean) => void
  placeholder?: string
  disabled?: boolean
  showQuickReplies?: boolean
  quickReplies?: string[]
  className?: string
}

export function MessageComposer({
  onSend,
  onTyping,
  placeholder = 'Type a message...',
  disabled = false,
  showQuickReplies = true,
  quickReplies = [
    'Still interested in this listing?',
    'Please submit your missing documents',
    'When would you like to schedule a showing?',
    'Thank you for your application!',
  ],
  className,
}: MessageComposerProps) {
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isSending, setIsSending] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Handle typing indicator
  useEffect(() => {
    if (onTyping && message.length > 0) {
      onTyping(true)

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false)
      }, 2000)
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [message, onTyping])

  const handleSend = async () => {
    if ((!message.trim() && attachments.length === 0) || isSending) return

    setIsSending(true)
    try {
      await onSend(
        message.trim(),
        attachments.map((a) => a.file)
      )
      setMessage('')
      setAttachments([])

      // Track analytics
      if (typeof window !== 'undefined' && window.posthog) {
        window.posthog.capture('message_sent', {
          hasAttachment: attachments.length > 0,
          attachmentCount: attachments.length,
        })
      }
    } finally {
      setIsSending(false)
      if (onTyping) onTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newAttachments: Attachment[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }))

    setAttachments([...attachments, ...newAttachments])

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id))
  }

  const handleQuickReply = (reply: string) => {
    setMessage(reply)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Quick Replies */}
      {showQuickReplies && quickReplies.length > 0 && (
        <QuickReplies replies={quickReplies} onSelect={handleQuickReply} />
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="bg-muted relative flex items-center gap-2 rounded-md p-2"
            >
              {attachment.preview ? (
                <img
                  src={attachment.preview}
                  alt={attachment.file.name}
                  className="h-10 w-10 rounded object-cover"
                />
              ) : (
                <div className="bg-background flex h-10 w-10 items-center justify-center rounded">
                  <span className="text-xs font-medium">
                    {attachment.file.name.split('.').pop()?.toUpperCase()}
                  </span>
                </div>
              )}
              <div className="max-w-[120px]">
                <p className="truncate text-xs font-medium">{attachment.file.name}</p>
                <p className="text-muted-foreground text-xs">
                  {formatFileSize(attachment.file.size)}
                </p>
              </div>
              <button
                onClick={() => removeAttachment(attachment.id)}
                className="text-muted-foreground hover:text-foreground bg-background absolute -top-1 -right-1 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Composer */}
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isSending}
            className="min-h-[80px] resize-none pr-10"
            rows={3}
          />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isSending}
            className="absolute right-2 bottom-2 h-8 w-8"
          >
            <Paperclip className="h-4 w-4" />
            <span className="sr-only">Attach file</span>
          </Button>
        </div>
        <Button
          onClick={handleSend}
          disabled={disabled || isSending || (!message.trim() && attachments.length === 0)}
          size="icon"
          className="h-10 w-10"
        >
          {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  )
}
