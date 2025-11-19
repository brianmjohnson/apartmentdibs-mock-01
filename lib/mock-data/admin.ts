// Admin Mock Data Types and Data

// Admin Profile
export interface AdminProfile {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'support'
}

export const mockAdminProfile: AdminProfile = {
  id: 'admin-1',
  name: 'Sarah Mitchell',
  email: 'sarah.mitchell@apartmentdibs.com',
  role: 'super_admin',
}

// Platform Stats
export interface AdminStats {
  totalUsers: number
  usersByPersona: {
    tenants: number
    agents: number
    landlords: number
    admins: number
  }
  activeListings: number
  applicationsThisMonth: number
  revenueThisMonth: number
  previousMonthRevenue: number
}

export const mockAdminStats: AdminStats = {
  totalUsers: 12847,
  usersByPersona: {
    tenants: 9823,
    agents: 1542,
    landlords: 1456,
    admins: 26,
  },
  activeListings: 3421,
  applicationsThisMonth: 8934,
  revenueThisMonth: 124500,
  previousMonthRevenue: 118200,
}

// User Types
export type UserPersona = 'tenant' | 'agent' | 'landlord' | 'admin'
export type UserStatus = 'active' | 'suspended' | 'banned' | 'pending'

export interface PlatformUser {
  id: string
  name: string
  email: string
  persona: UserPersona
  status: UserStatus
  joinDate: string
  lastActive: string
  listingsCount?: number
  applicationsCount?: number
  verificationStatus: 'verified' | 'pending' | 'unverified'
}

export const mockUsers: PlatformUser[] = [
  {
    id: 'user-1',
    name: 'Maya Chen',
    email: 'maya.chen@email.com',
    persona: 'tenant',
    status: 'active',
    joinDate: '2025-08-15',
    lastActive: '2025-11-18',
    applicationsCount: 5,
    verificationStatus: 'verified',
  },
  {
    id: 'user-2',
    name: 'James Rodriguez',
    email: 'j.rodriguez@email.com',
    persona: 'tenant',
    status: 'active',
    joinDate: '2025-09-01',
    lastActive: '2025-11-17',
    applicationsCount: 3,
    verificationStatus: 'verified',
  },
  {
    id: 'user-3',
    name: 'Emily Watson',
    email: 'emily.w@realestate.com',
    persona: 'agent',
    status: 'active',
    joinDate: '2025-06-20',
    lastActive: '2025-11-18',
    listingsCount: 12,
    verificationStatus: 'verified',
  },
  {
    id: 'user-4',
    name: 'Marcus Johnson',
    email: 'marcus.j@properties.com',
    persona: 'landlord',
    status: 'active',
    joinDate: '2025-07-10',
    lastActive: '2025-11-15',
    listingsCount: 8,
    verificationStatus: 'verified',
  },
  {
    id: 'user-5',
    name: 'Lisa Park',
    email: 'lisa.park@email.com',
    persona: 'tenant',
    status: 'suspended',
    joinDate: '2025-10-05',
    lastActive: '2025-11-01',
    applicationsCount: 2,
    verificationStatus: 'unverified',
  },
  {
    id: 'user-6',
    name: 'Robert Chen',
    email: 'robert.c@rentals.com',
    persona: 'landlord',
    status: 'active',
    joinDate: '2025-04-22',
    lastActive: '2025-11-18',
    listingsCount: 15,
    verificationStatus: 'verified',
  },
  {
    id: 'user-7',
    name: 'Amanda Foster',
    email: 'amanda.f@brokerage.com',
    persona: 'agent',
    status: 'banned',
    joinDate: '2025-05-18',
    lastActive: '2025-10-28',
    listingsCount: 0,
    verificationStatus: 'unverified',
  },
  {
    id: 'user-8',
    name: 'David Kim',
    email: 'david.kim@email.com',
    persona: 'tenant',
    status: 'pending',
    joinDate: '2025-11-15',
    lastActive: '2025-11-15',
    applicationsCount: 0,
    verificationStatus: 'pending',
  },
  {
    id: 'user-9',
    name: 'Jennifer Lopez',
    email: 'jennifer.l@email.com',
    persona: 'tenant',
    status: 'active',
    joinDate: '2025-07-30',
    lastActive: '2025-11-18',
    applicationsCount: 8,
    verificationStatus: 'verified',
  },
  {
    id: 'user-10',
    name: 'Michael Torres',
    email: 'm.torres@realty.com',
    persona: 'agent',
    status: 'active',
    joinDate: '2025-03-15',
    lastActive: '2025-11-17',
    listingsCount: 24,
    verificationStatus: 'verified',
  },
]

