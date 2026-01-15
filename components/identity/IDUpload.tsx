'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, Camera, X, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface IDUploadProps {
  acceptedTypes?: string[]
  maxSizeMB?: number
  onUpload?: (file: File) => Promise<void>
  onCapture?: () => void
  className?: string
}

type UploadState = 'idle' | 'uploading' | 'processing' | 'success' | 'error'

export function IDUpload({
  acceptedTypes = ["Driver's License", 'Passport', 'State ID'],
  maxSizeMB = 10,
  onUpload,
  onCapture,
  className,
}: IDUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [progress, setProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`)
      return
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/heic', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPEG, PNG, HEIC, or PDF file')
      return
    }

    setSelectedFile(file)
    setError(null)
    setUploadState('uploading')

    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('id_uploaded', {
        fileType: file.type,
        fileSize: file.size,
      })
    }

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        setProgress(i)
      }

      setUploadState('processing')
      await onUpload?.(file)
      setUploadState('success')
    } catch {
      setUploadState('error')
      setError('Upload failed. Please try again.')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      fileInputRef.current.files = dataTransfer.files
      fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const reset = () => {
    setUploadState('idle')
    setProgress(0)
    setSelectedFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload Government ID
        </CardTitle>
        <CardDescription>Accepted: {acceptedTypes.join(', ')}</CardDescription>
      </CardHeader>
      <CardContent>
        {uploadState === 'idle' && (
          <>
            <div
              className="hover:border-primary hover:bg-muted/50 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="text-muted-foreground mx-auto mb-4 h-10 w-10" />
              <p className="font-medium">Drop your ID here or click to upload</p>
              <p className="text-muted-foreground mt-1 text-sm">
                JPEG, PNG, HEIC, or PDF up to {maxSizeMB}MB
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/heic,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />

            {onCapture && (
              <div className="mt-4">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <span className="bg-background text-muted-foreground relative px-2 text-sm">
                    or
                  </span>
                </div>
                <Button variant="outline" className="mt-4 w-full" onClick={onCapture}>
                  <Camera className="mr-2 h-4 w-4" />
                  Take Photo with Camera
                </Button>
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </>
        )}

        {(uploadState === 'uploading' || uploadState === 'processing') && (
          <div className="py-8 text-center">
            <div className="bg-primary/10 mx-auto mb-4 h-12 w-12 animate-pulse rounded-full" />
            <p className="font-medium">
              {uploadState === 'uploading' ? 'Uploading...' : 'Processing document...'}
            </p>
            <Progress value={progress} className="mt-4" />
            {selectedFile && (
              <p className="text-muted-foreground mt-2 text-sm">{selectedFile.name}</p>
            )}
          </div>
        )}

        {uploadState === 'success' && (
          <div className="py-8 text-center">
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-600" />
            <p className="font-medium text-green-600">Upload Complete</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Your document has been uploaded successfully
            </p>
            <Button variant="outline" className="mt-4" onClick={reset}>
              Upload Different Document
            </Button>
          </div>
        )}

        {uploadState === 'error' && (
          <div className="py-8 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />
            <p className="font-medium text-red-600">Upload Failed</p>
            <p className="text-muted-foreground mt-1 text-sm">{error}</p>
            <Button variant="outline" className="mt-4" onClick={reset}>
              Try Again
            </Button>
          </div>
        )}

        <div className="bg-muted/50 mt-6 rounded-lg p-3">
          <p className="text-muted-foreground text-xs">
            Your ID is encrypted and stored securely. We automatically delete it after 90 days in
            compliance with privacy regulations.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
