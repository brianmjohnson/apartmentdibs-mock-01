export interface TenantProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  memberSince: string;
  profileCompletion: number;
  verifications: {
    identity: 'verified' | 'pending' | 'not_started';
    income: 'verified' | 'pending' | 'not_started';
    credit: 'verified' | 'pending' | 'not_started';
    background: 'verified' | 'pending' | 'not_started';
  };
  preferences: {
    budgetMin: number;
    budgetMax: number;
    neighborhoods: string[];
    moveInDate: string;
    mustHaves: string[];
    niceToHaves: string[];
  };
  employment: {
    status: 'employed' | 'self_employed' | 'student' | 'retired' | 'other';
    employer?: string;
    title?: string;
  };
  pets: {
    hasPets: boolean;
    type?: string;
    count?: number;
  };
  occupants: number;
  profileValidUntil: string;
}

export interface Application {
  id: string;
  listingId: string;
  address: string;
  unit?: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'approved' | 'denied' | 'withdrawn';
  appliedAt: string;
  lastUpdate: string;
  rent: number;
  beds: number;
  baths: number;
}

export interface Document {
  id: string;
  name: string;
  category: 'government_id' | 'pay_stubs' | 'employment_letter' | 'tax_returns' | 'bank_statements' | 'references';
  uploadedAt: string;
  status: 'verified' | 'pending_review' | 'rejected';
  fileType: string;
  fileSize: string;
}

export interface Activity {
  id: string;
  type: 'application' | 'document' | 'profile' | 'message' | 'verification';
  description: string;
  timestamp: string;
}

export const mockTenantProfile: TenantProfile = {
  id: "tenant-1",
  firstName: "Maya",
  lastName: "Chen",
  email: "maya.chen@email.com",
  phone: "(415) 555-1234",
  address: {
    street: "456 Oak Ave",
    city: "Mountain View",
    state: "CA",
    zip: "94040"
  },
  memberSince: "2025-08-15",
  profileCompletion: 85,
  verifications: {
    identity: "verified",
    income: "verified",
    credit: "pending",
    background: "not_started"
  },
  preferences: {
    budgetMin: 2500,
    budgetMax: 3500,
    neighborhoods: ["Williamsburg", "Park Slope"],
    moveInDate: "2025-12-01",
    mustHaves: ["In-Unit W/D", "Pet Friendly"],
    niceToHaves: ["Gym", "Rooftop"]
  },
  employment: {
    status: "employed",
    employer: "Tech Corp Inc.",
    title: "Software Engineer"
  },
  pets: {
    hasPets: true,
    type: "Dog",
    count: 1
  },
  occupants: 1,
  profileValidUntil: "2026-08-15"
};

export const mockApplications: Application[] = [
  {
    id: "app-1",
    listingId: "listing-1",
    address: "123 Main St",
    unit: "Unit 4B",
    status: "under_review",
    appliedAt: "2025-11-10",
    lastUpdate: "2025-11-12",
    rent: 3000,
    beds: 2,
    baths: 1
  },
  {
    id: "app-2",
    listingId: "listing-3",
    address: "789 Bedford Ave",
    unit: "PH1",
    status: "shortlisted",
    appliedAt: "2025-11-08",
    lastUpdate: "2025-11-15",
    rent: 4200,
    beds: 3,
    baths: 2
  },
  {
    id: "app-3",
    listingId: "listing-5",
    address: "567 Atlantic Ave",
    unit: "Suite 5C",
    status: "submitted",
    appliedAt: "2025-11-18",
    lastUpdate: "2025-11-18",
    rent: 3500,
    beds: 2,
    baths: 2
  },
  {
    id: "app-4",
    listingId: "listing-2",
    address: "456 Park Ave",
    unit: "Apt 3A",
    status: "denied",
    appliedAt: "2025-10-20",
    lastUpdate: "2025-10-28",
    rent: 2500,
    beds: 1,
    baths: 1
  }
];

