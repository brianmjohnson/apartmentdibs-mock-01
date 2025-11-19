// Landlord Profile Types and Mock Data

export interface LandlordProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  properties: number;
  totalUnits: number;
  occupiedUnits: number;
  monthlyRevenue: number;
}

export interface Property {
  id: string;
  address: string;
  type: 'Multi-family' | 'Single family' | 'Condo' | 'Townhouse';
  units: number;
  occupied: number;
  vacant: number;
  monthlyRevenue: number;
  yearBuilt: number;
  manager: 'self' | 'agent';
  agentId?: string;
  agentName?: string;
  imageUrl?: string;
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  beds: number;
  baths: number;
  sqft: number;
  rent: number;
  status: 'occupied' | 'vacant' | 'listed';
  tenant?: TenantInfo;
  listingId?: string;
}

export interface TenantInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  leaseStart: string;
  leaseEnd: string;
  paymentStatus: 'current' | 'late' | 'delinquent';
  lastPaymentDate?: string;
}

export interface LeaseHistory {
  id: string;
  unitId: string;
  tenantName: string;
  leaseStart: string;
  leaseEnd: string;
  monthlyRent: number;
  endReason: 'expired' | 'terminated' | 'renewed';
}

export interface LandlordListing {
  id: string;
  propertyId: string;
  unitId: string;
  propertyAddress: string;
  unitNumber: string;
  price: number;
  status: 'active' | 'pending_review' | 'closed';
  daysListed: number;
  applicantCount: number;
  shortlistedCount: number;
  beds: number;
  baths: number;
  sqft: number;
  screeningCriteria: {
    minCreditScore: number;
    incomeToRentRatio: number;
    maxEvictionYears: number;
    backgroundCheckRequired: boolean;
  };
}

export interface LandlordApplicant {
  id: string;
  listingId: string;
  displayId: string;
  incomeRatio: number;
  creditBand: string;
  employmentTenure: string;
  employmentType: string;
  status: 'shortlisted' | 'pending' | 'selected' | 'denied';
  appliedAt: string;
  pets: boolean;
  petDetails?: string;
  occupants: number;
  moveInDate: string;
  competitiveEdge: string;
}

export interface LandlordActivity {
  id: string;
  type: 'application' | 'agent_update' | 'maintenance' | 'payment' | 'lease';
  description: string;
  timestamp: string;
  propertyId?: string;
  unitId?: string;
}

export interface PendingDecision {
  id: string;
  listingId: string;
  propertyAddress: string;
  unitNumber: string;
  shortlistedCount: number;
  daysPending: number;
  price: number;
}

export interface LeaseExpiration {
  id: string;
  propertyId: string;
  unitId: string;
  propertyAddress: string;
  unitNumber: string;
  tenantName: string;
  leaseEnd: string;
  daysUntilExpiration: number;
  rent: number;
}

// Mock Data
export const mockLandlordProfile: LandlordProfile = {
  id: "landlord-1",
  name: "David Patel",
  email: "david@email.com",
  phone: "(555) 987-6543",
  properties: 3,
  totalUnits: 12,
  occupiedUnits: 10,
  monthlyRevenue: 32500
};

export const mockProperties: Property[] = [
  {
    id: "property-1",
    address: "100 Park Avenue, Brooklyn, NY",
    type: "Multi-family",
    units: 6,
    occupied: 5,
    vacant: 1,
    monthlyRevenue: 18000,
    yearBuilt: 1985,
    manager: "agent",
    agentId: "agent-1",
    agentName: "Jessica Martinez"
  },
  {
    id: "property-2",
    address: "250 Ocean Parkway, Brooklyn, NY",
    type: "Multi-family",
    units: 4,
    occupied: 4,
    vacant: 0,
    monthlyRevenue: 11500,
    yearBuilt: 1978,
    manager: "self"
  },
  {
    id: "property-3",
    address: "45 Prospect Place, Brooklyn, NY",
    type: "Condo",
    units: 2,
    occupied: 1,
    vacant: 1,
    monthlyRevenue: 3000,
    yearBuilt: 2010,
    manager: "agent",
    agentId: "agent-2",
    agentName: "Michael Chen"
  }
];

