// Agent Profile Types and Mock Data
export interface AgentProfile {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  listings: number;
  activeListings: number;
  totalApplicants: number;
  avgDaysToFill: number;
  crmLeads: number;
}

export interface AgentListing {
  id: string;
  address: string;
  unit?: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: 'apartment' | 'house' | 'condo' | 'townhouse';
  status: 'active' | 'pending' | 'rented' | 'expired';
  daysOnMarket: number;
  applicantCount: number;
  views: number;
  inquiries: number;
  availableDate: string;
  imageUrl?: string;
  description?: string;
  amenities: string[];
  petPolicy: string;
  parkingOptions: string;
  screeningCriteria: {
    minCreditScore: number;
    incomeToRentRatio: number;
    maxEvictionYears: number;
    backgroundCheckRequired: boolean;
  };
  syndicationStatus: {
    zillow: boolean;
    apartmentsCom: boolean;
    hotpads: boolean;
    trulia: boolean;
  };
}

export interface Applicant {
  id: string;
  listingId: string;
  displayId: string;
  incomeRatio: number;
  creditBand: string;
  employmentTenure: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'denied';
  appliedAt: string;
  pets: boolean;
  occupants: number;
  moveInDate: string;
}

export interface AgentActivity {
  id: string;
  type: 'application' | 'decision' | 'crm_match' | 'inquiry' | 'syndication';
  description: string;
  timestamp: string;
  listingId?: string;
  applicantId?: string;
}

export interface UrgentAction {
  id: string;
  type: 'no_applicants' | 'incomplete_app' | 'pending_decision';
  title: string;
  description: string;
  listingId?: string;
  daysOld?: number;
}

export interface ListingAnalytics {
  listingId: string;
  totalViews: number;
  uniqueViews: number;
  inquiries: number;
  applications: number;
  conversionRate: number;
  viewsByDay: { date: string; views: number }[];
  trafficSources: { source: string; count: number; percentage: number }[];
}

// Mock Data
export const mockAgentProfile: AgentProfile = {
  id: "agent-1",
  name: "Jessica Martinez",
  company: "Brooklyn Real Estate Co.",
  email: "jessica@brooklynre.com",
  phone: "(718) 555-0123",
  listings: 12,
  activeListings: 5,
  totalApplicants: 47,
  avgDaysToFill: 18,
  crmLeads: 12
};