// User Activity Log
export interface UserActivity {
  id: string
  userId: string
  action: string
  timestamp: string
  ipAddress: string
  details?: string
}

export const mockUserActivities: UserActivity[] = [
  {
    id: 'act-1',
    userId: 'user-1',
    action: 'login',
    timestamp: '2025-11-18T14:30:00Z',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'act-2',
    userId: 'user-1',
    action: 'application_submitted',
    timestamp: '2025-11-18T15:00:00Z',
    ipAddress: '192.168.1.100',
    details: 'Application for 123 Main St',
  },
  {
    id: 'act-3',
    userId: 'user-1',
    action: 'document_uploaded',
    timestamp: '2025-11-17T10:00:00Z',
    ipAddress: '192.168.1.100',
    details: 'Pay stub uploaded',
  },
]

// Listing Moderation
export type ListingModerationStatus = 'approved' | 'flagged' | 'under_review' | 'removed'

export interface ModeratedListing {
  id: string
  address: string
  agentOrLandlord: string
  agentOrLandlordId: string
  userType: 'agent' | 'landlord'
  status: ListingModerationStatus
  createdAt: string
  flags: ListingFlag[]
  price: number
  beds: number
  baths: number
}

export interface ListingFlag {
  id: string
  type: 'fair_housing' | 'misleading_info' | 'duplicate' | 'scam' | 'inappropriate_content'
  description: string
  reportedBy: string
  reportedAt: string
}

export const mockModeratedListings: ModeratedListing[] = [
  {
    id: 'mod-listing-1',
    address: '456 Oak Street, Brooklyn, NY',
    agentOrLandlord: 'Emily Watson',
    agentOrLandlordId: 'user-3',
    userType: 'agent',
    status: 'flagged',
    createdAt: '2025-11-10',
    price: 2800,
    beds: 2,
    baths: 1,
    flags: [
      {
        id: 'flag-1',
        type: 'fair_housing',
        description: "Listing mentions 'quiet neighborhood - ideal for professionals'",
        reportedBy: 'system',
        reportedAt: '2025-11-15',
      },
    ],
  },
  {
    id: 'mod-listing-2',
    address: '789 Pine Ave, Manhattan, NY',
    agentOrLandlord: 'Marcus Johnson',
    agentOrLandlordId: 'user-4',
    userType: 'landlord',
    status: 'under_review',
    createdAt: '2025-11-12',
    price: 4500,
    beds: 3,
    baths: 2,
    flags: [
      {
        id: 'flag-2',
        type: 'misleading_info',
        description: 'Photos appear to be from a different property',
        reportedBy: 'user',
        reportedAt: '2025-11-16',
      },
    ],
  },
  {
    id: 'mod-listing-3',
    address: '123 Elm Road, Queens, NY',
    agentOrLandlord: 'Robert Chen',
    agentOrLandlordId: 'user-6',
    userType: 'landlord',
    status: 'approved',
    createdAt: '2025-11-08',
    price: 2200,
    beds: 1,
    baths: 1,
    flags: [],
  },
  {
    id: 'mod-listing-4',
    address: '321 Maple Lane, Brooklyn, NY',
    agentOrLandlord: 'Michael Torres',
    agentOrLandlordId: 'user-10',
    userType: 'agent',
    status: 'removed',
    createdAt: '2025-11-05',
    price: 1800,
    beds: 1,
    baths: 1,
    flags: [
      {
        id: 'flag-3',
        type: 'scam',
        description: 'Price significantly below market rate, requesting wire transfer',
        reportedBy: 'user',
        reportedAt: '2025-11-14',
      },
      {
        id: 'flag-4',
        type: 'duplicate',
        description: 'Same photos used in multiple listings',
        reportedBy: 'system',
        reportedAt: '2025-11-14',
      },
    ],
  },
  {
    id: 'mod-listing-5',
    address: '555 Cedar Blvd, Bronx, NY',
    agentOrLandlord: 'Emily Watson',
    agentOrLandlordId: 'user-3',
    userType: 'agent',
    status: 'approved',
    createdAt: '2025-11-14',
    price: 1950,
    beds: 1,
    baths: 1,
    flags: [],
  },
  {
    id: 'mod-listing-6',
    address: '888 Birch Street, Staten Island, NY',
    agentOrLandlord: 'Robert Chen',
    agentOrLandlordId: 'user-6',
    userType: 'landlord',
    status: 'flagged',
    createdAt: '2025-11-13',
    price: 3200,
    beds: 2,
    baths: 1.5,
    flags: [
      {
        id: 'flag-5',
        type: 'fair_housing',
        description: "Listing states 'no children'",
        reportedBy: 'system',
        reportedAt: '2025-11-17',
      },
    ],
  },
]

