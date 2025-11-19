'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Search,
  Shield,
  Clock,
  FileCheck,
  Users,
  Building2,
  TrendingUp,
  ArrowRight,
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
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ListingCard } from '@/components/listings/listing-card'
import { mockListings } from '@/lib/mock-data/listings'

// Featured listings (first 6)
const featuredListings = mockListings.slice(0, 6)

export default function HomePage() {
  const [location, setLocation] = useState('')
  const [bedrooms, setBedrooms] = useState('')

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-background border-foreground relative border-b-4">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.02)_25%,rgba(0,0,0,0.02)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.02)_75%)] bg-[length:4px_4px]" />
          <div className="relative container mx-auto px-4 py-20 md:py-32">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
                Find Your Next Apartment—Fairly
              </h1>
              <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-xl md:text-2xl">
                The rental platform that protects tenants from bias and landlords from lawsuits
              </p>

              {/* Search Bar */}
              <div className="mx-auto flex max-w-2xl flex-col gap-3 md:flex-row">
                <div className="flex-1">
                  <Input
                    placeholder="Enter city, neighborhood, or ZIP"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border-foreground h-12 border-2 text-base"
                  />
                </div>
                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger className="border-foreground h-12 w-full border-2 md:w-40">
                    <SelectValue placeholder="Bedrooms" />
                  </SelectTrigger>
                  <SelectContent className="border-foreground border-2">
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="1">1 Bedroom</SelectItem>
                    <SelectItem value="2">2 Bedrooms</SelectItem>
                    <SelectItem value="3">3+ Bedrooms</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="lg" className="border-foreground h-12 border-2 px-8" asChild>
                  <Link href="/search">
                    <Search className="mr-2 h-5 w-5" />
                    Search
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Value Props Section */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              Why Choose ApartmentDibs?
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* For Tenants */}
              <Card className="border-foreground border-2 transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader>
                  <div className="bg-primary text-primary-foreground mb-4 flex h-12 w-12 items-center justify-center">
                    <FileCheck className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">For Tenants</CardTitle>
                  <CardDescription className="text-foreground text-base font-medium">
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
              <Card className="border-foreground border-2 transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader>
                  <div className="bg-primary text-primary-foreground mb-4 flex h-12 w-12 items-center justify-center">
                    <Clock className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">For Agents</CardTitle>
                  <CardDescription className="text-foreground text-base font-medium">
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
              <Card className="border-foreground border-2 transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader>
                  <div className="bg-primary text-primary-foreground mb-4 flex h-12 w-12 items-center justify-center">
                    <Shield className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">For Landlords</CardTitle>
                  <CardDescription className="text-foreground text-base font-medium">
                    Fair Housing, Guaranteed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Automated compliance with fair housing laws. Complete audit trails protect you
                    from discrimination lawsuits.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">How It Works</h2>
            <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-center">
              Get started in minutes with our simple three-step process
            </p>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="text-center">
                <div className="bg-primary text-primary-foreground mx-auto mb-4 flex h-16 w-16 items-center justify-center text-2xl font-bold">
                  1
                </div>
                <h3 className="mb-2 text-xl font-bold">Create Verified Profile</h3>
                <p className="text-muted-foreground">
                  Complete your application once with income verification, background check, and
                  rental history.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="bg-primary text-primary-foreground mx-auto mb-4 flex h-16 w-16 items-center justify-center text-2xl font-bold">
                  2
                </div>
                <h3 className="mb-2 text-xl font-bold">Apply to Any Listing</h3>
                <p className="text-muted-foreground">
                  One-tap applications to any property on the platform. No more filling out the same
                  forms repeatedly.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="bg-primary text-primary-foreground mx-auto mb-4 flex h-16 w-16 items-center justify-center text-2xl font-bold">
                  3
                </div>
                <h3 className="mb-2 text-xl font-bold">Get Fair Evaluation</h3>
                <p className="text-muted-foreground">
                  Landlords evaluate based on objective criteria only. No discrimination, just
                  qualified applicants.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Listings Section */}
        <section className="bg-muted/30 border-foreground border-y-4 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
              <div>
                <h2 className="text-3xl font-bold md:text-4xl">Featured Listings</h2>
                <p className="text-muted-foreground mt-2">
                  Explore our latest available apartments
                </p>
              </div>
              <Button variant="outline" className="border-foreground border-2" asChild>
                <Link href="/search">
                  View All Listings
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>

        {/* Trust/Social Proof Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              Trusted by Thousands
            </h2>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
              {/* Stat 1 */}
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <Users className="text-primary h-8 w-8" />
                  <span className="text-4xl font-bold md:text-5xl">10K+</span>
                </div>
                <p className="text-muted-foreground font-medium">Verified Renters</p>
              </div>

              {/* Stat 2 */}
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <Building2 className="text-primary h-8 w-8" />
                  <span className="text-4xl font-bold md:text-5xl">500+</span>
                </div>
                <p className="text-muted-foreground font-medium">Partner Agents</p>
              </div>

              {/* Stat 3 */}
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <TrendingUp className="text-primary h-8 w-8" />
                  <span className="text-4xl font-bold md:text-5xl">21</span>
                </div>
                <p className="text-muted-foreground font-medium">Days Avg. Time to Lease</p>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mx-auto mt-16 max-w-2xl text-center">
              <blockquote className="text-muted-foreground mb-4 text-lg italic md:text-xl">
                &ldquo;ApartmentDibs made finding my apartment so much easier. I created my profile
                once and applied to 15 listings in one afternoon. No more filling out the same forms
                over and over!&rdquo;
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center font-bold">
                  S
                </div>
                <div className="text-left">
                  <p className="font-medium">Sarah M.</p>
                  <p className="text-muted-foreground text-sm">Verified Renter, Brooklyn</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Get Started Today</h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
              Join thousands of renters and landlords who trust ApartmentDibs for fair, fast, and
              compliant rentals.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                className="border-primary-foreground border-2 px-8 text-lg"
                asChild
              >
                <Link href="/search">Find an Apartment</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground hover:bg-primary-foreground hover:text-primary border-2 bg-transparent px-8 text-lg"
                asChild
              >
                <Link href="/pricing">List Your Property</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
