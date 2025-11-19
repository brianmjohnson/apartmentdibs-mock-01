'use client'

import { useState } from 'react'
import { Search, Circle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface ThreadSummary {
  id: string
  participantName: string
  participantId: string
  participantType: 'agent' | 'applicant'
  lastMessage: string
  lastMessageAt: Date
  unreadCount: number
  listingAddress?: string
}

interface ThreadListProps {
  threads: ThreadSummary[]
  selectedThreadId?: string
  onSelectThread: (thread: ThreadSummary) => void
  className?: string
}

export function ThreadList({
  threads,
  selectedThreadId,
  onSelectThread,
  className,
}: ThreadListProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredThreads = threads.filter(
    (thread) =>
      thread.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.listingAddress?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h`
    if (days < 7) return `${days}d`
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

  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Search */}
      <div className="border-b p-4">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Thread List */}
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {filteredThreads.length === 0 ? (
            <p className="text-muted-foreground p-4 text-center text-sm">
              {searchTerm ? 'No conversations found' : 'No messages yet'}
            </p>
          ) : (
            filteredThreads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => onSelectThread(thread)}
                className={cn(
                  'hover:bg-muted/50 w-full p-4 text-left transition-colors',
                  selectedThreadId === thread.id && 'bg-muted'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{getInitials(thread.participantName)}</AvatarFallback>
                    </Avatar>
                    {thread.unreadCount > 0 && (
                      <Circle className="text-primary fill-primary absolute -top-0.5 -right-0.5 h-3 w-3" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          'truncate text-sm font-medium',
                          thread.unreadCount > 0 && 'font-semibold'
                        )}
                      >
                        {thread.participantName}
                      </span>
                      <span className="text-muted-foreground ml-2 flex-shrink-0 text-xs">
                        {formatTime(thread.lastMessageAt)}
                      </span>
                    </div>
                    {thread.listingAddress && (
                      <p className="text-muted-foreground truncate text-xs">
                        {thread.listingAddress}
                      </p>
                    )}
                    <p
                      className={cn(
                        'mt-0.5 truncate text-sm',
                        thread.unreadCount > 0
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground'
                      )}
                    >
                      {thread.lastMessage}
                    </p>
                    {thread.unreadCount > 0 && (
                      <Badge className="mt-1" variant="default">
                        {thread.unreadCount} new
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

// Compact thread list for sidebar
interface CompactThreadListProps {
  threads: ThreadSummary[]
  limit?: number
  onSelectThread: (thread: ThreadSummary) => void
  onViewAll: () => void
  className?: string
}

export function CompactThreadList({
  threads,
  limit = 5,
  onSelectThread,
  onViewAll,
  className,
}: CompactThreadListProps) {
  const displayThreads = threads.slice(0, limit)
  const totalUnread = threads.reduce((sum, t) => sum + t.unreadCount, 0)

  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Messages</h3>
        {totalUnread > 0 && <Badge variant="default">{totalUnread} unread</Badge>}
      </div>
      <div className="space-y-2">
        {displayThreads.map((thread) => (
          <button
            key={thread.id}
            onClick={() => onSelectThread(thread)}
            className="hover:bg-muted/50 w-full rounded-lg border p-3 text-left"
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {thread.participantName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{thread.participantName}</p>
                <p className="text-muted-foreground truncate text-xs">{thread.lastMessage}</p>
              </div>
              {thread.unreadCount > 0 && (
                <Badge variant="default" className="h-5 w-5 justify-center rounded-full p-0">
                  {thread.unreadCount}
                </Badge>
              )}
            </div>
          </button>
        ))}
      </div>
      {threads.length > limit && (
        <button
          onClick={onViewAll}
          className="text-primary mt-2 text-sm font-medium hover:underline"
        >
          View all {threads.length} conversations
        </button>
      )}
    </div>
  )
}
