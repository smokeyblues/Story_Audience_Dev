import { env } from "$env/dynamic/private"
import { error, redirect } from "@sveltejs/kit"
import Stripe from "stripe"
import {
  fetchSubscription,
  getOrCreateCustomerId,
} from "../../subscription_helpers.server"
import type { PageServerLoad } from "./$types"
const stripe = new Stripe(env.PRIVATE_STRIPE_API_KEY, {
  apiVersion: "2023-08-16",
})

export const load: PageServerLoad = async ({
  params,
  url,
  locals: { safeGetSession, supabaseServiceRole },
}) => {
  const { session, user } = await safeGetSession()
  if (!session) {
    redirect(303, "/login")
  }

  if (params.slug === "free_plan") {
    // Plan with no stripe_price_id. Get/create a customer, mark as free, and redirect to account home.
    const { error: idError, customerId } = await getOrCreateCustomerId({
      supabaseServiceRole,
      user,
    })
    if (idError || !customerId) {
      console.error("Error creating customer id for free plan", idError)
      error(500, {
        message: "Unknown error. If issue persists, please contact us.",
      })
    }

    // Update our DB to reflect the free plan choice
    const { error: updateError } = await supabaseServiceRole
      .from("stripe_customers")
      .update({ plan_id: "free_plan" })
      .eq("user_id", user.id)

    if (updateError) {
      console.error("Error marking user as free plan", updateError)
      error(500, {
        message: "Unknown error. If issue persists, please contact us.",
      })
    }

    redirect(303, "/account")
  }

  const { error: idError, customerId } = await getOrCreateCustomerId({
    supabaseServiceRole,
    user,
  })
  if (idError || !customerId) {
    console.error("Error creating customer id", idError)
    error(500, {
      message: "Unknown error. If issue persists, please contact us.",
    })
  }

  const { primarySubscription } = await fetchSubscription({
    customerId,
  })
  if (primarySubscription) {
    // User already has plan, we shouldn't let them buy another
    redirect(303, "/account/billing")
  }

  let checkoutUrl
  try {
    const stripeSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: params.slug,
          quantity: 1,
        },
      ],
      customer: customerId,
      mode: "subscription",
      success_url: `${url.origin}/account`,
      cancel_url: `${url.origin}/account/billing`,
    })
    checkoutUrl = stripeSession.url
  } catch (e) {
    console.error("Error creating checkout session", e)
    error(500, "Unknown Error (SSE): If issue persists please contact us.")
  }

  redirect(303, checkoutUrl ?? "/pricing")
}
