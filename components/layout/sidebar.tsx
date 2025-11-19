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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/search', label: 'Search', icon: Search },
    { href: '/dashboard/applications', label: 'Applications', icon: FileText },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
    { href: '/dashboard/documents', label: 'Documents', icon: FileText },
  ],
  agent: [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/listings', label: 'Listings', icon: Building },
    { href: '/dashboard/leads', label: 'Leads', icon: Users },
    { href: '/dashboard/applications', label: 'Applications', icon: FileText },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  ],
  landlord: [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/properties', label: 'Properties', icon: Building },
    { href: '/listings', label: 'Listings', icon: FileText },
    { href: '/dashboard/financials', label: 'Financials', icon: BarChart3 },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  ],
  admin: [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/users', label: 'Users', icon: Users },
    { href: '/dashboard/listings', label: 'Listings', icon: Building },
    { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
    { href: '/dashboard/compliance', label: 'Compliance', icon: FileText },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  ],
}

const secondaryItems: NavItem[] = [
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/help', label: 'Help & Support', icon: HelpCircle },
]

export function Sidebar({ persona = 'tenant' }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const primaryNav = navItems[persona] || navItems.tenant

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'sticky top-16 h-[calc(100vh-4rem)] border-r-4 border-foreground bg-background transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className={cn(
            'flex items-center h-16 px-4 border-b-2 border-border',
            collapsed ? 'justify-center' : 'justify-between'
          )}>
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
                              isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-accent'
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="border-2 border-foreground">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 transition-colors font-medium',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent'
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
          <div className="border-t-2 border-border py-4">
            <ul className="space-y-1 px-2">
              {secondaryItems.map((item) => {
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
                              isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-accent'
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="border-2 border-foreground">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent'
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
          <div className="border-t-2 border-border p-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'w-full justify-center',
                !collapsed && 'justify-end'
              )}
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
