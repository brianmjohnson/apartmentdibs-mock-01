'use client'

import { useState } from 'react'
import {
  Plus,
  Trash2,
  GripVertical,
  AlertTriangle,
  Save,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { cn } from '@/lib/utils'

interface Clause {
  id: string
  title: string
  content: string
  isCustom: boolean
  isRequired: boolean
  hasComplianceIssue?: boolean
  complianceWarning?: string
}

interface ClauseEditorProps {
  clauses: Clause[]
  savedClauses?: Clause[]
  onSave: (clauses: Clause[]) => Promise<void>
  onValidate?: (clause: Clause) => { valid: boolean; warning?: string }
  className?: string
}

export function ClauseEditor({
  clauses,
  savedClauses = [],
  onSave,
  onValidate,
  className,
}: ClauseEditorProps) {
  const [editedClauses, setEditedClauses] = useState<Clause[]>(clauses)
  const [isSaving, setIsSaving] = useState(false)

  const handleAddClause = () => {
    const newClause: Clause = {
      id: `custom-${Date.now()}`,
      title: '',
      content: '',
      isCustom: true,
      isRequired: false,
    }
    setEditedClauses([...editedClauses, newClause])
  }

  const handleUpdateClause = (id: string, updates: Partial<Clause>) => {
    setEditedClauses(
      editedClauses.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...updates }
          // Validate if validator provided
          if (onValidate) {
            const result = onValidate(updated)
            updated.hasComplianceIssue = !result.valid
            updated.complianceWarning = result.warning
          }
          return updated
        }
        return c
      })
    )
  }

  const handleRemoveClause = (id: string) => {
    setEditedClauses(editedClauses.filter((c) => c.id !== id))
  }

  const handleLoadSaved = (clause: Clause) => {
    const newClause = {
      ...clause,
      id: `saved-${Date.now()}`,
    }
    setEditedClauses([...editedClauses, newClause])
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Track analytics
      if (typeof window !== 'undefined' && window.posthog) {
        window.posthog.capture('lease_clauses_saved', {
          totalClauses: editedClauses.length,
          customClauses: editedClauses.filter((c) => c.isCustom).length,
        })
      }

      await onSave(editedClauses)
    } finally {
      setIsSaving(false)
    }
  }

  const hasComplianceIssues = editedClauses.some((c) => c.hasComplianceIssue)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Lease Clauses</CardTitle>
        <CardDescription>
          Add or modify clauses for this lease. Required clauses cannot be removed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Compliance Warning */}
        {hasComplianceIssues && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Compliance Issues Detected</AlertTitle>
            <AlertDescription>
              Some clauses may not comply with local regulations. Review the
              flagged items before saving.
            </AlertDescription>
          </Alert>
        )}

        {/* Clause List */}
        <div className="space-y-4">
          {editedClauses.map((clause) => (
            <div
              key={clause.id}
              className={cn(
                'rounded-lg border p-4 space-y-3',
                clause.hasComplianceIssue && 'border-red-300 bg-red-50'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <div className="flex items-center gap-2">
                    {clause.isRequired && (
                      <Badge variant="secondary" className="text-xs">
                        Required
                      </Badge>
                    )}
                    {clause.isCustom && (
                      <Badge variant="outline" className="text-xs">
                        Custom
                      </Badge>
                    )}
                  </div>
                </div>
                {!clause.isRequired && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveClause(clause.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`title-${clause.id}`}>Clause Title</Label>
                <Input
                  id={`title-${clause.id}`}
                  value={clause.title}
                  onChange={(e) =>
                    handleUpdateClause(clause.id, { title: e.target.value })
                  }
                  placeholder="e.g., Snow Removal Responsibility"
                  disabled={clause.isRequired && !clause.isCustom}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`content-${clause.id}`}>Clause Content</Label>
                <Textarea
                  id={`content-${clause.id}`}
                  value={clause.content}
                  onChange={(e) =>
                    handleUpdateClause(clause.id, { content: e.target.value })
                  }
                  placeholder="Enter the full clause text..."
                  rows={3}
                  disabled={clause.isRequired && !clause.isCustom}
                />
              </div>

              {clause.complianceWarning && (
                <div className="flex items-start gap-2 text-sm text-red-600">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{clause.complianceWarning}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Clause Button */}
        <Button variant="outline" className="w-full" onClick={handleAddClause}>
          <Plus className="mr-2 h-4 w-4" />
          Add Custom Clause
        </Button>

        {/* Saved Clauses */}
        {savedClauses.length > 0 && (
          <div className="space-y-3">
            <Label>Saved Clauses</Label>
            <div className="flex flex-wrap gap-2">
              {savedClauses.map((clause) => (
                <Button
                  key={clause.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleLoadSaved(clause)}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  {clause.title}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Click to add a previously saved clause to this lease
            </p>
          </div>
        )}

        {/* Save Button */}
        <Button
          className="w-full"
          onClick={handleSave}
          disabled={isSaving || hasComplianceIssues}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Clauses
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
