import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Listing Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          The apartment listing you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild>
            <Link href="/search">
              <Search className="mr-2 h-4 w-4" />
              Browse Listings
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
