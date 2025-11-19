'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Building,
  Home,
  DollarSign,
  Sparkles,
  Upload,
  Shield,
  Eye,
  X,
  AlertTriangle,
  Image as ImageIcon,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  amenityOptions,
  propertyTypeOptions,
  leaseTermOptions,
  petPolicyOptions,
  parkingOptions,
  formatCurrency,
} from '@/lib/mock-data/agent'

const steps = [
  { id: 1, name: 'Property Details', icon: Building },
  { id: 2, name: 'Listing Details', icon: DollarSign },
  { id: 3, name: 'Amenities', icon: Sparkles },
  { id: 4, name: 'Photos', icon: Upload },
  { id: 5, name: 'Screening', icon: Shield },
  { id: 6, name: 'Review', icon: Eye },
]

interface FormData {
  // Step 1: Property Details
  address: string
  unit: string
  propertyType: string
  beds: number
  baths: number
  sqft: number
  yearBuilt: number

  // Step 2: Listing Details
  rent: number
  deposit: number
  leaseTerm: string
  availableDate: string
  description: string

  // Step 3: Amenities
  amenities: string[]
  petPolicy: string
  parking: string

  // Step 4: Photos
  photos: string[]

  // Step 5: Screening
  minCreditScore: number
  incomeRatio: number
  maxEvictionYears: number
  backgroundCheck: boolean
}

const initialFormData: FormData = {
  address: '',
  unit: '',
  propertyType: '',
  beds: 1,
  baths: 1,
  sqft: 0,
  yearBuilt: 2000,
  rent: 0,
  deposit: 0,
  leaseTerm: '12',
  availableDate: '',
  description: '',
  amenities: [],
  petPolicy: 'no_pets',
  parking: 'street',
  photos: [],
  minCreditScore: 650,
  incomeRatio: 40,
  maxEvictionYears: 7,
  backgroundCheck: true,
}