// Support Tickets
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export interface SupportTicket {
  id: string
  userId: string
  userName: string
  userEmail: string
  subject: string
  description: string
  priority: TicketPriority
  status: TicketStatus
  category: string
  createdAt: string
  updatedAt: string
  assignedTo?: string
  attachments?: string[]
}

export interface TicketMessage {
  id: string
  ticketId: string
  sender: 'user' | 'support'
  senderName: string
  content: string
  timestamp: string
  isInternal?: boolean
}

export const mockSupportTickets: SupportTicket[] = [
  {
    id: 'ticket-1',
    userId: 'user-1',
    userName: 'Maya Chen',
    userEmail: 'maya.chen@email.com',
    subject: 'Cannot upload documents',
    description:
      "When I try to upload my pay stubs, the page shows an error message saying 'File type not supported'. I'm uploading PDF files which should be supported.",
    priority: 'high',
    status: 'open',
    category: 'Technical Issue',
    createdAt: '2025-11-18T10:00:00Z',
    updatedAt: '2025-11-18T10:00:00Z',
  },
  {
    id: 'ticket-2',
    userId: 'user-2',
    userName: 'James Rodriguez',
    userEmail: 'j.rodriguez@email.com',
    subject: 'Application status not updating',
    description:
      "I submitted an application 3 days ago but the status is still showing as 'pending'. The agent told me they've already reviewed it.",
    priority: 'medium',
    status: 'in_progress',
    category: 'Application Issue',
    createdAt: '2025-11-17T14:30:00Z',
    updatedAt: '2025-11-18T09:15:00Z',
    assignedTo: 'Alex Thompson',
  },
  {
    id: 'ticket-3',
    userId: 'user-4',
    userName: 'Marcus Johnson',
    userEmail: 'marcus.j@properties.com',
    subject: 'Billing discrepancy',
    description:
      'I was charged twice for my monthly subscription this month. Please refund the duplicate charge.',
    priority: 'high',
    status: 'in_progress',
    category: 'Billing',
    createdAt: '2025-11-16T11:00:00Z',
    updatedAt: '2025-11-17T16:00:00Z',
    assignedTo: 'Sarah Mitchell',
  },
  {
    id: 'ticket-4',
    userId: 'user-9',
    userName: 'Jennifer Lopez',
    userEmail: 'jennifer.l@email.com',
    subject: 'How to verify income?',
    description:
      "I'm a freelancer and don't have traditional pay stubs. What documents can I use to verify my income?",
    priority: 'low',
    status: 'resolved',
    category: 'General Inquiry',
    createdAt: '2025-11-15T09:00:00Z',
    updatedAt: '2025-11-15T15:30:00Z',
    assignedTo: 'Alex Thompson',
  },
  {
    id: 'ticket-5',
    userId: 'user-3',
    userName: 'Emily Watson',
    userEmail: 'emily.w@realestate.com',
    subject: 'Listing syndication not working',
    description:
      'My listings are not appearing on Zillow despite enabling syndication. This has been going on for 2 days.',
    priority: 'urgent',
    status: 'open',
    category: 'Technical Issue',
    createdAt: '2025-11-18T08:00:00Z',
    updatedAt: '2025-11-18T08:00:00Z',
  },
  {
    id: 'ticket-6',
    userId: 'user-6',
    userName: 'Robert Chen',
    userEmail: 'robert.c@rentals.com',
    subject: 'Feature request - bulk listing upload',
    description:
      'I manage multiple properties and would like the ability to upload multiple listings at once via CSV or Excel file.',
    priority: 'low',
    status: 'closed',
    category: 'Feature Request',
    createdAt: '2025-11-10T14:00:00Z',
    updatedAt: '2025-11-12T10:00:00Z',
    assignedTo: 'Sarah Mitchell',
  },
]

