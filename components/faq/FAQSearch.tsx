'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { FAQAccordion, type FAQItem } from '@/components/marketing/FAQAccordion'

interface FAQSearchProps {
  items: FAQItem[]
  onQuestionExpand?: (question: string) => void
  onSearch?: (query: string, resultsCount: number) => void
}

export function FAQSearch({ items, onQuestionExpand, onSearch }: FAQSearchProps) {
  const [query, setQuery] = useState('')

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items

    const lowerQuery = query.toLowerCase()
    return items.filter(
      (item) =>
        item.question.toLowerCase().includes(lowerQuery) ||
        item.answer.toLowerCase().includes(lowerQuery)
    )
  }, [items, query])

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery)
    if (onSearch) {
      const filtered = items.filter(
        (item) =>
          item.question.toLowerCase().includes(newQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(newQuery.toLowerCase())
      )
      onSearch(newQuery, filtered.length)
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          type="search"
          placeholder="Search frequently asked questions..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {query && filteredItems.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground mb-2">No results found for &quot;{query}&quot;</p>
          <p className="text-muted-foreground text-sm">
            Try different keywords or contact support for help.
          </p>
        </div>
      ) : (
        <FAQAccordion items={filteredItems} onQuestionExpand={onQuestionExpand} />
      )}

      {query && filteredItems.length > 0 && (
        <p className="text-muted-foreground text-center text-sm">
          Showing {filteredItems.length} of {items.length} questions
        </p>
      )}
    </div>
  )
}