export default function CreateListing() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)

  const updateFormData = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSaveDraft = () => {
    // Mock save draft
    alert('Draft saved successfully!')
  }

  const handlePublish = () => {
    // Mock publish
    alert('Listing published successfully!')
    router.push('/dashboard/listings')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Listing</h1>
        <p className="text-muted-foreground">
          Fill out the details to create a new property listing
        </p>
      </div>

      {/* Progress Steps */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isCompleted = currentStep > step.id
            const isCurrent = currentStep === step.id

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    isCompleted
                      ? 'bg-primary border-primary text-primary-foreground'
                      : isCurrent
                        ? 'bg-background border-primary text-primary'
                        : 'bg-muted border-muted-foreground/30 text-muted-foreground'
                  } `}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span
                  className={`mt-2 hidden text-xs sm:block ${isCurrent ? 'font-medium' : 'text-muted-foreground'}`}
                >
                  {step.name}
                </span>
              </div>
            )
          })}
        </div>
        <div className="bg-muted-foreground/30 absolute top-5 right-0 left-0 -z-10 h-0.5">
          <div
            className="bg-primary h-full transition-all"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Steps */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].name}</CardTitle>
          <CardDescription>
            Step {currentStep} of {steps.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Property Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Property Address *</Label>
                <Input
                  id="address"
                  placeholder="123 Main St, Brooklyn, NY 11211"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  className="border-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unit">Unit Number</Label>
                  <Input
                    id="unit"
                    placeholder="Unit 4B"
                    value={formData.unit}
                    onChange={(e) => updateFormData('unit', e.target.value)}
                    className="border-2"
                  />
                </div>
                <div>
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(v) => updateFormData('propertyType', v)}
                  >
                    <SelectTrigger className="border-2">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="beds">Bedrooms *</Label>
                  <Select
                    value={String(formData.beds)}
                    onValueChange={(v) => updateFormData('beds', Number(v))}
                  >
                    <SelectTrigger className="border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num === 0 ? 'Studio' : num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="baths">Bathrooms *</Label>
                  <Select
                    value={String(formData.baths)}
                    onValueChange={(v) => updateFormData('baths', Number(v))}
                  >
                    <SelectTrigger className="border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 1.5, 2, 2.5, 3, 3.5, 4].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sqft">Square Footage</Label>
                  <Input
                    id="sqft"
                    type="number"
                    placeholder="950"
                    value={formData.sqft || ''}
                    onChange={(e) => updateFormData('sqft', Number(e.target.value))}
                    className="border-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="yearBuilt">Year Built</Label>
                <Input
                  id="yearBuilt"
                  type="number"
                  placeholder="2000"
                  value={formData.yearBuilt || ''}
                  onChange={(e) => updateFormData('yearBuilt', Number(e.target.value))}
                  className="border-2"
                />
              </div>
            </div>
          )}

          {/* Step 2: Listing Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rent">Monthly Rent *</Label>
                  <div className="relative">
                    <DollarSign className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                    <Input
                      id="rent"
                      type="number"
                      placeholder="3000"
                      value={formData.rent || ''}
                      onChange={(e) => updateFormData('rent', Number(e.target.value))}
                      className="border-2 pl-9"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="deposit">Security Deposit *</Label>
                  <div className="relative">
                    <DollarSign className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                    <Input
                      id="deposit"
                      type="number"
                      placeholder="3000"
                      value={formData.deposit || ''}
                      onChange={(e) => updateFormData('deposit', Number(e.target.value))}
                      className="border-2 pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="leaseTerm">Lease Term *</Label>
                  <Select
                    value={formData.leaseTerm}
                    onValueChange={(v) => updateFormData('leaseTerm', v)}
                  >
                    <SelectTrigger className="border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {leaseTermOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="availableDate">Available Date *</Label>
                  <Input
                    id="availableDate"
                    type="date"
                    value={formData.availableDate}
                    onChange={(e) => updateFormData('availableDate', e.target.value)}
                    className="border-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the property, its features, and the neighborhood..."
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  className="min-h-[150px] border-2"
                />
              </div>
            </div>
          )}

          {/* Step 3: Amenities */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label>Amenities</Label>
                <p className="text-muted-foreground mb-3 text-sm">
                  Select all amenities that apply
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {amenityOptions.map((amenity) => (
                    <div
                      key={amenity}
                      className={`flex cursor-pointer items-center gap-2 border-2 p-3 transition-colors ${
                        formData.amenities.includes(amenity)
                          ? 'bg-primary/10 border-primary'
                          : 'border-border hover:border-primary/50'
                      } `}
                      onClick={() => toggleAmenity(amenity)}
                    >
                      <Checkbox
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                      />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="petPolicy">Pet Policy</Label>
                  <Select
                    value={formData.petPolicy}
                    onValueChange={(v) => updateFormData('petPolicy', v)}
                  >
                    <SelectTrigger className="border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {petPolicyOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="parking">Parking Options</Label>
                  <Select
                    value={formData.parking}
                    onValueChange={(v) => updateFormData('parking', v)}
                  >
                    <SelectTrigger className="border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {parkingOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Photos */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div
                className="border-foreground hover:bg-muted/50 cursor-pointer border-2 border-dashed p-8 text-center transition-colors"
                onClick={() => {
                  // Mock photo upload
                  updateFormData('photos', [
                    ...formData.photos,
                    `photo-${formData.photos.length + 1}`,
                  ])
                }}
              >
                <Upload className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="font-medium">Click to upload photos</p>
                <p className="text-muted-foreground text-sm">
                  or drag and drop PNG, JPG up to 10MB
                </p>
              </div>

              {formData.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {formData.photos.map((photo, index) => (
                    <div
                      key={photo}
                      className="bg-muted border-foreground relative aspect-video border-2"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="text-muted-foreground h-8 w-8" />
                      </div>
                      <span className="absolute bottom-2 left-2 text-xs font-medium">
                        Photo {index + 1}
                      </span>
                      <button
                        className="bg-background border-foreground hover:bg-destructive hover:text-destructive-foreground absolute top-2 right-2 border p-1"
                        onClick={() => {
                          updateFormData(
                            'photos',
                            formData.photos.filter((_, i) => i !== index)
                          )
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-muted-foreground text-sm">
                Tip: Properties with 10+ photos get 3x more inquiries
              </p>
            </div>
          )}

          {/* Step 5: Screening Criteria */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="border-2 border-yellow-300 bg-yellow-50 p-4 dark:bg-yellow-900/20">
                <div className="flex gap-2">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                      Fair Housing Compliance
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Ensure your screening criteria comply with local fair housing laws. Overly
                      restrictive criteria may be discriminatory.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between">
                  <Label>Minimum Credit Score</Label>
                  <span className="font-bold">{formData.minCreditScore}</span>
                </div>
                <Slider
                  value={[formData.minCreditScore]}
                  onValueChange={([v]) => updateFormData('minCreditScore', v)}
                  min={500}
                  max={800}
                  step={10}
                  className="w-full"
                />
                <div className="text-muted-foreground mt-1 flex justify-between text-xs">
                  <span>500</span>
                  <span>800</span>
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between">
                  <Label>Income-to-Rent Ratio</Label>
                  <span className="font-bold">{formData.incomeRatio}x</span>
                </div>
                <Slider
                  value={[formData.incomeRatio]}
                  onValueChange={([v]) => updateFormData('incomeRatio', v)}
                  min={25}
                  max={50}
                  step={1}
                  className="w-full"
                />
                <div className="text-muted-foreground mt-1 flex justify-between text-xs">
                  <span>25x</span>
                  <span>50x</span>
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between">
                  <Label>Eviction History (Max Years)</Label>
                  <span className="font-bold">{formData.maxEvictionYears} years</span>
                </div>
                <Slider
                  value={[formData.maxEvictionYears]}
                  onValueChange={([v]) => updateFormData('maxEvictionYears', v)}
                  min={3}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="text-muted-foreground mt-1 flex justify-between text-xs">
                  <span>3 years</span>
                  <span>10 years</span>
                </div>
              </div>

              <div className="border-foreground flex items-center gap-3 border-2 p-4">
                <Checkbox
                  id="backgroundCheck"
                  checked={formData.backgroundCheck}
                  onCheckedChange={(checked) => updateFormData('backgroundCheck', !!checked)}
                />
                <Label htmlFor="backgroundCheck" className="cursor-pointer">
                  Require background check
                </Label>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Property Details Summary */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold">Property Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Address</span>
                      <span className="font-medium">{formData.address || '-'}</span>
                    </div>
                    {formData.unit && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Unit</span>
                        <span className="font-medium">{formData.unit}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium capitalize">{formData.propertyType || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bed/Bath</span>
                      <span className="font-medium">
                        {formData.beds} bed / {formData.baths} bath
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size</span>
                      <span className="font-medium">{formData.sqft || '-'} sqft</span>
                    </div>
                  </div>
                </div>

                {/* Listing Details Summary */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold">Listing Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rent</span>
                      <span className="font-medium">
                        {formData.rent ? formatCurrency(formData.rent) : '-'}/mo
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deposit</span>
                      <span className="font-medium">
                        {formData.deposit ? formatCurrency(formData.deposit) : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lease Term</span>
                      <span className="font-medium">{formData.leaseTerm} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Available</span>
                      <span className="font-medium">{formData.availableDate || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {formData.amenities.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-bold">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity) => (
                      <Badge key={amenity} variant="outline" className="border-2">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Photos */}
              <div>
                <h3 className="mb-3 text-lg font-bold">Photos</h3>
                <p className="text-muted-foreground text-sm">
                  {formData.photos.length} photo(s) uploaded
                </p>
              </div>

              {/* Screening Criteria */}
              <div>
                <h3 className="mb-3 text-lg font-bold">Screening Criteria</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min Credit Score</span>
                    <span className="font-medium">{formData.minCreditScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Income Ratio</span>
                    <span className="font-medium">{formData.incomeRatio}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Eviction History</span>
                    <span className="font-medium">{formData.maxEvictionYears} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Background Check</span>
                    <span className="font-medium">
                      {formData.backgroundCheck ? 'Required' : 'Not required'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="border-2"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-3">
          {currentStep === 6 && (
            <Button variant="outline" onClick={handleSaveDraft} className="border-2">
              Save Draft
            </Button>
          )}

          {currentStep < 6 ? (
            <Button onClick={nextStep} className="border-foreground border-2">
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handlePublish} className="border-foreground border-2">
              <Check className="mr-2 h-4 w-4" />
              Publish Listing
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
