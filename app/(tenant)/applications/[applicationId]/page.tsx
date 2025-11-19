'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Clock,
  CheckCircle2,
  Circle,
  AlertTriangle,
  PartyPopper,
  Send,
  Calendar
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  getApplicationDetail,
  getStatusColor,
  getStatusLabel,
  formatDate,
  formatRelativeTime
} from '@/lib/mock-data/tenant'
import { formatPrice } from '@/lib/mock-data/listings'

export default function ApplicationDetailPage() {
  const params = useParams()
  const applicationId = params.applicationId as string
  const [message, setMessage] = useState('')

  const application = getApplicationDetail(applicationId)

  if (!application) {
    return (
      <div className="space-y-6">
        <Link
          href="/applications"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Applications
        </Link>
        <Card className="border-2 border-foreground">
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Application not found</h3>
            <p className="text-muted-foreground">
              The application you&apos;re looking for doesn&apos;t exist.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      // Mock send message
      setMessage('')
      // In real app, would send message via API
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/applications"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Applications
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-2xl font-bold">
            {application.address}
            {application.unit && `, ${application.unit}`}
          </h1>
        </div>
        <Badge className={`${getStatusColor(application.status)} border text-sm px-3 py-1`}>
          {getStatusLabel(application.status)}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Info Card */}
          <Card className="border-2 border-foreground overflow-hidden">
            <div className="relative aspect-video">
              <Image
                src={application.propertyImage}
                alt={application.address}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <span className="text-2xl font-bold">
                  {formatPrice(application.rent)}/mo
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Bed className="h-4 w-4" /> {application.beds} bed
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Bath className="h-4 w-4" /> {application.baths} bath
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Square className="h-4 w-4" /> {application.sqft} sqft
                </span>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <p className="font-medium">{application.landlordName}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {application.landlordResponseTime}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Status-specific Content */}
          {application.status === 'approved' && (
            <Card className="border-2 border-green-500 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <PartyPopper className="h-5 w-5" />
                  Congratulations!
                </CardTitle>
                <CardDescription className="text-green-700">
                  Your application has been approved
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Next Steps:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Review the lease agreement</li>
                    <li>Schedule a move-in inspection</li>
                    <li>Prepare security deposit and first month&apos;s rent</li>
                  </ul>
                </div>
                <Button className="border-2 border-foreground">
                  Sign Lease Agreement
                </Button>
              </CardContent>
            </Card>
          )}

          {application.status === 'denied' && application.denialReason && (
            <Card className="border-2 border-red-500 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Application Not Approved
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-red-800">Reason:</h4>
                  <p className="text-sm text-red-700">{application.denialReason}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  If you believe this decision was made in error or would like more information,
                  you may contact the landlord or request a copy of any consumer report used in this decision.
                </p>
                <Button variant="outline" asChild className="border-2 border-foreground">
                  <Link href="/search">Search Other Listings</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {(application.status === 'under_review' || application.status === 'submitted') && application.decisionDate && (
            <Card className="border-2 border-yellow-500 bg-yellow-50">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-yellow-700" />
                  <p className="text-yellow-800">
                    <span className="font-medium">Expected decision by:</span>{' '}
                    {formatDate(application.decisionDate)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Communication Section */}
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>
                Communication with the property agent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {application.messages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No messages yet. Send a message to the agent below.
                </p>
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {application.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        msg.sender === 'tenant' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <Avatar className="h-8 w-8 border-2 border-foreground">
                        <AvatarFallback className="text-xs">
                          {msg.senderName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`flex-1 max-w-[80%] ${
                          msg.sender === 'tenant' ? 'text-right' : ''
                        }`}
                      >
                        <div
                          className={`inline-block p-3 rounded-lg ${
                            msg.sender === 'tenant'
                              ? 'bg-foreground text-background'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {msg.senderName} - {formatRelativeTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              {/* Message Input */}
              <div className="space-y-3">
                <Textarea
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border-2 border-foreground resize-none"
                  rows={3}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="border-2 border-foreground"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Timeline */}
        <div className="space-y-6">
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
              <CardDescription>
                Track your application progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {application.timeline.map((step, index) => (
                  <div key={step.step} className="flex gap-4 pb-6 last:pb-0">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                      ) : step.status === 'current' ? (
                        <div className="h-6 w-6 rounded-full border-4 border-foreground bg-background flex-shrink-0" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                      )}
                      {index < application.timeline.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 mt-2 ${
                            step.status === 'completed'
                              ? 'bg-green-600'
                              : 'bg-muted'
                          }`}
                        />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 pb-2">
                      <p
                        className={`font-medium ${
                          step.status === 'upcoming'
                            ? 'text-muted-foreground'
                            : ''
                        }`}
                      >
                        {step.step}
                      </p>
                      {step.date && (
                        <p className="text-sm text-muted-foreground">
                          {formatDate(step.date)}
                        </p>
                      )}
                      {step.status === 'current' && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full border-2 border-foreground" asChild>
                <Link href={`/search/${application.listingId}`}>
                  View Listing
                </Link>
              </Button>
              {application.status !== 'denied' && application.status !== 'withdrawn' && (
                <Button variant="outline" className="w-full border-2 border-foreground text-red-600 hover:text-red-700">
                  Withdraw Application
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
