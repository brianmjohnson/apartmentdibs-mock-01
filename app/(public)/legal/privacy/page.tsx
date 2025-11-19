import { Metadata } from 'next'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | ApartmentDibs',
  description: 'Learn how ApartmentDibs collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <article>
      <header className="mb-8">
        <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: November 1, 2025</p>
        <div className="bg-muted/50 border-foreground mt-4 border-2 p-4">
          <p className="text-sm">
            <strong>Note:</strong> This is a sample privacy policy for demonstration purposes only.
            Actual privacy policies should be reviewed by legal counsel.
          </p>
        </div>
      </header>

      <Separator className="my-8" />

      {/* Table of Contents */}
      <nav className="bg-muted/30 border-foreground mb-8 border-2 p-6">
        <h2 className="mb-4 text-lg font-bold">Table of Contents</h2>
        <ol className="space-y-2 text-sm">
          <li>
            <a href="#introduction" className="hover:underline">
              1. Introduction
            </a>
          </li>
          <li>
            <a href="#information-we-collect" className="hover:underline">
              2. Information We Collect
            </a>
          </li>
          <li>
            <a href="#how-we-use" className="hover:underline">
              3. How We Use Your Information
            </a>
          </li>
          <li>
            <a href="#information-sharing" className="hover:underline">
              4. Information Sharing
            </a>
          </li>
          <li>
            <a href="#data-security" className="hover:underline">
              5. Data Security
            </a>
          </li>
          <li>
            <a href="#your-rights" className="hover:underline">
              6. Your Rights (GDPR/CCPA)
            </a>
          </li>
          <li>
            <a href="#data-retention" className="hover:underline">
              7. Data Retention
            </a>
          </li>
          <li>
            <a href="#childrens-privacy" className="hover:underline">
              8. Children&apos;s Privacy
            </a>
          </li>
          <li>
            <a href="#changes" className="hover:underline">
              9. Changes to Privacy Policy
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:underline">
              10. Contact Us
            </a>
          </li>
        </ol>
      </nav>

      <section id="introduction" className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">1. Introduction</h2>
        <p className="mb-4">
          ApartmentDibs, Inc. (&quot;ApartmentDibs,&quot; &quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how
          we collect, use, disclose, and safeguard your information when you use our website, mobile
          application, and services (collectively, the &quot;Service&quot;).
        </p>
        <p>
          By using the Service, you consent to the collection, use, and disclosure of your
          information as described in this Privacy Policy. If you do not agree with these practices,
          please do not use the Service.
        </p>
      </section>

      <section id="information-we-collect" className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">2. Information We Collect</h2>

        <h3 className="mb-3 text-xl font-semibold">2.1 Personal Information</h3>
        <p className="mb-4">
          We collect personal information that you voluntarily provide, including:
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6">
          <li>
            <strong>Contact information:</strong> Name, email address, phone number, mailing address
          </li>
          <li>
            <strong>Account credentials:</strong> Username and password
          </li>
          <li>
            <strong>Financial information:</strong> Income documentation, bank statements, credit
            card information for payments
          </li>
          <li>
            <strong>Identity verification:</strong> Government-issued ID, Social Security Number
            (for background checks)
          </li>
          <li>
            <strong>Employment information:</strong> Employer name, job title, work history
          </li>
          <li>
            <strong>Rental history:</strong> Previous addresses, landlord references
          </li>
          <li>
            <strong>Profile information:</strong> Photos, preferences, saved searches
          </li>
        </ul>

        <h3 className="mb-3 text-xl font-semibold">2.2 Usage Data</h3>
        <p className="mb-4">
          We automatically collect certain information when you use the Service:
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6">
          <li>IP address and device identifiers</li>
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>Pages visited and features used</li>
          <li>Date and time of visits</li>
          <li>Search queries and filter preferences</li>
          <li>Listings viewed and applications submitted</li>
        </ul>

        <h3 className="mb-3 text-xl font-semibold">2.3 Cookies and Tracking Technologies</h3>
        <p className="mb-4">We use cookies and similar technologies to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Remember your preferences and settings</li>
          <li>Analyze usage patterns and improve the Service</li>
          <li>Provide personalized content and recommendations</li>
          <li>Enable security features</li>
          <li>Deliver targeted advertising (with your consent)</li>
        </ul>
        <p className="mt-4">
          You can manage cookie preferences through your browser settings. Note that disabling
          cookies may affect the functionality of the Service.
        </p>
      </section>

      <section id="how-we-use" className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">3. How We Use Your Information</h2>
        <p className="mb-4">We use your information to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Provide the Service:</strong> Create accounts, process applications, facilitate
            communications
          </li>
          <li>
            <strong>Verify identity:</strong> Confirm your identity for background checks and fraud
            prevention
          </li>
          <li>
            <strong>Process payments:</strong> Handle subscriptions and screening report fees
          </li>
          <li>
            <strong>Improve the Service:</strong> Analyze usage patterns and develop new features
          </li>
          <li>
            <strong>Communicate with you:</strong> Send notifications, updates, and promotional
            materials
          </li>
          <li>
            <strong>Ensure compliance:</strong> Comply with legal obligations and enforce our Terms
            of Service
          </li>
          <li>
            <strong>Protect users:</strong> Detect and prevent fraud, security threats, and abuse
          </li>
          <li>
            <strong>Support fair housing:</strong> Implement compliance features and maintain audit
            trails
          </li>
        </ul>
      </section>

      <section id="information-sharing" className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">4. Information Sharing</h2>
        <p className="mb-4">We may share your information with:</p>

        <h3 className="mb-3 text-xl font-semibold">4.1 Other Users</h3>
        <p className="mb-4">
          When you apply for a rental, landlords/agents receive your application information.
          Certain personal identifiers may be obfuscated to ensure fair housing compliance.
        </p>

        <h3 className="mb-3 text-xl font-semibold">4.2 Service Providers</h3>
        <p className="mb-4">
          We share information with third-party vendors who help us provide the Service, including:
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6">
          <li>Background check providers</li>
          <li>Payment processors</li>
          <li>Cloud hosting services</li>
          <li>Analytics providers</li>
          <li>Customer support tools</li>
        </ul>

        <h3 className="mb-3 text-xl font-semibold">4.3 Legal Requirements</h3>
        <p className="mb-4">
          We may disclose information when required by law, court order, or government request, or
          when necessary to protect our rights or the safety of users.
        </p>

        <h3 className="mb-3 text-xl font-semibold">4.4 Business Transfers</h3>
        <p>
          In the event of a merger, acquisition, or sale of assets, user information may be
          transferred to the acquiring entity.
        </p>
      </section>

      <section id="data-security" className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">5. Data Security</h2>
        <p className="mb-4">
          We implement appropriate technical and organizational measures to protect your personal
          information, including:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Encryption of data in transit and at rest</li>
          <li>Regular security assessments and penetration testing</li>
          <li>Access controls and authentication measures</li>
          <li>Employee training on data protection</li>
          <li>Incident response procedures</li>
        </ul>
        <p>
          While we strive to protect your information, no method of transmission or storage is 100%
          secure. We cannot guarantee absolute security.
        </p>
      </section>

      <section id="your-rights" className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">6. Your Rights (GDPR/CCPA)</h2>

        <Alert className="border-foreground mb-6 border-2">
          <Shield className="h-4 w-4" />
          <AlertTitle>Your Privacy Rights</AlertTitle>
          <AlertDescription>
            Depending on your location, you may have specific rights under data protection laws such
            as the GDPR (European Union) or CCPA (California).
          </AlertDescription>
        </Alert>

        <h3 className="mb-3 text-xl font-semibold">6.1 Rights Under GDPR (EU Residents)</h3>
        <p className="mb-4">If you are in the European Union, you have the right to:</p>
        <ul className="mb-6 list-disc space-y-2 pl-6">
          <li>
            <strong>Access:</strong> Request copies of your personal data
          </li>
          <li>
            <strong>Rectification:</strong> Request correction of inaccurate data
          </li>
          <li>
            <strong>Erasure:</strong> Request deletion of your data (&quot;right to be
            forgotten&quot;)
          </li>
          <li>
            <strong>Restrict processing:</strong> Request limitation of data processing
          </li>
          <li>
            <strong>Data portability:</strong> Receive your data in a structured, machine-readable
            format
          </li>
          <li>
            <strong>Object:</strong> Object to processing based on legitimate interests
          </li>
          <li>
            <strong>Withdraw consent:</strong> Withdraw previously given consent at any time
          </li>
        </ul>

        <h3 className="mb-3 text-xl font-semibold">6.2 Rights Under CCPA (California Residents)</h3>
        <p className="mb-4">If you are a California resident, you have the right to:</p>
        <ul className="mb-6 list-disc space-y-2 pl-6">
          <li>
            <strong>Know:</strong> Request disclosure of personal information collected
          </li>
          <li>
            <strong>Delete:</strong> Request deletion of your personal information
          </li>
          <li>
            <strong>Opt-out:</strong> Opt out of the sale of your personal information
          </li>
          <li>
            <strong>Non-discrimination:</strong> Not be discriminated against for exercising your
            rights
          </li>
        </ul>

        <p className="mb-4">
          <strong>We do not sell your personal information.</strong>
        </p>

        <h3 className="mb-3 text-xl font-semibold">6.3 Exercising Your Rights</h3>
        <p>
          To exercise any of these rights, please contact us at privacy@apartmentdibs.com. We will
          respond to your request within the legally required timeframe.
        </p>
      </section>

      <section id="data-retention" className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">7. Data Retention</h2>
        <p className="mb-4">We retain your personal information for as long as necessary to:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Provide the Service and fulfill our contractual obligations</li>
          <li>Comply with legal and regulatory requirements</li>
          <li>Resolve disputes and enforce our agreements</li>
          <li>Maintain audit trails for fair housing compliance</li>
        </ul>
        <p className="mb-4">Specific retention periods:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Active accounts:</strong> Data retained while account is active
          </li>
          <li>
            <strong>Application records:</strong> 7 years (fair housing compliance)
          </li>
          <li>
            <strong>Payment records:</strong> 7 years (tax requirements)
          </li>
          <li>
            <strong>Inactive accounts:</strong> Deleted after 3 years of inactivity
          </li>
        </ul>
      </section>

      <section id="childrens-privacy" className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">8. Children&apos;s Privacy</h2>
        <p className="mb-4">
          The Service is not intended for users under 18 years of age. We do not knowingly collect
          personal information from children under 18.
        </p>
        <p>
          If you believe we have collected information from a child under 18, please contact us
          immediately at privacy@apartmentdibs.com, and we will take steps to delete such
          information.
        </p>
      </section>

      <section id="changes" className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">9. Changes to Privacy Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. We will notify you of any material
          changes by:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Posting the updated policy on this page</li>
          <li>Updating the &quot;Last updated&quot; date</li>
          <li>Sending you an email notification</li>
          <li>Displaying a notice within the Service</li>
        </ul>
        <p>
          We encourage you to review this Privacy Policy periodically. Your continued use of the
          Service after any changes constitutes acceptance of the updated policy.
        </p>
      </section>

      <section id="contact" className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">10. Contact Us</h2>
        <p className="mb-4">
          If you have questions about this Privacy Policy or our privacy practices, please contact
          our Data Protection Officer:
        </p>
        <div className="bg-muted/30 border-foreground border-2 p-4">
          <p className="font-semibold">ApartmentDibs, Inc.</p>
          <p>Attn: Data Protection Officer</p>
          <p>123 Main Street, Suite 456</p>
          <p>New York, NY 10001</p>
          <p className="mt-2">Email: privacy@apartmentdibs.com</p>
          <p>Phone: (555) 123-4567</p>
        </div>
        <p className="text-muted-foreground mt-4 text-sm">
          For EU residents: You also have the right to lodge a complaint with your local data
          protection authority.
        </p>
      </section>
    </article>
  )
}