export const mockDocuments: Document[] = [
  {
    id: "doc-1",
    name: "Driver's License",
    category: "government_id",
    uploadedAt: "2025-09-01",
    status: "verified",
    fileType: "image/jpeg",
    fileSize: "2.4 MB"
  },
  {
    id: "doc-2",
    name: "Pay Stub - October 2025",
    category: "pay_stubs",
    uploadedAt: "2025-11-05",
    status: "verified",
    fileType: "application/pdf",
    fileSize: "156 KB"
  },
  {
    id: "doc-3",
    name: "Pay Stub - September 2025",
    category: "pay_stubs",
    uploadedAt: "2025-10-05",
    status: "verified",
    fileType: "application/pdf",
    fileSize: "148 KB"
  },
  {
    id: "doc-4",
    name: "Pay Stub - August 2025",
    category: "pay_stubs",
    uploadedAt: "2025-09-05",
    status: "verified",
    fileType: "application/pdf",
    fileSize: "152 KB"
  },
  {
    id: "doc-5",
    name: "Employment Verification Letter",
    category: "employment_letter",
    uploadedAt: "2025-09-10",
    status: "verified",
    fileType: "application/pdf",
    fileSize: "89 KB"
  },
  {
    id: "doc-6",
    name: "Bank Statement - October 2025",
    category: "bank_statements",
    uploadedAt: "2025-11-02",
    status: "pending_review",
    fileType: "application/pdf",
    fileSize: "234 KB"
  }
];

export const mockActivities: Activity[] = [
  {
    id: "act-1",
    type: "application",
    description: "Applied to 567 Atlantic Ave, Suite 5C",
    timestamp: "2025-11-18T14:30:00Z"
  },
  {
    id: "act-2",
    type: "verification",
    description: "Income verification completed",
    timestamp: "2025-11-15T10:00:00Z"
  },
  {
    id: "act-3",
    type: "application",
    description: "Shortlisted for 789 Bedford Ave, PH1",
    timestamp: "2025-11-15T09:15:00Z"
  },
  {
    id: "act-4",
    type: "document",
    description: "Uploaded bank statement",
    timestamp: "2025-11-02T11:45:00Z"
  },
  {
    id: "act-5",
    type: "profile",
    description: "Updated rental preferences",
    timestamp: "2025-10-28T16:20:00Z"
  }
];

export const neighborhoodOptions = [
  "Williamsburg",
  "Park Slope",
  "Brooklyn Heights",
  "DUMBO",
  "Greenpoint",
  "Prospect Heights",
  "Fort Greene",
  "Boerum Hill",
  "Crown Heights",
  "Bushwick",
  "Bed-Stuy",
  "Cobble Hill"
];

export const mustHaveOptions = [
  "In-Unit W/D",
  "Pet Friendly",
  "Dishwasher",
  "Central AC",
  "Doorman",
  "Elevator",
  "Gym",
  "Parking"
];

export const niceToHaveOptions = [
  "Gym",
  "Rooftop",
  "Doorman",
  "Concierge",
  "Package Room",
  "Bike Storage",
  "Storage Unit",
  "Balcony",
  "Outdoor Space"
];

export function getStatusColor(status: Application['status']): string {
  switch (status) {
    case 'submitted':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'under_review':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'shortlisted':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'approved':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'denied':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'withdrawn':
      return 'bg-gray-100 text-gray-800 border-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

export function getStatusLabel(status: Application['status']): string {
  switch (status) {
    case 'submitted':
      return 'Submitted';
    case 'under_review':
      return 'Under Review';
    case 'shortlisted':
      return 'Shortlisted';
    case 'approved':
      return 'Approved';
    case 'denied':
      return 'Denied';
    case 'withdrawn':
      return 'Withdrawn';
    default:
      return status;
  }
}

export function getVerificationStatusColor(status: 'verified' | 'pending' | 'not_started'): string {
  switch (status) {
    case 'verified':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'not_started':
      return 'bg-gray-100 text-gray-600 border-gray-300';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-300';
  }
}

export function getDocumentStatusColor(status: Document['status']): string {
  switch (status) {
    case 'verified':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'pending_review':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'rejected':
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