export const mockTicketMessages: TicketMessage[] = [
  {
    id: 'msg-1',
    ticketId: 'ticket-2',
    sender: 'user',
    senderName: 'James Rodriguez',
    content:
      "I submitted an application 3 days ago but the status is still showing as 'pending'. The agent told me they've already reviewed it.",
    timestamp: '2025-11-17T14:30:00Z',
  },
  {
    id: 'msg-2',
    ticketId: 'ticket-2',
    sender: 'support',
    senderName: 'Alex Thompson',
    content:
      "Hi James, thank you for reaching out. I'm looking into this issue for you. Can you please provide the listing address and your application ID?",
    timestamp: '2025-11-18T09:15:00Z',
  },
  {
    id: 'msg-3',
    ticketId: 'ticket-2',
    sender: 'support',
    senderName: 'Alex Thompson',
    content:
      "Internal note: Checking with the agent to confirm they've updated the status on their end.",
    timestamp: '2025-11-18T09:20:00Z',
    isInternal: true,
  },
]

// Compliance
export type ComplianceAlertStatus = 'pending_review' | 'investigating' | 'resolved' | 'dismissed'
export type ComplianceAlertType =
  | 'potential_bias'
  | 'fair_housing_violation'
  | 'audit_request'
  | 'data_breach'
  | 'policy_violation'

export interface ComplianceAlert {
  id: string
  type: ComplianceAlertType
  userId: string
  userName: string
  description: string
  status: ComplianceAlertStatus
  severity: 'low' | 'medium' | 'high' | 'critical'
  createdAt: string
  updatedAt: string
  assignedTo?: string
}

export const mockComplianceAlerts: ComplianceAlert[] = [
  {
    id: 'alert-1',
    type: 'potential_bias',
    userId: 'user-4',
    userName: 'Marcus Johnson',
    description: 'Landlord denied 5 applicants from the same ZIP code (11201) in the past 30 days',
    status: 'pending_review',
    severity: 'high',
    createdAt: '2025-11-17T10:00:00Z',
    updatedAt: '2025-11-17T10:00:00Z',
  },
  {
    id: 'alert-2',
    type: 'fair_housing_violation',
    userId: 'user-6',
    userName: 'Robert Chen',
    description: 'Listing contains discriminatory language regarding familial status',
    status: 'investigating',
    severity: 'critical',
    createdAt: '2025-11-16T14:30:00Z',
    updatedAt: '2025-11-18T09:00:00Z',
    assignedTo: 'Legal Team',
  },
  {
    id: 'alert-3',
    type: 'audit_request',
    userId: 'user-1',
    userName: 'Maya Chen',
    description: 'User requested access to all personal data under CCPA',
    status: 'pending_review',
    severity: 'medium',
    createdAt: '2025-11-15T16:00:00Z',
    updatedAt: '2025-11-15T16:00:00Z',
  },
  {
    id: 'alert-4',
    type: 'potential_bias',
    userId: 'user-3',
    userName: 'Emily Watson',
    description:
      "Agent's approval rate for applicants with 'foreign-sounding' names is 40% lower than average",
    status: 'resolved',
    severity: 'high',
    createdAt: '2025-11-10T11:00:00Z',
    updatedAt: '2025-11-14T15:00:00Z',
    assignedTo: 'Compliance Officer',
  },
  {
    id: 'alert-5',
    type: 'policy_violation',
    userId: 'user-7',
    userName: 'Amanda Foster',
    description: 'User attempted to collect application fees through platform (prohibited)',
    status: 'resolved',
    severity: 'medium',
    createdAt: '2025-10-28T09:00:00Z',
    updatedAt: '2025-10-30T14:00:00Z',
    assignedTo: 'Sarah Mitchell',
  },
]

// Compliance Rules
export interface ComplianceRule {
  id: string
  jurisdiction: string
  ruleType: string
  description: string
  effectiveDate: string
  status: 'active' | 'pending' | 'deprecated'
  sourceUrl?: string
  logic?: string
}

