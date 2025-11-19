export interface Listing {
  id: string;
  images: string[];
  price: number;
  address: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  sqft: number;
  available: string;
  amenities: string[];
  petFriendly: boolean;
  description: string;
  criteria: {
    incomeRatio: number;
    minCredit: number;
    maxEvictionYears: number;
  };
  neighborhood?: string;
  buildingType?: string;
  yearBuilt?: number;
}

export const mockListings: Listing[] = [
  {
    id: "listing-1",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b25ba?w=800&h=600&fit=crop",
    ],
    price: 3000,
    address: "123 Main St",
    unit: "Unit 4B",
    city: "Brooklyn",
    state: "NY",
    zip: "11201",
    beds: 2,
    baths: 1,
    sqft: 850,
    available: "2025-11-01",
    amenities: ["In-Unit W/D", "Dishwasher", "Central AC", "Hardwood Floors"],
    petFriendly: true,
    description: "Stunning sun-drenched 2-bedroom apartment in the heart of Brooklyn Heights. This beautifully renovated unit features an open-concept living space, modern kitchen with stainless steel appliances, and in-unit washer/dryer. The apartment boasts original hardwood floors throughout, high ceilings, and large windows that flood the space with natural light. Located on a tree-lined street, just steps from the Promenade with stunning views of Manhattan.",
    criteria: {
      incomeRatio: 3,
      minCredit: 680,
      maxEvictionYears: 7
    },
    neighborhood: "Brooklyn Heights",
    buildingType: "Pre-war",
    yearBuilt: 1925
  },
  {
    id: "listing-2",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&h=600&fit=crop",
    ],
    price: 2500,
    address: "456 Park Ave",
    unit: "Apt 3A",
    city: "Brooklyn",
    state: "NY",
    zip: "11238",
    beds: 1,
    baths: 1,
    sqft: 650,
    available: "2025-11-15",
    amenities: ["Dishwasher", "Gym", "Doorman", "Elevator"],
    petFriendly: false,
    description: "Modern 1-bedroom in a full-service building in Prospect Heights. This contemporary unit features floor-to-ceiling windows, sleek finishes, and a chef's kitchen with quartz countertops. Building amenities include a state-of-the-art fitness center, resident lounge, and 24-hour doorman. Perfectly located near Prospect Park, the Brooklyn Museum, and excellent restaurants.",
    criteria: {
      incomeRatio: 40,
      minCredit: 700,
      maxEvictionYears: 5
    },
    neighborhood: "Prospect Heights",
    buildingType: "Modern High-rise",
    yearBuilt: 2018
  },
  {
    id: "listing-3",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=600&fit=crop",
    ],
    price: 4200,
    address: "789 Bedford Ave",
    unit: "PH1",
    city: "Brooklyn",
    state: "NY",
    zip: "11211",
    beds: 3,
    baths: 2,
    sqft: 1200,
    available: "2025-12-01",
    amenities: ["In-Unit W/D", "Dishwasher", "Central AC", "Private Roof Deck", "Parking"],
    petFriendly: true,
    description: "Spectacular penthouse in Williamsburg with private roof deck! This sprawling 3-bedroom, 2-bath home offers incredible city views and outdoor entertaining space. The open layout features a gourmet kitchen, spacious living area, and primary suite with en-suite bath. Includes one parking spot. Steps from McCarren Park, L train, and Williamsburg's best restaurants and nightlife.",
    criteria: {
      incomeRatio: 3,
      minCredit: 720,
      maxEvictionYears: 7
    },
    neighborhood: "Williamsburg",
    buildingType: "Boutique Condo",
    yearBuilt: 2015
  },
  {
    id: "listing-4",
    images: [
      "https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560185008-a33f0e68da9b?w=800&h=600&fit=crop",
    ],
    price: 1800,
    address: "234 Flatbush Ave",
    unit: "2R",
    city: "Brooklyn",
    state: "NY",
    zip: "11217",
    beds: 0,
    baths: 1,
    sqft: 450,
    available: "2025-11-01",
    amenities: ["Dishwasher", "Laundry in Building", "Bike Storage"],
    petFriendly: true,
    description: "Charming studio in Park Slope with excellent natural light. This well-maintained unit features an efficient layout, updated kitchen, and good closet space. Laundry in building and bike storage available. Ideal location near the F/G trains, Prospect Park, and 5th Avenue shopping and dining.",
    criteria: {
      incomeRatio: 3,
      minCredit: 650,
      maxEvictionYears: 7
    },
    neighborhood: "Park Slope",
    buildingType: "Brownstone",
    yearBuilt: 1910
  },
  {
    id: "listing-5",
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560449017-7c4c6c7d3b90?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
    ],
    price: 3500,
    address: "567 Atlantic Ave",
    unit: "Suite 5C",
    city: "Brooklyn",
    state: "NY",
    zip: "11217",
    beds: 2,
    baths: 2,
    sqft: 1000,
    available: "2025-11-20",
    amenities: ["In-Unit W/D", "Dishwasher", "Central AC", "Gym", "Doorman", "Rooftop Access"],
    petFriendly: true,
    description: "Luxurious 2-bedroom, 2-bath in Boerum Hill's newest development. This corner unit offers abundant light, premium finishes, and a private balcony. Features include a chef's kitchen with top-of-the-line appliances, spa-like bathrooms, and in-unit laundry. Full-service building with fitness center, rooftop terrace, and 24/7 concierge.",
    criteria: {
      incomeRatio: 40,
      minCredit: 700,
      maxEvictionYears: 5
    },
    neighborhood: "Boerum Hill",
    buildingType: "New Development",
    yearBuilt: 2023
  },
  {
    id: "listing-6",
    images: [
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560185893-39ff0c334587?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560449752-3fd4bdbe7df0?w=800&h=600&fit=crop",
    ],
    price: 2200,
    address: "890 Nostrand Ave",
    unit: "1F",
    city: "Brooklyn",
    state: "NY",
    zip: "11225",
    beds: 1,
    baths: 1,
    sqft: 700,
    available: "2025-11-01",
    amenities: ["Dishwasher", "Laundry in Building", "Backyard Access"],
    petFriendly: true,
    description: "Spacious 1-bedroom with access to shared backyard in Crown Heights. This garden-level apartment features high ceilings, exposed brick, and a renovated kitchen with breakfast bar. Enjoy morning coffee in the peaceful backyard garden. Near the 2/5 trains and Franklin Avenue shops.",
    criteria: {
      incomeRatio: 3,
      minCredit: 660,
      maxEvictionYears: 7
    },
    neighborhood: "Crown Heights",
    buildingType: "Townhouse",
    yearBuilt: 1905
  },
  {
    id: "listing-7",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560185127-bdf5e1bca76a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448075-cbc16bb4af8e?w=800&h=600&fit=crop",
    ],
    price: 5500,
    address: "111 Columbia Heights",
    unit: "10A",
    city: "Brooklyn",
    state: "NY",
    zip: "11201",
    beds: 3,
    baths: 2,
    sqft: 1500,
    available: "2025-12-15",
    amenities: ["In-Unit W/D", "Dishwasher", "Central AC", "Gym", "Doorman", "Parking", "Storage"],
    petFriendly: true,
    description: "Breathtaking 3-bedroom with panoramic Manhattan views in Brooklyn Heights. This impeccably designed home features a grand living room with wall-to-wall windows, formal dining area, and chef's kitchen. Primary suite includes walk-in closet and luxurious bath. Full-service building with gym, parking, and storage available.",
    criteria: {
      incomeRatio: 40,
      minCredit: 720,
      maxEvictionYears: 5
    },
    neighborhood: "Brooklyn Heights",
    buildingType: "Luxury High-rise",
    yearBuilt: 2010
  },
  {
    id: "listing-8",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560449017-e507598f4c4c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&h=600&fit=crop",
    ],
    price: 2800,
    address: "432 DeKalb Ave",
    unit: "4L",
    city: "Brooklyn",
    state: "NY",
    zip: "11205",
    beds: 2,
    baths: 1,
    sqft: 900,
    available: "2025-11-10",
    amenities: ["In-Unit W/D", "Dishwasher", "Exposed Brick", "High Ceilings"],
    petFriendly: false,
    description: "Classic Brooklyn loft-style 2-bedroom in Fort Greene. This character-filled apartment features soaring 12-foot ceilings, original exposed brick, and oversized windows. Modern updates include in-unit laundry and renovated kitchen. Walk to Fort Greene Park, BAM, and excellent local restaurants.",
    criteria: {
      incomeRatio: 3,
      minCredit: 680,
      maxEvictionYears: 7
    },
    neighborhood: "Fort Greene",
    buildingType: "Converted Loft",
    yearBuilt: 1890
  },
  {
    id: "listing-9",
    images: [
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560185127-d5e9ee67e9c8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448082-6e6e9a4f1a8f?w=800&h=600&fit=crop",
    ],
    price: 3800,
    address: "765 Wythe Ave",
    unit: "6B",
    city: "Brooklyn",
    state: "NY",
    zip: "11249",
    beds: 2,
    baths: 2,
    sqft: 1100,
    available: "2025-11-25",
    amenities: ["In-Unit W/D", "Dishwasher", "Central AC", "Gym", "Rooftop Access", "Bike Storage"],
    petFriendly: true,
    description: "Stunning 2-bedroom, 2-bath in North Williamsburg with East River views. This sun-flooded corner unit offers an open floor plan, floor-to-ceiling windows, and premium finishes throughout. Building features a rooftop deck with Manhattan skyline views, fitness center, and bike storage. Steps from the ferry and waterfront parks.",
    criteria: {
      incomeRatio: 40,
      minCredit: 700,
      maxEvictionYears: 5
    },
    neighborhood: "North Williamsburg",
    buildingType: "Waterfront Condo",
    yearBuilt: 2019
  },
  {
    id: "listing-10",
    images: [
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560185893-01c9c82bb3e8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448083-cabb96c29b5c?w=800&h=600&fit=crop",
    ],
    price: 1950,
    address: "298 Knickerbocker Ave",
    unit: "3M",
    city: "Brooklyn",
    state: "NY",
    zip: "11237",
    beds: 1,
    baths: 1,
    sqft: 600,
    available: "2025-11-05",
    amenities: ["Dishwasher", "Laundry in Building", "Roof Access"],
    petFriendly: true,
    description: "Bright and airy 1-bedroom in up-and-coming Bushwick. Recently renovated with modern kitchen, updated bathroom, and new flooring throughout. Building features shared roof deck with city views. Great value in a vibrant neighborhood with easy access to the L and M trains.",
    criteria: {
      incomeRatio: 3,
      minCredit: 640,
      maxEvictionYears: 7
    },
    neighborhood: "Bushwick",
    buildingType: "Walk-up",
    yearBuilt: 1940
  }
];