export const mockAgentListings: AgentListing[] = [
  {
    id: "agent-listing-1",
    address: "123 Main St, Brooklyn, NY",
    unit: "Unit 4B",
    price: 3000,
    beds: 2,
    baths: 1,
    sqft: 950,
    propertyType: "apartment",
    status: "active",
    daysOnMarket: 12,
    applicantCount: 8,
    views: 234,
    inquiries: 15,
    availableDate: "2025-12-01",
    description: "Stunning 2BR apartment in the heart of Brooklyn. Recently renovated with modern finishes, hardwood floors, and abundant natural light.",
    amenities: ["In-Unit W/D", "Dishwasher", "Central AC", "Hardwood Floors", "High Ceilings"],
    petPolicy: "Cats allowed, dogs under 25 lbs",
    parkingOptions: "Street parking",
    screeningCriteria: {
      minCreditScore: 680,
      incomeToRentRatio: 40,
      maxEvictionYears: 7,
      backgroundCheckRequired: true
    },
    syndicationStatus: {
      zillow: true,
      apartmentsCom: true,
      hotpads: true,
      trulia: true
    }
  },
  {
    id: "agent-listing-2",
    address: "456 Bedford Ave, Brooklyn, NY",
    unit: "PH2",
    price: 4500,
    beds: 3,
    baths: 2,
    sqft: 1400,
    propertyType: "apartment",
    status: "active",
    daysOnMarket: 5,
    applicantCount: 3,
    views: 156,
    inquiries: 8,
    availableDate: "2025-12-15",
    description: "Luxurious penthouse with private rooftop access. Floor-to-ceiling windows, chef's kitchen, and spa-like bathrooms.",
    amenities: ["Private Rooftop", "Chef's Kitchen", "In-Unit W/D", "Central AC", "Doorman"],
    petPolicy: "No pets",
    parkingOptions: "Garage available ($300/mo)",
    screeningCriteria: {
      minCreditScore: 720,
      incomeToRentRatio: 45,
      maxEvictionYears: 10,
      backgroundCheckRequired: true
    },
    syndicationStatus: {
      zillow: true,
      apartmentsCom: true,
      hotpads: false,
      trulia: true
    }
  },
  {
    id: "agent-listing-3",
    address: "789 Park Place, Brooklyn, NY",
    price: 2200,
    beds: 1,
    baths: 1,
    sqft: 650,
    propertyType: "apartment",
    status: "pending",
    daysOnMarket: 28,
    applicantCount: 12,
    views: 412,
    inquiries: 22,
    availableDate: "2025-11-30",
    description: "Cozy 1BR in brownstone building. Exposed brick, original hardwood floors, and quiet tree-lined street.",
    amenities: ["Exposed Brick", "Hardwood Floors", "Laundry in Building"],
    petPolicy: "Pets allowed",
    parkingOptions: "Street parking",
    screeningCriteria: {
      minCreditScore: 650,
      incomeToRentRatio: 35,
      maxEvictionYears: 5,
      backgroundCheckRequired: true
    },
    syndicationStatus: {
      zillow: true,
      apartmentsCom: true,
      hotpads: true,
      trulia: true
    }
  },
  {
    id: "agent-listing-4",
    address: "321 Atlantic Ave, Brooklyn, NY",
    unit: "Suite 5A",
    price: 3800,
    beds: 2,
    baths: 2,
    sqft: 1100,
    propertyType: "condo",
    status: "active",
    daysOnMarket: 8,
    applicantCount: 5,
    views: 189,
    inquiries: 11,
    availableDate: "2025-12-01",
    description: "Modern condo with open floor plan. Quartz countertops, stainless appliances, and in-unit laundry.",
    amenities: ["In-Unit W/D", "Dishwasher", "Central AC", "Gym", "Rooftop"],
    petPolicy: "Dogs under 40 lbs",
    parkingOptions: "One parking spot included",
    screeningCriteria: {
      minCreditScore: 700,
      incomeToRentRatio: 40,
      maxEvictionYears: 7,
      backgroundCheckRequired: true
    },
    syndicationStatus: {
      zillow: true,
      apartmentsCom: true,
      hotpads: true,
      trulia: true
    }
  },
  {
    id: "agent-listing-5",
    address: "555 Prospect Ave, Brooklyn, NY",
    unit: "3F",
    price: 2800,
    beds: 2,
    baths: 1,
    sqft: 875,
    propertyType: "apartment",
    status: "rented",
    daysOnMarket: 21,
    applicantCount: 10,
    views: 356,
    inquiries: 18,
    availableDate: "2025-11-01",
    description: "Charming 2BR with original details. Built-in bookshelves, decorative fireplace, and updated kitchen.",
    amenities: ["Dishwasher", "Laundry in Building", "Decorative Fireplace"],
    petPolicy: "Cats only",
    parkingOptions: "Street parking",
    screeningCriteria: {
      minCreditScore: 660,
      incomeToRentRatio: 38,
      maxEvictionYears: 7,
      backgroundCheckRequired: true
    },
    syndicationStatus: {
      zillow: true,
      apartmentsCom: true,
      hotpads: true,
      trulia: true
    }
  },
  {
    id: "agent-listing-6",
    address: "888 Clinton St, Brooklyn, NY",
    price: 5200,
    beds: 3,
    baths: 2.5,
    sqft: 1650,
    propertyType: "townhouse",
    status: "active",
    daysOnMarket: 3,
    applicantCount: 1,
    views: 89,
    inquiries: 4,
    availableDate: "2026-01-01",
    description: "Stunning townhouse with private garden. Three floors of living space, chef's kitchen, and original details throughout.",
    amenities: ["Private Garden", "In-Unit W/D", "Dishwasher", "Central AC", "Fireplace", "Multiple Floors"],
    petPolicy: "Pets allowed",
    parkingOptions: "Private driveway",
    screeningCriteria: {
      minCreditScore: 740,
      incomeToRentRatio: 45,
      maxEvictionYears: 10,
      backgroundCheckRequired: true
    },
    syndicationStatus: {
      zillow: true,
      apartmentsCom: false,
      hotpads: false,
      trulia: true
    }
  }
];

