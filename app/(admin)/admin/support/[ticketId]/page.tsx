'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Send,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  Mail,
  Clock,
  Lock,
  ExternalLink,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  mockSupportTickets,
  mockTicketMessages,
  mockAdminTeam,
  getTicketPriorityColor,
  getTicketStatusColor,
  formatDateTime,
} from '@/lib/mock-data/admin'

export default function TicketDetailsPage() {
  const params = useParams()
  const ticketId = params.ticketId as string
  const [replyMessage, setReplyMessage] = useState('')
  const [isInternalNote, setIsInternalNote] = useState(false)

  const ticket = mockSupportTickets.find((t) => t.id === ticketId)
  const messages = mockTicketMessages.filter((m) => m.ticketId === ticketId)

  if (!ticket) {
    return (
      <div className="space-y-6">
        <Link href="/admin/support">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Support Queue
          </Button>
        </Link>
        <Card className="border-2 border-foreground">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Ticket not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link href="/admin/support">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Support Queue
        </Button>
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Header */}
          <Card className="border-2 border-foreground">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">{ticket.subject}</CardTitle>
                  <CardDescription className="mt-2">
                    {ticket.id} - Created {formatDateTime(ticket.createdAt)}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className={`border ${getTicketPriorityColor(ticket.priority)}`}
                  >
                    {ticket.priority}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`border ${getTicketStatusColor(ticket.status)}`}
                  >
                    {ticket.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 border-2 border-border bg-muted/20 rounded-md">
                <p className="text-sm">{ticket.description}</p>
              </div>
              {ticket.attachments && ticket.attachments.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Attachments</p>
                  <div className="flex flex-wrap gap-2">
                    {ticket.attachments.map((attachment, index) => (
                      <Badge key={index} variant="outline" className="border">
                        {attachment}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conversation Thread */}
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
              <CardDescription>Messages between user and support</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 border-2 ${
                      message.isInternal
                        ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20'
                        : message.sender === 'support'
                        ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{message.senderName}</p>
                        {message.isInternal && (
                          <Badge variant="outline" className="border-yellow-400 text-yellow-700 text-xs">
                            <Lock className="h-3 w-3 mr-1" />
                            Internal
                          </Badge>
                        )}
                        {message.sender === 'support' && !message.isInternal && (
                          <Badge variant="outline" className="border-blue-300 text-blue-700 text-xs">
                            Support
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(message.timestamp)}
                      </p>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No messages in this conversation yet
                </p>
              )}

              {/* Reply Form */}
              <Separator className="my-4" />
              <div className="space-y-4">
                <Textarea
                  placeholder="Type your reply..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="border-2"
                  rows={4}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="internal"
                      checked={isInternalNote}
                      onCheckedChange={(checked) => setIsInternalNote(checked as boolean)}
                    />
                    <Label htmlFor="internal" className="text-sm">
                      Internal note (not visible to user)
                    </Label>
                  </div>
                  <Button className="border-2 border-foreground">
                    <Send className="mr-2 h-4 w-4" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Info */}
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle className="text-sm">User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">{ticket.userName}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <Mail className="h-3 w-3" />
                  {ticket.userEmail}
                </div>
              </div>
              <Link href={`/admin/users/${ticket.userId}`}>
                <Button variant="outline" size="sm" className="w-full border-2">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View User Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm">Assign to</Label>
                <Select defaultValue={ticket.assignedTo || undefined}>
                  <SelectTrigger className="border-2 mt-1">
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAdminTeam
                      .filter((m) => m.status === 'active')
                      .map((member) => (
                        <SelectItem key={member.id} value={member.name}>
                          {member.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Status</Label>
                <Select defaultValue={ticket.status}>
                  <SelectTrigger className="border-2 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Priority</Label>
                <Select defaultValue={ticket.priority}>
                  <SelectTrigger className="border-2 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <Button variant="outline" className="w-full border-2 text-yellow-600">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Escalate
              </Button>
              <Button variant="outline" className="w-full border-2 text-green-600">
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Resolved
              </Button>
            </CardContent>
          </Card>

          {/* Ticket Details */}
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span>{ticket.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{formatDateTime(ticket.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span>{formatDateTime(ticket.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
