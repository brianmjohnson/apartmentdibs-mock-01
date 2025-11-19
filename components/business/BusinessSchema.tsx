interface BusinessSchemaProps {
  name: string
  jobTitle?: string
  company?: {
    name: string
    url?: string
  }
  url: string
  description: string
  areaServed: string
  image?: string
  telephone?: string
  email?: string
}

export function BusinessSchema({
  name,
  jobTitle,
  company,
  url,
  description,
  areaServed,
  image,
  telephone,
  email,
}: BusinessSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name,
    ...(jobTitle && { jobTitle }),
    ...(company && {
      worksFor: {
        '@type': 'Organization',
        name: company.name,
        ...(company.url && { url: company.url }),
      },
    }),
    url,
    description,
    areaServed,
    ...(image && { image }),
    ...(telephone || email
      ? {
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            ...(telephone && { telephone }),
            ...(email && { email }),
          },
        }
      : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ItemList schema for business directory
interface BusinessListSchemaProps {
  businesses: {
    name: string
    url: string
    image?: string
  }[]
}

export function BusinessListSchema({ businesses }: BusinessListSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: businesses.map((business, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'RealEstateAgent',
        name: business.name,
        url: business.url,
        ...(business.image && { image: business.image }),
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
