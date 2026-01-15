'use client'

import { useState } from 'react'
import { Trash2, FileText, Building2, MessageSquare, CheckCircle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DeletableItem {
  id: string
  name: string
  type: 'document' | 'application' | 'message'
  description: string
  createdAt: Date
}

interface SelectiveDeleteProps {
  items: DeletableItem[]
  onDelete?: (itemIds: string[]) => Promise<void>
  className?: string
}

export function SelectiveDelete({ items, onDelete, className }: SelectiveDeleteProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isConfirming, setIsConfirming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const toggleItem = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const toggleAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map((i) => i.id))
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('deletion_requested', {
        scope: 'selective',
        itemsDeleted: selectedItems.length,
      })
    }

    try {
      await onDelete?.(selectedItems)
      setIsComplete(true)
      setTimeout(() => {
        setIsConfirming(false)
        setIsComplete(false)
        setSelectedItems([])
      }, 2000)
    } finally {
      setIsDeleting(false)
    }
  }

  const getItemIcon = (type: DeletableItem['type']) => {
    switch (type) {
      case 'document':
        return <FileText className="text-muted-foreground h-4 w-4" />
      case 'application':
        return <Building2 className="text-muted-foreground h-4 w-4" />
      case 'message':
        return <MessageSquare className="text-muted-foreground h-4 w-4" />
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  const groupedItems = items.reduce(
    (acc, item) => {
      const group = item.type
      if (!acc[group]) acc[group] = []
      acc[group].push(item)
      return acc
    },
    {} as Record<string, DeletableItem[]>
  )

  const typeLabels: Record<string, string> = {
    document: 'Documents',
    application: 'Applications',
    message: 'Messages',
  }

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Selective Data Deletion
          </CardTitle>
          <CardDescription>Delete specific items while keeping your account active</CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              <FileText className="mx-auto mb-3 h-8 w-8" />
              <p>No deletable items found</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={selectedItems.length === items.length}
                    onCheckedChange={toggleAll}
                  />
                  <Label htmlFor="select-all" className="cursor-pointer">
                    Select all ({items.length} items)
                  </Label>
                </div>
                {selectedItems.length > 0 && (
                  <span className="text-muted-foreground text-sm">
                    {selectedItems.length} selected
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {Object.entries(groupedItems).map(([type, typeItems]) => (
                  <div key={type}>
                    <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                      {typeLabels[type]}
                    </h4>
                    <div className="space-y-2">
                      {typeItems.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center space-x-3 rounded-lg border p-3 transition-colors ${
                            selectedItems.includes(item.id) ? 'border-primary bg-primary/5' : ''
                          }`}
                        >
                          <Checkbox
                            id={item.id}
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => toggleItem(item.id)}
                          />
                          <Label
                            htmlFor={item.id}
                            className="flex flex-1 cursor-pointer items-center gap-3"
                          >
                            {getItemIcon(item.type)}
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-muted-foreground text-sm">{item.description}</p>
                            </div>
                            <span className="text-muted-foreground text-sm">
                              {formatDate(item.createdAt)}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="destructive"
                className="w-full"
                disabled={selectedItems.length === 0}
                onClick={() => setIsConfirming(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected ({selectedItems.length})
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isConfirming} onOpenChange={setIsConfirming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedItems.length}{' '}
              {selectedItems.length === 1 ? 'item' : 'items'}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {isComplete ? (
            <div className="py-8 text-center">
              <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-600" />
              <p className="font-medium text-green-600">Deletion Complete</p>
            </div>
          ) : (
            <>
              <div className="bg-muted/50 max-h-48 overflow-y-auto rounded-lg p-3">
                <ul className="space-y-1 text-sm">
                  {selectedItems.map((id) => {
                    const item = items.find((i) => i.id === id)
                    return (
                      <li key={id} className="flex items-center gap-2">
                        {item && getItemIcon(item.type)}
                        <span>{item?.name}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsConfirming(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
