interface BuildingSchemaProps {
  name: string
  url: string
  description: string
  address: {
    street: string
    city: string
    state: string
    postalCode: string
  }
  geo: {
    latitude: number
    longitude: number
  }
  amenities: string[]
  availableUnits: number
  petsAllowed: boolean
  image: string
}

export function BuildingSchema({
  name,
  url,
  description,
  address,
  geo,
  amenities,
  availableUnits,
  petsAllowed,
  image,
}: BuildingSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ApartmentComplex',
    name,
    url,
    description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.postalCode,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    amenityFeature: amenities.map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
      value: true,
    })),
    numberOfAvailableAccommodation: availableUnits,
    petsAllowed,
    image,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ItemList schema for building directory
interface BuildingListSchemaProps {
  buildings: {
    name: string
    url: string
    image: string
  }[]
}

export function BuildingListSchema({ buildings }: BuildingListSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: buildings.map((building, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'ApartmentComplex',
        name: building.name,
        url: building.url,
        image: building.image,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
