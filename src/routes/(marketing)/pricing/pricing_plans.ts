// src/routes/(marketing)/pricing/pricing_plans.ts

export const defaultPlanId = "producer"

export const pricingPlans = [
  {
    id: "creator",
    name: "Creator",
    description:
      "For the solo creator focused on developing a single, powerful story world.",
    price: "$0",
    priceIntervalName: "forever",
    stripe_price_id: null,
    stripe_product_id: "prod_creator_free",
    features: [
      "1 Project",
      "Core World-Building Tools",
      "Community Discord Access",
      "100 MB Asset Storage",
    ],
  },
  {
    id: "producer", // Monthly
    name: "Producer",
    description:
      "For professional writers and small teams developing multiple IPs and building an audience.",
    price: "$29",
    priceIntervalName: "per month",
    stripe_price_id: "price_1RDoyVItMT7HUULIH0dLcVKX",
    stripe_product_id: "prod_S85816nL7UywP8",
    features: [
      "Up to 5 Projects",
      "Full Narrative Graph Access",
      "Audience Development Tools",
      "Team Collaboration (5 Members)",
    ],
  },
  {
    id: "producer_annual", // Annual
    name: "Producer (Annual)",
    description: "Best value for committed teams planning for the year.",
    price: "$24", // ~17% discount
    priceIntervalName: "per year",
    stripe_price_id: "price_1RDoyVItMT7HUULIAseMcZKY",
    stripe_product_id: "prod_S85816nL7UywP8",
    features: [
      "Up to 5 Projects",
      "Full Narrative Graph Access",
      "Audience Development Tools",
      "Team Collaboration (5 Members)",
    ],
  },
  {
    id: "studio", // Monthly
    name: "Studio",
    description:
      "For production companies and studios managing a portfolio of IP and seeking production partners.",
    price: "$79",
    priceIntervalName: "per month",
    stripe_price_id: "price_1RDoybItMT7HUULIp9je59vF",
    stripe_product_id: "prod_S858Mc87pqEjoS",
    features: [
      "Unlimited Projects",
      "Advanced IP Management",
      "Early Access to AI Co-Pilots",
      "Priority Support",
    ],
  },
  {
    id: "studio_annual", // Annual
    name: "Studio (Annual)",
    description:
      "Unlock the full potential for your studio or large team annually.",
    price: "$65", // ~18% discount
    priceIntervalName: "per year",
    stripe_price_id: "price_1RDoybItMT7HUULIMF7VIcJm",
    stripe_product_id: "prod_S858Mc87pqEjoS",
    features: [
      "Unlimited Projects",
      "Advanced IP Management",
      "Early Access to AI Co-Pilots",
      "Priority Support",
    ],
  },
  // --- NEW PRODUCTION PARTNER TIER ---
  {
    id: "production-partner",
    name: "Production Partner",
    description:
      "A bespoke partnership for select projects ready to move into active production.",
    price: "Contact Us",
    priceIntervalName: "for a quote",
    stripe_price_id: null,
    stripe_product_id: null, // No Stripe Product
    features: [
      "Everything in Studio, plus:",
      "Executive Producer Services",
      "Pitch Deck & Packaging Support",
      "Financing & Distribution Strategy",
      "Direct Access to Our Network",
    ],
  },
]