export const mockApplicants: Applicant[] = [
  {
    id: "app-001",
    listingId: "agent-listing-1",
    displayId: "Applicant #2847",
    incomeRatio: 4.1,
    creditBand: "740-760",
    employmentTenure: "3+ years",
    status: "new",
    appliedAt: "2025-11-15",
    pets: false,
    occupants: 2,
    moveInDate: "2025-12-01"
  },
  {
    id: "app-002",
    listingId: "agent-listing-1",
    displayId: "Applicant #2891",
    incomeRatio: 3.8,
    creditBand: "700-720",
    employmentTenure: "1-2 years",
    status: "reviewed",
    appliedAt: "2025-11-14",
    pets: true,
    occupants: 1,
    moveInDate: "2025-12-01"
  },
  {
    id: "app-003",
    listingId: "agent-listing-1",
    displayId: "Applicant #2903",
    incomeRatio: 5.2,
    creditBand: "780-800",
    employmentTenure: "5+ years",
    status: "shortlisted",
    appliedAt: "2025-11-12",
    pets: false,
    occupants: 2,
    moveInDate: "2025-12-15"
  },
  {
    id: "app-004",
    listingId: "agent-listing-1",
    displayId: "Applicant #2915",
    incomeRatio: 3.2,
    creditBand: "660-680",
    employmentTenure: "6 months - 1 year",
    status: "denied",
    appliedAt: "2025-11-10",
    pets: false,
    occupants: 3,
    moveInDate: "2025-12-01"
  },
  {
    id: "app-005",
    listingId: "agent-listing-1",
    displayId: "Applicant #2928",
    incomeRatio: 4.5,
    creditBand: "720-740",
    employmentTenure: "2-3 years",
    status: "new",
    appliedAt: "2025-11-17",
    pets: true,
    occupants: 1,
    moveInDate: "2025-12-01"
  },
  {
    id: "app-006",
    listingId: "agent-listing-2",
    displayId: "Applicant #2934",
    incomeRatio: 6.1,
    creditBand: "800+",
    employmentTenure: "5+ years",
    status: "shortlisted",
    appliedAt: "2025-11-16",
    pets: false,
    occupants: 2,
    moveInDate: "2025-12-15"
  },
  {
    id: "app-007",
    listingId: "agent-listing-2",
    displayId: "Applicant #2941",
    incomeRatio: 4.8,
    creditBand: "760-780",
    employmentTenure: "3+ years",
    status: "reviewed",
    appliedAt: "2025-11-15",
    pets: false,
    occupants: 3,
    moveInDate: "2025-12-15"
  },
  {
    id: "app-008",
    listingId: "agent-listing-3",
    displayId: "Applicant #2812",
    incomeRatio: 3.5,
    creditBand: "680-700",
    employmentTenure: "1-2 years",
    status: "shortlisted",
    appliedAt: "2025-11-08",
    pets: true,
    occupants: 1,
    moveInDate: "2025-11-30"
  },
  {
    id: "app-009",
    listingId: "agent-listing-4",
    displayId: "Applicant #2956",
    incomeRatio: 4.3,
    creditBand: "740-760",
    employmentTenure: "2-3 years",
    status: "new",
    appliedAt: "2025-11-18",
    pets: true,
    occupants: 2,
    moveInDate: "2025-12-01"
  },
  {
    id: "app-010",
    listingId: "agent-listing-4",
    displayId: "Applicant #2963",
    incomeRatio: 3.9,
    creditBand: "720-740",
    employmentTenure: "3+ years",
    status: "reviewed",
    appliedAt: "2025-11-17",
    pets: false,
    occupants: 1,
    moveInDate: "2025-12-01"
  }
];