export const amenityIcons: Record<string, string> = {
  "In-Unit W/D": "washing-machine",
  "Dishwasher": "utensils-crossed",
  "Central AC": "air-vent",
  "Gym": "dumbbell",
  "Doorman": "concierge-bell",
  "Parking": "car",
  "Pet Friendly": "paw-print",
  "Elevator": "arrow-up-down",
  "Rooftop Access": "sun",
  "Storage": "archive",
  "Bike Storage": "bike",
  "Laundry in Building": "shirt",
  "Backyard Access": "trees",
  "Private Roof Deck": "umbrella",
  "Hardwood Floors": "panel-top",
  "Exposed Brick": "brick-wall",
  "High Ceilings": "move-vertical",
  "Roof Access": "sun"
};

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

export function getListingById(id: string): Listing | undefined {
  return mockListings.find(listing => listing.id === id);
}

export function filterListings(filters: {
  minPrice?: number;
  maxPrice?: number;
  beds?: number[];
  baths?: number[];
  amenities?: string[];
  petFriendly?: boolean;
}): Listing[] {
  return mockListings.filter(listing => {
    if (filters.minPrice && listing.price < filters.minPrice) return false;
    if (filters.maxPrice && listing.price > filters.maxPrice) return false;
    if (filters.beds && filters.beds.length > 0 && !filters.beds.includes(listing.beds)) return false;
    if (filters.baths && filters.baths.length > 0 && !filters.baths.includes(listing.baths)) return false;
    if (filters.petFriendly && !listing.petFriendly) return false;
    if (filters.amenities && filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every(amenity =>
        listing.amenities.includes(amenity) ||
        (amenity === "Pet Friendly" && listing.petFriendly)
      );
      if (!hasAllAmenities) return false;
    }
    return true;
  });
}
