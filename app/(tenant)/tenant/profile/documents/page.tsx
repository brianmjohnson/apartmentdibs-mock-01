'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Upload,
  FileText,
  CreditCard,
  Briefcase,
  FileSpreadsheet,
  Building,
  Users,
  Trash2,
  Eye,
  Download
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  mockDocuments,
  getDocumentStatusColor,
  formatDate,
  Document
} from '@/lib/mock-data/tenant'

interface DocumentCategory {
  id: Document['category']
  label: string
  description: string
  icon: React.ElementType
  required: boolean
}

const documentCategories: DocumentCategory[] = [
  {
    id: 'government_id',
    label: 'Government ID',
    description: 'Passport, driver\'s license, or state ID',
    icon: CreditCard,
    required: true
  },
  {
    id: 'pay_stubs',
    label: 'Pay Stubs',
    description: 'Last 3 months of pay stubs',
    icon: FileText,
    required: true
  },
  {
    id: 'employment_letter',
    label: 'Employment Letter',
    description: 'Letter from employer verifying employment',
    icon: Briefcase,
    required: true
  },
  {
    id: 'tax_returns',
    label: 'Tax Returns',
    description: 'For self-employed applicants',
    icon: FileSpreadsheet,
    required: false
  },
  {
    id: 'bank_statements',
    label: 'Bank Statements',
    description: 'Recent bank account statements',
    icon: Building,
    required: false
  },
  {
    id: 'references',
    label: 'References',
    description: 'Previous landlord or personal references',
    icon: Users,
    required: false
  }
]

export default function DocumentsPage() {
  const [dragActive, setDragActive] = useState<string | null>(null)

  const getDocumentsByCategory = (category: Document['category']) => {
    return mockDocuments.filter(doc => doc.category === category)
  }

  const handleDrag = (e: React.DragEvent, category: string | null) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(category)
    } else if (e.type === 'dragleave') {
      setDragActive(null)
    }
  }

  const handleDrop = (e: React.DragEvent, category: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(null)
    // In a real app, handle file upload here
    console.log('Files dropped for category:', category, e.dataTransfer.files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
    // In a real app, handle file upload here
    console.log('Files selected for category:', category, e.target.files)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/tenant/profile">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Upload and manage your verification documents
          </p>
        </div>
      </div>

      {/* Document Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {documentCategories.map((category) => {
          const documents = getDocumentsByCategory(category.id)
          const Icon = category.icon
          const isActive = dragActive === category.id

          return (
            <Card
              key={category.id}
              className={`border-2 ${isActive ? 'border-primary bg-primary/5' : 'border-foreground'}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {category.label}
                        {category.required && (
                          <span className="text-xs text-red-500">*Required</span>
                        )}
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Dropzone */}
                <div
                  className={`
                    border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
                    transition-colors hover:border-primary hover:bg-primary/5
                    ${isActive ? 'border-primary bg-primary/5' : 'border-border'}
                  `}
                  onDragEnter={(e) => handleDrag(e, category.id)}
                  onDragLeave={(e) => handleDrag(e, null)}
                  onDragOver={(e) => handleDrag(e, category.id)}
                  onDrop={(e) => handleDrop(e, category.id)}
                  onClick={() => document.getElementById(`file-${category.id}`)?.click()}
                >
                  <input
                    id={`file-${category.id}`}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileInput(e, category.id)}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, JPG, or PNG up to 10MB
                  </p>
                </div>

                {/* Uploaded Documents */}
                {documents.length > 0 && (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.fileSize} - {formatDate(doc.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={`${getDocumentStatusColor(doc.status)} border text-xs`}>
                            {doc.status === 'pending_review' ? 'Pending' : doc.status === 'verified' ? 'Verified' : 'Rejected'}
                          </Badge>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {documents.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No documents uploaded yet
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Upload Guidelines */}
      <Card className="border-2 border-border bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Upload Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="font-medium text-foreground">File formats:</span>
              PDF, JPG, or PNG
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium text-foreground">Max file size:</span>
              10MB per file
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium text-foreground">Image quality:</span>
              Ensure all text is readable and images are not blurry
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium text-foreground">Privacy:</span>
              Your documents are encrypted and stored securely
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
