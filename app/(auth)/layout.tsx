import Link from 'next/link'
import { Building2 } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Background pattern */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.02)_25%,rgba(0,0,0,0.02)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.02)_75%)] bg-[length:4px_4px]" />

      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="mb-8 flex items-center justify-center gap-2">
            <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center">
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
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          Back to Home
        </Link>
      </footer>
    </div>
  )
}
