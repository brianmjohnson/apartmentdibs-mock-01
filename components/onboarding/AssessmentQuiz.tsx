'use client'

import { useState } from 'react'
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'

type EmploymentType = 'w2' | 'self_employed' | 'student' | 'retired' | 'unemployed'
type PetOwnership = 'yes' | 'no'
type ApplicationType = 'solo' | 'group'
type RecentRelocation = 'yes' | 'no'

interface AssessmentAnswers {
  employmentType?: EmploymentType
  petOwnership?: PetOwnership
  applicationType?: ApplicationType
  recentRelocation?: RecentRelocation
}

interface Question {
  id: keyof AssessmentAnswers
  title: string
  description: string
  options: { value: string; label: string; description?: string }[]
}

interface AssessmentQuizProps {
  onComplete: (answers: AssessmentAnswers) => Promise<void>
  initialAnswers?: AssessmentAnswers
  className?: string
}

const questions: Question[] = [
  {
    id: 'employmentType',
    title: 'What is your employment type?',
    description: 'This helps us determine which documents you&apos;ll need to provide.',
    options: [
      { value: 'w2', label: 'W-2 Employee', description: 'Regular salaried or hourly' },
      {
        value: 'self_employed',
        label: 'Self-Employed',
        description: 'Freelancer, contractor, or business owner',
      },
      { value: 'student', label: 'Student', description: 'Currently enrolled in school' },
      { value: 'retired', label: 'Retired', description: 'Receiving pension or retirement income' },
      { value: 'unemployed', label: 'Unemployed', description: 'Currently not employed' },
    ],
  },
  {
    id: 'petOwnership',
    title: 'Do you have any pets?',
    description: 'Some listings require pet documentation.',
    options: [
      { value: 'yes', label: 'Yes', description: 'I have one or more pets' },
      { value: 'no', label: 'No', description: 'I don&apos;t have any pets' },
    ],
  },
  {
    id: 'applicationType',
    title: 'Are you applying solo or with roommates?',
    description: 'Group applications have different requirements.',
    options: [
      { value: 'solo', label: 'Solo', description: 'Just me on the lease' },
      { value: 'group', label: 'With Roommates', description: 'Multiple people on the lease' },
    ],
  },
  {
    id: 'recentRelocation',
    title: 'Have you relocated recently?',
    description: 'Recent moves may affect reference verification.',
    options: [
      { value: 'yes', label: 'Yes', description: 'I moved in the last 6 months' },
      { value: 'no', label: 'No', description: 'I&apos;ve been at my current address 6+ months' },
    ],
  },
]

export function AssessmentQuiz({
  onComplete,
  initialAnswers = {},
  className,
}: AssessmentQuizProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<AssessmentAnswers>(initialAnswers)
  const [isLoading, setIsLoading] = useState(false)

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100
  const canProceed = answers[currentQuestion.id] !== undefined
  const isLastStep = currentStep === questions.length - 1

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
  }

  const handleNext = async () => {
    if (isLastStep) {
      setIsLoading(true)
      try {
        // Track analytics
        if (typeof window !== 'undefined' && window.posthog) {
          window.posthog.capture('assessment_completed', {
            ...answers,
          })
        }

        await onComplete(answers)
      } finally {
        setIsLoading(false)
      }
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="space-y-4">
          <div className="text-muted-foreground flex justify-between text-sm">
            <span>
              Question {currentStep + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <CardTitle className="text-xl">{currentQuestion.title}</CardTitle>
          <CardDescription className="mt-2">{currentQuestion.description}</CardDescription>
        </div>

        <RadioGroup
          value={answers[currentQuestion.id] || ''}
          onValueChange={handleAnswer}
          className="space-y-3"
        >
          {currentQuestion.options.map((option) => (
            <div key={option.value}>
              <Label
                htmlFor={option.value}
                className="hover:bg-muted/50 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5 flex cursor-pointer items-start space-x-3 rounded-lg border p-4 transition-colors"
              >
                <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                <div className="space-y-1">
                  <span className="font-medium">{option.label}</span>
                  {option.description && (
                    <p className="text-muted-foreground text-sm">{option.description}</p>
                  )}
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 0 || isLoading}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={!canProceed || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : isLastStep ? (
              'Generate Checklist'
            ) : (
              <>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