export const mockUnits: Unit[] = [
  // Property 1 units
  {
    id: "unit-1",
    propertyId: "property-1",
    unitNumber: "1A",
    beds: 2,
    baths: 1,
    sqft: 900,
    rent: 3000,
    status: "occupied",
    tenant: {
      id: "tenant-1",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "(555) 123-4567",
      leaseStart: "2025-01-01",
      leaseEnd: "2026-01-01",
      paymentStatus: "current",
      lastPaymentDate: "2025-11-01"
    }
  },
  {
    id: "unit-2",
    propertyId: "property-1",
    unitNumber: "1B",
    beds: 1,
    baths: 1,
    sqft: 650,
    rent: 2500,
    status: "occupied",
    tenant: {
      id: "tenant-2",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "(555) 234-5678",
      leaseStart: "2024-08-01",
      leaseEnd: "2025-08-01",
      paymentStatus: "current",
      lastPaymentDate: "2025-11-01"
    }
  },
  {
    id: "unit-3",
    propertyId: "property-1",
    unitNumber: "2A",
    beds: 2,
    baths: 1,
    sqft: 920,
    rent: 3200,
    status: "occupied",
    tenant: {
      id: "tenant-3",
      name: "Michael Brown",
      email: "m.brown@email.com",
      phone: "(555) 345-6789",
      leaseStart: "2024-12-01",
      leaseEnd: "2025-12-01",
      paymentStatus: "late",
      lastPaymentDate: "2025-10-15"
    }
  },
  {
    id: "unit-4",
    propertyId: "property-1",
    unitNumber: "2B",
    beds: 1,
    baths: 1,
    sqft: 680,
    rent: 2600,
    status: "occupied",
    tenant: {
      id: "tenant-4",
      name: "Emily Davis",
      email: "emily.d@email.com",
      phone: "(555) 456-7890",
      leaseStart: "2025-03-01",
      leaseEnd: "2026-03-01",
      paymentStatus: "current",
      lastPaymentDate: "2025-11-01"
    }
  },
  {
    id: "unit-5",
    propertyId: "property-1",
    unitNumber: "3A",
    beds: 3,
    baths: 2,
    sqft: 1200,
    rent: 3700,
    status: "occupied",
    tenant: {
      id: "tenant-5",
      name: "Robert Wilson",
      email: "r.wilson@email.com",
      phone: "(555) 567-8901",
      leaseStart: "2024-06-01",
      leaseEnd: "2025-06-01",
      paymentStatus: "current",
      lastPaymentDate: "2025-11-01"
    }
  },
  {
    id: "unit-6",
    propertyId: "property-1",
    unitNumber: "3B",
    beds: 2,
    baths: 1,
    sqft: 950,
    rent: 3000,
    status: "listed",
    listingId: "landlord-listing-1"
  },
  // Property 2 units
  {
    id: "unit-7",
    propertyId: "property-2",
    unitNumber: "1",
    beds: 2,
    baths: 1,
    sqft: 850,
    rent: 2800,
    status: "occupied",
    tenant: {
      id: "tenant-6",
      name: "Jennifer Lee",
      email: "j.lee@email.com",
      phone: "(555) 678-9012",
      leaseStart: "2025-02-01",
      leaseEnd: "2026-02-01",
      paymentStatus: "current",
      lastPaymentDate: "2025-11-01"
    }
  },
  {
    id: "unit-8",
    propertyId: "property-2",
    unitNumber: "2",
    beds: 2,
    baths: 1,
    sqft: 875,
    rent: 2900,
    status: "occupied",
    tenant: {
      id: "tenant-7",
      name: "David Kim",
      email: "d.kim@email.com",
      phone: "(555) 789-0123",
      leaseStart: "2024-09-01",
      leaseEnd: "2025-09-01",
      paymentStatus: "current",
      lastPaymentDate: "2025-11-01"
    }
  },
  {
    id: "unit-9",
    propertyId: "property-2",
    unitNumber: "3",
    beds: 3,
    baths: 1.5,
    sqft: 1100,
    rent: 3400,
    status: "occupied",
    tenant: {
      id: "tenant-8",
      name: "Amanda Martinez",
      email: "a.martinez@email.com",
      phone: "(555) 890-1234",
      leaseStart: "2025-04-01",
      leaseEnd: "2026-04-01",
      paymentStatus: "current",
      lastPaymentDate: "2025-11-01"
    }
  },
  {
    id: "unit-10",
    propertyId: "property-2",
    unitNumber: "4",
    beds: 1,
    baths: 1,
    sqft: 600,
    rent: 2400,
    status: "occupied",
    tenant: {
      id: "tenant-9",
      name: "Chris Thompson",
      email: "c.thompson@email.com",
      phone: "(555) 901-2345",
      leaseStart: "2024-11-01",
      leaseEnd: "2025-11-30",
      paymentStatus: "current",
      lastPaymentDate: "2025-11-01"
    }
  },
  // Property 3 units
  {
    id: "unit-11",
    propertyId: "property-3",
    unitNumber: "A",
    beds: 2,
    baths: 2,
    sqft: 1050,
    rent: 3000,
    status: "occupied",
    tenant: {
      id: "tenant-10",
      name: "Lisa Anderson",
      email: "l.anderson@email.com",
      phone: "(555) 012-3456",
      leaseStart: "2025-05-01",
      leaseEnd: "2026-05-01",
      paymentStatus: "current",
      lastPaymentDate: "2025-11-01"
    }
  },
  {
    id: "unit-12",
    propertyId: "property-3",
    unitNumber: "B",
    beds: 2,
    baths: 2,
    sqft: 1080,
    rent: 3200,
    status: "listed",
    listingId: "landlord-listing-2"
  }
];

