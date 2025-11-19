import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Clock,
  Calendar,
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  MessageCircle
} from 'lucide-react'
import {
  getBlogPostBySlug,
  getRelatedPosts,
  formatBlogDate,
  mockBlogPosts
} from '@/lib/mock-data/blog-posts'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found | ApartmentDibs Blog',
    }
  }

  return {
    title: `${post.title} | ApartmentDibs Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  }
}

export async function generateStaticParams() {
  return mockBlogPosts.map((post) => ({
    slug: post.slug,
  }))
}

function MarkdownContent({ content }: { content: string }) {
  // Simple markdown-to-JSX conversion for demo purposes
  // In production, use a proper markdown parser like remark/rehype
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let currentList: string[] = []
  let listType: 'ul' | 'ol' | null = null
  let inTable = false
  let tableRows: string[][] = []
  let inCodeBlock = false
  let codeContent: string[] = []

  const processLine = (line: string, index: number) => {
    // Code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${index}`} className="bg-muted p-4 overflow-x-auto text-sm border-2 border-foreground">
            <code>{codeContent.join('\n')}</code>
          </pre>
        )
        codeContent = []
        inCodeBlock = false
      } else {
        inCodeBlock = true
      }
      return
    }

    if (inCodeBlock) {
      codeContent.push(line)
      return
    }

    // Tables
    if (line.startsWith('|')) {
      if (!inTable) {
        inTable = true
        tableRows = []
      }
      if (!line.includes('---')) {
        const cells = line.split('|').filter(cell => cell.trim())
        tableRows.push(cells.map(cell => cell.trim()))
      }
      return
    } else if (inTable) {
      // End table
      elements.push(
        <div key={`table-${index}`} className="overflow-x-auto my-4">
          <table className="w-full border-2 border-foreground">
            <thead className="bg-muted">
              <tr>
                {tableRows[0]?.map((cell, i) => (
                  <th key={i} className="p-2 text-left font-bold border-b-2 border-foreground">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-border">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="p-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      tableRows = []
      inTable = false
    }

    // Flush list if we're not continuing it
    if (!line.startsWith('- ') && !line.match(/^\d+\. /) && currentList.length > 0) {
      const ListTag = listType === 'ol' ? 'ol' : 'ul'
      elements.push(
        <ListTag key={`list-${index}`} className={`pl-6 space-y-2 my-4 ${listType === 'ol' ? 'list-decimal' : 'list-disc'}`}>
          {currentList.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: processInlineMarkdown(item) }} />
          ))}
        </ListTag>
      )
      currentList = []
      listType = null
    }

    // Headings
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
          {line.replace('## ', '')}
        </h2>
      )
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="text-xl font-semibold mt-6 mb-3">
          {line.replace('### ', '')}
        </h3>
      )
    }
    // Blockquotes
    else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={index} className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
          {line.replace('> ', '')}
        </blockquote>
      )
    }
    // Unordered lists
    else if (line.startsWith('- ')) {
      listType = 'ul'
      currentList.push(line.replace('- ', ''))
    }
    // Ordered lists
    else if (line.match(/^\d+\. /)) {
      listType = 'ol'
      currentList.push(line.replace(/^\d+\. /, ''))
    }
    // Paragraphs
    else if (line.trim()) {
      elements.push(
        <p
          key={index}
          className="my-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: processInlineMarkdown(line) }}
        />
      )
    }
  }

  const processInlineMarkdown = (text: string): string => {
    return text
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 text-sm">$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
  }

  lines.forEach((line, index) => processLine(line, index))

  // Flush remaining list
  if (currentList.length > 0) {
    const ListTag = listType === 'ol' ? 'ol' : 'ul'
    elements.push(
      <ListTag key="final-list" className={`pl-6 space-y-2 my-4 ${listType === 'ol' ? 'list-decimal' : 'list-disc'}`}>
        {currentList.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: processInlineMarkdown(item) }} />
        ))}
      </ListTag>
    )
  }

  return <div className="prose-content">{elements}</div>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(slug, 3)

  return (
    <article className="container mx-auto px-4 py-8 md:py-12">
      {/* Back to Blog */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm font-medium hover:underline mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      {/* Featured Image */}
      <div className="relative aspect-[21/9] mb-8 border-2 border-foreground overflow-hidden">
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Article Header */}
      <header className="max-w-3xl mx-auto mb-8">
        <Badge className="mb-4 border-2 border-foreground">{post.category}</Badge>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
          {post.title}
        </h1>

        {/* Author Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-foreground">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>
                {post.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">{post.author.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatBlogDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime} min read
            </span>
          </div>
        </div>
      </header>

      <Separator className="max-w-3xl mx-auto mb-8" />

      {/* Article Content */}
      <div className="max-w-3xl mx-auto">
        <MarkdownContent content={post.content} />
      </div>

      <Separator className="max-w-3xl mx-auto my-12" />

      {/* Social Share */}
      <section className="max-w-3xl mx-auto mb-12">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-4">Share this article</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="border-2 border-foreground">
            <Twitter className="h-4 w-4" />
            <span className="sr-only">Share on Twitter</span>
          </Button>
          <Button variant="outline" size="icon" className="border-2 border-foreground">
            <Facebook className="h-4 w-4" />
            <span className="sr-only">Share on Facebook</span>
          </Button>
          <Button variant="outline" size="icon" className="border-2 border-foreground">
            <Linkedin className="h-4 w-4" />
            <span className="sr-only">Share on LinkedIn</span>
          </Button>
          <Button variant="outline" size="icon" className="border-2 border-foreground">
            <LinkIcon className="h-4 w-4" />
            <span className="sr-only">Copy link</span>
          </Button>
        </div>
      </section>

      {/* Author Bio */}
      <section className="max-w-3xl mx-auto mb-12">
        <Card className="border-2 border-foreground">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Avatar className="h-16 w-16 border-2 border-foreground">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>
                  {post.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-lg">{post.author.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{post.author.role}</p>
                <p className="text-sm">
                  {post.author.name} is a {post.author.role.toLowerCase()} at ApartmentDibs,
                  helping tenants and landlords navigate the rental market with expert insights
                  and practical advice.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Comments Placeholder */}
      <section className="max-w-3xl mx-auto mb-12">
        <Card className="border-2 border-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              Comments are coming soon! In the meantime, share your thoughts on social media.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="group">
                <Card className="border-2 border-foreground overflow-hidden transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={relatedPost.featuredImage}
                      alt={relatedPost.title}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-2 left-2 text-xs">
                      {relatedPost.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold group-hover:underline line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {formatBlogDate(relatedPost.publishedAt)} &bull; {relatedPost.readTime} min
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