export const mockComplianceRules: ComplianceRule[] = [
  {
    id: 'rule-1',
    jurisdiction: 'New York City',
    ruleType: 'Fair Housing',
    description: 'Prohibits discrimination based on source of income including Section 8 vouchers',
    effectiveDate: '2008-01-01',
    status: 'active',
    sourceUrl: 'https://www.nyc.gov/site/cchr/law/source-of-income.page',
  },
  {
    id: 'rule-2',
    jurisdiction: 'California',
    ruleType: 'Privacy',
    description: 'CCPA compliance - users must be able to request data deletion',
    effectiveDate: '2020-01-01',
    status: 'active',
    sourceUrl: 'https://oag.ca.gov/privacy/ccpa',
  },
  {
    id: 'rule-3',
    jurisdiction: 'Federal',
    ruleType: 'Fair Housing',
    description: 'Fair Housing Act - prohibits discrimination based on protected classes',
    effectiveDate: '1968-04-11',
    status: 'active',
    sourceUrl:
      'https://www.hud.gov/program_offices/fair_housing_equal_opp/fair_housing_act_overview',
  },
  {
    id: 'rule-4',
    jurisdiction: 'New York State',
    ruleType: 'Tenant Protection',
    description: 'Housing Stability and Tenant Protection Act - rent stabilization rules',
    effectiveDate: '2019-06-14',
    status: 'active',
  },
  {
    id: 'rule-5',
    jurisdiction: 'New Jersey',
    ruleType: 'Fair Housing',
    description: 'Updated source of income protections for Housing Choice Voucher holders',
    effectiveDate: '2026-01-01',
    status: 'pending',
  },
]

// Recent Activity for Dashboard
export interface RecentActivity {
  id: string
  type:
    | 'user_signup'
    | 'flagged_content'
    | 'support_ticket'
    | 'compliance_alert'
    | 'listing_removed'
  title: string
  description: string
  timestamp: string
  link?: string
}

export const mockRecentActivities: RecentActivity[] = [
  {
    id: 'recent-1',
    type: 'user_signup',
    title: 'New User Signup',
    description: 'David Kim registered as a tenant',
    timestamp: '2025-11-18T14:00:00Z',
    link: '/users/user-8',
  },
  {
    id: 'recent-2',
    type: 'flagged_content',
    title: 'Listing Flagged',
    description: '456 Oak Street flagged for potential fair housing violation',
    timestamp: '2025-11-17T15:30:00Z',
    link: '/listings/mod-listing-1',
  },
  {
    id: 'recent-3',
    type: 'support_ticket',
    title: 'Urgent Support Ticket',
    description: 'Emily Watson reported syndication issues',
    timestamp: '2025-11-18T08:00:00Z',
    link: '/support/ticket-5',
  },
  {
    id: 'recent-4',
    type: 'compliance_alert',
    title: 'Compliance Alert',
    description: 'Potential bias detected for Marcus Johnson',
    timestamp: '2025-11-17T10:00:00Z',
    link: '/compliance',
  },
  {
    id: 'recent-5',
    type: 'listing_removed',
    title: 'Listing Removed',
    description: '321 Maple Lane removed for policy violation',
    timestamp: '2025-11-14T16:00:00Z',
    link: '/listings/mod-listing-4',
  },
]

// Platform Analytics
export interface AnalyticsMetric {
  name: string
  value: number
  previousValue: number
  unit?: string
}

export const mockAnalyticsMetrics: AnalyticsMetric[] = [
  { name: 'Daily Active Users', value: 3421, previousValue: 3156 },
  { name: 'Monthly Active Users', value: 9823, previousValue: 9145 },
  { name: 'User Retention (30-day)', value: 72, previousValue: 68, unit: '%' },
  { name: 'Application Conversion', value: 34, previousValue: 31, unit: '%' },
  { name: 'Average Session Duration', value: 8.5, previousValue: 7.8, unit: 'min' },
  { name: 'Bounce Rate', value: 28, previousValue: 32, unit: '%' },
]

export interface RevenueBreakdown {
  source: string
  amount: number
  percentage: number
}

