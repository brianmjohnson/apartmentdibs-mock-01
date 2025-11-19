'use client'

import { useState } from 'react'
import { FileText, ImageIcon, Download, Eye, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export interface FileAttachmentData {
  id: string
  name: string
  type: 'image' | 'pdf' | 'document'
  url: string
  size?: number
  uploadedAt?: Date
}

interface FileAttachmentProps {
  attachment: FileAttachmentData
  onRemove?: () => void
  showPreview?: boolean
  className?: string
}

export function FileAttachment({
  attachment,
  onRemove,
  showPreview = true,
  className,
}: FileAttachmentProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = () => {
    switch (attachment.type) {
      case 'image':
        return <ImageIcon className="h-5 w-5" />
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(attachment.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = attachment.name
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className={cn('group flex items-center gap-3 rounded-lg border p-3', className)}>
        {/* Preview thumbnail for images */}
        {attachment.type === 'image' ? (
          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded">
            <img
              src={attachment.url}
              alt={attachment.name}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="bg-muted flex h-12 w-12 flex-shrink-0 items-center justify-center rounded">
            {getFileIcon()}
          </div>
        )}

        {/* File info */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{attachment.name}</p>
          <p className="text-muted-foreground text-xs">
            {formatFileSize(attachment.size)}
            {attachment.uploadedAt && (
              <span className="ml-2">
                {new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: 'numeric',
                }).format(attachment.uploadedAt)}
              </span>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {showPreview && (attachment.type === 'image' || attachment.type === 'pdf') && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPreviewOpen(true)}
              className="h-8 w-8"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">Preview</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            disabled={isLoading}
            className="h-8 w-8"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span className="sr-only">Download</span>
          </Button>
          {onRemove && (
            <Button variant="ghost" size="icon" onClick={onRemove} className="h-8 w-8">
              <X className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          )}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{attachment.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {attachment.type === 'image' ? (
              <img
                src={attachment.url}
                alt={attachment.name}
                className="max-h-[70vh] w-full object-contain"
              />
            ) : attachment.type === 'pdf' ? (
              <iframe
                src={attachment.url}
                title={attachment.name}
                className="h-[70vh] w-full rounded border"
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Inline attachment preview for chat messages
interface InlineAttachmentProps {
  attachment: FileAttachmentData
  className?: string
}

export function InlineAttachment({ attachment, className }: InlineAttachmentProps) {
  if (attachment.type === 'image') {
    return (
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn('block', className)}
      >
        <img src={attachment.url} alt={attachment.name} className="max-h-48 rounded-lg" />
      </a>
    )
  }

  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('bg-muted/50 hover:bg-muted flex items-center gap-2 rounded-lg p-2', className)}
    >
      <FileText className="h-4 w-4" />
      <span className="truncate text-sm">{attachment.name}</span>
    </a>
  )
}
