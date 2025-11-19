import Link from 'next/link'
import { Users, Target, Heart, Award, ArrowRight, Newspaper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// Team members data
const teamMembers = [
  {
    name: 'Sarah Chen',
    title: 'CEO & Co-Founder',
    bio: 'Former housing policy advisor with 10+ years in real estate tech. Passionate about fair housing access.',
    initials: 'SC',
  },
  {
    name: 'Marcus Johnson',
    title: 'CTO & Co-Founder',
    bio: 'Ex-Stripe engineer focused on building secure, scalable platforms. Believes technology can solve systemic problems.',
    initials: 'MJ',
  },
  {
    name: 'Elena Rodriguez',
    title: 'VP of Product',
    bio: 'Product leader from Zillow with deep expertise in rental marketplace dynamics and user experience.',
    initials: 'ER',
  },
  {
    name: 'David Kim',
    title: 'VP of Engineering',
    bio: 'Built infrastructure at scale for Airbnb. Committed to creating reliable systems for critical housing decisions.',
    initials: 'DK',
  },
  {
    name: 'Aisha Patel',
    title: 'Head of Compliance',
    bio: 'Former HUD attorney specializing in fair housing law. Ensures our platform exceeds regulatory standards.',
    initials: 'AP',
  },
  {
    name: "James O'Brien",
    title: 'Head of Customer Success',
    bio: 'Customer operations leader with experience at both startups and Fortune 500 companies.',
    initials: 'JO',
  },
]

// Press mentions
const pressLogos = [
  { name: 'TechCrunch', width: 'w-32' },
  { name: 'The New York Times', width: 'w-36' },
  { name: 'Forbes', width: 'w-24' },
  { name: 'Wired', width: 'w-20' },
  { name: 'Fast Company', width: 'w-32' },
]

// Timeline events
const timelineEvents = [
  {
    year: '2021',
    title: 'The Problem',
    description:
      'Our founders experienced rental discrimination firsthand and saw the broken system affecting millions.',
  },
  {
    year: '2022',
    title: 'The Solution',
    description:
      'ApartmentDibs was born with a mission to create a fair, transparent rental process for everyone.',
  },
  {
    year: '2023',
    title: 'The Growth',
    description:
      'Launched in San Francisco, expanded to 10 cities, and helped over 5,000 renters find homes fairly.',
  },
  {
    year: '2024',
    title: 'The Future',
    description:
      'Now in 25+ cities with 500+ agent partners, continuing to expand access to fair housing nationwide.',
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-background border-foreground relative border-b-4">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.02)_25%,rgba(0,0,0,0.02)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.02)_75%)] bg-[length:4px_4px]" />
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Making Renting Fair for Everyone
            </h1>
            <p className="text-muted-foreground mx-auto max-w-3xl text-xl md:text-2xl">
              We&apos;re building a rental platform where tenants are judged on their
              qualifications, not their demographics—and where landlords are protected from costly
              discrimination claims.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex items-center justify-center">
              <div className="bg-primary text-primary-foreground flex h-16 w-16 items-center justify-center">
                <Target className="h-8 w-8" />
              </div>
            </div>
            <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">Our Mission</h2>
            <div className="text-muted-foreground space-y-6 text-lg">
              <p>
                Housing is a fundamental need, yet the rental process remains plagued by
                inefficiency, bias, and frustration for everyone involved. Tenants face repeated
                application fees, redundant background checks, and decisions that often feel
                arbitrary or discriminatory.
              </p>
              <p>
                Landlords and agents, meanwhile, struggle with compliance concerns, inconsistent
                screening processes, and the fear of discrimination lawsuits—even when they have
                good intentions.
              </p>
              <p>
                <strong className="text-foreground">ApartmentDibs exists to fix this.</strong>{' '}
                We&apos;ve built a platform that creates verified, portable tenant profiles, ensures
                objective evaluation criteria, and provides complete audit trails. The result?
                Faster leasing, happier tenants, and protected landlords.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Our Story</h2>
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {timelineEvents.map((event, index) => (
                <Card
                  key={event.year}
                  className="border-foreground border-2 transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary text-primary-foreground flex h-12 w-12 shrink-0 items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-primary mb-1 text-sm font-bold">{event.year}</div>
                        <h3 className="mb-2 text-xl font-bold">{event.title}</h3>
                        <p className="text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-muted/30 border-foreground border-y-4 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="mb-4 flex items-center justify-center">
              <Users className="text-primary h-8 w-8" />
            </div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Meet Our Team</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              We&apos;re a diverse team of technologists, housing experts, and former renters united
              by a belief that the rental process can and should be better.
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <Card
                key={member.name}
                className="border-foreground border-2 transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="bg-primary text-primary-foreground flex h-14 w-14 items-center justify-center text-lg font-bold">
                      {member.initials}
                    </div>
                    <div>
                      <h3 className="font-bold">{member.name}</h3>
                      <p className="text-muted-foreground text-sm">{member.title}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Our Values</h2>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Fairness First</h3>
              <p className="text-muted-foreground">
                Every decision we make is guided by our commitment to equal housing opportunity.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Trust Through Transparency</h3>
              <p className="text-muted-foreground">
                We provide clear criteria and complete audit trails so everyone knows how decisions
                are made.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Win-Win Solutions</h3>
              <p className="text-muted-foreground">
                Our platform benefits tenants, agents, and landlords—because fair housing is good
                for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Press Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="mb-4 flex items-center justify-center">
              <Newspaper className="text-primary h-8 w-8" />
            </div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">In the Press</h2>
            <p className="text-muted-foreground">
              See what leading publications are saying about ApartmentDibs
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {pressLogos.map((logo) => (
              <div
                key={logo.name}
                className={`${logo.width} bg-muted border-foreground flex h-12 items-center justify-center border-2 px-4`}
              >
                <span className="text-muted-foreground text-sm font-bold">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">We&apos;re Hiring!</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
            Join our mission to make renting fair for everyone. We&apos;re looking for passionate
            people who believe technology can solve systemic problems.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="border-primary-foreground border-2 px-8 text-lg"
              asChild
            >
              <Link href="/careers">
                View Open Positions
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground hover:bg-primary-foreground hover:text-primary border-2 bg-transparent px-8 text-lg"
              asChild
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