export const mockAgentActivities: AgentActivity[] = [
  {
    id: "act-1",
    type: "application",
    description: "New application for 123 Main St from Applicant #2928",
    timestamp: "2025-11-17T14:30:00Z",
    listingId: "agent-listing-1",
    applicantId: "app-005"
  },
  {
    id: "act-2",
    type: "decision",
    description: "Landlord shortlisted Applicant #2903 for 123 Main St",
    timestamp: "2025-11-17T10:15:00Z",
    listingId: "agent-listing-1",
    applicantId: "app-003"
  },
  {
    id: "act-3",
    type: "crm_match",
    description: "3 CRM leads match 888 Clinton St criteria",
    timestamp: "2025-11-16T16:45:00Z",
    listingId: "agent-listing-6"
  },
  {
    id: "act-4",
    type: "application",
    description: "New application for 456 Bedford Ave from Applicant #2934",
    timestamp: "2025-11-16T09:00:00Z",
    listingId: "agent-listing-2",
    applicantId: "app-006"
  },
  {
    id: "act-5",
    type: "syndication",
    description: "123 Main St now live on Zillow and Apartments.com",
    timestamp: "2025-11-15T11:30:00Z",
    listingId: "agent-listing-1"
  },
  {
    id: "act-6",
    type: "inquiry",
    description: "5 new inquiries for 456 Bedford Ave",
    timestamp: "2025-11-15T08:00:00Z",
    listingId: "agent-listing-2"
  },
  {
    id: "act-7",
    type: "decision",
    description: "Application denied for Applicant #2915 (insufficient income)",
    timestamp: "2025-11-14T15:20:00Z",
    listingId: "agent-listing-1",
    applicantId: "app-004"
  }
];

export const mockUrgentActions: UrgentAction[] = [
  {
    id: "urgent-1",
    type: "no_applicants",
    title: "Low applicant count",
    description: "888 Clinton St has only 1 applicant after 3 days",
    listingId: "agent-listing-6",
    daysOld: 3
  },
  {
    id: "urgent-2",
    type: "pending_decision",
    title: "Awaiting landlord decision",
    description: "789 Park Place has 3 shortlisted applicants pending final decision",
    listingId: "agent-listing-3",
    daysOld: 5
  },
  {
    id: "urgent-3",
    type: "incomplete_app",
    title: "Incomplete application",
    description: "Applicant #2847 missing income verification documents",
    listingId: "agent-listing-1"
  }
];

export const mockListingAnalytics: Record<string, ListingAnalytics> = {
  "agent-listing-1": {
    listingId: "agent-listing-1",
    totalViews: 234,
    uniqueViews: 198,
    inquiries: 15,
    applications: 8,
    conversionRate: 3.4,
    viewsByDay: [
      { date: "2025-11-12", views: 45 },
      { date: "2025-11-13", views: 38 },
      { date: "2025-11-14", views: 52 },
      { date: "2025-11-15", views: 41 },
      { date: "2025-11-16", views: 33 },
      { date: "2025-11-17", views: 25 }
    ],
    trafficSources: [
      { source: "Zillow", count: 98, percentage: 42 },
      { source: "Apartments.com", count: 56, percentage: 24 },
      { source: "Direct", count: 42, percentage: 18 },
      { source: "HotPads", count: 23, percentage: 10 },
      { source: "Other", count: 15, percentage: 6 }
    ]
  },
  "agent-listing-2": {
    listingId: "agent-listing-2",
    totalViews: 156,
    uniqueViews: 134,
    inquiries: 8,
    applications: 3,
    conversionRate: 1.9,
    viewsByDay: [
      { date: "2025-11-14", views: 35 },
      { date: "2025-11-15", views: 48 },
      { date: "2025-11-16", views: 42 },
      { date: "2025-11-17", views: 31 }
    ],
    trafficSources: [
      { source: "Zillow", count: 72, percentage: 46 },
      { source: "Direct", count: 38, percentage: 24 },
      { source: "Apartments.com", count: 28, percentage: 18 },
      { source: "Trulia", count: 18, percentage: 12 }
    ]
  }
};

// Amenity options for create listing form
export const amenityOptions = [
  "In-Unit W/D",
  "Laundry in Building",
  "Dishwasher",
  "Central AC",
  "Window AC",
  "Hardwood Floors",
  "High Ceilings",
  "Exposed Brick",
  "Doorman",
  "Elevator",
  "Gym",
  "Rooftop",
  "Pool",
  "Concierge",
  "Package Room",
  "Bike Storage",
  "Storage Unit",
  "Balcony",
  "Patio",
  "Private Garden",
  "Fireplace"
];