export const mockLeaseHistory: LeaseHistory[] = [
  {
    id: "lease-history-1",
    unitId: "unit-6",
    tenantName: "Mark Garcia",
    leaseStart: "2023-01-01",
    leaseEnd: "2024-01-01",
    monthlyRent: 2800,
    endReason: "expired"
  },
  {
    id: "lease-history-2",
    unitId: "unit-6",
    tenantName: "Anna White",
    leaseStart: "2024-02-01",
    leaseEnd: "2025-02-01",
    monthlyRent: 2900,
    endReason: "terminated"
  },
  {
    id: "lease-history-3",
    unitId: "unit-12",
    tenantName: "Tom Harris",
    leaseStart: "2023-06-01",
    leaseEnd: "2024-06-01",
    monthlyRent: 3000,
    endReason: "expired"
  },
  {
    id: "lease-history-4",
    unitId: "unit-12",
    tenantName: "Nancy Clark",
    leaseStart: "2024-07-01",
    leaseEnd: "2025-07-01",
    monthlyRent: 3100,
    endReason: "terminated"
  }
];

export const mockLandlordListings: LandlordListing[] = [
  {
    id: "landlord-listing-1",
    propertyId: "property-1",
    unitId: "unit-6",
    propertyAddress: "100 Park Avenue, Brooklyn, NY",
    unitNumber: "3B",
    price: 3000,
    status: "pending_review",
    daysListed: 14,
    applicantCount: 8,
    shortlistedCount: 3,
    beds: 2,
    baths: 1,
    sqft: 950,
    screeningCriteria: {
      minCreditScore: 680,
      incomeToRentRatio: 40,
      maxEvictionYears: 7,
      backgroundCheckRequired: true
    }
  },
  {
    id: "landlord-listing-2",
    propertyId: "property-3",
    unitId: "unit-12",
    propertyAddress: "45 Prospect Place, Brooklyn, NY",
    unitNumber: "B",
    price: 3200,
    status: "active",
    daysListed: 5,
    applicantCount: 3,
    shortlistedCount: 0,
    beds: 2,
    baths: 2,
    sqft: 1080,
    screeningCriteria: {
      minCreditScore: 700,
      incomeToRentRatio: 40,
      maxEvictionYears: 7,
      backgroundCheckRequired: true
    }
  }
];

