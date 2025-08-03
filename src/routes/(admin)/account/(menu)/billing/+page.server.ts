import { error, redirect } from "@sveltejs/kit"
import {
  fetchSubscription,
  getOrCreateCustomerId,
} from "../../subscription_helpers.server"
import { diagnoseStripe } from "./diagnose_stripe"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({
  locals: { safeGetSession, supabaseServiceRole },
}) => {
  const { session, user } = await safeGetSession()
  if (!session || !user?.id) {
    redirect(303, "/login")
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

  // Temporary diagnostic - remove after debugging
  await diagnoseStripe(customerId)

  const {
    primarySubscription,
    hasEverHadSubscription,
    error: fetchErr,
  } = await fetchSubscription({
    customerId,
  })
  if (fetchErr) {
    const errorMessage =
      fetchErr instanceof Error ? fetchErr.message : String(fetchErr)
    const errorStack = fetchErr instanceof Error ? fetchErr.stack : undefined
    console.error("Error fetching subscription - Full details:", {
      error: fetchErr,
      customerId: customerId,
      errorType: typeof fetchErr,
      errorMessage,
      stack: errorStack,
    })

    // Temporary: Show actual error to help debug
    error(500, {
      message: `DEBUG: ${errorMessage} | Type: ${typeof fetchErr} | Customer: ${customerId}`,
    })
  }

  return {
    isActiveCustomer: !!primarySubscription,
    hasEverHadSubscription,
    currentPlanId: primarySubscription?.appSubscription?.id ?? "creative",
  }
}
