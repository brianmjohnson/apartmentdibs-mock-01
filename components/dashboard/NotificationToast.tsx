'use client'

import { useEffect } from 'react'
import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { toast } from 'sonner'

export type NotificationType =
  | 'new_applicant'
  | 'documents_complete'
  | 'landlord_reviewed'
  | 'urgent'

interface NotificationData {
  id: string
  type: NotificationType
  title: string
  message: string
  applicantId?: string
  listingAddress?: string
  timestamp: Date
}

const notificationIcons: Record<NotificationType, React.ElementType> = {
  new_applicant: Bell,
  documents_complete: CheckCircle,
  landlord_reviewed: Info,
  urgent: AlertCircle,
}

const notificationStyles: Record<NotificationType, string> = {
  new_applicant: 'border-blue-500',
  documents_complete: 'border-green-500',
  landlord_reviewed: 'border-purple-500',
  urgent: 'border-red-500',
}

export function showNotificationToast(notification: NotificationData) {
  const Icon = notificationIcons[notification.type]
  const borderClass = notificationStyles[notification.type]

  toast.custom(
    (t) => (
      <div
        className={`bg-card text-card-foreground pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border-l-4 shadow-lg ${borderClass}`}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Icon
                className={`h-5 w-5 ${
                  notification.type === 'urgent'
                    ? 'text-red-500'
                    : notification.type === 'documents_complete'
                      ? 'text-green-500'
                      : notification.type === 'landlord_reviewed'
                        ? 'text-purple-500'
                        : 'text-blue-500'
                }`}
              />
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-medium">{notification.title}</p>
              <p className="text-muted-foreground mt-1 text-sm">{notification.message}</p>
              {notification.listingAddress && (
                <p className="text-muted-foreground mt-1 text-xs">{notification.listingAddress}</p>
              )}
            </div>
            <div className="ml-4 flex flex-shrink-0">
              <button
                className="text-muted-foreground hover:text-foreground inline-flex rounded-md focus:ring-2 focus:ring-offset-2 focus:outline-none"
                onClick={() => toast.dismiss(t)}
              >
                <span className="sr-only">Close</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      duration: notification.type === 'urgent' ? 10000 : 5000,
      position: 'top-right',
    }
  )

  // Track analytics
  if (typeof window !== 'undefined' && window.posthog) {
    window.posthog.capture('notification_received', {
      notificationType: notification.type,
      applicantId: notification.applicantId,
    })
  }
}

// Hook for WebSocket-based real-time notifications
export function useNotifications(agentId: string) {
  useEffect(() => {
    // In production, this would connect to WebSocket
    // For now, we simulate with mock notifications
    const mockNotification = () => {
      const notifications: NotificationData[] = [
        {
          id: '1',
          type: 'new_applicant',
          title: 'New Verified Applicant',
          message: 'Applicant #2847 (4.1x income ratio)',
          applicantId: '2847',
          listingAddress: '123 Main St',
          timestamp: new Date(),
        },
        {
          id: '2',
          type: 'documents_complete',
          title: 'Documents Complete',
          message: 'Applicant #2845 is ready for review',
          applicantId: '2845',
          listingAddress: '456 Oak Ave',
          timestamp: new Date(),
        },
      ]

      // This is disabled by default - would be enabled with real WebSocket
      // const randomNotification = notifications[Math.floor(Math.random() * notifications.length)]
      // showNotificationToast(randomNotification)
    }

    // Placeholder for WebSocket connection
    // const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/notifications/${agentId}`)
    // ws.onmessage = (event) => {
    //   const notification = JSON.parse(event.data)
    //   showNotificationToast(notification)
    // }

    return () => {
      // Cleanup WebSocket connection
      // ws.close()
    }
  }, [agentId])
}
