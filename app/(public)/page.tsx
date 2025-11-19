'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Search,
  Shield,
  Clock,
  FileCheck,
  CheckCircle2,
  Users,
  Building2,
  TrendingUp,
  ArrowRight,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ListingCard } from '@/components/listings/listing-card'
import { mockListings } from '@/lib/mock-data/listings'

// Featured listings (first 6)
const featuredListings = mockListings.slice(0, 6)

export default function HomePage() {
  const [location, setLocation] = useState('')
  const [bedrooms, setBedrooms] = useState('')

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-background border-b-4 border-foreground">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.02)_25%,rgba(0,0,0,0.02)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.02)_75%)] bg-[length:4px_4px]" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Find Your Next Apartment—Fairly
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              The rental platform that protects tenants from bias and landlords from lawsuits
            </p>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto">
              <div className="flex-1">
                <Input
                  placeholder="Enter city, neighborhood, or ZIP"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-12 border-2 border-foreground text-base"
                />
              </div>
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger className="w-full md:w-40 h-12 border-2 border-foreground">
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent className="border-2 border-foreground">
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="1">1 Bedroom</SelectItem>
                  <SelectItem value="2">2 Bedrooms</SelectItem>
                  <SelectItem value="3">3+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>
              <Button size="lg" className="h-12 px-8 border-2 border-foreground" asChild>
                <Link href="/search">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose ApartmentDibs?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* For Tenants */}
            <Card className="border-2 border-foreground hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <CardHeader>
                <div className="h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center mb-4">
                  <FileCheck className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">For Tenants</CardTitle>
                <CardDescription className="text-base font-medium text-foreground">
                  Apply Once, Use Everywhere
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Create a portable screening report once. Apply to multiple listings without
                  repeated fees or redundant background checks.
                </p>
              </CardContent>
            </Card>

            {/* For Agents */}
            <Card className="border-2 border-foreground hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <CardHeader>
                <div className="h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">For Agents</CardTitle>
                <CardDescription className="text-base font-medium text-foreground">
                  Fill Units 50% Faster
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access pre-verified applicants from your CRM. Reduce time-to-lease with
                  streamlined workflows and automated screening.
                </p>
              </CardContent>
            </Card>

            {/* For Landlords */}
            <Card className="border-2 border-foreground hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <CardHeader>
                <div className="h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">For Landlords</CardTitle>
                <CardDescription className="text-base font-medium text-foreground">
                  Fair Housing, Guaranteed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Automated compliance with fair housing laws. Complete audit trails protect
                  you from discrimination lawsuits.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            How It Works
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Get started in minutes with our simple three-step process
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="h-16 w-16 bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Create Verified Profile</h3>
              <p className="text-muted-foreground">
                Complete your application once with income verification, background check, and
                rental history.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="h-16 w-16 bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Apply to Any Listing</h3>
              <p className="text-muted-foreground">
                One-tap applications to any property on the platform. No more filling out the
                same forms repeatedly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="h-16 w-16 bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Get Fair Evaluation</h3>
              <p className="text-muted-foreground">
                Landlords evaluate based on objective criteria only. No discrimination, just
                qualified applicants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16 md:py-24 bg-muted/30 border-y-4 border-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Featured Listings</h2>
              <p className="text-muted-foreground mt-2">
                Explore our latest available apartments
              </p>
            </div>
            <Button variant="outline" className="border-2 border-foreground" asChild>
              <Link href="/search">
                View All Listings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust/Social Proof Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Trusted by Thousands
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Stat 1 */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-8 w-8 text-primary" />
                <span className="text-4xl md:text-5xl font-bold">10K+</span>
              </div>
              <p className="text-muted-foreground font-medium">Verified Renters</p>
            </div>

            {/* Stat 2 */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-4xl md:text-5xl font-bold">500+</span>
              </div>
              <p className="text-muted-foreground font-medium">Partner Agents</p>
            </div>

            {/* Stat 3 */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                <span className="text-4xl md:text-5xl font-bold">21</span>
              </div>
              <p className="text-muted-foreground font-medium">Days Avg. Time to Lease</p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-16 max-w-2xl mx-auto text-center">
            <blockquote className="text-lg md:text-xl italic text-muted-foreground mb-4">
              &ldquo;ApartmentDibs made finding my apartment so much easier. I created my profile once
              and applied to 15 listings in one afternoon. No more filling out the same forms
              over and over!&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="h-10 w-10 bg-primary text-primary-foreground flex items-center justify-center font-bold">
                S
              </div>
              <div className="text-left">
                <p className="font-medium">Sarah M.</p>
                <p className="text-sm text-muted-foreground">Verified Renter, Brooklyn</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Started Today</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of renters and landlords who trust ApartmentDibs for fair, fast, and
            compliant rentals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="border-2 border-primary-foreground text-lg px-8"
              asChild
            >
              <Link href="/search">Find an Apartment</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary text-lg px-8"
              asChild
            >
              <Link href="/for-landlords">List Your Property</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
