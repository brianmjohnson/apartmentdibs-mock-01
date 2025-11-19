'use client'

import { useState } from 'react'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
  Eye,
  FileSignature,
  Phone,
  Edit,
  X,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/mock-data/agent'

// Mock calendar events
const mockCalendarEvents = [
  {
    id: 'event-001',
    type: 'showing',
    title: 'Property Showing',
    propertyAddress: '123 Main St, Unit 4B',
    applicantId: 'Applicant #2847',
    date: '2025-11-20',
    time: '10:00 AM',
    duration: 30,
    notes: 'First-time viewing, interested in the layout',
  },
  {
    id: 'event-002',
    type: 'showing',
    title: 'Property Showing',
    propertyAddress: '456 Bedford Ave, PH2',
    applicantId: 'Applicant #2934',
    date: '2025-11-20',
    time: '2:00 PM',
    duration: 45,
    notes: 'Second viewing, bringing partner',
  },
  {
    id: 'event-003',
    type: 'lease_signing',
    title: 'Lease Signing',
    propertyAddress: '789 Park Place',
    applicantId: 'Applicant #2812',
    date: '2025-11-21',
    time: '11:00 AM',
    duration: 60,
    notes: 'Bring two forms of ID',
  },
  {
    id: 'event-004',
    type: 'follow_up',
    title: 'Follow-up Call',
    propertyAddress: '321 Atlantic Ave, Suite 5A',
    applicantId: 'Applicant #2956',
    date: '2025-11-22',
    time: '3:00 PM',
    duration: 15,
    notes: 'Discuss move-in date flexibility',
  },
  {
    id: 'event-005',
    type: 'showing',
    title: 'Property Showing',
    propertyAddress: '888 Clinton St',
    applicantId: 'Applicant #2089',
    date: '2025-11-25',
    time: '9:00 AM',
    duration: 30,
    notes: 'CRM lead - invited to apply',
  },
  {
    id: 'event-006',
    type: 'lease_signing',
    title: 'Lease Signing',
    propertyAddress: '555 Prospect Ave, 3F',
    applicantId: 'Applicant #2903',
    date: '2025-11-19',
    time: '4:00 PM',
    duration: 60,
    notes: 'Final walkthrough before signing',
  },
]

const getEventTypeStyles = (type: string) => {
  switch (type) {
    case 'showing':
      return {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        border: 'border-blue-300',
        text: 'text-blue-800 dark:text-blue-200',
        badge: 'bg-blue-100 text-blue-800 border-blue-300',
      }
    case 'lease_signing':
      return {
        bg: 'bg-green-100 dark:bg-green-900/30',
        border: 'border-green-300',
        text: 'text-green-800 dark:text-green-200',
        badge: 'bg-green-100 text-green-800 border-green-300',
      }
    case 'follow_up':
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        border: 'border-yellow-300',
        text: 'text-yellow-800 dark:text-yellow-200',
        badge: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      }
    default:
      return {
        bg: 'bg-gray-100 dark:bg-gray-900/30',
        border: 'border-gray-300',
        text: 'text-gray-800 dark:text-gray-200',
        badge: 'bg-gray-100 text-gray-800 border-gray-300',
      }
  }
}

