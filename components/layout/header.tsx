'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Search, ChevronDown, User, LogOut, Settings, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'

interface HeaderProps {
  isLoggedIn?: boolean
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

const navLinks = [
  { href: '/search', label: 'Search' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
]

const portalLinks = [
  { href: '/tenant', label: 'Tenant Portal' },
  { href: '/agent', label: 'Agent Portal' },
  { href: '/landlord', label: 'Landlord Portal' },
  { href: '/admin', label: 'Site Admin' },
]

export function Header({ isLoggedIn = false, user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Portal Navigation Bar */}
      <div className="bg-foreground text-background w-full text-xs">
        <div className="container mx-auto flex items-center justify-center gap-6 px-4 py-1.5">
          {portalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="font-medium hover:underline">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <header className="border-foreground bg-background sticky top-0 z-50 w-full border-b-4">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight">ApartmentDibs</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:bg-accent px-4 py-2 text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop Auth Buttons */}
            <div className="hidden items-center gap-2 md:flex">
              {isLoggedIn && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-foreground w-48 border-2">
                    <DropdownMenuItem asChild>
                      <Link href="/tenant/dashboard" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/tenant/settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive flex items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild className="border-foreground border-2">
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="border-foreground w-[300px] border-l-4">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Building2 className="h-6 w-6" />
                    ApartmentDibs
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="hover:bg-accent border-border border-b px-4 py-3 text-lg font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="mt-6 flex flex-col gap-2">
                    {isLoggedIn && user ? (
                      <>
                        <div className="border-border flex items-center gap-3 border-b px-4 py-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-muted-foreground text-sm">{user.email}</p>
                          </div>
                        </div>
                        <Link
                          href="/tenant/dashboard"
                          className="hover:bg-accent px-4 py-3 text-lg font-medium transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/tenant/settings"
                          className="hover:bg-accent px-4 py-3 text-lg font-medium transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Settings
                        </Link>
                        <button className="text-destructive hover:bg-accent px-4 py-3 text-left text-lg font-medium transition-colors">
                          Log out
                        </button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" asChild className="border-foreground border-2">
                          <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                            Log in
                          </Link>
                        </Button>
                        <Button asChild className="border-foreground border-2">
                          <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                            Sign Up
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  )
}
