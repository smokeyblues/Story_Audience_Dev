// src/routes/pricing/pricing_plans.ts

// The plan ID used for highlighting on the pricing page (usually the recommended paid plan)
export const defaultPlanId = "producer"

// Define the pricing plans
export const pricingPlans = [
  {
    id: "creative", // Keep ID simple for the free tier
    name: "Creative",
    description:
      "Perfect for solo creators starting their first transmedia project.",
    price: "$0",
    priceIntervalName: "forever", // Changed from 'per month'
    stripe_price_id: null, // No Stripe ID for free plans
    stripe_product_id: "prod_creative_free", // Optional: A product ID for your reference
    features: [
      "1 Project",
      "Core Planning Sections",
      "Manual Feedback Log",
      "100 MB Asset Storage",
      "Community Discord Access",
    ],
  },
  {
    id: "producer", // Monthly Producer plan
    name: "Producer",
    description:
      "Ideal for small teams needing collaboration and more capacity.",
    price: "$25",
    priceIntervalName: "per month",
    stripe_price_id: "price_1RDoyVItMT7HUULIH0dLcVKX",
    stripe_product_id: "prod_S85816nL7UywP8",
    features: [
      "Up to 5 Projects",
      "Team Collaboration (5 Members)",
      "1 GB Asset Storage",
      "Basic Project Export",
      "Priority Access to Future Betas", // Added benefit
    ],
  },
  {
    id: "producer_annual", // Annual Producer plan
    name: "Producer (Annual)",
    description: "Best value for committed teams planning for the year.",
    price: "$21", // $250 / 12 = ~$20.83/mo (Approx 17% discount)
    priceIntervalName: "per year",
    stripe_price_id: "price_1RDoyVItMT7HUULIAseMcZKY", // Needs a SEPARATE annual price ID in Stripe
    stripe_product_id: "prod_S85816nL7UywP8",
    features: [
      "Up to 5 Projects",
      "Team Collaboration (5 Members)",
      "1 GB Asset Storage",
      "Basic Project Export",
      "Priority Access to Future Betas",
      "Approx. 17% Discount", // Highlight annual saving
    ],
  },
  {
    id: "executive", // Monthly Executive plan
    name: "Executive Producer",
    description:
      "For larger teams, studios, or creators needing advanced features.",
    price: "$50",
    priceIntervalName: "per month",
    stripe_price_id: "price_1RDoybItMT7HUULIp9je59vF",
    stripe_product_id: "prod_S858Mc87pqEjoS", // Needs a SEPARATE product ID
    features: [
      "Unlimited Projects",
      "Larger Teams (15+ Members)", // Define limit or use 'Custom'
      "10 GB+ Asset Storage",
      "Advanced Export Options (Future)",
      "Early Access to AI Tools (Future)",
      "Priority Support",
    ],
  },
  {
    id: "executive_annual", // CORRECTED ID: Needs unique ID for annual version
    name: "Executive Producer (Annual)",
    description:
      "Unlock the full potential for your studio or large team annually.",
    price: "$42", // $500 / 12 = ~$41.67/mo (Approx 17% discount)
    priceIntervalName: "per year",
    stripe_price_id: "price_1RDoybItMT7HUULIMF7VIcJm",
    stripe_product_id: "prod_S858Mc87pqEjoS",
    features: [
      "Unlimited Projects",
      "Larger Teams (15+ Members)",
      "10 GB+ Asset Storage",
      "Advanced Export Options (Future)",
      "Early Access to AI Tools (Future)",
      "Priority Support",
      "Approx. 17% Discount",
    ],
  },
]
