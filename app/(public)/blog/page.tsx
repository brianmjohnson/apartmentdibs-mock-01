'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Clock, ArrowRight } from 'lucide-react'
import {
  mockBlogPosts,
  blogCategories,
  formatBlogDate,
  type BlogPost
} from '@/lib/mock-data/blog-posts'

function BlogPostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card className={`border-2 border-foreground overflow-hidden transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${featured ? 'md:flex' : ''}`}>
        <div className={`relative ${featured ? 'md:w-1/2' : 'aspect-[16/9]'}`}>
          <div className={`relative ${featured ? 'h-64 md:h-full' : 'h-full'}`}>
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
          <Badge className="absolute top-4 left-4 border-2 border-foreground">
            {post.category}
          </Badge>
        </div>
        <div className={featured ? 'md:w-1/2' : ''}>
          <CardHeader className="pb-2">
            <h3 className={`font-bold group-hover:underline ${featured ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
              {post.title}
            </h3>
          </CardHeader>
          <CardContent>
            <p className={`text-muted-foreground mb-4 ${featured ? 'text-base' : 'text-sm line-clamp-2'}`}>
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>
                    {post.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{post.author.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBlogDate(post.publishedAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min</span>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredPosts = selectedCategory
    ? mockBlogPosts.filter(post => post.category === selectedCategory)
    : mockBlogPosts

  const featuredPost = filteredPosts[0]
  const remainingPosts = filteredPosts.slice(1)

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Blog
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Insights on fair housing, renting tips, market updates, and product news
          from the ApartmentDibs team.
        </p>
      </header>

      {/* Category Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="border-2 border-foreground"
          >
            All Posts
          </Button>
          {blogCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="border-2 border-foreground"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <Separator className="mb-8" />

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts found in this category.</p>
          <Button
            variant="outline"
            className="mt-4 border-2 border-foreground"
            onClick={() => setSelectedCategory(null)}
          >
            View all posts
          </Button>
        </div>
      ) : (
        <>
          {/* Featured Post */}
          {featuredPost && (
            <section className="mb-12">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Featured
              </h2>
              <BlogPostCard post={featuredPost} featured />
            </section>
          )}

          {/* Post Grid */}
          {remainingPosts.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Latest Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {remainingPosts.map((post) => (
                  <BlogPostCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* Load More / Pagination Placeholder */}
          {filteredPosts.length > 6 && (
            <div className="mt-12 text-center">
              <Button variant="outline" className="border-2 border-foreground">
                Load More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Newsletter CTA */}
      <section className="mt-16 p-8 bg-muted/30 border-2 border-foreground text-center">
        <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Get the latest fair housing insights and renting tips delivered to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 border-2 border-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button className="border-2 border-foreground">
            Subscribe
          </Button>
        </div>
      </section>
    </div>
  )
}