export const mockRevenueBreakdown: RevenueBreakdown[] = [
  { source: 'Agent Subscriptions', amount: 62500, percentage: 50.2 },
  { source: 'Landlord Subscriptions', amount: 37500, percentage: 30.1 },
  { source: 'Premium Features', amount: 15600, percentage: 12.5 },
  { source: 'Application Fees', amount: 8900, percentage: 7.2 },
]

// Admin Team
export interface AdminTeamMember {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'support'
  status: 'active' | 'pending'
  joinedAt: string
  lastActive: string
}

export const mockAdminTeam: AdminTeamMember[] = [
  {
    id: 'admin-1',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@apartmentdibs.com',
    role: 'super_admin',
    status: 'active',
    joinedAt: '2024-01-15',
    lastActive: '2025-11-18',
  },
  {
    id: 'admin-2',
    name: 'Alex Thompson',
    email: 'alex.thompson@apartmentdibs.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-06-01',
    lastActive: '2025-11-18',
  },
  {
    id: 'admin-3',
    name: 'Jordan Lee',
    email: 'jordan.lee@apartmentdibs.com',
    role: 'support',
    status: 'active',
    joinedAt: '2024-09-15',
    lastActive: '2025-11-17',
  },
  {
    id: 'admin-4',
    name: 'Taylor Brown',
    email: 'taylor.brown@apartmentdibs.com',
    role: 'support',
    status: 'pending',
    joinedAt: '2025-11-10',
    lastActive: '2025-11-10',
  },
]

// Feature Flags
export interface FeatureFlag {
  id: string
  name: string
  description: string
  enabled: boolean
  rolloutPercentage: number
}

export const mockFeatureFlags: FeatureFlag[] = [
  {
    id: 'ff-1',
    name: 'new_search_algorithm',
    description: 'Enable improved search ranking algorithm',
    enabled: true,
    rolloutPercentage: 100,
  },
  {
    id: 'ff-2',
    name: 'ai_matching',
    description: 'AI-powered tenant-listing matching',
    enabled: true,
    rolloutPercentage: 50,
  },
  {
    id: 'ff-3',
    name: 'instant_verification',
    description: 'Real-time income verification',
    enabled: false,
    rolloutPercentage: 0,
  },
  {
    id: 'ff-4',
    name: 'chat_support',
    description: 'In-app live chat support',
    enabled: true,
    rolloutPercentage: 25,
  },
]

// Helper Functions
export function getUserStatusColor(status: UserStatus): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-300'
    case 'suspended':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'banned':
      return 'bg-red-100 text-red-800 border-red-300'
    case 'pending':
      return 'bg-blue-100 text-blue-800 border-blue-300'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-300'
  }
}

export function getPersonaColor(persona: UserPersona): string {
  switch (persona) {
    case 'tenant':
      return 'bg-blue-100 text-blue-800 border-blue-300'
    case 'agent':
      return 'bg-purple-100 text-purple-800 border-purple-300'
    case 'landlord':
      return 'bg-green-100 text-green-800 border-green-300'
    case 'admin':
      return 'bg-red-100 text-red-800 border-red-300'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-300'
  }
}

export function getTicketPriorityColor(priority: TicketPriority): string {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-300'
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-300'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'low':
      return 'bg-gray-100 text-gray-600 border-gray-300'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-300'
  }
}

export function getTicketStatusColor(status: TicketStatus): string {
  switch (status) {
    case 'open':
      return 'bg-blue-100 text-blue-800 border-blue-300'
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'resolved':
      return 'bg-green-100 text-green-800 border-green-300'
    case 'closed':
      return 'bg-gray-100 text-gray-600 border-gray-300'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-300'
  }
}

export function getModerationStatusColor(status: ListingModerationStatus): string {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800 border-green-300'
    case 'flagged':
      return 'bg-red-100 text-red-800 border-red-300'
    case 'under_review':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'removed':
      return 'bg-gray-100 text-gray-600 border-gray-300'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-300'
  }
}

export function getComplianceSeverityColor(
  severity: 'low' | 'medium' | 'high' | 'critical'
): string {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-300'
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-300'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'low':
      return 'bg-gray-100 text-gray-600 border-gray-300'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-300'
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export function getPercentageChange(
  current: number,
  previous: number
): { value: number; isPositive: boolean } {
  const change = ((current - previous) / previous) * 100
  return {
    value: Math.abs(change),
    isPositive: change >= 0,
  }
}