const getEventTypeIcon = (type: string) => {
  switch (type) {
    case 'showing':
      return Eye
    case 'lease_signing':
      return FileSignature
    case 'follow_up':
      return Phone
    default:
      return CalendarIcon
  }
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10, 1)) // November 2025
  const [selectedDate, setSelectedDate] = useState<string | null>('2025-11-20')

  // Get days in month
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()

  // Get first day of month (0 = Sunday)
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  // Generate calendar days
  const calendarDays = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  // Format date for comparison
  const formatDateString = (day: number) => {
    const month = (currentMonth.getMonth() + 1).toString().padStart(2, '0')
    const dayStr = day.toString().padStart(2, '0')
    return `${currentMonth.getFullYear()}-${month}-${dayStr}`
  }

  // Get events for a specific date
  const getEventsForDate = (dateStr: string) => {
    return mockCalendarEvents.filter((event) => event.date === dateStr)
  }

  // Get selected date events
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : []

  // Navigate months
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">Manage your showings, signings, and follow-ups</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Grid */}
        <Card className="border-foreground border-2 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </CardTitle>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" onClick={prevMonth} className="border-2">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={nextMonth} className="border-2">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day headers */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-muted-foreground p-2 text-center text-sm font-medium"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="h-24 p-2" />
                }

                const dateStr = formatDateString(day)
                const events = getEventsForDate(dateStr)
                const isSelected = dateStr === selectedDate
                const isToday = dateStr === '2025-11-19' // Mock today

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`h-24 rounded-md border-2 p-2 text-left transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : isToday
                          ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                          : 'hover:border-muted-foreground/30 border-transparent'
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${isToday ? 'text-yellow-700 dark:text-yellow-300' : ''}`}
                    >
                      {day}
                    </span>
                    <div className="mt-1 space-y-0.5">
                      {events.slice(0, 2).map((event) => {
                        const styles = getEventTypeStyles(event.type)
                        return (
                          <div
                            key={event.id}
                            className={`truncate rounded px-1 py-0.5 text-xs ${styles.bg} ${styles.text}`}
                          >
                            {event.time.split(' ')[0]}
                          </div>
                        )
                      })}
                      {events.length > 2 && (
                        <div className="text-muted-foreground text-xs">
                          +{events.length - 2} more
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Events */}
        <Card className="border-foreground border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {selectedDate ? formatDate(selectedDate) : 'Select a date'}
            </CardTitle>
            <CardDescription>{selectedDateEvents.length} event(s) scheduled</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => {
                  const styles = getEventTypeStyles(event.type)
                  const Icon = getEventTypeIcon(event.type)

                  return (
                    <div
                      key={event.id}
                      className={`rounded-md border-2 p-3 ${styles.border} ${styles.bg}`}
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <Badge variant="outline" className={styles.badge}>
                          <Icon className="mr-1 h-3 w-3" />
                          {event.type.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="text-muted-foreground h-3 w-3" />
                          <span className="font-medium">{event.time}</span>
                          <span className="text-muted-foreground">({event.duration} min)</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="text-muted-foreground h-3 w-3" />
                          <span>{event.propertyAddress}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <User className="text-muted-foreground h-3 w-3" />
                          <span>{event.applicantId}</span>
                        </div>

                        {event.notes && (
                          <p className="text-muted-foreground mt-2 text-xs">{event.notes}</p>
                        )}
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 border-2">
                          <Edit className="mr-1 h-3 w-3" />
                          Reschedule
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-2 border-red-300 text-red-700 hover:bg-red-50"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-muted-foreground py-8 text-center">
                <CalendarIcon className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>No events scheduled</p>
                <Button size="sm" variant="outline" className="mt-3 border-2">
                  Add Event
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card className="border-foreground border-2">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>All scheduled events for the next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {mockCalendarEvents
              .sort(
                (a, b) =>
                  new Date(a.date + ' ' + a.time).getTime() -
                  new Date(b.date + ' ' + b.time).getTime()
              )
              .slice(0, 6)
              .map((event) => {
                const styles = getEventTypeStyles(event.type)
                const Icon = getEventTypeIcon(event.type)

                return (
                  <div key={event.id} className={`rounded-md border-2 p-3 ${styles.border}`}>
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant="outline" className={styles.badge}>
                        <Icon className="mr-1 h-3 w-3" />
                        {event.type.replace('_', ' ')}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {formatDate(event.date)}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{event.propertyAddress}</p>
                    <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                      <Clock className="h-3 w-3" />
                      {event.time}
                      <span className="mx-1">-</span>
                      {event.applicantId}
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
