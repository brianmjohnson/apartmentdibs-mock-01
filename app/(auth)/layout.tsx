import Link from 'next/link'
import { Building2 } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Background pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.02)_25%,rgba(0,0,0,0.02)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.02)_75%)] bg-[length:4px_4px] -z-10" />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center justify-center gap-2 mb-8"
          >
            <div className="h-10 w-10 bg-primary text-primary-foreground flex items-center justify-center">
              <Building2 className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold">ApartmentDibs</span>
          </Link>

          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to Home
        </Link>
      </footer>
    </div>
  )
}
