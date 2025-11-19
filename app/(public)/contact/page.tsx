'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  Twitter,
  Linkedin,
  Facebook,
  HelpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

// Contact subjects
const contactSubjects = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'support', label: 'Technical Support' },
  { value: 'sales', label: 'Sales & Pricing' },
  { value: 'partnerships', label: 'Partnerships' },
  { value: 'press', label: 'Press & Media' },
]

// Social links
const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/apartmentdibs' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/apartmentdibs' },
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/apartmentdibs' },
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubjectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
    toast.success('Message sent successfully!', {
      description: "We'll get back to you within 24 hours.",
    })

    // Reset form after showing success
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
      setIsSubmitted(false)
    }, 3000)
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-background border-b-4 border-foreground">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.02)_25%,rgba(0,0,0,0.02)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.02)_75%)] bg-[length:4px_4px]" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Have a question or feedback? We&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                <Card className="border-2 border-foreground">
                  <CardContent className="p-6">
                    {isSubmitted ? (
                      <div className="text-center py-12">
                        <div className="h-16 w-16 bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                        <p className="text-muted-foreground">
                          Thank you for reaching out. We&apos;ll respond within 24 hours.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">
                            Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="border-2 border-foreground"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">
                            Email <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="border-2 border-foreground"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone (optional)</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="border-2 border-foreground"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject">
                            Subject <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={formData.subject}
                            onValueChange={handleSubjectChange}
                            required
                          >
                            <SelectTrigger className="border-2 border-foreground">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent className="border-2 border-foreground">
                              {contactSubjects.map((subject) => (
                                <SelectItem key={subject.value} value={subject.value}>
                                  {subject.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">
                            Message <span className="text-destructive">*</span>
                          </Label>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder="How can we help you?"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            rows={5}
                            className="border-2 border-foreground resize-none"
                          />
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          className="w-full border-2 border-foreground"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-5 w-5" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  {/* Info Cards */}
                  <Card className="border-2 border-foreground hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                          <Mail className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold mb-1">Email</h3>
                          <a
                            href="mailto:support@apartmentdibs.com"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            support@apartmentdibs.com
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-foreground hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                          <Phone className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold mb-1">Phone</h3>
                          <a
                            href="tel:+15551234567"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            (555) 123-4567
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-foreground hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                          <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold mb-1">Address</h3>
                          <p className="text-muted-foreground">
                            123 Tech Way<br />
                            San Francisco, CA 94102
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-foreground hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                          <Clock className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold mb-1">Business Hours</h3>
                          <p className="text-muted-foreground">
                            Monday - Friday<br />
                            9:00 AM - 6:00 PM PST
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Map Placeholder */}
                  <div className="border-2 border-foreground bg-muted h-48 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="h-8 w-8 mx-auto mb-2" />
                      <p>Map will be displayed here</p>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h3 className="font-bold mb-3">Follow Us</h3>
                    <div className="flex gap-3">
                      {socialLinks.map((social) => {
                        const Icon = social.icon
                        return (
                          <a
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-10 w-10 bg-muted border-2 border-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                            aria-label={social.name}
                          >
                            <Icon className="h-5 w-5" />
                          </a>
                        )
                      })}
                    </div>
                  </div>

                  {/* FAQ Link */}
                  <div className="p-4 bg-muted border-2 border-foreground">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-primary shrink-0" />
                      <p className="text-sm">
                        Looking for quick answers?{' '}
                        <Link href="/faq" className="text-primary font-medium hover:underline">
                          Check our FAQ
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
