import Link from 'next/link'
import { Building2, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const footerLinks = {
  company: [
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' },
  ],
  resources: [
    { href: '/search', label: 'Search Listings' },
    { href: '/faq', label: 'FAQ' },
  ],
  legal: [
    { href: '/legal/terms', label: 'Terms of Service' },
    { href: '/legal/privacy', label: 'Privacy Policy' },
    { href: '/legal/fair-housing', label: 'Fair Housing' },
  ],
}

const socialLinks = [
  { href: 'https://twitter.com/apartmentdibs', icon: Twitter, label: 'Twitter' },
  { href: 'https://facebook.com/apartmentdibs', icon: Facebook, label: 'Facebook' },
  { href: 'https://instagram.com/apartmentdibs', icon: Instagram, label: 'Instagram' },
  { href: 'https://linkedin.com/company/apartmentdibs', icon: Linkedin, label: 'LinkedIn' },
]

export function Footer() {
  return (
    <footer className="border-t-4 border-foreground bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Tagline */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Building2 className="h-8 w-8" />
              <span className="text-xl font-bold tracking-tight">ApartmentDibs</span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              The rental platform that protects tenants from bias and landlords from lawsuits.
              Fair housing, guaranteed.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <Link
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-accent transition-colors border-2 border-transparent hover:border-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-border h-0.5" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ApartmentDibs, Inc. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Equal Housing Opportunity
          </p>
        </div>
      </div>
    </footer>
  )
}
