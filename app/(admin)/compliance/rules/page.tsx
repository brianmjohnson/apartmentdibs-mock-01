'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Edit,
  ExternalLink,
  FileText,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  mockComplianceRules,
  formatDate,
} from '@/lib/mock-data/admin'

export default function ComplianceRulesPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'deprecated':
        return 'bg-gray-100 text-gray-600 border-gray-300'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link href="/compliance">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Compliance
        </Button>
      </Link>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance Rules</h1>
          <p className="text-muted-foreground">
            Manage compliance rules and regulations
          </p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="border-2 border-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="border-2 border-foreground max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Compliance Rule</DialogTitle>
              <DialogDescription>
                Define a new compliance rule for the platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jurisdiction">Jurisdiction</Label>
                  <Select>
                    <SelectTrigger className="border-2 mt-1">
                      <SelectValue placeholder="Select jurisdiction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="federal">Federal</SelectItem>
                      <SelectItem value="new_york_city">New York City</SelectItem>
                      <SelectItem value="new_york_state">New York State</SelectItem>
                      <SelectItem value="california">California</SelectItem>
                      <SelectItem value="new_jersey">New Jersey</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rule_type">Rule Type</Label>
                  <Select>
                    <SelectTrigger className="border-2 mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fair_housing">Fair Housing</SelectItem>
                      <SelectItem value="privacy">Privacy</SelectItem>
                      <SelectItem value="tenant_protection">Tenant Protection</SelectItem>
                      <SelectItem value="accessibility">Accessibility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the compliance rule..."
                  className="mt-1 border-2"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="effective_date">Effective Date</Label>
                  <Input
                    id="effective_date"
                    type="date"
                    className="mt-1 border-2"
                  />
                </div>
                <div>
                  <Label htmlFor="source_url">Source URL (optional)</Label>
                  <Input
                    id="source_url"
                    placeholder="https://..."
                    className="mt-1 border-2"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="logic">Rule Logic (JSON, optional)</Label>
                <Textarea
                  id="logic"
                  placeholder='{"condition": "...", "action": "..."}'
                  className="mt-1 border-2 font-mono text-sm"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setAddDialogOpen(false)}
                className="border-2"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Handle add
                  setAddDialogOpen(false)
                }}
                className="border-2 border-foreground"
              >
                Add Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rules Table */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle>All Rules ({mockComplianceRules.length})</CardTitle>
          <CardDescription>
            Compliance rules applied to the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border-2 border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jurisdiction</TableHead>
                  <TableHead>Rule Type</TableHead>
                  <TableHead className="max-w-md">Description</TableHead>
                  <TableHead>Effective Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockComplianceRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">
                      {rule.jurisdiction}
                    </TableCell>
                    <TableCell>{rule.ruleType}</TableCell>
                    <TableCell className="max-w-md">
                      <p className="truncate">{rule.description}</p>
                    </TableCell>
                    <TableCell>{formatDate(rule.effectiveDate)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`border ${getStatusColor(rule.status)}`}
                      >
                        {rule.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {rule.sourceUrl && (
                          <a
                            href={rule.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="ghost" size="icon">
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">View source</span>
                            </Button>
                          </a>
                        )}
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
