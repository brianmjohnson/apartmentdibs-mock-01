'use client'

import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface QuickRepliesProps {
  replies: string[]
  onSelect: (reply: string) => void
  className?: string
}

export function QuickReplies({ replies, onSelect, className }: QuickRepliesProps) {
  return (
    <ScrollArea className={`w-full whitespace-nowrap ${className}`}>
      <div className="flex gap-2 pb-2">
        {replies.map((reply, index) => (
          <button
            key={index}
            onClick={() => onSelect(reply)}
            className="focus:ring-ring rounded-md focus:ring-2 focus:outline-none"
          >
            <Badge variant="outline" className="hover:bg-muted cursor-pointer whitespace-nowrap">
              {reply}
            </Badge>
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

// Editable quick replies for settings
interface EditableQuickRepliesProps {
  replies: string[]
  onChange: (replies: string[]) => void
  className?: string
}

export function EditableQuickReplies({ replies, onChange, className }: EditableQuickRepliesProps) {
  const handleAdd = () => {
    const newReply = prompt('Enter new quick reply:')
    if (newReply?.trim()) {
      onChange([...replies, newReply.trim()])

      // Track analytics
      if (typeof window !== 'undefined' && window.posthog) {
        window.posthog.capture('quick_reply_added')
      }
    }
  }

  const handleRemove = (index: number) => {
    onChange(replies.filter((_, i) => i !== index))
  }

  const handleEdit = (index: number) => {
    const newReply = prompt('Edit quick reply:', replies[index])
    if (newReply?.trim()) {
      const newReplies = [...replies]
      newReplies[index] = newReply.trim()
      onChange(newReplies)
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {replies.map((reply, index) => (
          <div key={index} className="group relative">
            <Badge
              variant="secondary"
              className="cursor-pointer pr-6"
              onClick={() => handleEdit(index)}
            >
              {reply}
            </Badge>
            <button
              onClick={() => handleRemove(index)}
              className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 hidden h-4 w-4 items-center justify-center rounded-full text-xs group-hover:flex"
            >
              x
            </button>
          </div>
        ))}
        <button
          onClick={handleAdd}
          className="text-muted-foreground hover:border-primary hover:text-primary rounded-md border border-dashed px-3 py-1 text-sm"
        >
          + Add reply
        </button>
      </div>
    </div>
  )
}
