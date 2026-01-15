'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, RotateCcw, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface SelfieCaptureProps {
  onCapture?: (imageData: string) => Promise<void>
  instructions?: string[]
  className?: string
}

type CaptureState = 'idle' | 'streaming' | 'captured' | 'verifying' | 'success' | 'error'

export function SelfieCapture({
  onCapture,
  instructions = [
    'Position your face in the oval',
    'Ensure good lighting',
    'Remove glasses if possible',
    'Look directly at the camera',
  ],
  className,
}: SelfieCaptureProps) {
  const [captureState, setCaptureState] = useState<CaptureState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCaptureState('streaming')
      setError(null)
    } catch {
      setError('Unable to access camera. Please check permissions.')
      setCaptureState('error')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    const imageData = canvas.toDataURL('image/jpeg', 0.9)
    setCapturedImage(imageData)
    setCaptureState('captured')
    stopCamera()
  }

  const retake = () => {
    setCapturedImage(null)
    startCamera()
  }

  const confirmPhoto = async () => {
    if (!capturedImage) return

    setCaptureState('verifying')

    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('liveness_completed', {
        method: 'selfie',
      })
    }

    try {
      await onCapture?.(capturedImage)
      setCaptureState('success')
    } catch {
      setError('Verification failed. Please try again.')
      setCaptureState('error')
    }
  }

  const reset = () => {
    setCapturedImage(null)
    setError(null)
    setCaptureState('idle')
    stopCamera()
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Liveness Check
        </CardTitle>
        <CardDescription>Take a selfie to verify you match your ID photo</CardDescription>
      </CardHeader>
      <CardContent>
        {captureState === 'idle' && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="mb-2 font-medium">Instructions:</p>
              <ul className="text-muted-foreground space-y-1 text-sm">
                {instructions.map((instruction, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="bg-primary/10 flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium">
                      {index + 1}
                    </span>
                    {instruction}
                  </li>
                ))}
              </ul>
            </div>
            <Button className="w-full" onClick={startCamera}>
              <Camera className="mr-2 h-4 w-4" />
              Start Camera
            </Button>
          </div>
        )}

        {captureState === 'streaming' && (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg bg-black">
              <video ref={videoRef} autoPlay playsInline muted className="w-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-64 w-48 rounded-full border-4 border-white/50" />
              </div>
            </div>
            <Button className="w-full" onClick={capturePhoto}>
              <Camera className="mr-2 h-4 w-4" />
              Take Photo
            </Button>
          </div>
        )}

        {captureState === 'captured' && capturedImage && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg">
              <img src={capturedImage} alt="Captured selfie" className="w-full" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={retake}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Retake
              </Button>
              <Button className="flex-1" onClick={confirmPhoto}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm
              </Button>
            </div>
          </div>
        )}

        {captureState === 'verifying' && (
          <div className="py-8 text-center">
            <Loader2 className="text-primary mx-auto mb-4 h-12 w-12 animate-spin" />
            <p className="font-medium">Verifying your photo...</p>
            <p className="text-muted-foreground mt-1 text-sm">Matching against your ID</p>
          </div>
        )}

        {captureState === 'success' && (
          <div className="py-8 text-center">
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-600" />
            <p className="font-medium text-green-600">Verification Complete</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Your identity has been verified successfully
            </p>
          </div>
        )}

        {captureState === 'error' && (
          <div className="py-8 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />
            <p className="font-medium text-red-600">Verification Failed</p>
            <p className="text-muted-foreground mt-1 text-sm">{error}</p>
            <Button variant="outline" className="mt-4" onClick={reset}>
              Try Again
            </Button>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  )
}
