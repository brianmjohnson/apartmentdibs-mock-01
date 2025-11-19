interface PropertySchemaProps {
  name: string
  url: string
  description: string
  datePosted: string
  price: number
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
  beds: number
  baths: number
  sqft: number
  amenities: string[]
  petsAllowed: boolean
  images: string[]
  landlord?: {
    name: string
    url?: string
  }
}

export function PropertySchema({
  name,
  url,
  description,
  datePosted,
  price,
  address,
  geo,
  beds,
  baths,
  sqft,
  amenities,
  petsAllowed,
  images,
  landlord,
}: PropertySchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name,
    url,
    description,
    datePosted,
    price,
    priceCurrency: 'USD',
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
    numberOfRooms: beds,
    numberOfBathroomsTotal: baths,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: sqft,
      unitCode: 'FTK',
    },
    amenityFeature: amenities.map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
      value: true,
    })),
    petsAllowed,
    image: images,
    ...(landlord && {
      landlord: {
        '@type': 'Organization',
        name: landlord.name,
        ...(landlord.url && { url: landlord.url }),
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Meta tags component for property pages
interface PropertyMetaProps {
  title: string
  description: string
  url: string
  image: string
}

export function PropertyMeta({ title, description, url, image }: PropertyMetaProps) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  )
}
