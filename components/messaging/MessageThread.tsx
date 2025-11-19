'use client'

import { useEffect, useRef } from 'react'
import { CheckCheck, Check, FileText, ImageIcon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

export interface Message {
  id: string
  threadId: string
  senderId: string
  senderType: 'agent' | 'applicant'
  senderName: string
  content: string
  attachments?: MessageAttachment[]
  readAt?: Date
  createdAt: Date
}

export interface MessageAttachment {
  id: string
  type: 'image' | 'pdf' | 'document'
  name: string
  url: string
  size?: number
}

interface MessageThreadProps {
  messages: Message[]
  currentUserId: string
  currentUserType: 'agent' | 'applicant'
  isTyping?: boolean
  typingUserName?: string
  onMessageRead?: (messageId: string) => void
  className?: string
}

export function MessageThread({
  messages,
  currentUserId,
  currentUserType,
  isTyping = false,
  typingUserName,
  onMessageRead,
  className,
}: MessageThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Mark messages as read
  useEffect(() => {
    if (onMessageRead) {
      messages
        .filter((m) => m.senderId !== currentUserId && !m.readAt)
        .forEach((m) => onMessageRead(m.id))
    }
  }, [messages, currentUserId, onMessageRead])

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    }
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = []
  let currentDate = ''

  messages.forEach((message) => {
    const messageDate = formatDate(message.createdAt)
    if (messageDate !== currentDate) {
      currentDate = messageDate
      groupedMessages.push({ date: messageDate, messages: [message] })
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(message)
    }
  })

  return (
    <ScrollArea className={cn('h-[400px]', className)} ref={scrollRef}>
      <div className="space-y-4 p-4">
        {groupedMessages.map((group) => (
          <div key={group.date}>
            {/* Date separator */}
            <div className="flex items-center justify-center py-2">
              <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs">
                {group.date}
              </span>
            </div>

            {/* Messages */}
            <div className="space-y-3">
              {group.messages.map((message) => {
                const isOwnMessage = message.senderId === currentUserId
                return (
                  <div
                    key={message.id}
                    className={cn('flex gap-2', isOwnMessage ? 'justify-end' : 'justify-start')}
                  >
                    {!isOwnMessage && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(message.senderName)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'max-w-[70%] space-y-1',
                        isOwnMessage ? 'items-end' : 'items-start'
                      )}
                    >
                      {!isOwnMessage && (
                        <p className="text-muted-foreground text-xs">{message.senderName}</p>
                      )}
                      <div
                        className={cn(
                          'rounded-lg px-3 py-2',
                          isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment) => (
                              <a
                                key={attachment.id}
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                  'flex items-center gap-2 rounded p-2 text-xs',
                                  isOwnMessage
                                    ? 'bg-primary-foreground/10 hover:bg-primary-foreground/20'
                                    : 'bg-background hover:bg-background/80'
                                )}
                              >
                                {attachment.type === 'image' ? (
                                  <ImageIcon className="h-4 w-4" />
                                ) : (
                                  <FileText className="h-4 w-4" />
                                )}
                                <span className="truncate">{attachment.name}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                      <div
                        className={cn(
                          'flex items-center gap-1 text-xs',
                          isOwnMessage ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <span className="text-muted-foreground">
                          {formatTime(message.createdAt)}
                        </span>
                        {isOwnMessage &&
                          (message.readAt ? (
                            <CheckCheck className="h-3 w-3 text-blue-500" />
                          ) : (
                            <Check className="text-muted-foreground h-3 w-3" />
                          ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {typingUserName ? getInitials(typingUserName) : '...'}
              </AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-lg px-3 py-2">
              <div className="flex gap-1">
                <span className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]" />
                <span className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]" />
                <span className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full" />
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
