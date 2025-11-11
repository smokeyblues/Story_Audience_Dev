// src/routes/(marketing)/pricing/pricing_plans.ts

export const defaultPlanId = "producer_annual"

export const pricingPlans = [
  {
    id: "creator",
    name: "Creator",
    description:
      "For creators ready to build, test, and validate their story worlds.",
    price: "$0",
    priceIntervalName: "forever",
    stripe_price_id: null,
    stripe_product_id: "prod_creator_free",
    features: [
      "Core Story Development Tools",
      "Community Discord Access",
      "Unlimited Projects",
      "Name featured in Credits",
      "Potential IMDb Credits",
    ],
  },
  {
    id: "producer_annual",
    name: "Producer",
    description:
      "For backers who want to fund projects and give the greenlight.",
    price: "$250",
    priceIntervalName: "per year",
    stripe_price_id: "YOUR_STRIPE_PRICE_ID_PRODUCER_250_YR", // Replace this
    stripe_product_id: "prod_producer_annual",
    features: [
      "All Creator features, plus:",
      "5 Greenlight Votes",
      "Vote Splitting",
    ],
  },
  {
    id: "executive_producer_annual",
    name: "Executive Producer",
    description:
      "For backers who want to wield maximum influence in the co-op.",
    price: "$500",
    priceIntervalName: "per year",
    stripe_price_id: "YOUR_STRIPE_PRICE_ID_EP_500_YR", // Replace this
    stripe_product_id: "prod_ep_annual",
    features: [
      "All Producer features, plus:",
      "10 Greenlight Votes",
      "Priority Community Support",
    ],
  },
]
