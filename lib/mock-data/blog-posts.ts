export interface BlogAuthor {
  name: string;
  avatar: string;
  role: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: 'Fair Housing' | 'Renting Tips' | 'Market Updates' | 'Product News';
  author: BlogAuthor;
  publishedAt: string;
  readTime: number;
}

export const mockBlogPosts: BlogPost[] = [
  {
    slug: "understanding-fair-housing-act",
    title: "Understanding the Fair Housing Act: A Complete Guide",
    excerpt: "Learn about protected classes, prohibited practices, and how to ensure compliance with federal fair housing laws.",
    content: `
## Introduction

The Fair Housing Act is one of the most important pieces of civil rights legislation in American history. Enacted in 1968, it prohibits discrimination in housing based on race, color, national origin, religion, sex, familial status, and disability.

## Protected Classes

The Fair Housing Act protects individuals from discrimination based on:

- **Race** - Protection against racial discrimination
- **Color** - Protection based on skin color
- **National Origin** - Protection based on country of birth or ancestry
- **Religion** - Protection based on religious beliefs or practices
- **Sex** - Protection based on gender, including sexual harassment
- **Familial Status** - Protection for families with children under 18
- **Disability** - Protection for individuals with physical or mental disabilities

## What Constitutes Discrimination?

Discrimination can take many forms, including:

1. **Refusing to rent or sell** housing to someone based on a protected class
2. **Different terms or conditions** - Offering different rental terms based on protected characteristics
3. **Discriminatory advertising** - Making statements that indicate a preference or limitation
4. **Steering** - Directing people to specific neighborhoods based on protected characteristics
5. **Blockbusting** - Inducing homeowners to sell by suggesting changes in neighborhood composition

## How ApartmentDibs Ensures Compliance

At ApartmentDibs, we've built fair housing compliance into our core platform:

> "We believe that technology can be a powerful force for fair housing when designed with the right principles."

### PII Obfuscation

Personal identifying information that could reveal protected class membership is hidden from landlords during initial screening.

### Objective Criteria Only

Our platform evaluates applicants based on:
- Income verification
- Credit history
- Rental history
- Background checks

### Complete Audit Trails

Every decision is logged, creating a defensible record of fair housing compliance.

## Conclusion

Understanding and following fair housing laws isn't just about avoiding lawsuits—it's about creating a more equitable housing market for everyone. ApartmentDibs is committed to making this easier for landlords while protecting tenants from discrimination.
    `.trim(),
    featuredImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=630&fit=crop",
    category: "Fair Housing",
    author: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      role: "Fair Housing Expert"
    },
    publishedAt: "2025-11-15",
    readTime: 8
  },
  {
    slug: "tips-for-first-time-renters",
    title: "10 Essential Tips for First-Time Renters",
    excerpt: "Moving into your first apartment? Here's everything you need to know to make the process smooth and stress-free.",
    content: `
## Starting Your Rental Journey

Renting your first apartment is an exciting milestone, but it can also feel overwhelming. Here are ten essential tips to help you navigate the process successfully.

## 1. Know Your Budget

Before you start looking, determine how much you can afford. The general rule is that rent should not exceed 30% of your gross monthly income.

\`\`\`
Monthly Income: $5,000
Max Rent (30%): $1,500
\`\`\`

## 2. Understand Credit Requirements

Most landlords require a minimum credit score. Check your credit report before applying and address any errors.

## 3. Prepare Your Documents

Gather these documents before you start applying:

- Government-issued ID
- Pay stubs (usually last 2-3 months)
- Bank statements
- Employment verification letter
- Tax returns
- References from previous landlords

## 4. Start Early

> Begin your search 60-90 days before your desired move-in date. This gives you time to find the right place without rushing into a decision.

## 5. Read the Lease Carefully

Pay attention to:

1. **Lease term** - Monthly vs. annual
2. **Security deposit** - Amount and conditions for return
3. **Pet policies** - Even if you don't have pets now
4. **Maintenance responsibilities** - What you're responsible for
5. **Early termination** - Penalties and procedures

## 6. Document Everything

Take photos and videos of the apartment during your move-in walkthrough. Note any existing damage on your move-in checklist.

## 7. Get Renter's Insurance

Protect your belongings and yourself with renter's insurance. It's typically very affordable—around $15-30 per month.

## 8. Understand Your Rights

Familiarize yourself with tenant rights in your state and city. Know what landlords can and cannot do.

## 9. Ask Questions

Don't be afraid to ask:

- Is rent negotiable?
- What utilities are included?
- How are maintenance requests handled?
- What's the process for lease renewal?

## 10. Use ApartmentDibs

Create your portable screening report once and apply to multiple listings without repeated fees. Our platform makes the application process faster and fairer.

## Final Thoughts

Renting your first apartment doesn't have to be stressful. With the right preparation and knowledge, you can find a great place that fits your needs and budget.
    `.trim(),
    featuredImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=630&fit=crop",
    category: "Renting Tips",
    author: {
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      role: "Content Writer"
    },
    publishedAt: "2025-11-10",
    readTime: 6
  },
  {
    slug: "creating-strong-rental-application",
    title: "How to Create a Strong Rental Application",
    excerpt: "Stand out from other applicants with these proven strategies for building a compelling rental application.",
    content: `
## Why Your Application Matters

In competitive rental markets, landlords often receive dozens of applications for a single unit. Here's how to make yours stand out.

## Building Your Application Package

### 1. Complete Your ApartmentDibs Profile

Your verified profile includes:

- **Identity verification** - Confirms you are who you say you are
- **Income verification** - Direct from your employer or bank
- **Credit report** - Current and accurate
- **Background check** - Comprehensive and up-to-date
- **Rental history** - Verified references

### 2. Write a Cover Letter

A brief, professional cover letter can set you apart:

> Dear Property Manager,
>
> I am writing to express my strong interest in the 2-bedroom apartment at 123 Main Street. As a marketing professional with a stable income and excellent rental history, I would be an ideal tenant for your property...

### 3. Provide Strong References

Include:

- Previous landlords (last 2-3)
- Employer contact
- Personal references (if requested)

## What Landlords Look For

### Income Requirements

Most landlords require income of 2.5-3x the monthly rent:

| Rent | Required Income (3x) |
|------|---------------------|
| $2,000 | $6,000/month |
| $2,500 | $7,500/month |
| $3,000 | $9,000/month |

### Credit Score

- **720+** - Excellent, best rates
- **680-719** - Good, generally accepted
- **620-679** - Fair, may need additional documentation
- **Below 620** - May need co-signer or larger deposit

### Rental History

- No evictions
- Timely rent payments
- Good landlord references
- Reasonable tenure at previous addresses

## Common Mistakes to Avoid

1. **Incomplete applications** - Fill out every field
2. **Inconsistent information** - Ensure all details match across documents
3. **Late submissions** - Apply as soon as possible
4. **Missing documents** - Include everything requested
5. **Unprofessional communication** - Keep all correspondence professional

## The ApartmentDibs Advantage

With ApartmentDibs:

- Create your application once
- Apply to unlimited listings
- Track all your applications in one place
- Receive status updates in real-time
- Know you're being evaluated fairly

## Conclusion

A strong rental application demonstrates reliability and responsibility. Take the time to prepare your materials thoroughly, and you'll significantly improve your chances of securing your ideal apartment.
    `.trim(),
    featuredImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop",
    category: "Renting Tips",
    author: {
      name: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      role: "Tenant Success Manager"
    },
    publishedAt: "2025-11-08",
    readTime: 7
  },
  {
    slug: "portable-screening-reports-explained",
    title: "Why Portable Screening Reports Save Time and Money",
    excerpt: "Discover how portable tenant screening reports are revolutionizing the rental application process for both tenants and landlords.",
    content: `
## The Problem with Traditional Screening

Every time you apply for an apartment, you typically pay $30-75 for a new background and credit check. If you're applying to multiple units, these fees add up quickly.

## What Are Portable Screening Reports?

A portable screening report is a comprehensive tenant screening that you control. It includes:

- Credit report and score
- Criminal background check
- Eviction history
- Income verification
- Identity verification

Once created, you can share this report with any landlord or property manager.

## Benefits for Tenants

### Cost Savings

Instead of paying for multiple screenings:

\`\`\`
Traditional: 10 applications x $50 = $500
Portable: 1 report x $50 = $50

Savings: $450
\`\`\`

### Time Efficiency

> "I applied to 15 apartments in one afternoon. Without my portable report, it would have taken weeks." - ApartmentDibs user

### Privacy Control

You decide who sees your information and when. Reports are accessed only when you share them.

### Faster Approvals

Landlords can make decisions quickly when they have verified information upfront.

## Benefits for Landlords

### Verified Information

All data in a portable report is verified by a third-party screening company, reducing fraud risk.

### Faster Decision-Making

Pre-screened applicants mean you can fill vacancies faster.

### Reduced Costs

When tenants bring their own verified reports, you save on screening expenses.

### Fair Housing Compliance

Standardized reports help ensure consistent, objective evaluation of all applicants.

## How It Works on ApartmentDibs

1. **Create Your Profile** - Enter your information once
2. **Order Your Report** - Pay a one-time fee for comprehensive screening
3. **Apply Anywhere** - Share your report with any listing on our platform
4. **Track Status** - Monitor all your applications in one dashboard

## The Future of Renting

Portable screening reports represent a major shift toward a more efficient, tenant-friendly rental market. By putting control in the hands of applicants while providing landlords with reliable information, everyone wins.

## Get Started Today

Create your portable screening report on ApartmentDibs and start applying to apartments immediately. Your verified profile makes you a more attractive candidate to landlords while saving you time and money.
    `.trim(),
    featuredImage: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1200&h=630&fit=crop",
    category: "Product News",
    author: {
      name: "David Park",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      role: "Product Manager"
    },
    publishedAt: "2025-11-05",
    readTime: 5
  },
  {
    slug: "brooklyn-rental-market-trends-2025",
    title: "Brooklyn Rental Market Update: November 2025",
    excerpt: "Explore the latest trends in Brooklyn's rental market, including median rents, inventory levels, and neighborhood highlights.",
    content: `
## Market Overview

Brooklyn's rental market continues to show strong demand heading into the holiday season. Here's what you need to know about current trends and what to expect in the coming months.

## Median Rents by Bedroom

| Unit Type | Median Rent | YoY Change |
|-----------|-------------|------------|
| Studio | $2,100 | +3.2% |
| 1-Bedroom | $2,800 | +2.8% |
| 2-Bedroom | $3,500 | +4.1% |
| 3-Bedroom | $4,200 | +3.7% |

## Hottest Neighborhoods

### Most In-Demand

1. **Williamsburg** - Tech workers and creatives continue to flock here
2. **Park Slope** - Families drawn to schools and green space
3. **Brooklyn Heights** - Premium location with Manhattan views
4. **Prospect Heights** - Museum district gaining popularity

### Best Value

1. **Bushwick** - Most affordable option with improving amenities
2. **Crown Heights** - Great transit, growing restaurant scene
3. **Bed-Stuy** - Beautiful brownstones, strong community

## Inventory Levels

> Inventory is down 12% compared to this time last year, creating a more competitive market for renters.

### What This Means for You

**For Renters:**
- Apply quickly when you find a good fit
- Have your documents ready
- Consider slightly expanding your search area

**For Landlords:**
- Well-priced units are renting within 2 weeks
- Quality tenants are available but moving fast
- Competitive listings include quality photos and detailed descriptions

## Seasonal Trends

November and December typically see:

- Lower inventory as people avoid holiday moves
- More negotiating power for renters
- Landlords more willing to offer incentives

### Potential Incentives

- Free month's rent
- Reduced security deposit
- Flexible move-in dates
- Waived application fees

## Looking Ahead to 2026

Market analysts predict:

1. **Continued demand** - Brooklyn remains a top destination
2. **Moderate rent increases** - 2-4% expected
3. **New developments** - Several large projects coming to market
4. **Suburban competition** - Remote work continues to influence preferences

## ApartmentDibs Brooklyn Listings

We currently have over 500 active listings in Brooklyn, from studios to 3+ bedrooms. Our fair housing-compliant platform ensures you're evaluated on objective criteria only.

## Tips for Brooklyn Apartment Hunting

- **Be flexible on neighborhoods** - Similar units vary greatly in price
- **Consider transit time** - Don't just look at distance
- **Check building amenities** - In-unit laundry is worth the premium
- **Visit at different times** - See the neighborhood day and night

Start your Brooklyn apartment search on ApartmentDibs today.
    `.trim(),
    featuredImage: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=1200&h=630&fit=crop",
    category: "Market Updates",
    author: {
      name: "Jessica Martinez",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
      role: "Market Analyst"
    },
    publishedAt: "2025-11-01",
    readTime: 6
  },
  {
    slug: "reducing-discrimination-risk-landlords",
    title: "How Landlords Can Reduce Discrimination Risk",
    excerpt: "Practical steps property owners can take to ensure fair housing compliance and protect themselves from costly lawsuits.",
    content: `
## The Cost of Non-Compliance

Fair housing violations can result in:

- **Federal penalties** up to $100,000+ for repeat violations
- **State and local fines** varying by jurisdiction
- **Civil lawsuits** with damages and attorney fees
- **Reputation damage** affecting future business

## Common Fair Housing Mistakes

### In Advertising

**Problematic phrases:**
- "Perfect for young professionals"
- "Great family neighborhood"
- "Walking distance to church"
- "No children"

**Better alternatives:**
- "Close to downtown"
- "Near parks and schools"
- "Quiet building"
- Describe amenities objectively

### During Showings

Never make comments about:
- Who typically lives in the building
- The ethnic makeup of the neighborhood
- Nearby religious institutions
- Whether the area is "family-friendly"

### In Application Review

You CAN consider:
- Income relative to rent
- Credit history
- Rental references
- Background check results

You CANNOT consider:
- Race, color, or national origin
- Religion
- Sex or gender identity
- Familial status
- Disability

## Best Practices for Compliance

### 1. Use Consistent Criteria

Establish objective screening criteria before you list:

\`\`\`
Income: 3x monthly rent
Credit: 650+ minimum
Rental history: No evictions in past 7 years
\`\`\`

Apply these criteria equally to all applicants.

### 2. Document Everything

> "If it wasn't documented, it didn't happen."

Keep records of:
- All applications received
- Screening criteria used
- Reasons for decisions
- Communications with applicants

### 3. Send Adverse Action Notices

When denying an application, provide:
- The specific reason(s) for denial
- Credit bureau contact information
- Rights under the FCRA
- How to dispute information

### 4. Train Your Team

Everyone involved in the rental process should understand:
- Protected classes
- Prohibited practices
- How to respond to discriminatory requests
- Documentation requirements

### 5. Use Technology

Platforms like ApartmentDibs help by:
- Hiding protected class information during screening
- Applying criteria consistently
- Creating automatic audit trails
- Generating compliant adverse action notices

## When to Consult an Attorney

Seek legal advice if:
- You receive a fair housing complaint
- You're unsure if criteria are compliant
- You want to update your policies
- You're implementing new technology

## The ApartmentDibs Solution

Our platform is designed with fair housing compliance at its core:

1. **PII Obfuscation** - You never see information that could reveal protected class membership
2. **Objective Scoring** - Applications are evaluated on consistent criteria
3. **Automatic Audit Trails** - Every decision is documented
4. **Adverse Action Automation** - Compliant notices sent automatically
5. **Training Resources** - Ongoing education for landlords and agents

## Conclusion

Fair housing compliance isn't just about avoiding lawsuits—it's about creating an equitable rental market. By using consistent criteria, documenting decisions, and leveraging technology, you can protect your business while ensuring all applicants receive fair treatment.

Join ApartmentDibs today and let our platform handle compliance for you.
    `.trim(),
    featuredImage: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1200&h=630&fit=crop",
    category: "Fair Housing",
    author: {
      name: "Robert Thompson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      role: "Legal Compliance Advisor"
    },
    publishedAt: "2025-10-28",
    readTime: 9
  },
  {
    slug: "apartment-viewing-checklist",
    title: "The Ultimate Apartment Viewing Checklist",
    excerpt: "Don't miss crucial details during your apartment tour. Use this comprehensive checklist to evaluate any rental property.",
    content: `
## Before You Go

Prepare for your viewing by:

- Researching the neighborhood online
- Checking the listing photos and description
- Preparing questions to ask
- Bringing this checklist!

## What to Bring

- [ ] Photo ID
- [ ] Proof of income (in case you want to apply immediately)
- [ ] Checkbook or payment method for application fee
- [ ] Phone for photos/video
- [ ] Measuring tape
- [ ] This checklist

## General Condition

### Walls and Ceilings
- [ ] Check for cracks or holes
- [ ] Look for water stains
- [ ] Note paint condition
- [ ] Check for mold or mildew

### Floors
- [ ] Test for squeaks
- [ ] Check condition of hardwood/carpet
- [ ] Look for uneven areas
- [ ] Note cleanliness

### Windows and Doors
- [ ] Open and close all windows
- [ ] Check locks work
- [ ] Look for drafts
- [ ] Note window treatments included
- [ ] Test all doors

## Kitchen

> The kitchen is often the most expensive room to furnish, so note what's included.

- [ ] Open all cabinets and drawers
- [ ] Test all appliances
- [ ] Check water pressure
- [ ] Run garbage disposal
- [ ] Note counter space
- [ ] Check outlet availability

### Appliances to Test
- Stove/oven
- Refrigerator (check temperature)
- Dishwasher
- Microwave
- Garbage disposal

## Bathroom

- [ ] Flush toilet
- [ ] Run sink and shower
- [ ] Check water pressure
- [ ] Look under sink for leaks
- [ ] Note ventilation (fan or window)
- [ ] Check storage space
- [ ] Look for mold/mildew

## Utilities and Systems

### Electrical
- [ ] Test all light switches
- [ ] Check outlet count in each room
- [ ] Ask about wiring age

### Heating and Cooling
- [ ] Ask how it's controlled
- [ ] Check vents/radiators
- [ ] Ask about average utility costs

### Water
- [ ] Ask about hot water (tank or tankless)
- [ ] Check water heater age
- [ ] Ask about included utilities

## Storage and Closets

- [ ] Check closet sizes
- [ ] Note number of closets
- [ ] Ask about additional storage
- [ ] Check basement/attic access

## Building Amenities

- [ ] Laundry facilities (location, cost)
- [ ] Gym
- [ ] Roof access
- [ ] Bike storage
- [ ] Package delivery
- [ ] Doorman/concierge

## Security

- [ ] Main entry lock type
- [ ] Intercom system
- [ ] Deadbolts on doors
- [ ] Window locks
- [ ] Fire escape accessibility
- [ ] Smoke/CO detectors

## Neighborhood

After the viewing, walk around and note:

- Nearest grocery store
- Public transit access
- Street noise levels
- Parking availability
- General safety feel

## Questions to Ask

1. Why is the current tenant leaving?
2. How are maintenance requests handled?
3. What's the lease length?
4. Are there any planned renovations?
5. What's the pet policy?
6. Can I paint or make modifications?
7. What's the process for lease renewal?
8. Who are my neighbors?

## Red Flags

Be cautious if:

- Landlord discourages documentation
- Pressure to sign immediately
- Evasive answers to questions
- Signs of pest problems
- Strong odors (masking issues)
- Reluctance to show certain areas

## After the Viewing

- Review your notes and photos
- Compare to other apartments you've seen
- Calculate total move-in costs
- Apply through ApartmentDibs if interested!

## Conclusion

A thorough viewing helps you avoid surprises after moving in. Take your time, ask questions, and trust your instincts. When you find the right apartment, having your ApartmentDibs profile ready means you can apply immediately.
    `.trim(),
    featuredImage: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=1200&h=630&fit=crop",
    category: "Renting Tips",
    author: {
      name: "Amanda Lee",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
      role: "Real Estate Advisor"
    },
    publishedAt: "2025-10-20",
    readTime: 8
  }
];

export const blogCategories = [
  'Fair Housing',
  'Renting Tips',
  'Market Updates',
  'Product News'
] as const;

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return mockBlogPosts.find(post => post.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return mockBlogPosts.filter(post => post.category === category);
}

export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const currentPost = getBlogPostBySlug(currentSlug);
  if (!currentPost) return [];

  return mockBlogPosts
    .filter(post => post.slug !== currentSlug)
    .filter(post => post.category === currentPost.category)
    .slice(0, limit);
}

export function formatBlogDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}
