import { Metadata } from 'next'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Terms of Service | ApartmentDibs',
  description: 'Read the terms and conditions governing your use of the ApartmentDibs platform.',
}

export default function TermsOfServicePage() {
  return (
    <article>
      <header className="mb-8">
        <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: November 1, 2025</p>
        <div className="bg-muted/50 border-foreground mt-4 border-2 p-4">
          <p className="text-sm">
            <strong>Note:</strong> These are sample terms for demonstration purposes only. Actual
            terms of service should be reviewed by legal counsel.
          </p>
        </div>
      </header>

      <Separator className="my-8" />

      {/* Table of Contents */}
      <nav className="bg-muted/30 border-foreground mb-8 border-2 p-6">
        <h2 className="mb-4 text-lg font-bold">Table of Contents</h2>
        <ol className="space-y-2 text-sm">
          <li>
            <a href="#acceptance" className="hover:underline">
              1. Acceptance of Terms
            </a>
          </li>
          <li>
            <a href="#description" className="hover:underline">
              2. Description of Service
            </a>
          </li>
          <li>
            <a href="#accounts" className="hover:underline">
              3. User Accounts
            </a>
          </li>
          <li>
            <a href="#tenant-responsibilities" className="hover:underline">
              4. Tenant Responsibilities
            </a>
          </li>
          <li>
            <a href="#agent-landlord-responsibilities" className="hover:underline">
              5. Agent/Landlord Responsibilities
            </a>
          </li>
          <li>
            <a href="#prohibited-uses" className="hover:underline">
              6. Prohibited Uses
            </a>
          </li>
          <li>
            <a href="#intellectual-property" className="hover:underline">
              7. Intellectual Property
            </a>
          </li>
          <li>
            <a href="#limitation-of-liability" className="hover:underline">
              8. Limitation of Liability
            </a>
          </li>
          <li>
            <a href="#indemnification" className="hover:underline">
              9. Indemnification
            </a>
          </li>
          <li>
            <a href="#termination" className="hover:underline">
              10. Termination
            </a>
          </li>
          <li>
            <a href="#governing-law" className="hover:underline">
              11. Governing Law
            </a>
          </li>
          <li>
            <a href="#changes" className="hover:underline">
              12. Changes to Terms
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:underline">
              13. Contact Information
            </a>
          </li>
        </ol>
      </nav>

      <section id="acceptance" className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">1. Acceptance of Terms</h2>
        <p className="mb-4">
          Welcome to ApartmentDibs. By accessing or using our website, mobile application, or any
          other services we offer (collectively, the &quot;Service&quot;), you agree to be bound by
          these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do
          not use the Service.
        </p>
        <p>
          These Terms constitute a legally binding agreement between you and ApartmentDibs, Inc.
          (&quot;ApartmentDibs,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By using
          the Service, you represent that you are at least 18 years old and have the legal capacity
          to enter into these Terms.
        </p>
      </section>

      <section id="description" className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">2. Description of Service</h2>
        <p className="mb-4">
          ApartmentDibs is a rental platform that connects tenants with landlords and agents while
          ensuring compliance with fair housing laws. Our Service includes:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Rental listing search and discovery</li>
          <li>Portable tenant screening reports</li>
          <li>Application submission and tracking</li>
          <li>Communication tools between tenants and landlords</li>
          <li>Fair housing compliance features</li>
          <li>Document management and verification</li>
        </ul>
        <p>
          We do not own, manage, or control any rental properties listed on the Service. We are not
          a party to any rental agreements between tenants and landlords.
        </p>
      </section>

      <section id="accounts" className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">3. User Accounts</h2>
        <h3 className="mb-3 text-xl font-semibold">3.1 Account Creation</h3>
        <p className="mb-4">
          To access certain features of the Service, you must create an account. When creating an
          account, you agree to provide accurate, current, and complete information and to update
          this information to maintain its accuracy.
        </p>

        <h3 className="mb-3 text-xl font-semibold">3.2 Account Security</h3>
        <p className="mb-4">
          You are responsible for maintaining the confidentiality of your account credentials and
          for all activities that occur under your account. You agree to notify us immediately of
          any unauthorized use of your account.
        </p>

        <h3 className="mb-3 text-xl font-semibold">3.3 Account Types</h3>
        <p>
          ApartmentDibs offers different account types for tenants, agents, and landlords. Each
          account type has specific features and responsibilities as outlined in these Terms.
        </p>
      </section>

      <section id="tenant-responsibilities" className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">4. Tenant Responsibilities</h2>
        <p className="mb-4">As a tenant user, you agree to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Provide accurate information in your profile and applications</li>
          <li>Authorize background checks and income verification as required</li>
          <li>Respond to landlord communications in a timely manner</li>
          <li>Not misrepresent your identity, income, or rental history</li>
          <li>Comply with all applicable fair housing laws</li>
          <li>Pay any applicable fees for screening reports or premium services</li>
          <li>Not use the Service for any fraudulent or illegal purpose</li>
        </ul>
      </section>

      <section id="agent-landlord-responsibilities" className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">5. Agent/Landlord Responsibilities</h2>
        <p className="mb-4">As an agent or landlord user, you agree to:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Provide accurate and complete information about rental properties</li>
          <li>Comply with all applicable fair housing laws and regulations</li>
          <li>Evaluate applicants based on objective, non-discriminatory criteria</li>
          <li>Use the Service&apos;s tools for fair housing compliance</li>
          <li>Respond to tenant applications and inquiries in a timely manner</li>
          <li>Provide required adverse action notices when denying applications</li>
          <li>Maintain accurate records of all application decisions</li>
          <li>Not discriminate against any applicant based on protected characteristics</li>
        </ul>
        <p>
          Failure to comply with fair housing requirements may result in account suspension or
          termination and potential legal consequences.
        </p>
      </section>

      <section id="prohibited-uses" className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">6. Prohibited Uses</h2>
        <p className="mb-4">You may not use the Service to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Violate any applicable laws, including fair housing laws</li>
          <li>Post false, misleading, or fraudulent content</li>
          <li>Discriminate against any person based on protected characteristics</li>
          <li>Harass, abuse, or harm other users</li>
          <li>Interfere with or disrupt the Service</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Scrape or collect user data without permission</li>
          <li>Use the Service for any commercial purpose not authorized by us</li>
          <li>Transmit viruses, malware, or other harmful code</li>
          <li>Circumvent any technological measures we use to provide the Service</li>
        </ul>
      </section>

      <section id="intellectual-property" className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">7. Intellectual Property</h2>
        <h3 className="mb-3 text-xl font-semibold">7.1 Our Property</h3>
        <p className="mb-4">
          The Service and its original content, features, and functionality are owned by
          ApartmentDibs and are protected by copyright, trademark, and other intellectual property
          laws.
        </p>

        <h3 className="mb-3 text-xl font-semibold">7.2 User Content</h3>
        <p className="mb-4">
          You retain ownership of any content you submit to the Service. By submitting content, you
          grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and display
          that content in connection with the Service.
        </p>

        <h3 className="mb-3 text-xl font-semibold">7.3 Feedback</h3>
        <p>
          Any feedback, suggestions, or ideas you provide to us may be used by us without any
          obligation to compensate you.
        </p>
      </section>

      <section id="limitation-of-liability" className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">8. Limitation of Liability</h2>
        <p className="mb-4">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, APARTMENTDIBS SHALL NOT BE LIABLE FOR ANY
          INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT
          LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
        </p>
        <p className="mb-4">We are not responsible for:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Actions or omissions of landlords, agents, or tenants</li>
          <li>The accuracy of user-provided information</li>
          <li>The condition of any rental property</li>
          <li>The outcome of any rental application</li>
          <li>Any disputes between users</li>
        </ul>
      </section>

      <section id="indemnification" className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">9. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless ApartmentDibs, its officers, directors,
          employees, and agents from any claims, damages, losses, liabilities, and expenses
          (including attorneys&apos; fees) arising from your use of the Service, your violation of
          these Terms, or your violation of any rights of another.
        </p>
      </section>

      <section id="termination" className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">10. Termination</h2>
        <p className="mb-4">
          We may terminate or suspend your account immediately, without prior notice or liability,
          for any reason, including without limitation if you breach these Terms.
        </p>
        <p>
          Upon termination, your right to use the Service will immediately cease. You may also
          terminate your account at any time by contacting us. Certain provisions of these Terms
          will survive termination.
        </p>
      </section>

      <section id="governing-law" className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">11. Governing Law</h2>
        <p className="mb-4">
          These Terms shall be governed by and construed in accordance with the laws of the State of
          New York, without regard to its conflict of law provisions.
        </p>
        <p>
          Any disputes arising from these Terms or your use of the Service shall be resolved
          exclusively in the state or federal courts located in New York County, New York, and you
          consent to the personal jurisdiction of such courts.
        </p>
      </section>

      <section id="changes" className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">12. Changes to Terms</h2>
        <p className="mb-4">
          We reserve the right to modify or replace these Terms at any time. If we make material
          changes, we will provide notice through the Service or by other means.
        </p>
        <p>
          Your continued use of the Service after any changes constitutes acceptance of the new
          Terms. If you do not agree to the modified Terms, you must stop using the Service.
        </p>
      </section>

      <section id="contact" className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">13. Contact Information</h2>
        <p className="mb-4">If you have any questions about these Terms, please contact us at:</p>
        <div className="bg-muted/30 border-foreground border-2 p-4">
          <p className="font-semibold">ApartmentDibs, Inc.</p>
          <p>123 Main Street, Suite 456</p>
          <p>New York, NY 10001</p>
          <p className="mt-2">Email: legal@apartmentdibs.com</p>
          <p>Phone: (555) 123-4567</p>
        </div>
      </section>
    </article>
  )
}
