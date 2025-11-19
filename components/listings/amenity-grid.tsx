"use client";

import {
  WashingMachine,
  UtensilsCrossed,
  AirVent,
  Dumbbell,
  Car,
  PawPrint,
  ArrowUpDown,
  Sun,
  Archive,
  Bike,
  Shirt,
  Trees,
  Umbrella,
  PanelTop,
  BrickWall,
  MoveVertical,
  ConciergeBell,
  Check,
} from "lucide-react";

interface AmenityGridProps {
  amenities: string[];
  petFriendly?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  "In-Unit W/D": WashingMachine,
  "Dishwasher": UtensilsCrossed,
  "Central AC": AirVent,
  "Gym": Dumbbell,
  "Doorman": ConciergeBell,
  "Parking": Car,
  "Pet Friendly": PawPrint,
  "Elevator": ArrowUpDown,
  "Rooftop Access": Sun,
  "Storage": Archive,
  "Bike Storage": Bike,
  "Laundry in Building": Shirt,
  "Backyard Access": Trees,
  "Private Roof Deck": Umbrella,
  "Hardwood Floors": PanelTop,
  "Exposed Brick": BrickWall,
  "High Ceilings": MoveVertical,
  "Roof Access": Sun,
};

export function AmenityGrid({ amenities, petFriendly }: AmenityGridProps) {
  const allAmenities = petFriendly
    ? [...amenities, "Pet Friendly"]
    : amenities;

  // Remove duplicates
  const uniqueAmenities = [...new Set(allAmenities)];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {uniqueAmenities.map((amenity) => {
        const Icon = iconMap[amenity] || Check;
        return (
          <div
            key={amenity}
            className="flex items-center gap-3 text-sm"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary">
              <Icon className="h-4 w-4 text-foreground" />
            </div>
            <span>{amenity}</span>
          </div>
        );
      })}
    </div>
  );
}

export function AmenityList({ amenities, petFriendly }: AmenityGridProps) {
  const allAmenities = petFriendly
    ? [...amenities, "Pet Friendly"]
    : amenities;

  const uniqueAmenities = [...new Set(allAmenities)];

  return (
    <ul className="space-y-2">
      {uniqueAmenities.map((amenity) => {
        const Icon = iconMap[amenity] || Check;
        return (
          <li key={amenity} className="flex items-center gap-2 text-sm">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span>{amenity}</span>
          </li>
        );
      })}
    </ul>
  );
}
