'use client'

import { useState } from 'react'
import { MessageSquare, Send, Search, User, Building, Circle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

// Mock conversations
const mockConversations = [
  {
    id: 'conv-001',
    type: 'applicant',
    name: 'Applicant #2847',
    propertyAddress: '123 Main St, Unit 4B',
    lastMessage: 'Thank you for the update. I look forward to hearing back.',
    lastMessageTime: '2025-11-19T10:30:00Z',
    unreadCount: 2,
    messages: [
      {
        id: 'm1',
        sender: 'agent',
        content:
          'Thank you for your application! We have received your documents and are currently reviewing them.',
        timestamp: '2025-11-18T09:00:00Z',
      },
      {
        id: 'm2',
        sender: 'applicant',
        content: 'Thank you! Please let me know if you need any additional information from me.',
        timestamp: '2025-11-18T10:30:00Z',
      },
      {
        id: 'm3',
        sender: 'agent',
        content: 'Could you please provide an additional pay stub from your current employer?',
        timestamp: '2025-11-18T14:00:00Z',
      },
      {
        id: 'm4',
        sender: 'applicant',
        content: 'Of course! I have attached my latest pay stub to this message.',
        timestamp: '2025-11-19T08:00:00Z',
      },
      {
        id: 'm5',
        sender: 'applicant',
        content: 'Thank you for the update. I look forward to hearing back.',
        timestamp: '2025-11-19T10:30:00Z',
      },
    ],
  },
  {
    id: 'conv-002',
    type: 'applicant',
    name: 'Applicant #2934',
    propertyAddress: '456 Bedford Ave, PH2',
    lastMessage: 'Yes, 2 PM works perfectly for me. See you then!',
    lastMessageTime: '2025-11-18T16:00:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'm1',
        sender: 'agent',
        content:
          'Hi! Your application for 456 Bedford Ave has been shortlisted. Would you like to schedule a second viewing?',
        timestamp: '2025-11-17T11:00:00Z',
      },
      {
        id: 'm2',
        sender: 'applicant',
        content:
          "That's great news! Yes, I would love to see the apartment again. I'd like to bring my partner this time.",
        timestamp: '2025-11-17T13:00:00Z',
      },
      {
        id: 'm3',
        sender: 'agent',
        content: 'Perfect! How does November 20th at 2 PM work for you both?',
        timestamp: '2025-11-18T09:00:00Z',
      },
      {
        id: 'm4',
        sender: 'applicant',
        content: 'Yes, 2 PM works perfectly for me. See you then!',
        timestamp: '2025-11-18T16:00:00Z',
      },
    ],
  },
  {
    id: 'conv-003',
    type: 'landlord',
    name: 'Michael Chen',
    propertyAddress: '789 Park Place',
    lastMessage: 'I approve Applicant #2812 for the lease. Please proceed.',
    lastMessageTime: '2025-11-17T14:00:00Z',
    unreadCount: 1,
    messages: [
      {
        id: 'm1',
        sender: 'agent',
        content:
          'Hi Michael, I have 3 shortlisted applicants for 789 Park Place. The top candidate is Applicant #2812 with a 3.5x income ratio and 680-700 credit band.',
        timestamp: '2025-11-16T10:00:00Z',
      },
      {
        id: 'm2',
        sender: 'landlord',
        content: 'Thanks Jessica. What about their rental history?',
        timestamp: '2025-11-16T11:30:00Z',
      },
      {
        id: 'm3',
        sender: 'agent',
        content:
          'They have 5+ years of rental history with no evictions. Previous landlord provided excellent references.',
        timestamp: '2025-11-16T12:00:00Z',
      },
      {
        id: 'm4',
        sender: 'landlord',
        content: 'I approve Applicant #2812 for the lease. Please proceed.',
        timestamp: '2025-11-17T14:00:00Z',
      },
    ],
  },
  {
    id: 'conv-004',
    type: 'applicant',
    name: 'Applicant #2903',
    propertyAddress: '123 Main St, Unit 4B',
    lastMessage: 'I can offer 2 months rent upfront if that helps my application.',
    lastMessageTime: '2025-11-16T09:00:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'm1',
        sender: 'applicant',
        content:
          'Hello, I submitted my application yesterday. I wanted to mention that I am very interested in this unit.',
        timestamp: '2025-11-15T14:00:00Z',
      },
      {
        id: 'm2',
        sender: 'agent',
        content:
          'Thank you for your interest! Your application is currently being reviewed. We have received multiple applications for this unit.',
        timestamp: '2025-11-15T16:00:00Z',
      },
      {
        id: 'm3',
        sender: 'applicant',
        content: 'I can offer 2 months rent upfront if that helps my application.',
        timestamp: '2025-11-16T09:00:00Z',
      },
    ],
  },
  {
    id: 'conv-005',
    type: 'landlord',
    name: 'Sarah Williams',
    propertyAddress: '321 Atlantic Ave',
    lastMessage: 'When can we expect more applications?',
    lastMessageTime: '2025-11-15T11:00:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'm1',
        sender: 'landlord',
        content: 'Hi Jessica, how is the listing performing so far?',
        timestamp: '2025-11-14T10:00:00Z',
      },
      {
        id: 'm2',
        sender: 'agent',
        content:
          'Hi Sarah! The listing has received 189 views and 5 applications in the first week. Engagement is strong.',
        timestamp: '2025-11-14T11:00:00Z',
      },
      {
        id: 'm3',
        sender: 'landlord',
        content: 'When can we expect more applications?',
        timestamp: '2025-11-15T11:00:00Z',
      },
    ],
  },
]

const formatMessageTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredConversations = mockConversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalUnread = mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">
          {totalUnread} unread message(s) across {mockConversations.length} conversations
        </p>
      </div>

      {/* Messages Layout */}
      <div className="grid h-[600px] gap-4 lg:grid-cols-3">
        {/* Conversation List */}
        <Card className="border-foreground flex flex-col border-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-2 pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full">
              <div className="divide-y">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`hover:bg-muted/50 w-full p-4 text-left transition-colors ${
                      selectedConversation.id === conversation.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 shrink-0">
                        {conversation.type === 'applicant' ? (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                            <Building className="h-4 w-4 text-purple-600" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="truncate text-sm font-medium">{conversation.name}</p>
                          <span className="text-muted-foreground shrink-0 text-xs">
                            {formatMessageTime(conversation.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-0.5 truncate text-xs">
                          {conversation.propertyAddress}
                        </p>
                        <p className="text-muted-foreground mt-1 truncate text-sm">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <Badge className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full p-0">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat View */}
        <Card className="border-foreground flex flex-col border-2 lg:col-span-2">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-foreground border-b-2 pb-4">
                <div className="flex items-center gap-3">
                  {selectedConversation.type === 'applicant' ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                      <Building className="h-5 w-5 text-purple-600" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">{selectedConversation.name}</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {selectedConversation.propertyAddress}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`ml-auto ${
                      selectedConversation.type === 'applicant'
                        ? 'border-blue-300 bg-blue-100 text-blue-800'
                        : 'border-purple-300 bg-purple-100 text-purple-800'
                    }`}
                  >
                    {selectedConversation.type === 'applicant' ? 'Applicant' : 'Landlord'}
                  </Badge>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-hidden p-4">
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === 'agent'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`mt-1 text-xs ${
                              message.sender === 'agent'
                                ? 'text-primary-foreground/70'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              <div className="border-foreground border-t-2 p-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="max-h-[120px] min-h-[60px] resize-none border-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        // Send message logic would go here
                        setNewMessage('')
                      }
                    }}
                  />
                  <Button
                    className="border-foreground h-auto border-2"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-muted-foreground mt-2 text-xs">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </>
          ) : (
            <div className="text-muted-foreground flex flex-1 items-center justify-center">
              <div className="text-center">
                <MessageSquare className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