export const propertyTypeOptions = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" }
];

export const leaseTermOptions = [
  { value: "6", label: "6 months" },
  { value: "12", label: "12 months" },
  { value: "18", label: "18 months" },
  { value: "24", label: "24 months" },
  { value: "flexible", label: "Flexible" }
];

export const petPolicyOptions = [
  { value: "no_pets", label: "No pets" },
  { value: "cats_only", label: "Cats only" },
  { value: "small_dogs", label: "Dogs under 25 lbs" },
  { value: "medium_dogs", label: "Dogs under 40 lbs" },
  { value: "all_pets", label: "All pets allowed" }
];

export const parkingOptions = [
  { value: "none", label: "No parking" },
  { value: "street", label: "Street parking" },
  { value: "lot", label: "Parking lot" },
  { value: "garage", label: "Garage available" },
  { value: "included", label: "Parking included" }
];

// Helper functions
export function getListingStatusColor(status: AgentListing['status']): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'rented':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'expired':
      return 'bg-gray-100 text-gray-600 border-gray-300';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-300';
  }
}

export function getApplicantStatusColor(status: Applicant['status']): string {
  switch (status) {
    case 'new':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'reviewed':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'shortlisted':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'denied':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-300';
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} minutes ago`;
    }
    return `${diffHours} hours ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return formatDate(timestamp);
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function getActivityIcon(type: AgentActivity['type']): string {
  switch (type) {
    case 'application':
      return 'FileText';
    case 'decision':
      return 'CheckCircle';
    case 'crm_match':
      return 'Users';
    case 'inquiry':
      return 'MessageSquare';
    case 'syndication':
      return 'Globe';
    default:
      return 'Activity';
  }
}

// CRM Lead Types and Data
export interface CRMLead {
  id: string;
  displayId: string;
  originalListingId: string;
  originalListingAddress: string;
  denialDate: string;
  denialReason: string;
  incomeRatio: number;
  creditBand: string;
  employmentTenure: string;
  matchingListings: number;
  matchScore: number;
  lastOutreach: string | null;
  budgetMin: number;
  budgetMax: number;
  preferredBeds: number;
  preferredNeighborhoods: string[];
}

export const mockCRMLeads: CRMLead[] = [
  {
    id: 'crm-001',
    displayId: 'Applicant #2301',
    originalListingId: 'agent-listing-1',
    originalListingAddress: '123 Main St, Brooklyn, NY',
    denialDate: '2025-10-28',
    denialReason: 'Higher qualified applicant selected',
    incomeRatio: 4.2,
    creditBand: '720-740',
    employmentTenure: '3+ years',
    matchingListings: 3,
    matchScore: 92,
    lastOutreach: null,
    budgetMin: 2500,
    budgetMax: 3200,
    preferredBeds: 2,
    preferredNeighborhoods: ['Brooklyn Heights', 'Park Slope', 'Cobble Hill']
  },
  {
    id: 'crm-002',
    displayId: 'Applicant #2156',
    originalListingId: 'agent-listing-2',
    originalListingAddress: '456 Bedford Ave, Brooklyn, NY',
    denialDate: '2025-10-15',
    denialReason: 'Unit rented to another applicant',
    incomeRatio: 3.8,
    creditBand: '700-720',
    employmentTenure: '2-3 years',
    matchingListings: 2,
    matchScore: 85,
    lastOutreach: '2025-11-01',
    budgetMin: 4000,
    budgetMax: 5000,
    preferredBeds: 3,
    preferredNeighborhoods: ['Williamsburg', 'Bedford-Stuyvesant']
  },
  {
    id: 'crm-003',
    displayId: 'Applicant #2089',
    originalListingId: 'agent-listing-3',
    originalListingAddress: '789 Park Place, Brooklyn, NY',
    denialDate: '2025-10-20',
    denialReason: 'Listing removed from market',
    incomeRatio: 5.1,
    creditBand: '760-780',
    employmentTenure: '5+ years',
    matchingListings: 4,
    matchScore: 96,
    lastOutreach: null,
    budgetMin: 2000,
    budgetMax: 2800,
    preferredBeds: 1,
    preferredNeighborhoods: ['Crown Heights', 'Prospect Heights', 'Park Slope']
  },
  {
    id: 'crm-004',
    displayId: 'Applicant #2445',
    originalListingId: 'agent-listing-1',
    originalListingAddress: '123 Main St, Brooklyn, NY',
    denialDate: '2025-11-01',
    denialReason: 'Pet policy mismatch',
    incomeRatio: 4.0,
    creditBand: '680-700',
    employmentTenure: '1-2 years',
    matchingListings: 5,
    matchScore: 88,
    lastOutreach: '2025-11-10',
    budgetMin: 2500,
    budgetMax: 3500,
    preferredBeds: 2,
    preferredNeighborhoods: ['Park Slope', 'Prospect Heights']
  },
  {
    id: 'crm-005',
    displayId: 'Applicant #2567',
    originalListingId: 'agent-listing-4',
    originalListingAddress: '321 Atlantic Ave, Brooklyn, NY',
    denialDate: '2025-11-05',
    denialReason: 'Higher qualified applicant selected',
    incomeRatio: 4.5,
    creditBand: '740-760',
    employmentTenure: '3+ years',
    matchingListings: 3,
    matchScore: 91,
    lastOutreach: null,
    budgetMin: 3500,
    budgetMax: 4200,
    preferredBeds: 2,
    preferredNeighborhoods: ['Boerum Hill', 'Cobble Hill', 'Brooklyn Heights']
  }
];

// Calendar Event Types and Data
export interface CalendarEvent {
  id: string;
  type: 'showing' | 'lease_signing' | 'follow_up';
  title: string;
  propertyAddress: string;
  applicantId: string;
  date: string;
  time: string;
  duration: number;
  notes?: string;
}

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'event-001',
    type: 'showing',
    title: 'Property Showing',
    propertyAddress: '123 Main St, Unit 4B',
    applicantId: 'Applicant #2847',
    date: '2025-11-20',
    time: '10:00 AM',
    duration: 30,
    notes: 'First-time viewing, interested in the layout'
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
    notes: 'Second viewing, bringing partner'
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
    notes: 'Bring two forms of ID'
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
    notes: 'Discuss move-in date flexibility'
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
    notes: 'CRM lead - invited to apply'
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
    notes: 'Final walkthrough before signing'
  }
];

