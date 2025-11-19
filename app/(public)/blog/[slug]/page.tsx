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
  MessageCircle,
} from 'lucide-react'
import {
  getBlogPostBySlug,
  getRelatedPosts,
  formatBlogDate,
  mockBlogPosts,
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
          <pre
            key={`code-${index}`}
            className="bg-muted border-foreground overflow-x-auto border-2 p-4 text-sm"
          >
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
        const cells = line.split('|').filter((cell) => cell.trim())
        tableRows.push(cells.map((cell) => cell.trim()))
      }
      return
    } else if (inTable) {
      // End table
      elements.push(
        <div key={`table-${index}`} className="my-4 overflow-x-auto">
          <table className="border-foreground w-full border-2">
            <thead className="bg-muted">
              <tr>
                {tableRows[0]?.map((cell, i) => (
                  <th key={i} className="border-foreground border-b-2 p-2 text-left font-bold">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex} className="border-border border-b">
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
        <ListTag
          key={`list-${index}`}
          className={`my-4 space-y-2 pl-6 ${listType === 'ol' ? 'list-decimal' : 'list-disc'}`}
        >
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
        <h2 key={index} className="mt-8 mb-4 text-2xl font-bold">
          {line.replace('## ', '')}
        </h2>
      )
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="mt-6 mb-3 text-xl font-semibold">
          {line.replace('### ', '')}
        </h3>
      )
    }
    // Blockquotes
    else if (line.startsWith('> ')) {
      elements.push(
        <blockquote
          key={index}
          className="border-primary text-muted-foreground my-4 border-l-4 pl-4 italic"
        >
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
    return (
      text
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 text-sm">$1</code>')
        // Links
        .replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          '<a href="$2" class="text-primary hover:underline">$1</a>'
        )
    )
  }

  lines.forEach((line, index) => processLine(line, index))

  // Flush remaining list
  if (currentList.length > 0) {
    const ListTag = listType === 'ol' ? 'ol' : 'ul'
    elements.push(
      <ListTag
        key="final-list"
        className={`my-4 space-y-2 pl-6 ${listType === 'ol' ? 'list-decimal' : 'list-disc'}`}
      >
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
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      {/* Featured Image */}
      <div className="border-foreground relative mb-8 aspect-[21/9] overflow-hidden border-2">
        <Image src={post.featuredImage} alt={post.title} fill className="object-cover" priority />
      </div>

      {/* Article Header */}
      <header className="mx-auto mb-8 max-w-3xl">
        <Badge className="border-foreground mb-4 border-2">{post.category}</Badge>
        <h1 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        {/* Author Info */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Avatar className="border-foreground h-12 w-12 border-2">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>
                {post.author.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post.author.name}</p>
              <p className="text-muted-foreground text-sm">{post.author.role}</p>
            </div>
          </div>
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
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

      <Separator className="mx-auto mb-8 max-w-3xl" />

      {/* Article Content */}
      <div className="mx-auto max-w-3xl">
        <MarkdownContent content={post.content} />
      </div>

      <Separator className="mx-auto my-12 max-w-3xl" />

      {/* Social Share */}
      <section className="mx-auto mb-12 max-w-3xl">
        <h2 className="mb-4 text-sm font-bold tracking-wider uppercase">Share this article</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="border-foreground border-2">
            <Twitter className="h-4 w-4" />
            <span className="sr-only">Share on Twitter</span>
          </Button>
          <Button variant="outline" size="icon" className="border-foreground border-2">
            <Facebook className="h-4 w-4" />
            <span className="sr-only">Share on Facebook</span>
          </Button>
          <Button variant="outline" size="icon" className="border-foreground border-2">
            <Linkedin className="h-4 w-4" />
            <span className="sr-only">Share on LinkedIn</span>
          </Button>
          <Button variant="outline" size="icon" className="border-foreground border-2">
            <LinkIcon className="h-4 w-4" />
            <span className="sr-only">Copy link</span>
          </Button>
        </div>
      </section>

      {/* Author Bio */}
      <section className="mx-auto mb-12 max-w-3xl">
        <Card className="border-foreground border-2">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <Avatar className="border-foreground h-16 w-16 border-2">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>
                  {post.author.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-bold">{post.author.name}</h3>
                <p className="text-muted-foreground mb-2 text-sm">{post.author.role}</p>
                <p className="text-sm">
                  {post.author.name} is a {post.author.role.toLowerCase()} at ApartmentDibs, helping
                  tenants and landlords navigate the rental market with expert insights and
                  practical advice.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Comments Placeholder */}
      <section className="mx-auto mb-12 max-w-3xl">
        <Card className="border-foreground border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground py-8 text-center">
              Comments are coming soon! In the meantime, share your thoughts on social media.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-2xl font-bold">Related Articles</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="group">
                <Card className="border-foreground overflow-hidden border-2 transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={relatedPost.featuredImage}
                      alt={relatedPost.title}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-2 left-2 text-xs">{relatedPost.category}</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="line-clamp-2 font-semibold group-hover:underline">
                      {relatedPost.title}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm">
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
