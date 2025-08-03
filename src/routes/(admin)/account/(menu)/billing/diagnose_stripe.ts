// Temporary diagnostic file for Stripe troubleshooting
// This should be removed after debugging is complete

import { PRIVATE_STRIPE_API_KEY } from "$env/static/private"
import Stripe from "stripe"
import { pricingPlans } from "../../../../(marketing)/pricing/pricing_plans"

const stripe = new Stripe(PRIVATE_STRIPE_API_KEY, { apiVersion: "2023-08-16" })

export const diagnoseStripe = async (customerId: string) => {
  console.log("=== STRIPE DIAGNOSTIC START ===")

  // Check environment
  console.log("Environment check:", {
    hasStripeKey: !!PRIVATE_STRIPE_API_KEY,
    stripeKeyPrefix: PRIVATE_STRIPE_API_KEY?.substring(0, 8) + "...",
    customerId,
  })

  // Check pricing plans
  console.log(
    "Available pricing plans:",
    pricingPlans.map((p) => ({
      id: p.id,
      name: p.name,
      stripe_product_id: p.stripe_product_id,
    })),
  )

  try {
    // Test basic Stripe connectivity
    console.log("Testing Stripe connectivity...")
    const testCall = await stripe.customers.retrieve(customerId)

    if (testCall.deleted) {
      console.log("Customer is deleted:", { id: testCall.id })
    } else {
      console.log("Customer retrieved successfully:", {
        id: testCall.id,
        email: testCall.email,
        created: testCall.created,
      })
    }

    // Test subscriptions call
    console.log("Testing subscriptions.list...")
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 100,
      status: "all",
    })

    console.log("Subscriptions found:", subscriptions.data.length)

    subscriptions.data.forEach((sub, index) => {
      const productId = sub?.items?.data?.[0]?.price.product ?? ""
      const matchingPlan = pricingPlans.find(
        (p) => p.stripe_product_id === productId,
      )

      console.log(`Subscription ${index + 1}:`, {
        id: sub.id,
        status: sub.status,
        productId,
        matchingPlan: matchingPlan ? matchingPlan.id : "NO MATCH",
        created: sub.created,
        current_period_start: sub.current_period_start,
        current_period_end: sub.current_period_end,
      })
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined

    // Stripe errors have additional properties
    const hasType = error && typeof error === "object" && "type" in error
    const hasCode = error && typeof error === "object" && "code" in error
    const hasStatusCode =
      error && typeof error === "object" && "statusCode" in error

    console.error("Stripe diagnostic failed:", {
      error,
      message: errorMessage,
      type: hasType ? (error as { type: unknown }).type : undefined,
      code: hasCode ? (error as { code: unknown }).code : undefined,
      statusCode: hasStatusCode
        ? (error as { statusCode: unknown }).statusCode
        : undefined,
      stack: errorStack,
    })
  }

  console.log("=== STRIPE DIAGNOSTIC END ===")
}