// Message Types and Data
export interface Message {
  id: string;
  sender: 'agent' | 'applicant' | 'landlord';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  type: 'applicant' | 'landlord';
  name: string;
  propertyAddress: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export const mockConversations: Conversation[] = [
  {
    id: 'conv-001',
    type: 'applicant',
    name: 'Applicant #2847',
    propertyAddress: '123 Main St, Unit 4B',
    lastMessage: 'Thank you for the update. I look forward to hearing back.',
    lastMessageTime: '2025-11-19T10:30:00Z',
    unreadCount: 2,
    messages: [
      {
        id: 'm1',
        sender: 'agent',
        content: 'Thank you for your application! We have received your documents and are currently reviewing them.',
        timestamp: '2025-11-18T09:00:00Z'
      },
      {
        id: 'm2',
        sender: 'applicant',
        content: 'Thank you! Please let me know if you need any additional information from me.',
        timestamp: '2025-11-18T10:30:00Z'
      },
      {
        id: 'm3',
        sender: 'agent',
        content: 'Could you please provide an additional pay stub from your current employer?',
        timestamp: '2025-11-18T14:00:00Z'
      },
      {
        id: 'm4',
        sender: 'applicant',
        content: 'Of course! I have attached my latest pay stub to this message.',
        timestamp: '2025-11-19T08:00:00Z'
      },
      {
        id: 'm5',
        sender: 'applicant',
        content: 'Thank you for the update. I look forward to hearing back.',
        timestamp: '2025-11-19T10:30:00Z'
      }
    ]
  },
  {
    id: 'conv-002',
    type: 'applicant',
    name: 'Applicant #2934',
    propertyAddress: '456 Bedford Ave, PH2',
    lastMessage: 'Yes, 2 PM works perfectly for me. See you then!',
    lastMessageTime: '2025-11-18T16:00:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'm1',
        sender: 'agent',
        content: 'Hi! Your application for 456 Bedford Ave has been shortlisted. Would you like to schedule a second viewing?',
        timestamp: '2025-11-17T11:00:00Z'
      },
      {
        id: 'm2',
        sender: 'applicant',
        content: 'That\'s great news! Yes, I would love to see the apartment again. I\'d like to bring my partner this time.',
        timestamp: '2025-11-17T13:00:00Z'
      },
      {
        id: 'm3',
        sender: 'agent',
        content: 'Perfect! How does November 20th at 2 PM work for you both?',
        timestamp: '2025-11-18T09:00:00Z'
      },
      {
        id: 'm4',
        sender: 'applicant',
        content: 'Yes, 2 PM works perfectly for me. See you then!',
        timestamp: '2025-11-18T16:00:00Z'
      }
    ]
  },
  {
    id: 'conv-003',
    type: 'landlord',
    name: 'Michael Chen',
    propertyAddress: '789 Park Place',
    lastMessage: 'I approve Applicant #2812 for the lease. Please proceed.',
    lastMessageTime: '2025-11-17T14:00:00Z',
    unreadCount: 1,
    messages: [
      {
        id: 'm1',
        sender: 'agent',
        content: 'Hi Michael, I have 3 shortlisted applicants for 789 Park Place. The top candidate is Applicant #2812 with a 3.5x income ratio and 680-700 credit band.',
        timestamp: '2025-11-16T10:00:00Z'
      },
      {
        id: 'm2',
        sender: 'landlord',
        content: 'Thanks Jessica. What about their rental history?',
        timestamp: '2025-11-16T11:30:00Z'
      },
      {
        id: 'm3',
        sender: 'agent',
        content: 'They have 5+ years of rental history with no evictions. Previous landlord provided excellent references.',
        timestamp: '2025-11-16T12:00:00Z'
      },
      {
        id: 'm4',
        sender: 'landlord',
        content: 'I approve Applicant #2812 for the lease. Please proceed.',
        timestamp: '2025-11-17T14:00:00Z'
      }
    ]
  }
];

