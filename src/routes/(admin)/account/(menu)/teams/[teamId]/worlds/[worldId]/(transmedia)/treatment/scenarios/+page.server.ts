import { fail } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({
  locals: { supabase },
  params,
}) => {
  const { data: scenarios, error } = await supabase
    .from("world_user_scenarios")
    .select("*")
    .eq("world_id", params.worldId)
    .order("order_index", { ascending: true })

  if (error) {
    console.error("Error loading user scenarios:", error.message)
    // Return an empty array on error so the page can still render
    return { scenarios: [] }
  }

  return {
    scenarios: scenarios ?? [],
  }
}

export const actions: Actions = {
  addScenario: async ({ request, locals: { supabase, user }, params }) => {
    if (!user)
      return fail(401, { action: "addScenario", error: "Unauthorized" })

    const formData = await request.formData()
    const description = formData.get("description")?.toString()?.trim()

    if (!description) {
      return fail(400, {
        action: "addScenario",
        error: "Scenario description cannot be empty.",
      })
    }

    const { count } = await supabase
      .from("world_user_scenarios")
      .select("*", { count: "exact", head: true })
      .eq("world_id", params.worldId)

    const { error: insertError } = await supabase
      .from("world_user_scenarios")
      .insert({
        world_id: params.worldId,
        description: description,
        order_index: count ?? 0,
      })

    if (insertError) {
      console.error("Error adding scenario:", insertError)
      return fail(500, {
        action: "addScenario",
        error: `Database error: ${insertError.message}`,
      })
    }

    return {
      success: true,
      action: "addScenario",
      message: "Scenario added.",
    }
  },

  updateScenario: async ({ request, locals: { supabase, user } }) => {
    if (!user)
      return fail(401, { action: "updateScenario", error: "Unauthorized" })

    const formData = await request.formData()
    const id = formData.get("id")?.toString()
    const description = formData.get("description")?.toString()?.trim()

    if (!id || !description) {
      return fail(400, {
        action: "updateScenario",
        error: "Missing required fields.",
      })
    }

    const { error: updateError } = await supabase
      .from("world_user_scenarios")
      .update({ description: description })
      .eq("id", id)

    if (updateError) {
      console.error("Error updating scenario:", updateError)
      return fail(500, {
        action: "updateScenario",
        error: `Database error: ${updateError.message}`,
      })
    }

    return {
      success: true,
      action: "updateScenario",
      message: "Scenario updated.",
    }
  },

  deleteScenario: async ({ request, locals: { supabase, user } }) => {
    if (!user)
      return fail(401, { action: "deleteScenario", error: "Unauthorized" })

    const formData = await request.formData()
    const id = formData.get("id")?.toString()

    if (!id) {
      return fail(400, {
        action: "deleteScenario",
        error: "Missing scenario ID.",
      })
    }

    const { error: deleteError } = await supabase
      .from("world_user_scenarios")
      .delete()
      .eq("id", id)

    if (deleteError) {
      console.error("Error deleting scenario:", deleteError)
      return fail(500, {
        action: "deleteScenario",
        error: `Database error: ${deleteError.message}`,
      })
    }

    return {
      success: true,
      action: "deleteScenario",
      message: "Scenario deleted.",
    }
  },
}