export const mockLandlordApplicants: LandlordApplicant[] = [
  // Shortlisted applicants for listing 1
  {
    id: "landlord-app-1",
    listingId: "landlord-listing-1",
    displayId: "Applicant #3421",
    incomeRatio: 4.2,
    creditBand: "740-760",
    employmentTenure: "3+ years",
    employmentType: "Full-time W2",
    status: "shortlisted",
    appliedAt: "2025-11-10",
    pets: false,
    occupants: 2,
    moveInDate: "2025-12-01",
    competitiveEdge: "Excellent references from previous landlord, stable employment"
  },
  {
    id: "landlord-app-2",
    listingId: "landlord-listing-1",
    displayId: "Applicant #3428",
    incomeRatio: 5.1,
    creditBand: "780-800",
    employmentTenure: "5+ years",
    employmentType: "Self-employed",
    status: "shortlisted",
    appliedAt: "2025-11-08",
    pets: false,
    occupants: 1,
    moveInDate: "2025-12-15",
    competitiveEdge: "High income ratio, excellent credit history"
  },
  {
    id: "landlord-app-3",
    listingId: "landlord-listing-1",
    displayId: "Applicant #3445",
    incomeRatio: 3.8,
    creditBand: "720-740",
    employmentTenure: "2-3 years",
    employmentType: "Full-time W2",
    status: "shortlisted",
    appliedAt: "2025-11-12",
    pets: true,
    petDetails: "1 cat",
    occupants: 2,
    moveInDate: "2025-12-01",
    competitiveEdge: "Willing to sign 2-year lease, great communication"
  },
  // Applicants for listing 2
  {
    id: "landlord-app-4",
    listingId: "landlord-listing-2",
    displayId: "Applicant #3467",
    incomeRatio: 4.0,
    creditBand: "700-720",
    employmentTenure: "1-2 years",
    employmentType: "Full-time W2",
    status: "pending",
    appliedAt: "2025-11-16",
    pets: false,
    occupants: 2,
    moveInDate: "2025-12-01",
    competitiveEdge: "Flexible move-in date"
  },
  {
    id: "landlord-app-5",
    listingId: "landlord-listing-2",
    displayId: "Applicant #3472",
    incomeRatio: 4.5,
    creditBand: "740-760",
    employmentTenure: "3+ years",
    employmentType: "Full-time W2",
    status: "pending",
    appliedAt: "2025-11-17",
    pets: true,
    petDetails: "1 small dog (15 lbs)",
    occupants: 1,
    moveInDate: "2025-12-15",
    competitiveEdge: "Excellent rental history, professional references"
  },
  {
    id: "landlord-app-6",
    listingId: "landlord-listing-2",
    displayId: "Applicant #3478",
    incomeRatio: 3.6,
    creditBand: "680-700",
    employmentTenure: "1-2 years",
    employmentType: "Contract",
    status: "pending",
    appliedAt: "2025-11-18",
    pets: false,
    occupants: 3,
    moveInDate: "2026-01-01",
    competitiveEdge: "Looking for long-term rental"
  }
];

export const mockLandlordActivities: LandlordActivity[] = [
  {
    id: "act-1",
    type: "application",
    description: "New application received for 45 Prospect Place, Unit B",
    timestamp: "2025-11-18T10:30:00Z",
    propertyId: "property-3",
    unitId: "unit-12"
  },
  {
    id: "act-2",
    type: "agent_update",
    description: "Agent shortlisted 3 applicants for 100 Park Avenue, Unit 3B",
    timestamp: "2025-11-17T15:45:00Z",
    propertyId: "property-1",
    unitId: "unit-6"
  },
  {
    id: "act-3",
    type: "maintenance",
    description: "Maintenance request: Leaky faucet at 250 Ocean Parkway, Unit 3",
    timestamp: "2025-11-17T09:00:00Z",
    propertyId: "property-2",
    unitId: "unit-9"
  },
  {
    id: "act-4",
    type: "payment",
    description: "Rent payment received from John Smith (100 Park Avenue, 1A)",
    timestamp: "2025-11-01T08:15:00Z",
    propertyId: "property-1",
    unitId: "unit-1"
  },
  {
    id: "act-5",
    type: "lease",
    description: "Lease renewal reminder: Robert Wilson's lease expires in 30 days",
    timestamp: "2025-11-15T12:00:00Z",
    propertyId: "property-1",
    unitId: "unit-5"
  },
  {
    id: "act-6",
    type: "application",
    description: "2 new applications for 45 Prospect Place, Unit B",
    timestamp: "2025-11-17T14:00:00Z",
    propertyId: "property-3",
    unitId: "unit-12"
  },
  {
    id: "act-7",
    type: "agent_update",
    description: "Agent published listing for 45 Prospect Place, Unit B",
    timestamp: "2025-11-14T16:30:00Z",
    propertyId: "property-3",
    unitId: "unit-12"
  }
];

