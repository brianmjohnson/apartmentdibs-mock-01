interface NeighborhoodSchemaProps {
  name: string
  description: string
  url: string
  geo: {
    latitude: number
    longitude: number
  }
  containedIn: {
    city: string
    state: string
  }
  image?: string
}

export function NeighborhoodSchema({
  name,
  description,
  url,
  geo,
  containedIn,
  image,
}: NeighborhoodSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name,
    description,
    url,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    containedInPlace: {
      '@type': 'City',
      name: `${containedIn.city}, ${containedIn.state}`,
    },
    ...(image && { image }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ItemList schema for neighborhood index
interface NeighborhoodListSchemaProps {
  neighborhoods: {
    name: string
    url: string
    image: string
  }[]
}

export function NeighborhoodListSchema({ neighborhoods }: NeighborhoodListSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: neighborhoods.map((neighborhood, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Place',
        name: neighborhood.name,
        url: neighborhood.url,
        image: neighborhood.image,
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
