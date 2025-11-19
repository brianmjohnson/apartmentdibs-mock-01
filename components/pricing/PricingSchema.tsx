interface PricingSchemaProps {
  tiers: {
    name: string
    description: string
    price: number
  }[]
}

export function PricingSchema({ tiers }: PricingSchemaProps) {
  const schemas = tiers.map((tier) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: tier.name,
    description: tier.description,
    offers: {
      '@type': 'Offer',
      price: tier.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  }))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  )
}