export const mockPendingDecisions: PendingDecision[] = [
  {
    id: "pending-1",
    listingId: "landlord-listing-1",
    propertyAddress: "100 Park Avenue",
    unitNumber: "3B",
    shortlistedCount: 3,
    daysPending: 5,
    price: 3000
  }
];

export const mockLeaseExpirations: LeaseExpiration[] = [
  {
    id: "exp-1",
    propertyId: "property-2",
    unitId: "unit-10",
    propertyAddress: "250 Ocean Parkway",
    unitNumber: "4",
    tenantName: "Chris Thompson",
    leaseEnd: "2025-11-30",
    daysUntilExpiration: 11,
    rent: 2400
  },
  {
    id: "exp-2",
    propertyId: "property-1",
    unitId: "unit-5",
    propertyAddress: "100 Park Avenue",
    unitNumber: "3A",
    tenantName: "Robert Wilson",
    leaseEnd: "2025-06-01",
    daysUntilExpiration: 194,
    rent: 3700
  },
  {
    id: "exp-3",
    propertyId: "property-1",
    unitId: "unit-2",
    propertyAddress: "100 Park Avenue",
    unitNumber: "1B",
    tenantName: "Sarah Johnson",
    leaseEnd: "2025-08-01",
    daysUntilExpiration: 255,
    rent: 2500
  }
];

// Helper functions
export function getUnitStatusColor(status: Unit['status']): string {
  switch (status) {
    case 'occupied':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'vacant':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'listed':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-300';
  }
}

export function getPaymentStatusColor(status: TenantInfo['paymentStatus']): string {
  switch (status) {
    case 'current':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'late':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'delinquent':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-300';
  }
}

export function getListingStatusColor(status: LandlordListing['status']): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'pending_review':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'closed':
      return 'bg-gray-100 text-gray-600 border-gray-300';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-300';
  }
}

export function getApplicantStatusColor(status: LandlordApplicant['status']): string {
  switch (status) {
    case 'shortlisted':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'pending':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'selected':
      return 'bg-green-100 text-green-800 border-green-300';
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

export function getPropertyUnits(propertyId: string): Unit[] {
  return mockUnits.filter(unit => unit.propertyId === propertyId);
}

export function getPropertyById(propertyId: string): Property | undefined {
  return mockProperties.find(property => property.id === propertyId);
}

export function getUnitById(unitId: string): Unit | undefined {
  return mockUnits.find(unit => unit.id === unitId);
}

export function getListingById(listingId: string): LandlordListing | undefined {
  return mockLandlordListings.find(listing => listing.id === listingId);
}

export function getApplicantsByListing(listingId: string): LandlordApplicant[] {
  return mockLandlordApplicants.filter(applicant => applicant.listingId === listingId);
}

export function getLeaseHistoryByUnit(unitId: string): LeaseHistory[] {
  return mockLeaseHistory.filter(history => history.unitId === unitId);
}

// Property type options for create form
export const propertyTypeOptions = [
  { value: 'Multi-family', label: 'Multi-family' },
  { value: 'Single family', label: 'Single family' },
  { value: 'Condo', label: 'Condo' },
  { value: 'Townhouse', label: 'Townhouse' }
];

// Denial reason options
export const denialReasonOptions = [
  { value: 'insufficient_income', label: 'Insufficient income' },
  { value: 'credit_history', label: 'Credit history concerns' },
  { value: 'rental_history', label: 'Rental history issues' },
  { value: 'background_check', label: 'Background check concerns' },
  { value: 'move_in_date', label: 'Move-in date incompatible' },
  { value: 'pets', label: 'Pet policy violation' },
  { value: 'occupancy', label: 'Occupancy limits exceeded' },
  { value: 'other', label: 'Other reason' }
];