// Agent Settings Types and Data
export interface AgentSettings {
  account: {
    name: string;
    email: string;
    phone: string;
    company: string;
    licenseNumber: string;
    website: string;
    bio: string;
  };
  billing: {
    currentPlan: string;
    planPrice: number;
    billingCycle: 'monthly' | 'annual';
    nextBillingDate: string;
    paymentMethod: {
      type: string;
      last4: string;
      brand: string;
      expiry: string;
    };
  };
  notifications: {
    applications: { email: boolean; sms: boolean; push: boolean };
    crm: { email: boolean; sms: boolean; push: boolean };
    landlord: { email: boolean; sms: boolean; push: boolean };
  };
}

export const mockAgentSettings: AgentSettings = {
  account: {
    name: 'Jessica Martinez',
    email: 'jessica@brooklynre.com',
    phone: '(718) 555-0123',
    company: 'Brooklyn Real Estate Co.',
    licenseNumber: 'NYS-2024-78542',
    website: 'https://brooklynre.com',
    bio: 'Experienced real estate agent specializing in Brooklyn rentals with 8+ years in the market.'
  },
  billing: {
    currentPlan: 'Professional',
    planPrice: 99,
    billingCycle: 'monthly',
    nextBillingDate: '2025-12-19',
    paymentMethod: {
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiry: '12/26'
    }
  },
  notifications: {
    applications: { email: true, sms: true, push: true },
    crm: { email: true, sms: false, push: true },
    landlord: { email: true, sms: true, push: true }
  }
};

// Team Member Types
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  status: 'active' | 'pending';
  joinedAt: string;
}

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Jessica Martinez',
    email: 'jessica@brooklynre.com',
    role: 'owner',
    status: 'active',
    joinedAt: '2023-01-15'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@brooklynre.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-03-20'
  },
  {
    id: '3',
    name: 'Sarah Williams',
    email: 'sarah@brooklynre.com',
    role: 'member',
    status: 'active',
    joinedAt: '2024-06-10'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@brooklynre.com',
    role: 'member',
    status: 'pending',
    joinedAt: '2025-11-15'
  }
];
