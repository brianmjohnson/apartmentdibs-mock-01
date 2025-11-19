'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Building2,
  Home,
  Search,
  FileText,
  MessageSquare,
  Settings,
  HelpCircle,
  BarChart3,
  Users,
  Building,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
  Shield,
  Headphones,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

interface SidebarProps {
  persona?: 'tenant' | 'agent' | 'landlord' | 'admin'
}

const navItems: Record<string, NavItem[]> = {
  tenant: [
    { href: '/tenant/dashboard', label: 'Dashboard', icon: Home },
    { href: '/tenant/applications', label: 'Applications', icon: FileText },
    { href: '/tenant/saved-listings', label: 'Saved Listings', icon: Search },
    { href: '/tenant/payments', label: 'Payments', icon: BarChart3 },
    { href: '/tenant/profile', label: 'Profile', icon: Users },
  ],
  agent: [
    { href: '/agent/dashboard', label: 'Dashboard', icon: Home },
    { href: '/agent/listings', label: 'Listings', icon: Building },
    { href: '/agent/applicants', label: 'Applicants', icon: Users },
    { href: '/agent/crm', label: 'CRM', icon: FileText },
    { href: '/agent/messages', label: 'Messages', icon: MessageSquare },
    { href: '/agent/analytics', label: 'Analytics', icon: BarChart3 },
  ],
  landlord: [
    { href: '/landlord/dashboard', label: 'Dashboard', icon: Home },
    { href: '/landlord/properties', label: 'Properties', icon: Building },
    { href: '/landlord/listings', label: 'Listings', icon: FileText },
    { href: '/landlord/leases', label: 'Leases', icon: FileText },
    { href: '/landlord/payments', label: 'Payments', icon: BarChart3 },
    { href: '/landlord/maintenance', label: 'Maintenance', icon: Settings },
  ],
  admin: [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/listings', label: 'Listings', icon: Building },
    { href: '/admin/compliance', label: 'Compliance', icon: Shield },
    { href: '/admin/support', label: 'Support', icon: Headphones },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ],
}

const secondaryItems: Record<string, NavItem[]> = {
  tenant: [
    { href: '/tenant/settings', label: 'Settings', icon: Settings },
    { href: '/faq', label: 'Help & Support', icon: HelpCircle },
  ],
  agent: [
    { href: '/agent/settings', label: 'Settings', icon: Settings },
    { href: '/faq', label: 'Help & Support', icon: HelpCircle },
  ],
  landlord: [
    { href: '/landlord/settings', label: 'Settings', icon: Settings },
    { href: '/faq', label: 'Help & Support', icon: HelpCircle },
  ],
  admin: [{ href: '/admin/settings', label: 'Settings', icon: Settings }],
}

export function Sidebar({ persona = 'tenant' }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const primaryNav = navItems[persona] || navItems.tenant
  const secondaryNav = secondaryItems[persona] || secondaryItems.tenant

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'border-foreground bg-background sticky top-16 h-[calc(100vh-4rem)] border-r-4 transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div
            className={cn(
              'border-border flex h-16 items-center border-b-2 px-4',
              collapsed ? 'justify-center' : 'justify-between'
            )}
          >
            {!collapsed && (
              <Link href="/" className="flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                <span className="font-bold">ApartmentDibs</span>
              </Link>
            )}
            {collapsed && (
              <Link href="/">
                <Building2 className="h-6 w-6" />
              </Link>
            )}
          </div>

          {/* Primary Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {primaryNav.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <li key={item.href}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              'flex items-center justify-center p-3 transition-colors',
                              isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="border-foreground border-2">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 font-medium transition-colors',
                          isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Secondary Navigation */}
          <div className="border-border border-t-2 py-4">
            <ul className="space-y-1 px-2">
              {secondaryNav.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <li key={item.href}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              'flex items-center justify-center p-3 transition-colors',
                              isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="border-foreground border-2">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 transition-colors',
                          isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Collapse Toggle */}
          <div className="border-border border-t-2 p-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn('w-full justify-center', !collapsed && 'justify-end')}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <span className="mr-2 text-sm">Collapse</span>
                  <ChevronLeft className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}
