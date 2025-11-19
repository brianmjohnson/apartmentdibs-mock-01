import { Metadata } from 'next'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Shield,
  Eye,
  ClipboardCheck,
  FileText,
  AlertTriangle,
  ExternalLink,
  Phone,
  Mail
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Fair Housing Statement | ApartmentDibs',
  description: 'Learn about our commitment to fair housing and how ApartmentDibs ensures compliance with fair housing laws.',
}

export default function FairHousingPage() {
  return (
    <article>
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Fair Housing Statement
        </h1>
        <p className="text-muted-foreground">
          Last updated: November 1, 2025
        </p>
      </header>

      <Separator className="my-8" />

      {/* Hero Statement */}
      <Alert className="mb-8 border-4 border-primary bg-primary/5">
        <Shield className="h-5 w-5" />
        <AlertTitle className="text-lg font-bold">Our Commitment to Fair Housing</AlertTitle>
        <AlertDescription className="text-base mt-2">
          ApartmentDibs is committed to ensuring that every person has equal access to housing
          opportunities. We believe that technology can and should be a force for fairness in
          the rental market.
        </AlertDescription>
      </Alert>

      <section id="our-commitment" className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
        <p className="mb-4 text-lg">
          At ApartmentDibs, fair housing isn&apos;t just a legal requirement—it&apos;s the foundation
          of our platform. We&apos;ve built our technology from the ground up to promote equal
          housing opportunities and protect both tenants and landlords.
        </p>
        <p className="mb-4">
          We believe that:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Everyone deserves to be evaluated based on their qualifications, not their identity</li>
          <li>Technology should reduce bias, not amplify it</li>
          <li>Transparency and accountability are essential to fair housing</li>
          <li>Landlords and tenants both benefit from a fair, efficient rental process</li>
        </ul>
      </section>

      <section id="fair-housing-act" className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Fair Housing Act Overview</h2>
        <p className="mb-4">
          The Fair Housing Act (Title VIII of the Civil Rights Act of 1968, as amended)
          prohibits discrimination in housing based on protected characteristics. This
          federal law applies to most housing transactions, including rentals.
        </p>

        <h3 className="text-xl font-semibold mb-4">Protected Classes</h3>
        <p className="mb-4">
          Under federal law, it is illegal to discriminate against any person based on:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="border-2 border-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Race</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Protection against discrimination based on race or ethnicity
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Color</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Protection based on skin color or complexion
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">National Origin</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Protection based on country of birth, ancestry, or language
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Religion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Protection based on religious beliefs or practices
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Sex</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Protection based on gender, including sexual harassment and gender identity
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Familial Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Protection for families with children under 18, pregnant women, and those seeking custody
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-foreground md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Disability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Protection for individuals with physical or mental disabilities, including requirements
                for reasonable accommodations and modifications
              </p>
            </CardContent>
          </Card>
        </div>

        <Alert className="border-2 border-foreground">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Additional Protections</AlertTitle>
          <AlertDescription>
            Many states and localities provide additional protections beyond federal law,
            including protections based on source of income, sexual orientation, gender
            identity, marital status, and more. ApartmentDibs supports compliance with
            all applicable fair housing laws.
          </AlertDescription>
        </Alert>
      </section>

      <section id="how-we-ensure-compliance" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">How We Ensure Compliance</h2>
        <p className="mb-6">
          ApartmentDibs has implemented multiple technical and procedural safeguards to
          ensure fair housing compliance:
        </p>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center">
                <Eye className="h-6 w-6" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">PII Obfuscation</h3>
              <p className="text-muted-foreground">
                Personal identifying information that could reveal protected class membership
                is hidden from landlords during the initial screening process. This includes
                photos, names that may indicate national origin, and other identifying details.
                Landlords evaluate applications based on qualifications, not identity.
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center">
                <ClipboardCheck className="h-6 w-6" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Objective Criteria Only</h3>
              <p className="text-muted-foreground mb-4">
                Our platform evaluates applicants solely based on objective, non-discriminatory
                criteria that landlords define in advance:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Income relative to rent (e.g., 3x monthly rent)</li>
                <li>Credit score thresholds</li>
                <li>Rental history and landlord references</li>
                <li>Background check results</li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                These criteria are applied consistently to all applicants for a given listing.
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center">
                <Shield className="h-6 w-6" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Complete Audit Trails</h3>
              <p className="text-muted-foreground">
                Every action on our platform is logged with timestamps, creating a complete
                audit trail of the application and decision-making process. This documentation
                helps landlords demonstrate fair housing compliance and provides transparency
                for all parties. In the event of a fair housing inquiry, landlords have
                defensible records of their objective decision-making process.
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center">
                <FileText className="h-6 w-6" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Adverse Action Notices</h3>
              <p className="text-muted-foreground">
                When an application is denied, our platform automatically generates compliant
                adverse action notices that include the specific reason(s) for denial, credit
                bureau contact information, and the applicant&apos;s rights under applicable law.
                This ensures transparency and compliance with the Fair Credit Reporting Act (FCRA).
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="report-discrimination" className="mb-12">
        <h2 className="text-2xl font-bold mb-4">How to Report Discrimination</h2>
        <p className="mb-4">
          If you believe you have experienced housing discrimination, we encourage you to
          take action. Discrimination is illegal and you have the right to file a complaint.
        </p>

        <div className="space-y-4">
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Report to ApartmentDibs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                If you experienced discrimination on our platform, please contact us immediately:
              </p>
              <p className="font-medium">fairhousing@apartmentdibs.com</p>
              <p className="text-sm text-muted-foreground mt-2">
                We take all reports seriously and will investigate promptly.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                File a HUD Complaint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                You can file a complaint with the U.S. Department of Housing and Urban Development:
              </p>
              <ul className="space-y-2">
                <li><strong>Phone:</strong> 1-800-669-9777</li>
                <li><strong>TTY:</strong> 1-800-927-9275</li>
                <li><strong>Online:</strong> <Link href="https://www.hud.gov/fairhousing" className="text-primary hover:underline">www.hud.gov/fairhousing</Link></li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Complaints must be filed within one year of the alleged discriminatory act.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="resources" className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Resources</h2>
        <p className="mb-6">
          Learn more about fair housing rights and responsibilities:
        </p>

        <div className="space-y-3">
          <Link
            href="https://www.hud.gov/program_offices/fair_housing_equal_opp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 border-2 border-foreground hover:bg-accent transition-colors"
          >
            <div>
              <p className="font-semibold">HUD Office of Fair Housing</p>
              <p className="text-sm text-muted-foreground">Federal fair housing resources and complaint filing</p>
            </div>
            <ExternalLink className="h-5 w-5 flex-shrink-0" />
          </Link>

          <Link
            href="https://nationalfairhousing.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 border-2 border-foreground hover:bg-accent transition-colors"
          >
            <div>
              <p className="font-semibold">National Fair Housing Alliance</p>
              <p className="text-sm text-muted-foreground">Advocacy and education on fair housing</p>
            </div>
            <ExternalLink className="h-5 w-5 flex-shrink-0" />
          </Link>

          <Link
            href="https://www.justice.gov/crt/fair-housing-act-1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 border-2 border-foreground hover:bg-accent transition-colors"
          >
            <div>
              <p className="font-semibold">DOJ Civil Rights Division</p>
              <p className="text-sm text-muted-foreground">Fair Housing Act enforcement information</p>
            </div>
            <ExternalLink className="h-5 w-5 flex-shrink-0" />
          </Link>

          <Link
            href="https://www.consumerfinance.gov/fair-lending/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 border-2 border-foreground hover:bg-accent transition-colors"
          >
            <div>
              <p className="font-semibold">Consumer Financial Protection Bureau</p>
              <p className="text-sm text-muted-foreground">Fair lending and credit reporting rights</p>
            </div>
            <ExternalLink className="h-5 w-5 flex-shrink-0" />
          </Link>
        </div>

        <div className="mt-8 p-6 bg-muted/30 border-2 border-foreground text-center">
          <p className="text-lg font-semibold mb-2">Equal Housing Opportunity</p>
          <p className="text-muted-foreground">
            ApartmentDibs is committed to the letter and spirit of U.S. policy for the
            achievement of equal housing opportunity throughout the nation.
          </p>
        </div>
      </section>
    </article>
  )
}
