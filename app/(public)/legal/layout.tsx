'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { FileText, Shield, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

const legalPages = [
  {
    href: '/legal/terms',
    label: 'Terms of Service',
    icon: FileText,
  },
  {
    href: '/legal/privacy',
    label: 'Privacy Policy',
    icon: Shield,
  },
  {
    href: '/legal/fair-housing',
    label: 'Fair Housing',
    icon: Home,
  },
]

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="md:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h2 className="text-lg font-bold mb-4">Legal Documents</h2>
            <nav className="space-y-1">
              {legalPages.map((page) => {
                const isActive = pathname === page.href
                return (
                  <Link
                    key={page.href}
                    href={page.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-2',
                      isActive
                        ? 'bg-primary text-primary-foreground border-foreground'
                        : 'border-transparent hover:bg-accent hover:border-foreground'
                    )}
                  >
                    <page.icon className="h-4 w-4" />
                    {page.label}
                  </Link>
                )
              })}
            </nav>
            <Separator className="my-6" />
            <div className="text-sm text-muted-foreground">
              <p>Questions about our policies?</p>
              <Link
                href="/contact"
                className="text-foreground font-medium hover:underline"
              >
                Contact us
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
